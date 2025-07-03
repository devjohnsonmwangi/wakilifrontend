import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, CalendarCheck2, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2, Edit3, User as ClientIcon } from 'lucide-react';

import {
  useUpdateAppointmentMutation,
  Appointment,
  AppointmentStatus,
  BranchLocation,
  UpdateAppointmentPayload, // Import the specific payload type
} from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; 
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';

// --- Component Props ---
interface EditAppointmentProps {
  isDarkMode?: boolean;
  appointment: Appointment;
  onAppointmentUpdated?: () => void;
  onClose: () => void;
  isClientView?: boolean;
}

// --- Type Definitions ---
interface ApiErrorData { message?: string; errors?: Array<{ message: string }>; }
interface RtkQueryErrorShape { data?: ApiErrorData; }

// --- Helper Functions ---
const formatDateForInput = (isoString: string): string => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().slice(0, 16);
};

const getApiErrorMessage = (error: unknown): string => {
  const err = error as RtkQueryErrorShape;
  if (err?.data?.message) return err.data.message;
  if (err?.data?.errors) return err.data.errors.map(e => e.message).join(', ');
  return 'An unknown error occurred while saving.';
};

const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];
const getStatusDisplayName = (status: string): string => status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

// --- Main Component ---
const EditAppointment: React.FC<EditAppointmentProps> = ({
    appointment,
    onAppointmentUpdated,
    onClose,
    isClientView = false,
}) => {
  // Hooks
  const [updateAppointment, { isLoading: isUpdateLoading }] = useUpdateAppointmentMutation();
  const { data: branches, isLoading: isBranchesLoading } = useFetchBranchLocationsQuery();
  const { data: allUsers, isLoading: isUsersLoading } = useFetchUsersQuery();

  // Form State
  const [branchId, setBranchId] = useState<string>('');
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [party, setParty] = useState(''); // <<< CORRECTED: Added Party state
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('pending');
  const [notesByClient, setNotesByClient] = useState('');
  const [notesByStaff, setNotesByStaff] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Effect to populate form when appointment prop changes
  useEffect(() => {
    if (appointment) {
        setBranchId(appointment.location_branch_id?.toString() ?? '');
        setAppointmentDateTime(formatDateForInput(appointment.appointment_datetime));
        setAssigneeIds(appointment.assignees?.map(a => a.assignee_user_id) || []);
        setParty(appointment.party || ''); // <<< CORRECTED: Populate Party state
        setReason(appointment.reason || '');
        setStatus(appointment.status ?? 'pending');
        setNotesByClient(appointment.notes_by_client || '');
        setNotesByStaff(appointment.notes_by_staff || '');
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // <<< CORRECTED: Rewritten payload construction to match the UpdateAppointmentPayload type
    const payload: UpdateAppointmentPayload = {};

    // 1. Build the payload object by comparing current state with the original appointment
    if (!isClientView) {
      if (Number(branchId) !== appointment.location_branch_id) payload.branch_id = Number(branchId);
      if (party !== appointment.party) payload.party = party;
      if (reason !== appointment.reason) payload.reason = reason;
      if (status !== appointment.status) payload.status = status;
      if (notesByStaff !== (appointment.notes_by_staff || '')) payload.notes_by_staff = notesByStaff;
      
      const originalAssigneeIds = appointment.assignees?.map(a => a.assignee_user_id).sort() || [];
      const currentAssigneeIds = [...assigneeIds].sort();
      if (JSON.stringify(originalAssigneeIds) !== JSON.stringify(currentAssigneeIds)) {
        payload.newAssigneeIds = assigneeIds;
      }
    }

    if (appointmentDateTime && new Date(appointmentDateTime).toISOString() !== new Date(appointment.appointment_datetime).toISOString()) {
      payload.appointment_datetime = new Date(appointmentDateTime).toISOString();
    }
    
    if (notesByClient !== (appointment.notes_by_client || '')) {
      payload.notes_by_client = notesByClient;
    }

    // 2. Check if any changes were made
    if (Object.keys(payload).length === 0) {
      toast.info("No changes were made.");
      onClose();
      return;
    }

    // 3. Call the mutation with the correct payload structure
    try {
      await updateAppointment({
        id: appointment.appointment_id,
        payload,
      }).unwrap();

      toast.success(isClientView ? 'Your change request has been submitted.' : 'Appointment updated successfully!');
      onAppointmentUpdated?.();
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(`Update failed: ${message}`);
      setFormError(message);
    }
  };

  const staffUsers = useMemo(() => allUsers ? allUsers.filter(user => user.role && !['client'].includes(user.role.toLowerCase())) : [], [allUsers]);
  const modalVariants: Variants = { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
  const backdropVariants: Variants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-700/50`;
  const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
  
  return (
    <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" variants={backdropVariants} initial="initial" animate="animate" exit="exit" onClick={onClose}>
      <motion.div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col" variants={modalVariants} onClick={(e) => e.stopPropagation()}>
        <button title='Close' className="absolute top-3 right-3 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors z-10" onClick={onClose}><X size={20} /></button>
        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
            <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600"><Edit3 className="w-7 h-7 text-white" /></div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isClientView ? "View / Request Change" : "Edit Appointment"}</h2></div>
            <AnimatePresence mode="wait">
                {(!isClientView && (isBranchesLoading || isUsersLoading)) ? (<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 min-h-[200px]"><Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-3" /><p className="text-slate-600 dark:text-slate-400">Loading data...</p></motion.div>) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                        <div><label className={labelBaseClasses}><ClientIcon size={16} className="mr-2" /> Client</label><input type="text" value={appointment.client?.full_name || `User ID: ${appointment.client_user_id}`} className={inputBaseClasses} readOnly disabled /></div>
                        <div><label htmlFor="edit-branch" className={labelBaseClasses}><MapPin size={16} className="mr-2" /> Branch Location</label><select id="edit-branch" value={branchId} onChange={(e) => setBranchId(e.target.value)} className={inputBaseClasses} required={!isClientView} disabled={isClientView || isBranchesLoading || !branches?.length}><option value="" disabled>{isBranchesLoading ? "Loading..." : "Select Branch"}</option>{branches?.map((branch: BranchLocation) => (<option key={branch.branch_id} value={branch.branch_id}>{branch.name}</option>))}</select></div>
                        {!isClientView && (<div><label htmlFor="edit-staffId" className={labelBaseClasses}><UserCheck size={16} className="mr-2" /> Assign To</label><select id="edit-staffId" value={assigneeIds[0] || ''} onChange={(e) => setAssigneeIds(e.target.value ? [Number(e.target.value)] : [])} className={inputBaseClasses} disabled={isUsersLoading || !staffUsers.length}><option value="">{isUsersLoading ? "Loading..." : "Unassigned"}</option>{staffUsers.map((user: UserDataTypes) => (<option key={user.user_id} value={user.user_id}>{user.full_name}</option>))}</select></div>)}
                        <div><label htmlFor="edit-appointmentDateTime" className={labelBaseClasses}><CalendarCheck2 size={16} className="mr-2" /> Date & Time</label><input type="datetime-local" id="edit-appointmentDateTime" className={inputBaseClasses} value={appointmentDateTime} onChange={(e) => setAppointmentDateTime(e.target.value)} required disabled={isClientView}/></div>
                        
                        {/* <<< CORRECTED: Added Party Name input field */}
                        <div><label htmlFor="edit-party" className={labelBaseClasses}><Users size={16} className="mr-2" /> Party Name</label><input id="edit-party" type="text" value={party} onChange={(e) => setParty(e.target.value)} className={inputBaseClasses} required disabled={isClientView} /></div>

                        <div><label htmlFor="edit-reason" className={labelBaseClasses}><MessageSquare size={16} className="mr-2" /> Reason</label><textarea id="edit-reason" className={`${inputBaseClasses} resize-y min-h-[70px]`} value={reason} onChange={(e) => setReason(e.target.value)} rows={2} required disabled={isClientView}/></div>
                        <div><label htmlFor="edit-status" className={labelBaseClasses}><Clock size={16} className="mr-2" /> Status</label>{isClientView ? <p className={`${inputBaseClasses} py-3`}>{getStatusDisplayName(status)}</p> : (<select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus)} className={inputBaseClasses} required>{APPOINTMENT_STATUS_VALUES.map(val => (<option key={val} value={val}>{getStatusDisplayName(val)}</option>))}</select>)}</div>
                        
                        {/* <<< CORRECTED: Separated notes for client and staff */}
                        <div><label htmlFor="edit-notes-client" className={labelBaseClasses}><Users size={16} className="mr-2" /> Notes (Client visible)</label><textarea id="edit-notes-client" className={`${inputBaseClasses} resize-y min-h-[70px]`} value={notesByClient} onChange={(e) => setNotesByClient(e.target.value)} rows={2} placeholder="Notes or messages for the client..." /></div>
                        {!isClientView && (<div><label htmlFor="edit-notes-staff" className={labelBaseClasses}><UserCheck size={16} className="mr-2" /> Internal Notes (Staff only)</label><textarea id="edit-notes-staff" className={`${inputBaseClasses} resize-y min-h-[70px]`} value={notesByStaff} onChange={(e) => setNotesByStaff(e.target.value)} rows={2} placeholder="Internal notes for staff members..." /></div>)}
                        
                        {formError && (<div className="p-3 bg-red-100 text-red-600 border border-red-300 rounded-md text-center text-xs flex items-center justify-center dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"><AlertCircle size={14} className="mr-2" />{formError}</div>)}
                        
                        <div className="pt-2 flex flex-col-reverse sm:flex-row-reverse gap-3">
                            <button type="submit" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed" disabled={isUpdateLoading}><div className="flex items-center justify-center">{isUpdateLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}Save Changes</div></button>
                            <button type="button" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors shadow-sm" onClick={onClose} disabled={isUpdateLoading}>Cancel</button>
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