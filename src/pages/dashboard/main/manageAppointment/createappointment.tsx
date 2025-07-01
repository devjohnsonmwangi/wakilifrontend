import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence, Variants } from 'framer-motion';
// --- ACTION: Removed 'ChevronDown' as it is unused ---
import { X, CalendarPlus, Users, MapPin, UserCheck, Clock, MessageSquare, AlertCircle, Loader2, User as UserIcon, Search } from 'lucide-react';

import {
    useCreateAppointmentMutation,
    Appointment,
    BranchLocation,
} from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi';
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';


interface CreateAppointmentProps {
    isDarkMode?: boolean;
    forBranchId?: string | number;
    preselectedClientId?: number;
    onAppointmentCreated?: () => void;
    onClose: () => void;
}

// --- ACTION: Added a proper props interface for the SearchableDropdown helper ---
interface SearchableDropdownProps<T> {
    label: string;
    Icon: React.ElementType;
    value: string;
    setValue: (value: string) => void;
    setSelectedId: (id: number | '') => void;
    setOpen: (isOpen: boolean) => void;
    isOpen: boolean;
    dropdownRef: React.RefObject<HTMLDivElement>;
    filteredItems: T[];
    renderItem: (item: T) => React.ReactNode;
    placeholder: string;
    disabled: boolean;
    required: boolean;
}

interface ApiErrorData { message?: string; errors?: Array<{ message: string }>; }
interface RtkQueryErrorShape { data?: ApiErrorData; }

// Helper Functions
const getApiErrorMessage = (error: unknown): string => {
    const err = error as RtkQueryErrorShape;
    if (err?.data?.message) return err.data.message;
    if (err?.data?.errors) return err.data.errors.map(e => e.message).join(', ');
    return 'An unknown error occurred while saving.';
};
const generateTimeSlots = (startHour = 8, endHour = 17, interval = 30): string[] => {
    const slots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += interval) {
            slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    return slots;
};
const TIME_SLOTS = generateTimeSlots();

// --- Main Component ---
const CreateAppointment: React.FC<CreateAppointmentProps> = ({
    forBranchId,
    preselectedClientId,
    onAppointmentCreated,
    onClose
}) => {
    // Hooks
    const [createAppointment, { isLoading: isAppointmentLoading }] = useCreateAppointmentMutation();
    const { data: branches, isLoading: isBranchesLoading, isError: isBranchesError } = useFetchBranchLocationsQuery();
    const { data: allUsers, isLoading: isUsersLoading, isError: isUsersError } = useFetchUsersQuery();

    // Form State
    const [locationBranchId, setLocationBranchId] = useState<number | ''>(forBranchId ? Number(forBranchId) : '');
    const [clientUserId, setClientUserId] = useState<number | ''>(preselectedClientId || '');
    const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    // Searchable Dropdown State & Refs
    const [branchSearch, setBranchSearch] = useState('');
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const branchDropdownRef = useRef<HTMLDivElement>(null);
    const [clientSearch, setClientSearch] = useState('');
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const clientDropdownRef = useRef<HTMLDivElement>(null);
    const [staffSearch, setStaffSearch] = useState('');
    const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
    const staffDropdownRef = useRef<HTMLDivElement>(null);

    const staffUsers = useMemo(() => allUsers?.filter(user => user.role && !['client'].includes(user.role.toLowerCase())) || [], [allUsers]);
    const clientUsers = useMemo(() => allUsers?.filter(user => user.role && ['client', 'user'].includes(user.role.toLowerCase())) || [], [allUsers]);

    useEffect(() => {
        if (forBranchId && branches) {
            const branch = branches.find(b => b.branch_id.toString() === forBranchId.toString());
            if (branch) setBranchSearch(branch.name);
        }
        if (preselectedClientId && clientUsers.length > 0) {
            const client = clientUsers.find(u => u.user_id === preselectedClientId);
            if (client) setClientSearch(client.full_name);
        }
    }, [forBranchId, preselectedClientId, branches, clientUsers]);

    // Filtered lists for dropdowns
    const filteredBranches = useMemo(() => branches?.filter(b => b.name.toLowerCase().includes(branchSearch.toLowerCase())) || [], [branches, branchSearch]);
    const filteredClients = useMemo(() => clientUsers.filter(u => u.full_name.toLowerCase().includes(clientSearch.toLowerCase()) || u.email.toLowerCase().includes(clientSearch.toLowerCase())), [clientUsers, clientSearch]);
    const filteredStaff = useMemo(() => staffUsers.filter(u => u.full_name.toLowerCase().includes(staffSearch.toLowerCase())), [staffUsers, staffSearch]);

    // Handle dropdown selections
    const handleSelectBranch = (branch: BranchLocation) => { setLocationBranchId(branch.branch_id); setBranchSearch(branch.name); setIsBranchDropdownOpen(false); };
    const handleSelectClient = (user: UserDataTypes) => { setClientUserId(user.user_id); setClientSearch(user.full_name); setIsClientDropdownOpen(false); };
    const handleSelectStaff = (user: UserDataTypes) => { setAssigneeIds([user.user_id]); setStaffSearch(user.full_name); setIsStaffDropdownOpen(false); };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!locationBranchId || !clientUserId || !appointmentDate || !appointmentTime || !reason) {
            const msg = "Please fill in all required fields: Branch, Client, Date, Time, and Reason.";
            setFormError(msg);
            toast.error(msg);
            return;
        }

        try {
            const appointment_datetime = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
            
            const appointmentData: Omit<Appointment, 'appointment_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'client' | 'branch' | 'assignees'> = {
                client_user_id: Number(clientUserId),
                location_branch_id: Number(locationBranchId),
                appointment_datetime,
                reason: reason.trim(),
                status: 'pending',
                notes: notes.trim() || null,
            };

            await createAppointment({ appointmentData, assigneeIds }).unwrap();

            toast.success('Appointment created successfully!');
            onAppointmentCreated?.();
            onClose();

        } catch (error) {
            const message = getApiErrorMessage(error);
            toast.error(`Creation failed: ${message}`);
            setFormError(message);
        }
    };

    // UI Styles and Components
    const modalVariants: Variants = { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
    const backdropVariants: Variants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow text-sm disabled:opacity-70`;
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
    
    // --- ACTION: Typed the helper function's props using the new interface ---
    const SearchableDropdown = <T,>({ label, Icon, value, setValue, setSelectedId, setOpen, isOpen, dropdownRef, filteredItems, renderItem, placeholder, disabled, required }: SearchableDropdownProps<T>) => (
        <div ref={dropdownRef} className="relative">
            <label className={labelBaseClasses}><Icon size={16} className="mr-2" /> {label} {required && '*'}</label>
            <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /><input type="text" value={value} onChange={(e) => { setValue(e.target.value); setSelectedId(''); setOpen(true); }} onFocus={() => setOpen(true)} placeholder={placeholder} disabled={disabled} className={`${inputBaseClasses} pl-10 pr-8`} autoComplete="off" />{value && <button type="button" onClick={() => { setValue(''); setSelectedId(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>}</div>
            <AnimatePresence>{isOpen && filteredItems.length > 0 && <motion.ul variants={modalVariants} initial="initial" animate="animate" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-52 overflow-y-auto">{filteredItems.map(renderItem)}</motion.ul>}</AnimatePresence>
        </div>
    );
    
    return (
        <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" variants={backdropVariants} initial="initial" animate="animate" exit="exit" onClick={onClose}>
            <motion.div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col" variants={modalVariants} onClick={(e) => e.stopPropagation()}>
                <button title='Close' className="absolute top-3 right-3 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors z-10" onClick={onClose}><X size={20} /></button>
                <div className="flex-grow overflow-y-auto p-6 sm:p-8">
                    <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600"><CalendarPlus className="w-7 h-7 text-white" /></div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">New Appointment</h2></div>
                    <AnimatePresence mode="wait">
                        {(isBranchesLoading || isUsersLoading) ? (<motion.div key="loading" className="flex flex-col items-center justify-center py-10 min-h-[200px]"><Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-3" /><p className="text-slate-600 dark:text-slate-400">Loading data...</p></motion.div>) :
                        (isBranchesError || isUsersError) ? (<motion.div key="error" className="p-4 text-center"><AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" /><p className="font-semibold text-red-600">Failed to load required data.</p></motion.div>) :
                        (<motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                            <SearchableDropdown<BranchLocation> label="Branch" Icon={MapPin} value={branchSearch} setValue={setBranchSearch} setSelectedId={setLocationBranchId} setOpen={setIsBranchDropdownOpen} isOpen={isBranchDropdownOpen} dropdownRef={branchDropdownRef} filteredItems={filteredBranches} renderItem={(b) => <li key={b.branch_id}><button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-slate-700" onClick={() => handleSelectBranch(b)}>{b.name}</button></li>} placeholder="Search for a branch..." disabled={!!forBranchId} required={true} />
                            <SearchableDropdown<UserDataTypes> label="Client" Icon={UserIcon} value={clientSearch} setValue={setClientSearch} setSelectedId={setClientUserId} setOpen={setIsClientDropdownOpen} isOpen={isClientDropdownOpen} dropdownRef={clientDropdownRef} filteredItems={filteredClients} renderItem={(u) => <li key={u.user_id}><button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-slate-700" onClick={() => handleSelectClient(u)}>{u.full_name}</button></li>} placeholder="Search for a client..." disabled={!!preselectedClientId} required={true} />
                            <SearchableDropdown<UserDataTypes> label="Assign To (Staff)" Icon={UserCheck} value={staffSearch} setValue={setStaffSearch} setSelectedId={(id) => setAssigneeIds(id ? [id] : [])} setOpen={setIsStaffDropdownOpen} isOpen={isStaffDropdownOpen} dropdownRef={staffDropdownRef} filteredItems={filteredStaff} renderItem={(u) => <li key={u.user_id}><button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-slate-700" onClick={() => handleSelectStaff(u)}>{u.full_name}</button></li>} placeholder="Search for staff..." required={false} disabled={false} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label htmlFor="appointmentDate" className={labelBaseClasses}><CalendarPlus size={16} className="mr-2" /> Date *</label><input type="date" id="appointmentDate" className={inputBaseClasses} value={appointmentDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setAppointmentDate(e.target.value)} required /></div>
                                <div><label htmlFor="appointmentTime" className={labelBaseClasses}><Clock size={16} className="mr-2" /> Time *</label><select id="appointmentTime" className={inputBaseClasses} value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required><option value="" disabled>Select time</option>{TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></div>
                            </div>
                            <div><label htmlFor="reason" className={labelBaseClasses}><MessageSquare size={16} className="mr-2" /> Reason / Case Name *</label><textarea id="reason" className={`${inputBaseClasses} resize-y min-h-[70px]`} value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="e.g., Initial Consultation for John Doe vs. ABC Corp" required /></div>
                            <div><label htmlFor="notes" className={labelBaseClasses}><Users size={16} className="mr-2" /> Notes (Optional)</label><textarea id="notes" className={`${inputBaseClasses} resize-y min-h-[70px]`} value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any additional details or internal notes..." /></div>
                            {formError && <p className="text-xs text-center text-red-500 dark:text-red-400 flex items-center justify-center"><AlertCircle size={14} className="mr-1.5" />{formError}</p>}
                            <div className="pt-2 flex flex-col-reverse sm:flex-row-reverse gap-3">
                                <button type="submit" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed" disabled={isAppointmentLoading}><div className="flex items-center justify-center">{isAppointmentLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}Schedule</div></button>
                                <button type="button" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors shadow-sm" onClick={onClose} disabled={isAppointmentLoading}>Cancel</button>
                            </div>
                        </motion.form>)}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreateAppointment;