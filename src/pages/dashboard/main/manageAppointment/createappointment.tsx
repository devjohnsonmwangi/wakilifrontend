import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    useCreateAppointmentMutation,
    CreateAppointmentPayload,
} from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery, BranchLocationDataTypes } from '../../../../features/branchlocation/branchlocationapi';
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';
import { toast } from 'sonner';
// CORRECTED: Imported Variants type from framer-motion
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, CalendarPlus, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2, User as UserIcon, Search, ChevronDown } from 'lucide-react';

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

// MODIFIED: Function updated to accept startMinute
const generateTimeSlots = (startHour = 9, startMinute = 0, endHour = 17, intervalMinutes = 30): string[] => {
    const slots: string[] = [];
    const startTime = new Date();
    // Use startMinute in setHours
    startTime.setHours(startHour, startMinute, 0, 0);
    const endTime = new Date();
    endTime.setHours(endHour, 0, 0, 0);
    const currentTime = new Date(startTime);
    while (currentTime < endTime) {
        const h = currentTime.getHours().toString().padStart(2, '0');
        const m = currentTime.getMinutes().toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    // This logic correctly handles the end time boundary
    if (currentTime.getHours() === endHour && currentTime.getMinutes() === 0) {
       const h = currentTime.getHours().toString().padStart(2, '0');
       slots.push(`${h}:00`);
    }
    return slots;
};

// MODIFIED: Calling with new start time (8:15 AM) and a 15-minute interval for more slots.
const TIME_SLOTS = generateTimeSlots(8, 15, 17, 15);

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
    const [selectedStaffId, setSelectedStaffId] = useState<number | string>('');
    
    const [partyName, setPartyName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState<string>('');
    const [reason, setReason] = useState('');
    const [notesByClient, setNotesByClient] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    // --- State and Refs for Searchable/Custom Dropdowns ---
    const [branchSearch, setBranchSearch] = useState('');
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const branchDropdownRef = useRef<HTMLDivElement>(null);

    const [clientSearch, setClientSearch] = useState('');
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const clientDropdownRef = useRef<HTMLDivElement>(null);

    const [staffSearch, setStaffSearch] = useState('');
    const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
    const staffDropdownRef = useRef<HTMLDivElement>(null);

    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
    const timeDropdownRef = useRef<HTMLDivElement>(null);
    
    const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);

    const staffUsers = useMemo(() => allUsers ? allUsers.filter(user => user.role && !['client', 'user'].includes(user.role.toLowerCase())) : [], [allUsers]);
    const clientUsers = useMemo(() => allUsers ? allUsers.filter(user => user.role && ['client', 'user'].includes(user.role.toLowerCase())) : [], [allUsers]);
    
    // --- Set initial search text for pre-selected values ---
    useEffect(() => {
        if (forBranchId && branches) {
            const branch = branches.find(b => b.branch_id.toString() === forBranchId.toString());
            if (branch) setBranchSearch(`${branch.name} - ${branch.address}`);
        }
        if (preselectedClientId && clientUsers.length > 0) {
            const client = clientUsers.find(u => u.user_id === preselectedClientId);
            if (client) setClientSearch(`${client.full_name} (${client.email})`);
        }
    }, [forBranchId, preselectedClientId, branches, clientUsers]);

    // --- Filtered lists for search ---
    const filteredBranches = useMemo(() => {
        if (!branches) return [];
        return branches.filter(branch =>
            branch.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
            branch.address.toLowerCase().includes(branchSearch.toLowerCase())
        );
    }, [branches, branchSearch]);

    const filteredClientUsers = useMemo(() => {
        return clientUsers.filter(user =>
            user.full_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(clientSearch.toLowerCase())
        );
    }, [clientUsers, clientSearch]);

    const filteredStaffUsers = useMemo(() => {
        return staffUsers.filter(user =>
            user.full_name.toLowerCase().includes(staffSearch.toLowerCase()) ||
            (user.role && user.role.toLowerCase().includes(staffSearch.toLowerCase()))
        );
    }, [staffUsers, staffSearch]);

    // --- Handlers for Dropdowns ---
    const handleSelectBranch = (branch: BranchLocationDataTypes) => {
        setSelectedBranchId(branch.branch_id);
        setBranchSearch(`${branch.name} - ${branch.address}`);
        setIsBranchDropdownOpen(false);
    };
    const handleSelectClient = (user: UserDataTypes) => {
        setSelectedClientUserId(user.user_id);
        setClientSearch(`${user.full_name} (${user.email})`);
        setIsClientDropdownOpen(false);
    };
    const handleSelectStaff = (user: UserDataTypes) => {
        setSelectedStaffId(user.user_id);
        setStaffSearch(`${user.full_name} (${user.role})`);
        setIsStaffDropdownOpen(false);
    };
    const handleSelectTime = (slot: string) => {
        setAppointmentTime(slot);
        setIsTimeDropdownOpen(false);
    };

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) setIsBranchDropdownOpen(false);
            if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) setIsClientDropdownOpen(false);
            if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target as Node)) setIsStaffDropdownOpen(false);
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) setIsTimeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            setFormError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        let appointmentDateTimeISO: string;
        try {
            const localDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
            if (isNaN(localDateTime.getTime())) throw new Error("Invalid date or time selected by user.");
            appointmentDateTimeISO = localDateTime.toISOString();
        } catch (dateError) {
            const errorMessage = "Invalid date or time. Please check your selection.";
            setFormError(errorMessage); toast.error(errorMessage); return;
        }

        const payloadForServer: CreateAppointmentPayload = {
            client_user_id: Number(selectedClientUserId),
            branch_id: Number(selectedBranchId),
            party: partyName.trim(),
            appointmentDateTimeISO: appointmentDateTimeISO,
            status: 'pending',
            reason: reason.trim(),
            assigneeIds: selectedStaffId ? [Number(selectedStaffId)] : [], 
            notes_by_client: notesByClient.trim() || undefined,
        };

        try {
            await createAppointment(payloadForServer).unwrap();
            toast.success('Appointment created successfully!');
            onClose();
            if (onAppointmentCreated) onAppointmentCreated();
        } catch (error) {
            console.error('Failed to create appointment:', error);
            const message = getApiErrorMessage(error);
            toast.error(`Failed to create appointment: ${message}`);
            setFormError(message);
        }
    };

    // CORRECTED: Added the Variants type to the object definitions
    const modalVariants: Variants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
    };

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };
    
    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const labelBaseClasses = "flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5";
    
    const formatTimeForDisplay = (time24Value: string): string => {
        if (!time24Value || !time24Value.includes(':')) return "Pick Time";
        const [hoursStr, minutesStr] = time24Value.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        if (isNaN(hours) || isNaN(minutes)) return "Invalid Time";
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    // CORRECTED: Added the Variants type to the object definition
    const dropdownListVariants: Variants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } }
    };

    const renderSearchableInput = (
        id: string,
        label: string,
        Icon: React.ElementType,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        onClear: () => void,
        onToggle: () => void,
        onFocus: () => void,
        isOpen: boolean,
        placeholder: string,
        isDisabled: boolean,
        isRequired: boolean,
        listItems: React.ReactNode,
        filteredListLength: number
    ) => (
        <div className="relative">
            <label htmlFor={id} className={labelBaseClasses}>
                <Icon size={16} className="mr-2 opacity-70" /> {label} *
            </label>
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
                <input
                    id={id}
                    type="text"
                    className={`${inputBaseClasses} pl-10 pr-16`}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    required={isRequired}
                    disabled={isDisabled}
                    autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {value && !isDisabled && (
                        <button type="button" onClick={onClear} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <X size={16} />
                        </button>
                    )}
                    <button type="button" onClick={onToggle} disabled={isDisabled} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && !isDisabled && (
                    <motion.ul
                        variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit"
                        className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-52 overflow-y-auto"
                    >
                        {filteredListLength > 0 ? (
                            listItems
                        ) : (
                            <li className="px-4 py-2.5 text-sm text-slate-500 italic">
                                {value ? 'No matching results found.' : 'Start typing to search...'}
                            </li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );

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
                            <motion.div key="loading-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 min-h-[200px]">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-sky-400 mb-3" />
                                <p className="text-slate-600 dark:text-slate-400">{isBranchesLoading ? "Loading branches..." : "Loading users..."}</p>
                            </motion.div>
                        ) : isBranchesError || isUsersError ? (
                            <motion.div key="loading-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center py-10 min-h-[200px] p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-3" />
                                <p className="font-semibold text-red-700 dark:text-red-300">{isBranchesError ? "Error loading branches." : "Error loading users."}</p>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{getApiErrorMessage(isBranchesError ? branchesApiError : usersApiError)}</p>
                                <button onClick={onClose} className="mt-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">Close</button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="appointment-form"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onSubmit={handleSubmit} className="space-y-5"
                            >
                                <div ref={branchDropdownRef}>
                                    {renderSearchableInput("branchSearch", "Branch Location", MapPin, branchSearch,
                                        (e) => { setBranchSearch(e.target.value); setSelectedBranchId(''); if (!isBranchDropdownOpen) setIsBranchDropdownOpen(true); },
                                        () => { setBranchSearch(''); setSelectedBranchId(''); },
                                        () => setIsBranchDropdownOpen(prev => !prev),
                                        () => setIsBranchDropdownOpen(true),
                                        isBranchDropdownOpen,
                                        branches?.length === 0 ? "No branches available" : "Search for a branch...",
                                        !!forBranchId || !branches || branches.length === 0,
                                        !selectedBranchId,
                                        filteredBranches.slice(0, 50).map(branch => <li key={branch.branch_id}><button type="button" className="w-full text-left px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => handleSelectBranch(branch)}><span className="font-bold">{branch.name}</span> <span className="text-slate-500 dark:text-slate-400">- {branch.address}</span></button></li>),
                                        filteredBranches.length
                                    )}
                                </div>

                                <div ref={clientDropdownRef}>
                                    {renderSearchableInput("clientSearch", "Client (User for Appointment)", UserIcon, clientSearch,
                                        (e) => { setClientSearch(e.target.value); setSelectedClientUserId(''); if (!isClientDropdownOpen) setIsClientDropdownOpen(true); },
                                        () => { setClientSearch(''); setSelectedClientUserId(''); },
                                        () => setIsClientDropdownOpen(prev => !prev),
                                        () => setIsClientDropdownOpen(true),
                                        isClientDropdownOpen,
                                        clientUsers.length === 0 ? "No clients available" : "Search for client by name or email...",
                                        !!preselectedClientId || clientUsers.length === 0,
                                        !selectedClientUserId,
                                        filteredClientUsers.slice(0, 50).map(user => <li key={user.user_id}><button type="button" className="w-full text-left px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => handleSelectClient(user)}><span className="font-bold">{user.full_name}</span> <span className="text-slate-500 dark:text-slate-400">({user.email})</span></button></li>),
                                        filteredClientUsers.length
                                    )}
                                </div>

                                <div ref={staffDropdownRef}>
                                    {renderSearchableInput("staffSearch", "Assign To (Staff)", UserCheck, staffSearch,
                                        (e) => { setStaffSearch(e.target.value); setSelectedStaffId(''); if (!isStaffDropdownOpen) setIsStaffDropdownOpen(true); },
                                        () => { setStaffSearch(''); setSelectedStaffId(''); },
                                        () => setIsStaffDropdownOpen(prev => !prev),
                                        () => setIsStaffDropdownOpen(true),
                                        isStaffDropdownOpen,
                                        staffUsers.length === 0 ? "No staff available" : "Search for staff member...",
                                        staffUsers.length === 0,
                                        !selectedStaffId,
                                        filteredStaffUsers.slice(0, 50).map(user => <li key={user.user_id}><button type="button" className="w-full text-left px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => handleSelectStaff(user)}><span className="font-bold">{user.full_name}</span> <span className="text-slate-500 dark:text-slate-400">({user.role})</span></button></li>),
                                        filteredStaffUsers.length
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="partyName" className={labelBaseClasses}><Users size={16} className="mr-2 opacity-70" /> Party Name (e.g., Client's Name or Case Name) *</label>
                                    <input type="text" id="partyName" className={inputBaseClasses} value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="e.g., John Doe vs ABC Corp" required />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="appointmentDate" className={labelBaseClasses}><CalendarPlus size={16} className="mr-2 opacity-70" /> Date *</label>
                                        <input type="date" id="appointmentDate" className={inputBaseClasses} value={appointmentDate} min={todayDateString} onChange={(e) => setAppointmentDate(e.target.value)} required />
                                    </div>
                                    <div ref={timeDropdownRef} className="relative">
                                        <label htmlFor="appointmentTime" className={labelBaseClasses}><Clock size={16} className="mr-2 opacity-70" /> Time *</label>
                                        <button type="button" id="appointmentTime" onClick={() => setIsTimeDropdownOpen(prev => !prev)} className={`${inputBaseClasses} text-left flex justify-between items-center ${!appointmentTime ? 'text-slate-400 dark:text-slate-500' : ''}`}>
                                            {appointmentTime ? formatTimeForDisplay(appointmentTime) : "Select a Time Slot"}
                                            <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {isTimeDropdownOpen && (
                                                <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                                                    {TIME_SLOTS.map(slot => (
                                                        <li key={slot}>
                                                            <button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => handleSelectTime(slot)}>
                                                                {formatTimeForDisplay(slot)}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reason" className={labelBaseClasses}><MessageSquare size={16} className="mr-2 opacity-70" /> Reason / Purpose *</label>
                                    <textarea id="reason" className={`${inputBaseClasses} resize-none`} value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Briefly describe the purpose of the appointment" required />
                                </div>

                                <div>
                                    <label htmlFor="notesByClient" className={labelBaseClasses}><MessageSquare size={16} className="mr-2 opacity-70" /> Client Notes (Optional)</label>
                                    <textarea id="notesByClient" className={`${inputBaseClasses} resize-none`} value={notesByClient} onChange={(e) => setNotesByClient(e.target.value)} rows={2} placeholder="Any additional notes or requests from the client" />
                                </div>

                                {formError && <p className="text-xs text-red-500 dark:text-red-400 text-center">{formError}</p>}

                                <div className="pt-3 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                                    <motion.button type="submit" className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-sky-500 dark:to-indigo-600 hover:from-blue-700 hover:to-purple-700 dark:hover:from-sky-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm`} disabled={isAppointmentLoading} whileHover={{ scale: isAppointmentLoading ? 1 : 1.03 }} whileTap={{ scale: isAppointmentLoading ? 1 : 0.98 }}>
                                        {isAppointmentLoading ? (<div className="flex items-center justify-center"><Loader2 className="animate-spin h-5 w-5 mr-2" />Scheduling...</div>) : 'Schedule Appointment'}
                                    </motion.button>
                                    <motion.button type="button" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm" onClick={onClose} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} disabled={isAppointmentLoading}>
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