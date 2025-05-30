import React, { useState, useEffect } from 'react';
import {
  useUpdateAppointmentMutation,
  AppointmentDataTypes,
} from '../../../../features/appointment/appointmentapi'; // Adjust path
import { useFetchBranchLocationsQuery, BranchLocationDataTypes } from '../../../../features/branchlocation/branchlocationapi'; // Adjust path
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI'; // Adjust path
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck2, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

interface EditAppointmentProps {
  isDarkMode?: boolean;
  appointment: AppointmentDataTypes;
  onAppointmentUpdated?: () => void;
  onClose: () => void;
}

interface ApiErrorData {
  error?: string;
  message?: string;
}

interface RtkQueryErrorShape {
  data?: ApiErrorData | string;
  error?: string;
}

const formatDateForInput = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        let parts: string[] = [];
        if (typeof dateString === 'string') {
            parts = dateString.split('T')[0].split('-');
        }
        if (parts.length === 3 && typeof dateString === 'string') {
            return dateString.split('T')[0];
        }
        console.warn("Invalid date string for input:", dateString);
        return '';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return '';
  }
};


const EditAppointment: React.FC<EditAppointmentProps> = ({ appointment, onAppointmentUpdated, onClose }) => {
  const [updateAppointment, { isLoading: isUpdateLoading }] = useUpdateAppointmentMutation();
  const { data: branches, isLoading: isBranchesLoading, isError: isBranchesError, error: branchesApiError } = useFetchBranchLocationsQuery();
  const { data: users, isLoading: isUsersLoading, isError: isUsersError, error: usersApiError } = useFetchUsersQuery();

  const [selectedBranchId, setSelectedBranchId] = useState<string>(appointment.branch_id.toString());
  const [party, setParty] = useState(appointment.party);
  const [appointmentDate, setAppointmentDate] = useState(formatDateForInput(appointment.appointment_date));
  const [appointmentTime, setAppointmentTime] = useState(appointment.appointment_time);
  const [selectedUserId, setSelectedUserId] = useState<string>(appointment.user_id.toString());
  const [reason, setReason] = useState(appointment.reason || '');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBranchId(appointment.branch_id.toString());
    setParty(appointment.party);
    setAppointmentDate(formatDateForInput(appointment.appointment_date));
    setAppointmentTime(appointment.appointment_time);
    setSelectedUserId(appointment.user_id.toString());
    setReason(appointment.reason || '');
  }, [appointment]);

  const getApiErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
        const errorShape = error as RtkQueryErrorShape;
        if (errorShape.data && typeof errorShape.data === 'object' && (errorShape.data as ApiErrorData).message) {
            return (errorShape.data as ApiErrorData).message!;
        }
        if (errorShape.data && typeof errorShape.data === 'string') return errorShape.data;
        if (errorShape.error) return errorShape.error;
        if ((error as Error).message) return (error as Error).message;
    }
    return 'An unknown error occurred.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedBranchId || !party.trim() || !appointmentDate || !appointmentTime || !selectedUserId || !reason.trim()) {
      setFormError('Please fill in all required fields.');
      toast.error('Please fill in all required fields.');
      return;
    }

    let isoDateString = appointment.appointment_date;
    try {
        const dateObj = new Date(appointmentDate); // appointmentDate is YYYY-MM-DD
        if (!isNaN(dateObj.getTime())) {
            // To preserve the original time if only date is changed, or to set to start of day if new date
            // For simplicity, using the input date as is, which sets time to 00:00 UTC if not specified.
            // If time zone is critical, backend should handle it or frontend should send date and time separately or as a combined local ISO string.
            isoDateString = dateObj.toISOString();
        } else {
            toast.error("Invalid date selected. Please check the appointment date.");
            setFormError("Invalid date selected.");
            return;
        }
    } catch (e) {
        toast.error("Error processing date. Please check the appointment date format.");
        setFormError("Error processing date format.");
        return;
    }

    const updatedAppointmentPayload: Omit<AppointmentDataTypes, 'created_at' | 'updated_at'> & { appointment_id: number } = {
      appointment_id: appointment.appointment_id,
      user_id: Number(selectedUserId),
      branch_id: Number(selectedBranchId),
      party: party.trim(),
      appointment_date: isoDateString,
      appointment_time: appointmentTime,
      status: appointment.status,
      reason: reason.trim(),
    };

    try {
      await updateAppointment(updatedAppointmentPayload).unwrap();
      toast.success('Appointment updated successfully!');
      if (onAppointmentUpdated) {
        onAppointmentUpdated();
      }
      onClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      const message = getApiErrorMessage(error);
      toast.error(`Failed to update appointment: ${message}`);
    }
  };

    const modalVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

  const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 
                              rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                              focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent 
                              transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    
  const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  const filteredUsers = users ? users.filter(user => user.role !== "client" && user.role !== "user") : [];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" // Centering and padding for backdrop
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        className={`relative border bg-white dark:bg-slate-800 rounded-2xl shadow-2xl
                   text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700
                   w-full max-w-2xl h-[70vh] flex flex-col`} // MODIFIED: Width, height, flex layout. Removed padding.
        variants={modalVariants}
        // initial, animate, exit are fine here as well for the modal itself
        onClick={(e) => e.stopPropagation()} // ADDED: Prevent closing when clicking inside modal
      >
        <button
          title='Close Modal'
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors duration-200 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable content area */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8"> {/* ADDED: Wrapper for scrollable content with padding */}
            <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600">
                    <CalendarCheck2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">
                    Edit Appointment
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Modify the details for this scheduled appointment.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {isBranchesLoading || isUsersLoading ? (
                    <motion.div
                        key="loading-data-edit"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10 min-h-[200px]"
                    >
                        <Loader2 className="h-12 w-12 animate-spin text-green-500 dark:text-emerald-400 mb-3" />
                        <p className="text-slate-600 dark:text-slate-400">
                            {isBranchesLoading ? "Loading branch data..." : "Loading user data..."}
                        </p>
                    </motion.div>
                ) : isBranchesError || isUsersError ? (
                    <motion.div 
                        key="loading-error-edit"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center py-10 min-h-[200px] p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
                    >
                        <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-3" />
                        <p className="font-semibold text-red-700 dark:text-red-300">
                            {isBranchesError ? "Error loading branches." : "Error loading users."}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {getApiErrorMessage(isBranchesError ? branchesApiError : usersApiError)}
                        </p>
                        <button 
                            onClick={onClose}
                            className="mt-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                ) : (
                    <motion.form 
                        key="appointment-form-edit"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} className="space-y-5"
                    >
                        <div>
                            <label htmlFor="edit-branch" className={labelBaseClasses}>
                                <MapPin size={16} className="mr-2 opacity-70" /> Branch Location
                            </label>
                            <select
                                id="edit-branch"
                                value={selectedBranchId}
                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                className={`${inputBaseClasses} ${!selectedBranchId ? 'text-slate-400 dark:text-slate-500' : ''}`}
                                required
                                disabled={branches?.length === 0}
                            >
                                <option value="" disabled>
                                    {branches?.length === 0 ? "No branches available" : "Select a Branch"}
                                </option>
                                {branches?.map((branch: BranchLocationDataTypes) => (
                                    <option key={branch.branch_id} value={branch.branch_id.toString()}>
                                        {branch.name} - {branch.address}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="edit-userId" className={labelBaseClasses}>
                                <UserCheck size={16} className="mr-2 opacity-70" /> Assign To (Admin/Staff)
                            </label>
                            <select
                                id="edit-userId"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className={`${inputBaseClasses} ${!selectedUserId ? 'text-slate-400 dark:text-slate-500' : ''}`}
                                required
                                disabled={filteredUsers.length === 0}
                            >
                                 <option value="" disabled>
                                    {filteredUsers.length === 0 ? "No staff available" : "Select Staff Member"}
                                </option>
                                {filteredUsers.map((user: UserDataTypes) => (
                                    <option key={user.user_id} value={user.user_id.toString()}>
                                        {user.full_name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="edit-party" className={labelBaseClasses}>
                                <Users size={16} className="mr-2 opacity-70" /> Involved Party / Client Name
                            </label>
                            <input
                                type="text"
                                id="edit-party"
                                className={inputBaseClasses}
                                value={party}
                                onChange={(e) => setParty(e.target.value)}
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="edit-appointmentDate" className={labelBaseClasses}>
                                    <CalendarCheck2 size={16} className="mr-2 opacity-70" /> Date
                                </label>
                                <input
                                    type="date"
                                    id="edit-appointmentDate"
                                    className={inputBaseClasses}
                                    value={appointmentDate}
                                    // min={new Date().toISOString().split('T')[0]} // Consider if past dates should be editable
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-appointmentTime" className={labelBaseClasses}>
                                    <Clock size={16} className="mr-2 opacity-70" /> Time
                                </label>
                                <input // Using input type="time" here. Create modal used select. Keep as is unless specified.
                                    type="time"
                                    id="edit-appointmentTime"
                                    className={inputBaseClasses}
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="edit-reason" className={labelBaseClasses}>
                                <MessageSquare size={16} className="mr-2 opacity-70" /> Reason / Purpose
                            </label>
                            <textarea
                                id="edit-reason"
                                className={`${inputBaseClasses} resize-none`}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                placeholder="Briefly describe the purpose of the appointment"
                                required
                            />
                        </div>
                        
                        {formError && (
                            <p className="text-xs text-red-500 dark:text-red-400 text-center">{formError}</p>
                        )}

                        <div className="pt-3 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                            <motion.button
                                type="submit"
                                className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white
                                            bg-gradient-to-r from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600
                                            hover:from-green-600 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-cyan-700
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-cyan-500 
                                            dark:focus:ring-offset-slate-800
                                            transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                                            disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
                                disabled={isUpdateLoading || isBranchesLoading || isUsersLoading}
                                whileHover={{ scale: (isUpdateLoading || isBranchesLoading || isUsersLoading) ? 1 : 1.03 }}
                                whileTap={{ scale: (isUpdateLoading || isBranchesLoading || isUsersLoading) ? 1 : 0.98 }}
                            >
                                {isUpdateLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Updating...
                                    </div>
                                ) : 'Save Changes'}
                            </motion.button>
                            <motion.button
                                type="button"
                                className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg 
                                            bg-slate-100 hover:bg-slate-200 text-slate-700 
                                            dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500
                                            dark:focus:ring-offset-slate-800
                                            transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm"
                                onClick={onClose}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isUpdateLoading} // Disable cancel during submission
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div> {/* End of scrollable content area */}
      </motion.div>
    </motion.div>
  );
};

export default EditAppointment;