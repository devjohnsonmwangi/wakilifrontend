// Frontend: CreateAppointment.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    useCreateAppointmentMutation,
    CreateAppointmentPayload, 
} from '../../../../features/appointment/appointmentapi'; 
import { useFetchBranchLocationsQuery, BranchLocationDataTypes } from '../../../../features/branchlocation/branchlocationapi'; 
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2, User as UserIcon } from 'lucide-react';

interface CreateAppointmentProps {
    isDarkMode?: boolean;
    forBranchId?: string | number;
    preselectedClientId?: number;
    onAppointmentCreated?: () => void;
    onClose: () => void;
}

interface ApiErrorData {
  error?: string;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface RtkQueryErrorShape {
  data?: ApiErrorData | string;
  error?: string;
  status?: number | string;
}

const generateTimeSlots = (startHour = 9, endHour = 17, intervalMinutes = 30): string[] => {
    const slots: string[] = [];
    const startTime = new Date();
    startTime.setHours(startHour, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(endHour, 0, 0, 0);
    const currentTime = new Date(startTime);
    while (currentTime < endTime) {
        const h = currentTime.getHours().toString().padStart(2, '0');
        const m = currentTime.getMinutes().toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    if (endTime.getHours() === endHour && endTime.getMinutes() === 0 && currentTime.getTime() <= endTime.getTime()) {
       const h = endTime.getHours().toString().padStart(2, '0');
       slots.push(`${h}:00`);
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots(9, 17, 30);

const CreateAppointment: React.FC<CreateAppointmentProps> = ({
    forBranchId,
    preselectedClientId,
    onAppointmentCreated,
    onClose
}) => {
    const [createAppointment, { isLoading: isAppointmentLoading }] = useCreateAppointmentMutation();
    const { data: branches, isLoading: isBranchesLoading, isError: isBranchesError, error: branchesApiError } = useFetchBranchLocationsQuery();
    const { data: allUsers, isLoading: isUsersLoading, isError: isUsersError, error: usersApiError } = useFetchUsersQuery();

    const [selectedBranchId, setSelectedBranchId] = useState<number | string>(forBranchId || '');
    const [selectedClientUserId, setSelectedClientUserId] = useState<number | string>(preselectedClientId || '');
    const [partyName, setPartyName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(''); // User selects YYYY-MM-DD
    const [appointmentTime, setAppointmentTime] = useState<string>(''); // User selects HH:MM
    const [selectedStaffId, setSelectedStaffId] = useState<number | string>('');
    const [reason, setReason] = useState('');
    const [notesByClient, setNotesByClient] = useState('');
    // const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('pending'); 
    const [formError, setFormError] = useState<string | null>(null);

    const todayDateString = useMemo(() => {
        try {
            const today = new Date();
            return today.toISOString().split('T')[0];
        } catch (e) {
            console.error("Error generating today's date string:", e);
            const y = new Date().getFullYear();
            return `${y}-01-01`;
        }
    }, []);

    useEffect(() => {
        if (forBranchId) {
            setSelectedBranchId(typeof forBranchId === 'number' ? forBranchId : forBranchId.toString());
        }
        if (preselectedClientId) {
            setSelectedClientUserId(preselectedClientId);
        }
    }, [forBranchId, preselectedClientId]);

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
        return 'An unknown error occurred while processing your request.';
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!selectedBranchId || !partyName.trim() || !appointmentDate || !appointmentTime || !selectedClientUserId || !selectedStaffId || !reason.trim()) {
            const errorMessage = 'Please fill in all required fields: Branch, Client, Assign To, Party Name, Date, Time, and Reason.';
            setFormError(errorMessage); // Removed ?? null, already a string or null
            toast.error(errorMessage);
            return;
        }

        let appointmentDateTimeISO: string;
        try {
            const localDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
            if (isNaN(localDateTime.getTime())) {
                throw new Error("Invalid date or time selected by user.");
            }
            appointmentDateTimeISO = localDateTime.toISOString(); // Converts to UTC ISO string
        } catch (dateError: unknown) {
            console.error("Error constructing ISO date:", dateError);
            const errorMessage =
                dateError && typeof dateError === "object" && "message" in dateError && typeof (dateError as { message?: string }).message === "string"
                    ? (dateError as { message?: string }).message
                    : "Invalid date or time. Please check your selection.";
            setFormError(errorMessage ?? null); // Ensure string or null, never undefined
            toast.error(errorMessage);
            return;
        }

        // Corrected payload construction
        const payloadForServer: CreateAppointmentPayload = {
            client_user_id: Number(selectedClientUserId),
            branch_id: Number(selectedBranchId),
            party: partyName.trim(),
            appointmentDateTimeISO: appointmentDateTimeISO, // Send the combined UTC ISO string
            status: 'pending', // Default status
            reason: reason.trim(),
            assigneeIds: selectedStaffId ? [Number(selectedStaffId)] : [], 
            notes_by_client: notesByClient.trim() || undefined,
        };

        try {
            await createAppointment(payloadForServer).unwrap();
            toast.success('Appointment created successfully!');
            // Reset form fields
            setPartyName('');
            setAppointmentDate('');
            setAppointmentTime('');
            setSelectedBranchId(forBranchId || '');
            setSelectedClientUserId(preselectedClientId || '');
            setSelectedStaffId('');
            setReason('');
            setNotesByClient('');
            // setSelectedStatus('pending'); 
            if (onAppointmentCreated) onAppointmentCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create appointment:', error);
            const message = getApiErrorMessage(error);
            toast.error(`Failed to create appointment: ${message}`);
            setFormError(message);
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

    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    const staffUsers = allUsers ? allUsers.filter(user => user.role && !['client', 'user'].includes(user.role.toLowerCase())) : [];
    const clientUsers = allUsers ? allUsers.filter(user => user.role && ['client', 'user'].includes(user.role.toLowerCase())) : [];

    const formatTimeForDisplay = (time24Value: string): string => {
        if (!time24Value || typeof time24Value !== 'string' || !time24Value.includes(':')) {
            return "Pick Time";
        }
        const [hoursStr, minutesStr] = time24Value.split(':');
        if (!hoursStr || !minutesStr) return "Invalid Format";
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        if (isNaN(hours) || isNaN(minutes)) return "Invalid Numbers";
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };


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
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-sky-500 dark:to-indigo-600">
                            <CalendarPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">
                            Schedule New Appointment
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Organize your client meetings and consultations.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {isBranchesLoading || isUsersLoading ? (
                            <motion.div
                                key="loading-data"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-10 min-h-[200px]"
                            >
                                <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-sky-400 mb-3" />
                                <p className="text-slate-600 dark:text-slate-400">
                                    {isBranchesLoading ? "Loading branches..." : "Loading users..."}
                                </p>
                            </motion.div>
                        ) : isBranchesError || isUsersError ? (
                            <motion.div
                                key="loading-error"
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
                                key="appointment-form"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onSubmit={handleSubmit} className="space-y-5"
                            >
                                {/* Branch Location Select */}
                                <div>
                                    <label htmlFor="branch" className={labelBaseClasses}>
                                        <MapPin size={16} className="mr-2 opacity-70" /> Branch Location *
                                    </label>
                                    <select
                                        id="branch"
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

                                {/* Client User Select */}
                                <div>
                                    <label htmlFor="clientUserId" className={labelBaseClasses}>
                                        <UserIcon size={16} className="mr-2 opacity-70" /> Client (User for Appointment) *
                                    </label>
                                    <select
                                        id="clientUserId"
                                        value={selectedClientUserId}
                                        onChange={(e) => setSelectedClientUserId(e.target.value)}
                                        className={`${inputBaseClasses} ${!selectedClientUserId ? 'text-slate-400 dark:text-slate-500' : ''}`}
                                        required
                                        disabled={clientUsers.length === 0 || !!preselectedClientId}
                                    >
                                        <option value="" disabled>
                                            {clientUsers.length === 0 ? "No clients/users available" : "Select Client/User"}
                                        </option>
                                        {clientUsers.map((user: UserDataTypes) => (
                                            <option key={user.user_id} value={user.user_id.toString()}>
                                                {user.full_name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Assign To Staff Select */}
                                <div>
                                    <label htmlFor="assignTo" className={labelBaseClasses}>
                                        <UserCheck size={16} className="mr-2 opacity-70" /> Assign To (Staff) *
                                    </label>
                                    <select
                                        id="assignTo"
                                        value={selectedStaffId}
                                        onChange={(e) => setSelectedStaffId(e.target.value)}
                                        className={`${inputBaseClasses} ${!selectedStaffId ? 'text-slate-400 dark:text-slate-500' : ''}`}
                                        required
                                        disabled={staffUsers.length === 0}
                                    >
                                        <option value="" disabled>
                                            {staffUsers.length === 0 ? "No staff available" : "Select Staff Member"}
                                        </option>
                                        {staffUsers.map((user: UserDataTypes) => (
                                            <option key={user.user_id} value={user.user_id.toString()}>
                                                {user.full_name} ({user.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Party Name Input */}
                                <div>
                                    <label htmlFor="partyName" className={labelBaseClasses}>
                                        <Users size={16} className="mr-2 opacity-70" /> Party Name (e.g., Client's Name or Case Name) *
                                    </label>
                                    <input
                                        type="text"
                                        id="partyName"
                                        className={inputBaseClasses}
                                        value={partyName}
                                        onChange={(e) => setPartyName(e.target.value)}
                                        placeholder="e.g., John Doe vs ABC Corp"
                                        required
                                    />
                                </div>

                                {/* Date and Time Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="appointmentDate" className={labelBaseClasses}>
                                            <CalendarPlus size={16} className="mr-2 opacity-70" /> Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="appointmentDate"
                                            className={inputBaseClasses}
                                            value={appointmentDate}
                                            min={todayDateString}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="appointmentTime" className={labelBaseClasses}>
                                            <Clock size={16} className="mr-2 opacity-70" /> Time *
                                        </label>
                                        <select
                                            id="appointmentTime"
                                            value={appointmentTime}
                                            onChange={(e) => setAppointmentTime(e.target.value)}
                                            className={`${inputBaseClasses} ${!appointmentTime ? 'text-slate-400 dark:text-slate-500' : ''}`}
                                            required
                                        >
                                            <option value="" disabled>Select a Time Slot</option>
                                            {TIME_SLOTS.map(slot => (
                                                <option key={slot} value={slot}>
                                                    {formatTimeForDisplay(slot)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Reason Textarea */}
                                <div>
                                    <label htmlFor="reason" className={labelBaseClasses}>
                                        <MessageSquare size={16} className="mr-2 opacity-70" /> Reason / Purpose *
                                    </label>
                                    <textarea
                                        id="reason"
                                        className={`${inputBaseClasses} resize-none`}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={3}
                                        placeholder="Briefly describe the purpose of the appointment"
                                        required
                                    />
                                </div>

                                {/* Client Notes Textarea */}
                                <div>
                                    <label htmlFor="notesByClient" className={labelBaseClasses}>
                                        <MessageSquare size={16} className="mr-2 opacity-70" /> Client Notes (Optional)
                                    </label>
                                    <textarea
                                        id="notesByClient"
                                        className={`${inputBaseClasses} resize-none`}
                                        value={notesByClient}
                                        onChange={(e) => setNotesByClient(e.target.value)}
                                        rows={2}
                                        placeholder="Any additional notes or requests from the client"
                                    />
                                </div>

                                {/* Form Error Display */}
                                {formError && (
                                    <p className="text-xs text-red-500 dark:text-red-400 text-center">{formError}</p>
                                )}

                                {/* Submit and Cancel Buttons */}
                                <div className="pt-3 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                                    <motion.button
                                        type="submit"
                                        className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-sky-500 dark:to-indigo-600 hover:from-blue-700 hover:to-purple-700 dark:hover:from-sky-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
                                        disabled={isAppointmentLoading || isBranchesLoading || isUsersLoading}
                                        whileHover={{ scale: (isAppointmentLoading || isBranchesLoading || isUsersLoading) ? 1 : 1.03 }}
                                        whileTap={{ scale: (isAppointmentLoading || isBranchesLoading || isUsersLoading) ? 1 : 0.98 }}
                                    >
                                        {isAppointmentLoading ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                                Scheduling...
                                            </div>
                                        ) : 'Schedule Appointment'}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm"
                                        onClick={onClose}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isAppointmentLoading}
                                    >
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

export default CreateAppointment;