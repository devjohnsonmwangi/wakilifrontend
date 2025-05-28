import React, { useState } from 'react';
import { useCreateCaseMutation } from '../../../../features/case/caseAPI';
import { RootState } from '../../../../app/store';
import { toast } from 'sonner'; // Global Toaster assumed
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
    X, Briefcase, FolderKanban, BarChart3, Hash, Activity, Landmark, Building2, Users, CircleDollarSign, MessageSquare, AlertTriangle, Loader2 
} from 'lucide-react';

// Types remain the same
type CaseType =
    | 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment'
    | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'tribunal' | 'conveyances';
type CaseStatus = 'open' | 'in_progress' | 'closed';

interface FormData {
    case_type: CaseType;
    case_status: CaseStatus;
    case_number: string;
    case_track_number: string;
    court: string;
    station: string;
    parties: string;
    fee: number;
    case_description: string;
}

interface CreateCaseFormProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean; // Prop from parent to indicate dark mode
}

const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ isOpen, onClose}) => {
    const [createCase, { isLoading }] = useCreateCaseMutation();
    const user = useSelector((state: RootState) => state.user);
    const userId = user.user?.user_id ?? 0;

    const { register, handleSubmit, reset, formState: { errors: rhfErrors } } = useForm<FormData>({
        mode: 'onSubmit',
        defaultValues: {
            case_type: 'criminal',
            case_status: 'open',
            case_description: '',
            case_number: '',
            case_track_number: '',
            court: '',
            station: '',
            parties: '',
            fee: 0,
        },
    });
    
    // Using React Hook Form's built-in validation is generally preferred
    // but for this exercise, I'll style your existing custom validation display.
    // If you switch to RHF validation, remove the `formErrors` state and `validate` function.
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validate = (data: FormData): boolean => {
        let isValid = true;
        const newErrors: { [key: string]: string } = {};
        if (!data.case_type) newErrors.case_type = 'Case type is required';
        if (!data.case_status) newErrors.case_status = 'Case status is required';
        if (!data.case_number || data.case_number.length < 5) newErrors.case_number = 'Case number must be at least 5 characters';
        if (!data.case_track_number || data.case_track_number.length < 5) newErrors.case_track_number = 'Track number must be at least 5 characters';
        if (!data.court) newErrors.court = 'Court is required';
        if (!data.station) newErrors.station = 'Court station is required';
        if (!data.parties || data.parties.length < 5) newErrors.parties = 'Parties must be at least 5 characters';
        if (data.fee == null || isNaN(Number(data.fee)) || Number(data.fee) <= 0) newErrors.fee = 'Fee must be a positive number';
        if (!data.case_description || data.case_description.length < 10) newErrors.case_description = 'Description must be at least 10 characters';
        
        if (Object.keys(newErrors).length > 0) isValid = false;
        setFormErrors(newErrors);
        return isValid;
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        if (!validate(data)) { // Use custom validation
            const firstErrorField = Object.keys(formErrors)[0];
            if (firstErrorField) {
                const element = document.getElementById(firstErrorField);
                element?.focus();
            }
            toast.error("Please correct the errors in the form.");
            return;
        }

        try {
            const caseData = { ...data, user_id: userId };
            await createCase(caseData).unwrap();
            toast.success('🎉 Case created successfully!', { duration: 3000 });
            reset();
            setFormErrors({}); // Clear custom errors
            onClose();
        } catch (error: unknown) { // Better error typing
            console.error('Error creating case:', error);
            let errorMessage = 'Failed to create case. Please check the details and try again.';
            if (typeof error === 'object' && error !== null) {
                // @ts-expect-error: error may have data/message properties from API
                if (error.data?.message) errorMessage = error.data.message;
                // @ts-expect-error: error may have data/error properties from API
                else if (error.data?.error) errorMessage = error.data.error;
                
                else if ('message' in error && typeof error.message === 'string') errorMessage = error.message;
            }
            toast.error(`❌ ${errorMessage}`, { duration: 5000 });
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
    };
    const backdropVariants = { /* ... same as before ... */ };

    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border 
                              rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                              focus:outline-none focus:ring-2 focus:border-transparent 
                              transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
    const errorTextClasses = "text-red-500 dark:text-red-400 text-xs mt-1";

    if (!isOpen) return null;

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
                className={`relative p-0 border w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                           text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 overflow-hidden`}
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            >
                <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-sky-500 dark:to-indigo-600">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                                Create New Case
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Enter the details for the new case record.
                            </p>
                        </div>
                    </div>
                    <button
                        title='Close Modal'
                        className="text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1.5 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="px-5 sm:px-6 py-6 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)] styled-scrollbar"> {/* Max height for scroll */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Case Type */}
                        <div>
                            <label htmlFor="case_type" className={labelBaseClasses}>
                                <FolderKanban size={16} className="mr-2 opacity-70" /> Case Type
                            </label>
                            <select
                                id="case_type"
                                {...register('case_type')}
                                className={`${inputBaseClasses} ${formErrors.case_type || rhfErrors.case_type ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            >
                                {/* Options here */}
                                <option value="criminal">Criminal</option>
                                <option value="civil">Civil</option>
                                <option value="family">Family</option>
                                <option value="corporate">Corporate</option>
                                <option value="property">Property</option>
                                <option value="employment">Employment</option>
                                <option value="intellectual_property">Intellectual Property</option>
                                <option value="immigration">Immigration</option>
                                <option value="elc">ELC</option>
                                <option value="childrenCase">Children's Case</option>
                                <option value="tribunal">Tribunal</option>
                                <option value="conveyances">Conveyances</option>
                            </select>
                            {formErrors.case_type && <p className={errorTextClasses}>{formErrors.case_type}</p>}
                        </div>

                        {/* Case Status */}
                        <div>
                            <label htmlFor="case_status" className={labelBaseClasses}>
                                <BarChart3 size={16} className="mr-2 opacity-70" /> Case Status
                            </label>
                            <select
                                id="case_status"
                                {...register('case_status')}
                                className={`${inputBaseClasses} ${formErrors.case_status || rhfErrors.case_status ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                            {formErrors.case_status && <p className={errorTextClasses}>{formErrors.case_status}</p>}
                        </div>

                        {/* Case Number */}
                        <div>
                            <label htmlFor="case_number" className={labelBaseClasses}>
                                <Hash size={16} className="mr-2 opacity-70" /> Case Number
                            </label>
                            <input
                                type="text" id="case_number" {...register('case_number')}
                                placeholder="e.g., CR/001/2023"
                                className={`${inputBaseClasses} ${formErrors.case_number || rhfErrors.case_number ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            />
                            {formErrors.case_number && <p className={errorTextClasses}>{formErrors.case_number}</p>}
                        </div>

                        {/* Case Track Number */}
                        <div>
                            <label htmlFor="case_track_number" className={labelBaseClasses}>
                                <Activity size={16} className="mr-2 opacity-70" /> Track Number
                            </label>
                            <input
                                type="text" id="case_track_number" {...register('case_track_number')}
                                placeholder="e.g., TRK-XYZ-001"
                                className={`${inputBaseClasses} ${formErrors.case_track_number || rhfErrors.case_track_number ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            />
                            {formErrors.case_track_number && <p className={errorTextClasses}>{formErrors.case_track_number}</p>}
                        </div>

                        {/* Court */}
                        <div>
                            <label htmlFor="court" className={labelBaseClasses}>
                                <Landmark size={16} className="mr-2 opacity-70" /> Court
                            </label>
                            <input
                                type="text" id="court" {...register('court')}
                                placeholder="e.g., High Court"
                                className={`${inputBaseClasses} ${formErrors.court || rhfErrors.court ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            />
                            {formErrors.court && <p className={errorTextClasses}>{formErrors.court}</p>}
                        </div>

                        {/* Station */}
                        <div>
                            <label htmlFor="station" className={labelBaseClasses}>
                                <Building2 size={16} className="mr-2 opacity-70" /> Station
                            </label>
                            <input
                                type="text" id="station" {...register('station')}
                                placeholder="e.g., Milimani Law Courts"
                                className={`${inputBaseClasses} ${formErrors.station || rhfErrors.station ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            />
                            {formErrors.station && <p className={errorTextClasses}>{formErrors.station}</p>}
                        </div>

                        {/* Parties */}
                        <div className="md:col-span-2"> {/* Span full width on medium screens */}
                            <label htmlFor="parties" className={labelBaseClasses}>
                                <Users size={16} className="mr-2 opacity-70" /> Parties Involved
                            </label>
                            <input
                                type="text" id="parties" {...register('parties')}
                                placeholder="e.g., John Doe vs. Jane Smith"
                                className={`${inputBaseClasses} ${formErrors.parties || rhfErrors.parties ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            />
                            {formErrors.parties && <p className={errorTextClasses}>{formErrors.parties}</p>}
                        </div>

                        {/* Fee */}
                        <div className="md:col-span-2"> {/* Span full width on medium screens */}
                            <label htmlFor="fee" className={labelBaseClasses}>
                                <CircleDollarSign size={16} className="mr-2 opacity-70" /> Case Fee (KES)
                            </label>
                            <input
                                type="number" id="fee" {...register('fee', { valueAsNumber: true })}
                                placeholder="e.g., 50000"
                                className={`${inputBaseClasses} ${formErrors.fee || rhfErrors.fee ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                            />
                            {formErrors.fee && <p className={errorTextClasses}>{formErrors.fee}</p>}
                        </div>
                    </div>

                    {/* Case Description */}
                    <div>
                        <label htmlFor="case_description" className={labelBaseClasses}>
                            <MessageSquare size={16} className="mr-2 opacity-70" /> Case Description
                        </label>
                        <textarea
                            id="case_description"
                            {...register('case_description')}
                            rows={4}
                            placeholder="Provide a detailed description of the case..."
                            className={`${inputBaseClasses} resize-none ${formErrors.case_description || rhfErrors.case_description ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-sky-500'}`}
                        ></textarea>
                        {formErrors.case_description && <p className={errorTextClasses}>{formErrors.case_description}</p>}
                    </div>
                    
                    {/* Display a general form error if any from RHF or custom validation isn't field-specific */}
                    {Object.keys(formErrors).length > 0 && !Object.values(formErrors).every(val => !val) && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-md text-center">
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center justify-center">
                                <AlertTriangle size={16} className="mr-2" /> Please review and correct the highlighted errors.
                            </p>
                        </div>
                    )}


                    <footer className="pt-4 flex flex-col sm:flex-row-reverse sm:justify-start gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
                        <motion.button
                            type="submit"
                            className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white
                                        bg-gradient-to-r from-blue-600 to-purple-600 dark:from-sky-500 dark:to-indigo-600
                                        hover:from-blue-700 hover:to-purple-700 dark:hover:from-sky-600 dark:hover:to-indigo-700
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-sky-500 
                                        dark:focus:ring-offset-slate-800
                                        transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                                        disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.03 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    Creating Case...
                                </div>
                            ) : 'Create Case'}
                        </motion.button>
                        <motion.button
                            type="button"
                            className="w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg 
                                        bg-slate-100 hover:bg-slate-200 text-slate-700 
                                        dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-slate-500
                                        dark:focus:ring-offset-slate-800
                                        transition-all duration-300 ease-in-out shadow-sm hover:shadow-md text-sm"
                            onClick={() => { reset(); setFormErrors({}); onClose(); }} // Reset form and errors on cancel
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                    </footer>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateCaseForm;