import React, { useState, useEffect, useMemo } from 'react';
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
    X, Briefcase, FolderKanban, Hash, Activity, Landmark, Building2, Users, CircleDollarSign, MessageSquare, AlertTriangle, Loader2, UserCheck, UserCog, UserPlus
} from 'lucide-react';

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
    assigned_staff_ids: number[]; 
}

interface CreateCaseFormProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean;
    currentUserId?: number;
    currentUserRole?: UserApiResponse['role']; 
}

// Roles that qualify as staff members to be assigned
const STAFF_ROLES_FOR_ASSIGNMENT: UserApiResponse['role'][] = ['lawyer', 'manager', 'admin', 'supports', 'clerks'];
// Roles that qualify as clients
const CLIENT_ROLES_FOR_SELECTION: UserApiResponse['role'][] = ['client', 'user'];


const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ isOpen, onClose, currentUserId, currentUserRole }) => {
    const [createCase, { isLoading: isCreatingCase }] = useCreateCaseMutation();
    const [assignStaffToCase, { isLoading: isAssigningStaff }] = useAssignStaffToCaseMutation();

    // Client self-selection logic
    const isUserClientOrBasic = currentUserRole && CLIENT_ROLES_FOR_SELECTION.includes(currentUserRole);
    const isUserCreatingForSelf = isUserClientOrBasic && currentUserId !== undefined;

    // Fetch all users - will be filtered for clients and staff
    const {
        data: allUsers,
        isLoading: isLoadingUsers,
        isError: isUsersError,
        error: usersErrorData,
    } = useFetchUsersQuery();

    const selectableClients = useMemo(() => {
        if (!allUsers) return [];
        return allUsers.filter(user => CLIENT_ROLES_FOR_SELECTION.includes(user.role));
    }, [allUsers]);

    const selectableStaff = useMemo(() => {
        if (!allUsers) return [];
        return allUsers.filter(user => STAFF_ROLES_FOR_ASSIGNMENT.includes(user.role));
    }, [allUsers]);

    const { register, handleSubmit, reset, control, formState: { errors: rhfErrors }, setValue, watch } = useForm<FormData>({
        mode: 'onSubmit',
        defaultValues: {
            user_id_for_case: isUserCreatingForSelf ? currentUserId : null,
            primary_assignee_id: null, 
            case_type: 'civil' as CaseType,
            case_description: '',
            case_number: '',
            case_track_number: '',
            court: '',
            station: '',
            parties: '',
            fee: 0,
            assigned_staff_ids: [], 
        },
    });

    useEffect(() => {
        if (isUserCreatingForSelf) {
            setValue('user_id_for_case', currentUserId);
        } else {
            
            if (currentUserRole && !isUserCreatingForSelf && watch('user_id_for_case') === currentUserId) {
                 setValue('user_id_for_case', null);
            }
        }
    }, [currentUserId, currentUserRole, isUserCreatingForSelf, setValue, watch]);

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); 

    const validateAndPreparePayload: SubmitHandler<FormData> = async (data) => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        // Client selection is mandatory if not creating for self
        if (!isUserCreatingForSelf && (data.user_id_for_case == null || data.user_id_for_case === 0)) {
            newErrors.user_id_for_case = 'Client selection is required.'; isValid = false;
        }
        // Primary Assignee is always mandatory for anyone creating a case
        if (data.primary_assignee_id == null || data.primary_assignee_id === 0) {
            newErrors.primary_assignee_id = 'Primary Assignee selection is required.'; isValid = false;
        }
        // Other standard validations
        if (!data.case_type) { newErrors.case_type = 'Case type is required.'; isValid = false; }
        if (!data.case_number || data.case_number.length < 3) { newErrors.case_number = 'Case number must be at least 3 characters.'; isValid = false;}
        if (!data.case_track_number || data.case_track_number.length < 3) { newErrors.case_track_number = 'Track number must be at least 3 characters.'; isValid = false;}
        if (data.fee == null || isNaN(Number(data.fee)) || Number(data.fee) <= 0) { newErrors.fee = 'Fee must be a positive number.'; isValid = false;}
        if (!data.case_description || data.case_description.length < 10) { newErrors.case_description = 'Description must be at least 10 characters.'; isValid = false;}
        
        setFormErrors(newErrors); 

        if (!isValid) {
            const firstErrorKey = Object.keys(newErrors)[0] as keyof FormData | undefined;
            if (firstErrorKey) {
                let elementId: string = firstErrorKey;
                if (firstErrorKey === 'user_id_for_case') elementId = 'user_id_select';
                else if (firstErrorKey === 'primary_assignee_id') elementId = 'primary_assignee_select';
                else if (firstErrorKey === 'assigned_staff_ids') elementId = 'assigned_staff_select'; 
                document.getElementById(elementId)?.focus();
            }
            toast.error("Please correct the errors in the form.");
            return;
        }

        
        if (data.user_id_for_case === null && !isUserCreatingForSelf) {
            toast.error("Client ID is missing."); return;
        }
        if (data.primary_assignee_id === null) {
             toast.error("Primary Assignee is missing."); return;
        }


        let createdCaseId: number | null = null;
        try {
            // 1. Create the case
            const casePayload: CreateCasePayload = {
                user_id: data.user_id_for_case!, 
                case_type: data.case_type,
                fee: data.fee,
                case_number: data.case_number,
                case_track_number: data.case_track_number,
                case_description: data.case_description,
                court: data.court || undefined,
                station: data.station || undefined,
                parties: data.parties || undefined,
            };

            const result = await createCase(casePayload).unwrap();
            createdCaseId = result.case_id;
            toast.success(`🎉 Case (ID: ${createdCaseId}) created successfully!`);

            let allAssignmentsSuccessful = true;

            // 2. Assign the Primary Assignee (which is now mandatory)
            // No need to check if data.primary_assignee_id exists here, validation ensures it.
            if (createdCaseId) { // Ensure case was created before trying to assign
                try {
                    toast.info(`Assigning primary staff member...`);
                    await assignStaffToCase({ caseId: createdCaseId, staffUserId: data.primary_assignee_id! }).unwrap(); // Add non-null assertion
                    const primaryStaffMember = selectableStaff.find(s => s.user_id === data.primary_assignee_id);
                    toast.success(`Primary assignee ${primaryStaffMember?.full_name || `ID ${data.primary_assignee_id}`} assigned.`);
                } catch (assignError: unknown) {
                    allAssignmentsSuccessful = false;
                    
                    const staffMember = selectableStaff.find(s => s.user_id === data.primary_assignee_id);
                    const staffName = staffMember ? staffMember.full_name : `ID ${data.primary_assignee_id}`;
                    console.error(`Failed to assign primary staff ${staffName}:`, assignError);
                    let errorMessage = 'Unknown error';
                     if (typeof assignError === 'object' && assignError !== null) {
                        const err = assignError as { data?: { message?: string }, message?: string };
                        errorMessage = err.data?.message || err.message || errorMessage;
                    } else if (typeof assignError === 'string') {
                        errorMessage = assignError;
                    }
                    toast.error(`Failed to assign primary staff ${staffName}: ${errorMessage}`);
                }
            }


            // 3. Assign Additional Staff members (optional)
            const additionalStaffToAssign = data.assigned_staff_ids.filter(
                id => id !== data.primary_assignee_id 
            );

            if (createdCaseId && additionalStaffToAssign.length > 0) {
                toast.info("Assigning additional staff members...");
                let successfulAdditionalAssignments = 0;

                for (const staffId of additionalStaffToAssign) {
                    try {
                        await assignStaffToCase({ caseId: createdCaseId, staffUserId: staffId }).unwrap();
                        successfulAdditionalAssignments++;
                    } catch (assignError: unknown) {
                        allAssignmentsSuccessful = false;
                        
                        const staffMember = selectableStaff.find(s => s.user_id === staffId);
                        const staffName = staffMember ? staffMember.full_name : `ID ${staffId}`;
                        console.error(`Failed to assign additional staff ${staffName}:`, assignError);
                         let errorMessage = 'Unknown error';
                        if (typeof assignError === 'object' && assignError !== null) {
                            const err = assignError as { data?: { message?: string }, message?: string };
                            errorMessage = err.data?.message || err.message || errorMessage;
                        } else if (typeof assignError === 'string') {
                            errorMessage = assignError;
                        }
                        toast.error(`Failed to assign ${staffName}: ${errorMessage}`);
                    }
                }
                if (successfulAdditionalAssignments > 0) {
                    toast.success(`${successfulAdditionalAssignments} additional staff member(s) assigned.`);
                }
            }

            if (allAssignmentsSuccessful) {
                resetFormAndClose();
            } else {
                toast.warning("Some staff assignments failed. Please review the case details.");
                resetFormAndClose();
            }

        } catch (error: unknown) { // This catches errors from createCase
            console.error('Error during case creation:', error);
            let errorMessage = 'Failed to create case.';
             if (typeof error === 'object' && error !== null) {
                // ... (error handling )
                const apiError = error as { data?: { msg?: string, message?: string, error?: string, errors?: Record<string, string[]> }, status?: number, message?: string };
                if (apiError.data?.errors) {
                    const fieldErrors = Object.entries(apiError.data.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('; ');
                    errorMessage = fieldErrors || apiError.data?.msg || apiError.data?.message || apiError.data?.error || apiError.message || errorMessage;
                } else {
                    errorMessage = apiError.data?.msg || apiError.data?.message || apiError.data?.error || apiError.message || errorMessage;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(`❌ ${errorMessage}`, { duration: 5000 });
        }
    };

    const resetFormAndClose = () => {
        reset({
            user_id_for_case: isUserCreatingForSelf ? currentUserId : null,
            primary_assignee_id: null,
            case_type: 'civil' as CaseType,
            case_description: '', case_number: '', case_track_number: '',
            court: '', station: '', parties: '', fee: 0,
            assigned_staff_ids: [],
        });
        setFormErrors({});
        onClose();
    };

    const modalVariants = { /* ... */ };
    const backdropVariants = { /* ... */ };
    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
    const errorTextClasses = "text-red-500 dark:text-red-400 text-xs mt-1";

    if (!isOpen) return null;

    const caseTypeOptions = [ { value: 'civil', label: 'Civil' }, { value: 'criminal', label: 'Criminal' }, { value: 'family', label: 'Family' }, { value: 'corporate', label: 'Corporate' }, { value: 'property', label: 'Property' }, { value: 'employment', label: 'Employment' }, { value: 'intellectual_property', label: 'Intellectual Property' }, { value: 'immigration', label: 'Immigration' }, { value: 'elc', label: 'ELC' }, { value: 'childrenCase', label: "Children's Case" }, { value: 'tribunal', label: 'Tribunal' }, { value: 'conveyances', label: 'Conveyances' }, ];


    return (
        <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
            variants={backdropVariants} initial="hidden" animate="visible" exit="exit" onClick={onClose}
        >
            <motion.div
                className={`relative p-0 border w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                           text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 overflow-hidden`}
                variants={modalVariants} onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    {/* ... Header ... */}
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
                    {/* Client Selection (conditional) */}
                    {!isUserCreatingForSelf && (
                        <div>
                            <label htmlFor="user_id_select" className={labelBaseClasses}> <UserCheck size={16} className="mr-2 opacity-70" /> Select Client for Case </label>
                            <Controller name="user_id_for_case" control={control}
                                rules={{ validate: value => (isUserCreatingForSelf || (value !== null && value > 0)) || 'Client selection is required.'}}
                                render={({ field }) => (
                                    <select id="user_id_select" {...field} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)} value={field.value === null ? '' : String(field.value)}
                                        className={`${inputBaseClasses} ${formErrors.user_id_for_case || rhfErrors.user_id_for_case ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                                        disabled={isLoadingUsers}>
                                        <option value="" disabled> {isLoadingUsers ? 'Loading clients...' : isUsersError ? 'Error loading clients' : '-- Select a Client --'} </option>
                                        {selectableClients.map((clientUser: UserApiResponse) => ( <option key={clientUser.user_id} value={clientUser.user_id}> {clientUser.full_name} ({clientUser.email} - ID: {clientUser.user_id}) </option> ))}
                                    </select>
                                )} />
                            {(formErrors.user_id_for_case || rhfErrors.user_id_for_case) && <p className={errorTextClasses}>{formErrors.user_id_for_case || rhfErrors.user_id_for_case?.message}</p>}
                            {isUsersError && <p className={errorTextClasses}> Failed to load clients: {(usersErrorData as { data?: { message?: string }, error?: string } | undefined)?.data?.message || (usersErrorData as { error?: string } | undefined)?.error || 'Please try again.'} </p>}
                        </div>
                    )}

                    {/* Primary Assignee Selection (always shown, mandatory) */}
                    <div>
                        <label htmlFor="primary_assignee_select" className={labelBaseClasses}>
                            <UserPlus size={16} className="mr-2 opacity-70" /> Select Primary Assignee
                        </label>
                        <Controller
                            name="primary_assignee_id"
                            control={control}
                            rules={{
                                validate: value => (value !== null && value > 0) || 'Primary Assignee selection is required.'
                            }}
                            render={({ field }) => (
                                <select
                                    id="primary_assignee_select"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                                    value={field.value === null ? '' : String(field.value)}
                                    className={`${inputBaseClasses} ${formErrors.primary_assignee_id || rhfErrors.primary_assignee_id ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                                    disabled={isLoadingUsers}
                                >
                                    <option value="" disabled>
                                        {isLoadingUsers ? 'Loading staff...' : isUsersError ? 'Error loading staff' : '-- Select Primary Assignee --'}
                                    </option>
                                    {selectableStaff.map((staffUser: UserApiResponse) => (
                                        <option key={staffUser.user_id} value={staffUser.user_id}>
                                            {staffUser.full_name} ({staffUser.role})
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {(formErrors.primary_assignee_id || rhfErrors.primary_assignee_id) &&
                            <p className={errorTextClasses}>{formErrors.primary_assignee_id || rhfErrors.primary_assignee_id?.message}</p>}
                        {isUsersError && !selectableStaff.length && <p className={errorTextClasses}>Failed to load staff for assignment.</p>}
                    </div>

                    {/* Additional Staff Assignment (always shown, optional) */}
                    <div>
                        <label htmlFor="assigned_staff_select" className={labelBaseClasses}> <UserCog size={16} className="mr-2 opacity-70" /> Assign Additional Staff (Optional) </label>
                        <Controller name="assigned_staff_ids" control={control}
                            render={({ field }) => (
                                <select id="assigned_staff_select" multiple {...field}
                                    onChange={(e) => { const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10)); field.onChange(selectedOptions); }}
                                    value={field.value.map(String)}
                                    className={`${inputBaseClasses} h-32 ${rhfErrors.assigned_staff_ids ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                                    disabled={isLoadingUsers}>
                                    {selectableStaff.map((staffUser: UserApiResponse) => ( <option key={staffUser.user_id} value={staffUser.user_id}> {staffUser.full_name} ({staffUser.role} - ID: {staffUser.user_id}) </option> ))}
                                </select>
                            )} />
                        {rhfErrors.assigned_staff_ids && <p className={errorTextClasses}>{rhfErrors.assigned_staff_ids.message}</p>}
                        {/* Error for additional staff already covered by primary assignee error if users fail to load */}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* ... Other form fields ... */}
                        <div>
                            <label htmlFor="case_type" className={labelBaseClasses}> <FolderKanban size={16} className="mr-2 opacity-70" /> Case Type </label>
                            <select id="case_type" {...register('case_type', { required: "Case type is required."})} className={`${inputBaseClasses} ${formErrors.case_type || rhfErrors.case_type ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}> {caseTypeOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))} </select>
                            {(formErrors.case_type || rhfErrors.case_type) && <p className={errorTextClasses}>{formErrors.case_type || rhfErrors.case_type?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="case_number" className={labelBaseClasses}> <Hash size={16} className="mr-2 opacity-70" /> Case Number </label>
                            <input type="text" id="case_number" {...register('case_number', { required: "Case number is required.", minLength: { value: 3, message: "Min 3 characters."}})} placeholder="e.g., CR/001/2023" className={`${inputBaseClasses} ${formErrors.case_number || rhfErrors.case_number ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} />
                            {(formErrors.case_number || rhfErrors.case_number) && <p className={errorTextClasses}>{formErrors.case_number || rhfErrors.case_number?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="case_track_number" className={labelBaseClasses}> <Activity size={16} className="mr-2 opacity-70" /> Track Number </label>
                            <input type="text" id="case_track_number" {...register('case_track_number', { required: "Track number is required.", minLength: { value: 3, message: "Min 3 characters."}})} placeholder="e.g., TRK-XYZ-001" className={`${inputBaseClasses} ${formErrors.case_track_number || rhfErrors.case_track_number ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} />
                            {(formErrors.case_track_number || rhfErrors.case_track_number) && <p className={errorTextClasses}>{formErrors.case_track_number || rhfErrors.case_track_number?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="fee" className={labelBaseClasses}> <CircleDollarSign size={16} className="mr-2 opacity-70" /> Case Fee (KES) </label>
                            <input type="number" id="fee" {...register('fee', { required: "Fee is required.", valueAsNumber: true, min: { value: 0.01, message: "Fee must be positive." } })} placeholder="e.g., 50000" className={`${inputBaseClasses} ${formErrors.fee || rhfErrors.fee ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} />
                            {(formErrors.fee || rhfErrors.fee) && <p className={errorTextClasses}>{formErrors.fee || rhfErrors.fee?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="court" className={labelBaseClasses}> <Landmark size={16} className="mr-2 opacity-70" /> Court <span className="text-xs text-slate-400 ml-1">(Optional)</span> </label>
                            <input type="text" id="court" {...register('court')} placeholder="e.g., High Court" className={`${inputBaseClasses} ${formErrors.court || rhfErrors.court ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} />
                            {(formErrors.court || rhfErrors.court) && <p className={errorTextClasses}>{formErrors.court || rhfErrors.court?.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="station" className={labelBaseClasses}> <Building2 size={16} className="mr-2 opacity-70" /> Station <span className="text-xs text-slate-400 ml-1">(Optional)</span> </label>
                            <input type="text" id="station" {...register('station')} placeholder="e.g., Milimani Law Courts" className={`${inputBaseClasses} ${formErrors.station || rhfErrors.station ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} />
                            {(formErrors.station || rhfErrors.station) && <p className={errorTextClasses}>{formErrors.station || rhfErrors.station?.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="parties" className={labelBaseClasses}> <Users size={16} className="mr-2 opacity-70" /> Parties Involved <span className="text-xs text-slate-400 ml-1">(Optional)</span> </label>
                            <input type="text" id="parties" {...register('parties')} placeholder="e.g., John Doe vs. Jane Smith" className={`${inputBaseClasses} ${formErrors.parties || rhfErrors.parties ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} />
                            {(formErrors.parties || rhfErrors.parties) && <p className={errorTextClasses}>{formErrors.parties || rhfErrors.parties?.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="case_description" className={labelBaseClasses}> <MessageSquare size={16} className="mr-2 opacity-70" /> Case Description </label>
                        <textarea id="case_description" {...register('case_description', { required: "Description is required.", minLength: { value: 10, message: "Min 10 characters."}})} rows={4} placeholder="Provide a detailed description of the case..." className={`${inputBaseClasses} resize-none ${formErrors.case_description || rhfErrors.case_description ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`} ></textarea>
                        {(formErrors.case_description || rhfErrors.case_description) && <p className={errorTextClasses}>{formErrors.case_description || rhfErrors.case_description?.message}</p>}
                    </div>

                    {Object.keys(formErrors).some(key => !!formErrors[key as keyof FormData]) && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-md text-center">
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center justify-center">
                                <AlertTriangle size={16} className="mr-2" /> Please review and correct the highlighted errors.
                            </p>
                        </div>
                    )}

                    <footer className="pt-4 flex flex-col sm:flex-row-reverse sm:justify-start gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
                        {/* ... Buttons ... */}
                         <motion.button type="submit" className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-sky-500 dark:to-indigo-600 hover:from-blue-700 hover:to-purple-700 dark:hover:from-sky-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
                            disabled={isCreatingCase || isLoadingUsers || isAssigningStaff} whileHover={{ scale: (isCreatingCase || isLoadingUsers || isAssigningStaff) ? 1 : 1.03 }} whileTap={{ scale: (isCreatingCase || isLoadingUsers || isAssigningStaff) ? 1 : 0.98 }} >
                            {(isCreatingCase || isAssigningStaff) ? ( <div className="flex items-center justify-center"> <Loader2 className="animate-spin h-5 w-5 mr-2" /> {isCreatingCase ? 'Creating Case...' : isAssigningStaff ? 'Assigning Staff...' : 'Processing...'} </div> ) : 'Create Case'}
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