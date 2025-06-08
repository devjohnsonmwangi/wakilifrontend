// EditAppointment.tsx
import React, { useState, useEffect } from 'react';
import {
  useUpdateAppointmentMutation,
  AppointmentDataTypes,      
  UpdateAppointmentPayload,  
  AppointmentStatus,
} from '../../../../features/appointment/appointmentapi'; 
import { useFetchBranchLocationsQuery, BranchLocationDataTypes } from '../../../../features/branchlocation/branchlocationapi'; 
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI'; 
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck2, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2, User as ClientIconItself, Edit3 } from 'lucide-react';

interface EditAppointmentProps {
  isDarkMode?: boolean;
  appointment: AppointmentDataTypes; // This will have `appointment_datetime`
  onAppointmentUpdated?: () => void;
  onClose: () => void;
  isClientView?: boolean;
}

interface ApiErrorData {
  error?: string;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface RtkQueryErrorShape {
  data?: ApiErrorData | string;
  error?: string;
}

// Helper to get "YYYY-MM-DD" from an ISO string or Date object
const formatDateForDateInput = (isoOrDateString: string | Date | undefined): string => {
  if (!isoOrDateString) return '';
  try {
    const date = new Date(isoOrDateString);
    if (isNaN(date.getTime())) {
        // Fallback for simple "YYYY-MM-DD" strings if somehow passed
        if (typeof isoOrDateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(isoOrDateString)) {
            return isoOrDateString;
        }
        console.warn("Invalid date string for date input:", isoOrDateString);
        return '';
    }
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error formatting date for input:", isoOrDateString, e);
    return '';
  }
};

// Helper to get "HH:MM" from an ISO string or Date object
const formatTimeForTimeInput = (isoOrDateString: string | Date | undefined): string => {
  if (!isoOrDateString) return '';
  try {
    const date = new Date(isoOrDateString);
    if (isNaN(date.getTime())) {
        console.warn("Invalid date string for time input:", isoOrDateString);
        return '';
    }
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting time for input:", isoOrDateString, e);
    return '';
  }
};



const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "rescheduled", "no_show"];
const getStatusDisplayName = (status: string): string => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};


const EditAppointment: React.FC<EditAppointmentProps> = ({
    appointment,
    onAppointmentUpdated,
    onClose,
    isClientView = false,
}) => {
  const [updateAppointment, { isLoading: isUpdateLoading }] = useUpdateAppointmentMutation();
  const { data: branches, isLoading: isBranchesLoading } = useFetchBranchLocationsQuery();
  const { data: allUsers, isLoading: isUsersLoading } = useFetchUsersQuery();

  // State for form inputs
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [party, setParty] = useState('');
  const [appointmentDateInput, setAppointmentDateInput] = useState(''); // For "YYYY-MM-DD" input
  const [appointmentTimeInput, setAppointmentTimeInput] = useState(''); // For "HH:MM" input
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('pending');
  const [notesByClient, setNotesByClient] = useState('');
  const [notesByStaff, setNotesByStaff] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
        setSelectedBranchId(appointment.branch_id.toString());
        setParty(appointment.party);
        
        setAppointmentDateInput(formatDateForDateInput(appointment.appointment_datetime));
        setAppointmentTimeInput(formatTimeForTimeInput(appointment.appointment_datetime));
        setSelectedStaffIds(
            appointment.assignees?.map(a => a.assignee_user_id.toString()) || []
        );
        setReason(appointment.reason || '');
        setStatus(appointment.status);
        setNotesByClient(appointment.notes_by_client || '');
        setNotesByStaff(appointment.notes_by_staff || '');
    }
  }, [appointment]);

  const getApiErrorMessage = (error: unknown): string => {
    
    if (typeof error === 'object' && error !== null) {
        const errorShape = error as RtkQueryErrorShape;
        if (errorShape.data) {
            if (typeof errorShape.data === 'string') return errorShape.data;
            const dataError = errorShape.data as ApiErrorData;
            if (dataError.message) return dataError.message;
            if (dataError.error) return dataError.error;
            if (dataError.errors && Array.isArray(dataError.errors) && dataError.errors.length > 0) {
                return dataError.errors.map(e => `${e.field ? `${e.field}: ` : ''}${e.message}`).join('; ');
            }
        }
        if (errorShape.error && typeof errorShape.error === 'string') return errorShape.error;
        if ((error as Error).message) return (error as Error).message;
    }
    return 'An unknown error occurred.';
  };

  const handleStaffSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const staffId = event.target.value;
    setSelectedStaffIds(staffId ? [staffId] : []); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isClientView && (!selectedBranchId || (!selectedStaffIds.length && staffUsers.length > 0) )) { // Check if staff selection is applicable
        setFormError('Branch and Assignee are required for staff edits if staff members are available.');
        toast.error('Branch and Assignee are required if staff members are available.');
        return;
    }
    if (!party.trim() || !appointmentDateInput || !appointmentTimeInput || !reason.trim()) {
      setFormError('Party name, date, time, and reason are required.');
      toast.error('Party name, date, time, and reason are required.');
      return;
    }

    const payload: UpdateAppointmentPayload = {
      appointment_id: appointment.appointment_id,
      // client_user_id is generally not updatable here
    };

    let newAppointmentDateTimeISO: string | undefined = undefined;
    const originalDate = formatDateForDateInput(appointment.appointment_datetime);
    const originalTime = formatTimeForTimeInput(appointment.appointment_datetime);

    if (appointmentDateInput !== originalDate || appointmentTimeInput !== originalTime) {
        try {
            const localDateTime = new Date(`${appointmentDateInput}T${appointmentTimeInput}:00`);
            if (isNaN(localDateTime.getTime())) {
                throw new Error("Invalid date or time entered.");
            }
            newAppointmentDateTimeISO = localDateTime.toISOString(); // Convert to UTC ISO
            payload.appointmentDateTimeISO = newAppointmentDateTimeISO;
        } catch (dateError: unknown) {
            console.error("Error constructing ISO date for update:", dateError);
            const errorMessage =
                typeof dateError === "object" && dateError !== null && "message" in dateError
                    ? String((dateError as { message?: string }).message)
                    : "Invalid date or time format.";
            setFormError(errorMessage);
            toast.error(errorMessage);
            return;
        }
    }


    if (!isClientView) {
        if (appointment.branch_id.toString() !== selectedBranchId) payload.branch_id = Number(selectedBranchId);
        if (appointment.party !== party.trim()) payload.party = party.trim();
        if ((appointment.reason || '') !== reason.trim()) payload.reason = reason.trim();
        if (appointment.status !== status) payload.status = status;
        if ((appointment.notes_by_staff || '') !== (notesByStaff.trim() || undefined)) payload.notes_by_staff = notesByStaff.trim() || undefined;

        const currentAssigneeIds = appointment.assignees?.map(a => a.assignee_user_id.toString()).sort() || [];
        const newAssigneeIdsSorted = [...selectedStaffIds].sort();
        if (JSON.stringify(currentAssigneeIds) !== JSON.stringify(newAssigneeIdsSorted)) {
            payload.assigneeIds = selectedStaffIds.map(id => Number(id));
        }
    }

    if ((appointment.notes_by_client || '') !== (notesByClient.trim() || undefined)) {
        payload.notes_by_client = notesByClient.trim() || undefined;
    }


    // Check if any actual changes were made to include in the payload
    const changedFields = Object.keys(payload).filter(key => key !== 'appointment_id');
    if (changedFields.length === 0) {
        toast.info("No changes detected to save.");
        onClose();
        return;
    }

    try {
      await updateAppointment(payload).unwrap();
      toast.success(isClientView ? 'Your notes have been updated!' : 'Appointment updated successfully!');
      if (onAppointmentUpdated) {
        onAppointmentUpdated();
      }
      onClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      const message = getApiErrorMessage(error);
      toast.error(`Failed to update appointment: ${message}`);
      setFormError(message);
    }
  };

    const modalVariants = {  };
    const backdropVariants = {  };
    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    const staffUsers = allUsers ? allUsers.filter(user => user.role && !['client', 'user'].includes(user.role.toLowerCase())) : [];


  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className={`relative border bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 w-full max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col`}
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          title='Close Modal'
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors duration-200 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600">
                    <Edit3 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">
                    {isClientView ? "View / Update My Notes" : "Edit Appointment"}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isClientView ? "Update your notes for this appointment." : "Modify the details for this scheduled appointment."}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {/* Loading indicator only for staff/admin view when fetching branches/users */}
                {(!isClientView && (isBranchesLoading || isUsersLoading)) ? (
                    <motion.div key="loading-data-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 min-h-[200px]">
                        <Loader2 className="h-12 w-12 animate-spin text-green-500 dark:text-emerald-400 mb-3" />
                        <p className="text-slate-600 dark:text-slate-400">
                            {isBranchesLoading ? "Loading branch data..." : isUsersLoading ? "Loading user data..." : ""}
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="appointment-form-edit"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} className="space-y-5"
                    >
                        {/* Client Display (Read-only) */}
                        <div>
                            <label htmlFor="display-clientName" className={labelBaseClasses}>
                                <ClientIconItself size={16} className="mr-2 opacity-70" /> Client
                            </label>
                            <input
                                type="text"
                                id="display-clientName"
                                value={appointment.client?.full_name || `User ID: ${appointment.client_user_id}`}
                                className={`${inputBaseClasses} disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed`}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* Branch Location Select */}
                        <div>
                            <label htmlFor="edit-branch" className={labelBaseClasses}>
                                <MapPin size={16} className="mr-2 opacity-70" /> Branch Location
                            </label>
                            <select
                                id="edit-branch"
                                value={selectedBranchId}
                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                className={`${inputBaseClasses} ${isClientView || isBranchesLoading ? 'disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed' : ''}`}
                                required={!isClientView}
                                disabled={isClientView || !branches || branches.length === 0 || isBranchesLoading}
                            >
                                <option value="" disabled>
                                    {isBranchesLoading ? "Loading branches..." : (branches && branches.length > 0 ? "Select a Branch" : "No branches available")}
                                </option>
                                {branches?.map((branch: BranchLocationDataTypes) => (
                                    <option key={branch.branch_id} value={branch.branch_id.toString()}>
                                        {branch.name} - {branch.address}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assign To Staff Select (Not for Client View) */}
                        {!isClientView && (
                            <div>
                                <label htmlFor="edit-staffId" className={labelBaseClasses}>
                                    <UserCheck size={16} className="mr-2 opacity-70" /> Assign To (Staff)
                                </label>
                                <select
                                    id="edit-staffId"
                                    value={selectedStaffIds[0] || ''} // Assuming single staff selection for now
                                    onChange={handleStaffSelectionChange}
                                    className={`${inputBaseClasses} ${!selectedStaffIds.length ? 'text-slate-400 dark:text-slate-500' : ''}`}
                                    required // Make required if staff must be assigned
                                    disabled={isUsersLoading || staffUsers.length === 0}
                                >
                                    <option value="" disabled>
                                        {isUsersLoading ? "Loading staff..." : (staffUsers.length === 0 ? "No staff available" : "Select Staff Member")}
                                    </option>
                                    {staffUsers.map((user: UserDataTypes) => (
                                        <option key={user.user_id} value={user.user_id.toString()}>
                                            {user.full_name} ({user.role})
                                        </option>
                                    ))}
                                </select>
                                {selectedStaffIds.length > 1 && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Current UI supports single staff assignment for edit. To change multiple, re-create or enhance UI.</p>}
                            </div>
                        )}

                        {/* Party Name Input */}
                        <div>
                            <label htmlFor="edit-party" className={labelBaseClasses}>
                                <Users size={16} className="mr-2 opacity-70" /> Party Name
                            </label>
                            <input
                                type="text"
                                id="edit-party"
                                className={`${inputBaseClasses} ${isClientView ? 'disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed' : ''}`}
                                value={party}
                                onChange={(e) => setParty(e.target.value)}
                                placeholder="e.g., John Doe vs ABC Corp"
                                required
                                disabled={isClientView}
                            />
                        </div>

                        {/* Date and Time Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="edit-appointmentDate" className={labelBaseClasses}>
                                    <CalendarCheck2 size={16} className="mr-2 opacity-70" /> Date
                                </label>
                                <input
                                    type="date"
                                    id="edit-appointmentDate"
                                    className={`${inputBaseClasses} ${isClientView ? 'disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed' : ''}`}
                                    value={appointmentDateInput}
                                    onChange={(e) => setAppointmentDateInput(e.target.value)}
                                    required
                                    disabled={isClientView}
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-appointmentTime" className={labelBaseClasses}>
                                    <Clock size={16} className="mr-2 opacity-70" /> Time
                                </label>
                                <input
                                    type="time" // Native time input
                                    id="edit-appointmentTime"
                                    className={`${inputBaseClasses} ${isClientView ? 'disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed' : ''}`}
                                    value={appointmentTimeInput}
                                    onChange={(e) => setAppointmentTimeInput(e.target.value)}
                                    required
                                    disabled={isClientView}
                                />
                            </div>
                        </div>

                        {/* Reason Textarea */}
                        <div>
                            <label htmlFor="edit-reason" className={labelBaseClasses}>
                                <MessageSquare size={16} className="mr-2 opacity-70" /> Reason / Purpose
                            </label>
                            <textarea
                                id="edit-reason"
                                className={`${inputBaseClasses} resize-none ${isClientView ? 'disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed' : ''}`}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                placeholder="Briefly describe the purpose of the appointment"
                                required
                                disabled={isClientView}
                            />
                        </div>

                        {/* Status Select/Display */}
                        <div>
                            <label htmlFor="edit-status" className={labelBaseClasses}> Status </label>
                            {isClientView ? (
                                <p className={`${inputBaseClasses} py-3 disabled:bg-slate-100 dark:disabled:bg-slate-700/50`}>
                                    {getStatusDisplayName(status)} {/* Display current status */}
                                </p>
                            ) : (
                                <select
                                    id="edit-status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                                    className={inputBaseClasses}
                                    required
                                >
                                    {APPOINTMENT_STATUS_VALUES.map(statusVal => (
                                        <option key={statusVal} value={statusVal}>{getStatusDisplayName(statusVal)}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Client Notes Textarea */}
                        <div>
                            <label htmlFor="edit-notesByClient" className={labelBaseClasses}>
                                <MessageSquare size={16} className="mr-2 opacity-70" /> Client Notes
                            </label>
                            <textarea
                                id="edit-notesByClient"
                                className={`${inputBaseClasses} resize-none ${!isClientView ? 'disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed' : ''}`}
                                value={notesByClient}
                                onChange={(e) => setNotesByClient(e.target.value)}
                                rows={2}
                                placeholder={isClientView ? "Add or update your notes here..." : "Notes provided by the client"}
                                disabled={!isClientView} // Client can edit their notes
                            />
                        </div>

                        {/* Staff Notes Textarea (Not for Client View) */}
                        {!isClientView && (
                            <div>
                                <label htmlFor="edit-notesByStaff" className={labelBaseClasses}>
                                    <MessageSquare size={16} className="mr-2 opacity-70" /> Staff Notes
                                </label>
                                <textarea
                                    id="edit-notesByStaff"
                                    className={`${inputBaseClasses} resize-none`}
                                    value={notesByStaff}
                                    onChange={(e) => setNotesByStaff(e.target.value)}
                                    rows={2}
                                    placeholder="Internal notes for staff members"
                                />
                            </div>
                        )}

                        {/* Form Error Display */}
                        {formError && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md text-center">
                                <p className="text-xs text-red-600 dark:text-red-300 flex items-center justify-center">
                                    <AlertCircle size={14} className="mr-1.5" /> {formError}
                                </p>
                            </div>
                        )}

                        {/* Submit and Cancel Buttons */}
                        <div className="pt-3 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                            <motion.button
                                type="submit"
                                className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600 hover:from-green-600 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-cyan-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
                                disabled={isUpdateLoading || (!isClientView && (isBranchesLoading || isUsersLoading))}
                                whileHover={{ scale: (isUpdateLoading || (!isClientView && (isBranchesLoading || isUsersLoading))) ? 1 : 1.03 }}
                                whileTap={{ scale: (isUpdateLoading || (!isClientView && (isBranchesLoading || isUsersLoading))) ? 1 : 0.98 }}
                            >
                                {isUpdateLoading ? ( <div className="flex items-center justify-center"> <Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing... </div> ) : (isClientView ? "Update My Notes" : "Save Changes")}
                            </motion.button>
                            <motion.button type="button" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm" onClick={onClose} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} disabled={isUpdateLoading} >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditAppointment;