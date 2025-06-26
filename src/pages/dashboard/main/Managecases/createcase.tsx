import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    useCreateCaseMutation,
    useAssignStaffToCaseMutation,
    CaseType,
    CreateCasePayload,
} from '../../../../features/case/caseAPI'; 
import {
    useFetchUsersQuery,
    UserApiResponse,
} from '../../../../features/users/usersAPI'; 
import { toast } from 'sonner';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
    X, Briefcase, FolderKanban, Hash, Activity, Landmark, Building2, Users, CircleDollarSign, MessageSquare, AlertTriangle, Loader2, UserCheck, UserCog, UserPlus, Search, ChevronDown
} from 'lucide-react';

// ============================================================================
// 1. HELPER TYPES AND COMPONENTS
// ============================================================================

interface ApiError {
    status?: number;
    data?: {
        message?: string;
        msg?: string;
        error?: string;
        errors?: Record<string, string[]>;
    };
    message?: string;
}

export interface SearchOption {
    value: number;
    label: string;
    sublabel?: string;
}

interface SearchableSelectProps {
    options: SearchOption[];
    value: number | number[] | null;
    onChange: (value: number | number[] | null) => void;
    placeholder?: string;
    isLoading?: boolean;
    isMulti?: boolean;
    error?: string;
    id?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options, value, onChange, placeholder = "Search...", isLoading = false, isMulti = false, error, id,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOptions = useMemo(() => {
        if (!value) return [];
        const selectedValues = Array.isArray(value) ? value : [value];
        return options.filter(opt => selectedValues.includes(opt.value));
    }, [value, options]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        const lowercasedTerm = searchTerm.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(lowercasedTerm) ||
            opt.sublabel?.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: SearchOption) => {
        if (isMulti) {
            const currentValues = (value as number[] | null) || [];
            const newValues = currentValues.includes(option.value)
                ? currentValues.filter(v => v !== option.value)
                : [...currentValues, option.value];
            onChange(newValues.length > 0 ? newValues : null);
        } else {
            onChange(option.value);
        }
        setSearchTerm('');
        if (!isMulti) setIsOpen(false);
    };

    const handleRemove = (selectedValue: number) => {
        if (isMulti) {
            const newValues = (value as number[]).filter(v => v !== selectedValue);
            onChange(newValues.length > 0 ? newValues : null);
        } else {
            onChange(null);
        }
    };

    const inputBaseClasses = `w-full bg-slate-50 dark:bg-slate-700/80 border rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const errorClasses = 'border-red-500 dark:border-red-500 focus:ring-red-500';
    const normalClasses = 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500';

    return (
        <div className="relative" ref={containerRef}>
            <div
                id={id}
                onClick={() => setIsOpen(prev => !prev)}
                className={`${inputBaseClasses} ${error ? errorClasses : normalClasses} flex items-center flex-wrap gap-1.5 p-1.5 min-h-[46px] cursor-text`}
            >
                <Search size={18} className="text-slate-400 dark:text-slate-500 ml-1.5 flex-shrink-0" />
                {isMulti && selectedOptions.map(opt => (
                    <span key={opt.value} className="flex items-center bg-blue-100 dark:bg-sky-900 text-blue-800 dark:text-sky-200 text-xs font-medium px-2 py-1 rounded-full">
                        {opt.label}
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(opt.value); }} className="ml-1.5 -mr-1 hover:bg-black/10 rounded-full">
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={!isMulti && selectedOptions.length > 0 ? selectedOptions[0].label : placeholder}
                    className="flex-grow bg-transparent focus:outline-none p-1 text-sm"
                    disabled={isLoading}
                    autoComplete="off"
                />
                 {!isMulti && value && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(value as number); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X size={16} />
                    </button>
                )}
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto styled-scrollbar">
                    {isLoading ? ( <div className="p-4 text-center text-sm text-slate-500">Loading...</div> ) : 
                     filteredOptions.length > 0 ? (
                        <ul>
                            {filteredOptions.map((opt) => (
                                <li key={opt.value}
                                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${ (Array.isArray(value) && value.includes(opt.value)) || value === opt.value ? 'bg-blue-50 dark:bg-sky-900/50' : '' }`}
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                                >
                                    <p className="font-medium text-slate-800 dark:text-slate-100">{opt.label}</p>
                                    {opt.sublabel && <p className="text-xs text-slate-500 dark:text-slate-400">{opt.sublabel}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : ( <div className="p-4 text-center text-sm text-slate-500">No results found.</div> )}
                </div>
            )}
            {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};


// ============================================================================
// 2. MAIN FORM COMPONENT
// ============================================================================

interface FormData {
    user_id_for_case: number | null;
    primary_assignee_id: number | null; 
    case_type: CaseType;
    case_number: string;
    case_track_number: string;
    court: string;
    station: string;
    parties: string;
    fee: number;
    case_description: string;
    assigned_staff_ids: number[] | null;
}

interface CreateCaseFormProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean;
    currentUserId?: number;
    currentUserRole?: UserApiResponse['role']; 
}

const STAFF_ROLES_FOR_ASSIGNMENT: UserApiResponse['role'][] = ['lawyer', 'manager', 'admin', 'supports', 'clerks'];
const CLIENT_ROLES_FOR_SELECTION: UserApiResponse['role'][] = ['client', 'user'];

const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ isOpen, onClose, currentUserId, currentUserRole }) => {
    const [createCase, { isLoading: isCreatingCase }] = useCreateCaseMutation();
    const [assignStaffToCase, { isLoading: isAssigningStaff }] = useAssignStaffToCaseMutation();

    const isUserClientOrBasic = currentUserRole && CLIENT_ROLES_FOR_SELECTION.includes(currentUserRole);
    const isUserCreatingForSelf = isUserClientOrBasic && currentUserId !== undefined;

    const { data: allUsers, isLoading: isLoadingUsers, isError: isUsersError, error: usersErrorData, } = useFetchUsersQuery();
    
    const { register, handleSubmit, reset, control, formState: { errors: rhfErrors }, setValue, watch } = useForm<FormData>({
        mode: 'onSubmit',
        defaultValues: {
            user_id_for_case: isUserCreatingForSelf ? currentUserId : null,
            primary_assignee_id: null, 
            case_type: 'civil' as CaseType,
            case_description: '', case_number: '', case_track_number: '', court: '', station: '', parties: '', fee: 0,
            assigned_staff_ids: null, 
        },
    });
    
    const clientOptions: SearchOption[] = useMemo(() => {
        if (!allUsers) return [];
        return allUsers
            .filter(user => CLIENT_ROLES_FOR_SELECTION.includes(user.role))
            .map(u => ({ value: u.user_id, label: u.full_name, sublabel: `${u.email} - ID: ${u.user_id}` }));
    }, [allUsers]);

    const staffOptions: SearchOption[] = useMemo(() => {
        if (!allUsers) return [];
        return allUsers
            .filter(user => STAFF_ROLES_FOR_ASSIGNMENT.includes(user.role))
            .map(u => ({ value: u.user_id, label: u.full_name, sublabel: u.role }));
    }, [allUsers]);

    useEffect(() => {
        if (isUserCreatingForSelf) setValue('user_id_for_case', currentUserId);
        else if (watch('user_id_for_case') === currentUserId) setValue('user_id_for_case', null);
    }, [currentUserId, currentUserRole, isUserCreatingForSelf, setValue, watch]);

    const validateAndPreparePayload: SubmitHandler<FormData> = async (data) => {
        if (!data.primary_assignee_id) {
             toast.error("Primary Assignee is missing."); return;
        }

        let createdCaseId: number | null = null;
        try {
            const casePayload: CreateCasePayload = {
                user_id: data.user_id_for_case!, case_type: data.case_type, fee: data.fee, case_number: data.case_number, case_track_number: data.case_track_number, case_description: data.case_description, court: data.court || undefined, station: data.station || undefined, parties: data.parties || undefined,
            };

            const result = await createCase(casePayload).unwrap();
            createdCaseId = result.case_id;
            toast.success(`🎉 Case (ID: ${createdCaseId}) created successfully!`);

            let allAssignmentsSuccessful = true;
            if (createdCaseId) {
                const staffToAssign = new Set<number>([data.primary_assignee_id]);
                if (data.assigned_staff_ids) {
                    data.assigned_staff_ids.forEach(id => staffToAssign.add(id));
                }

                toast.info(`Assigning ${staffToAssign.size} staff member(s)...`);
                for (const staffId of Array.from(staffToAssign)) {
                    try {
                        await assignStaffToCase({ caseId: createdCaseId, staffUserId: staffId }).unwrap();
                    } catch (assignError: unknown) {
                        allAssignmentsSuccessful = false;
                        const apiError = assignError as ApiError;
                        const staffMember = staffOptions.find(s => s.value === staffId);
                        const staffName = staffMember ? staffMember.label : `ID ${staffId}`;
                        const errorMessage = apiError.data?.message || apiError.message || 'Unknown error';
                        toast.error(`Failed to assign ${staffName}: ${errorMessage}`);
                    }
                }
                if (allAssignmentsSuccessful && staffToAssign.size > 0) toast.success("All staff assigned successfully.");
            }
            resetFormAndClose();
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Error during case creation:', apiError);
            const errorMessage = apiError.data?.message || apiError.message || 'Failed to create case.';
            toast.error(`❌ ${errorMessage}`, { duration: 5000 });
        }
    };

    const resetFormAndClose = () => {
        reset();
        onClose();
    };

    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
    const inputBaseClass = "w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm";
    const errorTextClasses = "text-red-500 dark:text-red-400 text-xs mt-1";

    if (!isOpen) return null;
    
    const caseTypeOptions = [ { value: 'civil', label: 'Civil' }, { value: 'criminal', label: 'Criminal' }, { value: 'family', label: 'Family' }, { value: 'corporate', label: 'Corporate' }, { value: 'property', label: 'Property' }, { value: 'employment', label: 'Employment' }, { value: 'intellectual_property', label: 'Intellectual Property' }, { value: 'immigration', label: 'Immigration' }, { value: 'elc', label: 'ELC' }, { value: 'childrenCase', label: "Children's Case" }, { value: 'Tribunal', label: 'Tribunal' }, { value: 'conveyances', label: 'Conveyances' } ];
    const usersErrorString = (usersErrorData as ApiError)?.data?.message || (usersErrorData as ApiError)?.data?.error || (usersErrorData as ApiError)?.message || 'Please try again.';

    return (
        <motion.div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4" onClick={onClose}>
            <motion.div className={`relative p-0 border w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-sky-500 dark:to-indigo-600">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight"> Create New Case </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400"> Enter the details for the new case record. </p>
                        </div>
                    </div>
                    <button title='Close Modal' className="text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors duration-200" onClick={resetFormAndClose}>
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit(validateAndPreparePayload)} className="px-5 sm:px-6 py-6 space-y-5 overflow-y-auto max-h-[calc(100vh-200px)] styled-scrollbar">
                    
                    {!isUserCreatingForSelf && (
                        <div>
                            <label className={labelBaseClasses}> <UserCheck size={16} className="mr-2 opacity-70" /> Select Client for Case </label>
                            <Controller name="user_id_for_case" control={control} rules={{ required: 'Client selection is required.' }}
                                render={({ field }) => ( <SearchableSelect options={clientOptions} value={field.value} onChange={field.onChange} placeholder="Search for a client..." isLoading={isLoadingUsers} error={rhfErrors.user_id_for_case?.message} /> )}
                            />
                            {isUsersError && <p className={errorTextClasses}>Failed to load clients: {usersErrorString}</p>}
                        </div>
                    )}

                    <div>
                        <label className={labelBaseClasses}> <UserPlus size={16} className="mr-2 opacity-70" /> Select Primary Assignee </label>
                        <Controller name="primary_assignee_id" control={control} rules={{ required: 'Primary Assignee selection is required.' }}
                            render={({ field }) => ( <SearchableSelect options={staffOptions} value={field.value} onChange={field.onChange} placeholder="Search for a staff member..." isLoading={isLoadingUsers} error={rhfErrors.primary_assignee_id?.message} /> )}
                        />
                         {isUsersError && !staffOptions.length && <p className={errorTextClasses}>Failed to load staff for assignment.</p>}
                    </div>

                    <div>
                        <label className={labelBaseClasses}> <UserCog size={16} className="mr-2 opacity-70" /> Assign Additional Staff (Optional) </label>
                        <Controller name="assigned_staff_ids" control={control}
                            render={({ field }) => ( <SearchableSelect options={staffOptions.filter(opt => opt.value !== watch('primary_assignee_id'))} value={field.value} onChange={field.onChange} placeholder="Search and add more staff..." isLoading={isLoadingUsers} error={rhfErrors.assigned_staff_ids?.message} isMulti /> )} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                         <div>
                            <label htmlFor="case_type" className={labelBaseClasses}> <FolderKanban size={16} className="mr-2 opacity-70" /> Case Type </label>
                            <select id="case_type" {...register('case_type', { required: "Case type is required."})} className={`${inputBaseClass} ${rhfErrors.case_type ? 'border-red-500' : 'border-slate-300'}`}> {caseTypeOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))} </select>
                            {rhfErrors.case_type && <p className={errorTextClasses}>{rhfErrors.case_type?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="case_number" className={labelBaseClasses}> <Hash size={16} className="mr-2 opacity-70" /> Case Number </label>
                            <input type="text" id="case_number" {...register('case_number', { required: "Case number is required.", minLength: { value: 3, message: "Min 3 characters."}})} placeholder="e.g., CR/001/2023" className={`${inputBaseClass} ${rhfErrors.case_number ? 'border-red-500' : 'border-slate-300'}`} />
                            {rhfErrors.case_number && <p className={errorTextClasses}>{rhfErrors.case_number?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="case_track_number" className={labelBaseClasses}> <Activity size={16} className="mr-2 opacity-70" /> Track Number </label>
                            <input type="text" id="case_track_number" {...register('case_track_number', { required: "Track number is required.", minLength: { value: 3, message: "Min 3 characters."}})} placeholder="e.g., TRK-XYZ-001" className={`${inputBaseClass} ${rhfErrors.case_track_number ? 'border-red-500' : 'border-slate-300'}`} />
                            {rhfErrors.case_track_number && <p className={errorTextClasses}>{rhfErrors.case_track_number?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="fee" className={labelBaseClasses}> <CircleDollarSign size={16} className="mr-2 opacity-70" /> Case Fee (KES) </label>
                            <input type="number" id="fee" {...register('fee', { required: "Fee is required.", valueAsNumber: true, min: { value: 0.01, message: "Fee must be positive." } })} placeholder="e.g., 50000" className={`${inputBaseClass} ${rhfErrors.fee ? 'border-red-500' : 'border-slate-300'}`} />
                            {rhfErrors.fee && <p className={errorTextClasses}>{rhfErrors.fee?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="court" className={labelBaseClasses}> <Landmark size={16} className="mr-2 opacity-70" /> Court <span className="text-xs text-slate-400 ml-1">(Optional)</span> </label>
                            <input type="text" id="court" {...register('court')} placeholder="e.g., High Court" className={`${inputBaseClass} ${rhfErrors.court ? 'border-red-500' : 'border-slate-300'}`} />
                        </div>
                        <div>
                            <label htmlFor="station" className={labelBaseClasses}> <Building2 size={16} className="mr-2 opacity-70" /> Station <span className="text-xs text-slate-400 ml-1">(Optional)</span> </label>
                            <input type="text" id="station" {...register('station')} placeholder="e.g., Milimani Law Courts" className={`${inputBaseClass} ${rhfErrors.station ? 'border-red-500' : 'border-slate-300'}`} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="parties" className={labelBaseClasses}> <Users size={16} className="mr-2 opacity-70" /> Parties Involved <span className="text-xs text-slate-400 ml-1">(Optional)</span> </label>
                            <input type="text" id="parties" {...register('parties')} placeholder="e.g., John Doe vs. Jane Smith" className={`${inputBaseClass} ${rhfErrors.parties ? 'border-red-500' : 'border-slate-300'}`} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="case_description" className={labelBaseClasses}> <MessageSquare size={16} className="mr-2 opacity-70" /> Case Description </label>
                        <textarea id="case_description" {...register('case_description', { required: "Description is required.", minLength: { value: 10, message: "Min 10 characters."}})} rows={4} placeholder="Provide a detailed description of the case..." className={`${inputBaseClass} resize-none ${rhfErrors.case_description ? 'border-red-500' : 'border-slate-300'}`} ></textarea>
                        {rhfErrors.case_description && <p className={errorTextClasses}>{rhfErrors.case_description?.message}</p>}
                    </div>

                    {Object.keys(rhfErrors).length > 0 && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-md text-center">
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center justify-center">
                                <AlertTriangle size={16} className="mr-2" /> Please review and correct the highlighted errors.
                            </p>
                        </div>
                    )}

                    <footer className="pt-4 flex flex-col sm:flex-row-reverse sm:justify-start gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
                         <motion.button type="submit" className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-sky-500 dark:to-indigo-600 dark:hover:from-sky-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
                            disabled={isCreatingCase || isLoadingUsers || isAssigningStaff} whileHover={{ scale: (isCreatingCase || isLoadingUsers || isAssigningStaff) ? 1 : 1.03 }} whileTap={{ scale: (isCreatingCase || isLoadingUsers || isAssigningStaff) ? 1 : 0.98 }} >
                            {(isCreatingCase || isAssigningStaff) ? ( <div className="flex items-center justify-center"> <Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing... </div> ) : 'Create Case'}
                        </motion.button>
                        <motion.button type="button" className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm"
                            onClick={resetFormAndClose} disabled={isCreatingCase || isAssigningStaff} whileHover={{ scale: (isCreatingCase || isAssigningStaff) ? 1 : 1.03 }} whileTap={{ scale: (isCreatingCase || isAssigningStaff) ? 1 : 0.98 }} >
                            Cancel
                        </motion.button>
                    </footer>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateCaseForm;