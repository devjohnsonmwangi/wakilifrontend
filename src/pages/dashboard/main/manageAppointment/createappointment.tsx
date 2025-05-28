// CreateAppointment.tsx
import React, { useState, useEffect } from 'react';
import { useCreateAppointmentMutation, AppointmentDataTypes } from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery, BranchLocationDataTypes } from '../../../../features/branchlocation/branchlocationapi';
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

interface CreateAppointmentProps {
    isDarkMode?: boolean; // To be passed from parent (though not directly used for styling in this version)
    forBranchId?: string | number; // Optional: pre-select branch if provided
    onAppointmentCreated?: () => void;
    onClose: () => void;
}

// Define a more specific type for the error data from the backend if known
interface ApiErrorData {
  error?: string;
  message?: string;
  // Add other potential error fields from your backend
}

interface RtkQueryErrorShape {
  data?: ApiErrorData | string; // Backend error data or a simple string error
  error?: string; // For FetchBaseQueryError (network error, etc., often a string)
  status?: number | string; // HTTP status
  // other RTK Query error fields
}


// Function to generate time slots (e.g., 9:00 AM - 5:00 PM, every 30 minutes)
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
    // Optionally add the end time if it's on the hour and interval allows
    if (endHour > startHour && endTime.getHours() === endHour && endTime.getMinutes() === 0) {
       const h = endTime.getHours().toString().padStart(2, '0');
       slots.push(`${h}:00`);
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots(9, 17, 30); // 9:00 AM to 5:00 PM, 30 min intervals


const CreateAppointment: React.FC<CreateAppointmentProps> = ({  forBranchId, onAppointmentCreated, onClose }) => {
    const [createAppointment, { isLoading: isAppointmentLoading }] = useCreateAppointmentMutation();
    const { data: branches, isLoading: isBranchesLoading, isError: isBranchesError, error: branchesApiError } = useFetchBranchLocationsQuery();
    const { data: users, isLoading: isUsersLoading, isError: isUsersError, error: usersApiError } = useFetchUsersQuery();
    
    const [selectedBranchId, setSelectedBranchId] = useState<number | string>(forBranchId || '');
    const [party, setParty] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState<string>(''); // Initialize to empty for placeholder
    const [selectedUserId, setSelectedUserId] = useState<number | string>('');
    const [reason, setReason] = useState('');
    const [formError, setFormError] = useState<string | null>(null);


    useEffect(() => {
        if (forBranchId) {
            setSelectedBranchId(typeof forBranchId === 'number' ? forBranchId.toString() : forBranchId);
        }
    }, [forBranchId]);

    const getApiErrorMessage = (error: unknown): string => {
        if (typeof error === 'object' && error !== null) {
            const errorShape = error as RtkQueryErrorShape; // Cast to our expected shape

            // Check RTK Query's 'data' field for backend-specific error object
            if (errorShape.data) {
                if (typeof errorShape.data === 'string') {
                    return errorShape.data; // If data is just a string message
                }
                if (typeof errorShape.data === 'object' && (errorShape.data as ApiErrorData).message) {
                    return (errorShape.data as ApiErrorData).message!;
                }
                if (typeof errorShape.data === 'object' && (errorShape.data as ApiErrorData).error) {
                    return (errorShape.data as ApiErrorData).error!;
                }
            }
            // Check RTK Query's 'error' field (often for network errors from fetchBaseQuery)
            if (errorShape.error && typeof errorShape.error === 'string') {
                return errorShape.error;
            }
            // Fallback to standard JavaScript Error object message
            if ((error as Error).message) {
                return (error as Error).message;
            }
        }
        return 'An unknown error occurred. Please check logs or network tab.';
      };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!selectedBranchId || !party.trim() || !appointmentDate || !appointmentTime || !selectedUserId || !reason.trim()) {
            setFormError('Please fill in all required fields, including selecting a time.');
            toast.error('Please fill in all required fields, including selecting a time.');
            return;
        }

        const newAppointment: Omit<AppointmentDataTypes, 'appointment_id'> = {
            user_id: Number(selectedUserId),
            branch_id: Number(selectedBranchId),
            party: party.trim(),
            appointment_date: appointmentDate,
            appointment_time: appointmentTime, // This will be "HH:MM"
            status: 'pending', // Default status
            reason: reason.trim(),
        };

        try {
            await createAppointment(newAppointment).unwrap();
            toast.success('Appointment created successfully!');
            // Reset form
            setParty('');
            setAppointmentDate('');
            setAppointmentTime('');
            setSelectedBranchId(forBranchId || ''); // Reset to pre-selected or empty
            setSelectedUserId('');
            setReason('');
            
            if (onAppointmentCreated) {
                onAppointmentCreated();
            }
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Failed to create appointment:', error);
            const message = getApiErrorMessage(error);
            toast.error(`Failed to create appointment: ${message}`);
            // Optionally setFormError(message) if you want to display it in the form as well
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

    // Tailwind classes for inputs and labels
    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 
                              rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent 
                              transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    // Filter users: example - exclude 'client' and 'user' roles if this modal is for assigning to staff/admin
    const filteredUsers = users ? users.filter(user => user.role !== "client" && user.role !== "user") : [];

    // Helper to format HH:MM to AM/PM for display in select options
    const formatTimeForDisplay = (time24: string): string => {
        if (!time24) return "";
        const [hoursStr, minutesStr] = time24.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; // Convert 0 or 12 to 12 for 12-hour format
        
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose} // Close on backdrop click
        >
            <motion.div
                className={`relative p-6 sm:p-8 border w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl
                           text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700`}
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <button
                    title='Close Modal'
                    aria-label="Close modal"
                    className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors duration-200"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </button>

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
                            <div>
                                <label htmlFor="branch" className={labelBaseClasses}>
                                    <MapPin size={16} className="mr-2 opacity-70" /> Branch Location
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

                            <div>
                                <label htmlFor="userId" className={labelBaseClasses}>
                                    <UserCheck size={16} className="mr-2 opacity-70" /> Assign To (Staff/Admin)
                                </label>
                                <select
                                    id="userId"
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
                                <label htmlFor="party" className={labelBaseClasses}>
                                    <Users size={16} className="mr-2 opacity-70" /> Involved Party / Client Name
                                </label>
                                <input
                                    type="text"
                                    id="party"
                                    className={inputBaseClasses}
                                    value={party}
                                    onChange={(e) => setParty(e.target.value)}
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="appointmentDate" className={labelBaseClasses}>
                                        <CalendarPlus size={16} className="mr-2 opacity-70" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        id="appointmentDate"
                                        className={inputBaseClasses}
                                        value={appointmentDate}
                                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="appointmentTime" className={labelBaseClasses}>
                                        <Clock size={16} className="mr-2 opacity-70" /> Time
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

                            <div>
                                <label htmlFor="reason" className={labelBaseClasses}>
                                    <MessageSquare size={16} className="mr-2 opacity-70" /> Reason / Purpose
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
                            
                            {formError && (
                                <p className="text-xs text-red-500 dark:text-red-400 text-center">{formError}</p>
                            )}

                            <div className="pt-3 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                                <motion.button
                                    type="submit"
                                    className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white
                                                bg-gradient-to-r from-blue-600 to-purple-600 dark:from-sky-500 dark:to-indigo-600
                                                hover:from-blue-700 hover:to-purple-700 dark:hover:from-sky-600 dark:hover:to-indigo-700
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 
                                                dark:focus:ring-offset-slate-800
                                                transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                                                disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
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
                                    className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg 
                                                bg-slate-100 hover:bg-slate-200 text-slate-700 
                                                dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500
                                                dark:focus:ring-offset-slate-800
                                                transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isAppointmentLoading} // Also disable cancel during submission
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default CreateAppointment;