import React, { useState, useEffect } from 'react';
import {
    useUpdateCaseMutation,
    CaseDataTypes,
    CaseType,
    CaseStatus,
} from '../../../../features/case/caseAPI';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
    X, Edit3, FolderKanban, BarChart3, Hash, Activity, CircleDollarSign, MessageSquare, AlertTriangle, Loader2 
    // Removed Landmark, Building2, Users
} from 'lucide-react';

interface EditCaseFormProps {
    isDarkMode?: boolean;
    caseItem: CaseDataTypes | null;
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    case_type: CaseType;
    case_status: CaseStatus;
    case_number: string;
    case_track_number: string;
    fee: number | ''; // Allow empty string for input control, will be validated as number
    case_description: string;
}

interface ApiErrorData {
    error?: string;
    message?: string;
}
  
interface RtkQueryErrorShape {
    data?: ApiErrorData | string;
    error?: string;
}

const UpdateCaseForm: React.FC<EditCaseFormProps> = ({ caseItem, isOpen, onClose }) => {
    const id = caseItem?.case_id || 0; // Use 0 as fallback if caseItem is null
    const userId = caseItem?.user_id || 0;
    const [updateCase, { isLoading }] = useUpdateCaseMutation();
    
    const [formData, setFormData] = useState<FormData>({
        case_type: caseItem?.case_type || 'criminal',
        case_status: caseItem?.case_status || 'open',
        case_number: caseItem?.case_number || '',
        case_track_number: caseItem?.case_track_number || '',
        fee: caseItem?.fee ?? '', // Initialize with empty string if fee is 0 or undefined for better input UX
        case_description: caseItem?.case_description || '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (caseItem) {
            setFormData({
                case_type: caseItem.case_type,
                case_status: caseItem.case_status,
                case_number: caseItem.case_number,
                case_track_number: caseItem.case_track_number,
                fee: caseItem.fee ?? '', // Use ?? '' to handle null/undefined, ensuring controlled input
                case_description: caseItem.case_description ?? '',
            });
            setErrors({});
        }
    }, [caseItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let processedValue: string | number = value;
        if (name === 'fee') {
            // Allow empty string for user input, but store as number if valid, or keep as empty string
            processedValue = value === '' ? '' : (isNaN(Number(value)) ? formData.fee : Number(value));
        }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!formData.case_type) newErrors.case_type = 'Case type is required';
        if (!formData.case_status) newErrors.case_status = 'Case status is required';
        if (!formData.case_number || formData.case_number.length < 5) newErrors.case_number = 'Case number must be at least 5 characters';
        if (!formData.case_track_number || formData.case_track_number.length < 5) newErrors.case_track_number = 'Track number must be at least 5 characters';
        
        // Corrected fee validation
        const feeAsNumber = Number(formData.fee);
        if (formData.fee === '' || isNaN(feeAsNumber) || feeAsNumber <= 0) {
            newErrors.fee = 'Fee must be a positive number';
            isValid = false;
        }

        if (!formData.case_description || formData.case_description.length < 10) newErrors.case_description = 'Description must be at least 10 characters';
        
        if (Object.keys(newErrors).length > 0) isValid = false;
        setErrors(newErrors);
        return isValid;
    };

    const getApiErrorMessage = (error: unknown): string => { /* ... (same as previous correct version) ... */
        if (typeof error === 'object' && error !== null) {
            const errorShape = error as RtkQueryErrorShape;
            if (errorShape.data && typeof errorShape.data === 'object' && (errorShape.data as ApiErrorData).message) {
                return (errorShape.data as ApiErrorData).message!;
            }
            if (errorShape.data && typeof errorShape.data === 'string') return errorShape.data;
            if (errorShape.error) return errorShape.error;
            if ((error as Error).message) return (error as Error).message;
        }
        return 'An unknown error occurred. Please try again.';
    };


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please correct the errors in the form.");
            return;
        }
        if (!id || !caseItem) {
            toast.error('Case information is missing.');
            return;
        }

        try {
            const updatePayload = {
                ...caseItem, 
                ...formData, 
                case_id: id, 
                user_id: userId, 
                fee: Number(formData.fee), // Ensure fee is explicitly converted to number before sending
            };
            
            await updateCase(updatePayload).unwrap();
            toast.success('Case updated successfully!');
            onClose();
        } catch (err) {
            const errorMessage = getApiErrorMessage(err);
            toast.error(`Failed to update case: ${errorMessage}`);
            console.error("Update case error:",err);
        }
    };

    const modalVariants = { /* ... (same as previous correct version) ... */ };
    const backdropVariants = { /* ... (same as previous correct version) ... */ };
    const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border 
                              rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
                              focus:outline-none focus:ring-2 focus:border-transparent 
                              transition-all duration-200 shadow-sm hover:shadow-md text-sm`;
    const labelBaseClasses = "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
    const errorTextClasses = "text-red-500 dark:text-red-400 text-xs mt-1";

    if (!isOpen || !caseItem) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
        >
            <motion.div
                className={`relative p-0 border w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                           text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 overflow-hidden`}
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
                initial="hidden" 
                animate="visible"
                exit="exit" 
            >
                <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    {/* ... (header JSX same as previous correct version) ... */}
                    <div className="flex items-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-gradient-to-br from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600">
                            <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                                Edit Case Details
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Update the information for Case ID: {caseItem.case_id}
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

                <form onSubmit={onSubmit} className="px-5 sm:px-6 py-6 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)] styled-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Case Type */}
                        <div>
                            <label htmlFor="case_type_edit" className={labelBaseClasses}>
                                <FolderKanban size={16} className="mr-2 opacity-70" /> Case Type
                            </label>
                            <select
                                id="case_type_edit"
                                name="case_type"
                                value={formData.case_type}
                                onChange={handleChange}
                                className={`${inputBaseClasses} ${errors.case_type ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            >
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
                            {errors.case_type && <p className={errorTextClasses}>{errors.case_type}</p>}
                        </div>

                        {/* Case Status */}
                        <div>
                            <label htmlFor="case_status_edit" className={labelBaseClasses}>
                                <BarChart3 size={16} className="mr-2 opacity-70" /> Case Status
                            </label>
                            <select
                                id="case_status_edit"
                                name="case_status"
                                value={formData.case_status}
                                onChange={handleChange}
                                className={`${inputBaseClasses} ${errors.case_status ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                            {errors.case_status && <p className={errorTextClasses}>{errors.case_status}</p>}
                        </div>

                        {/* Case Number */}
                        <div>
                            <label htmlFor="case_number_edit" className={labelBaseClasses}>
                                <Hash size={16} className="mr-2 opacity-70" /> Case Number
                            </label>
                            <input
                                type="text" id="case_number_edit" name="case_number"
                                value={formData.case_number} onChange={handleChange}
                                placeholder="e.g., CR/001/2023"
                                className={`${inputBaseClasses} ${errors.case_number ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            />
                            {errors.case_number && <p className={errorTextClasses}>{errors.case_number}</p>}
                        </div>

                        {/* Case Track Number */}
                        <div>
                            <label htmlFor="case_track_number_edit" className={labelBaseClasses}>
                                <Activity size={16} className="mr-2 opacity-70" /> Track Number
                            </label>
                            <input
                                type="text" id="case_track_number_edit" name="case_track_number"
                                value={formData.case_track_number} onChange={handleChange}
                                placeholder="e.g., TRK-XYZ-001"
                                className={`${inputBaseClasses} ${errors.case_track_number ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            />
                            {errors.case_track_number && <p className={errorTextClasses}>{errors.case_track_number}</p>}
                        </div>
                        
                        {/* Fee */}
                        <div className="md:col-span-2">
                            <label htmlFor="fee_edit" className={labelBaseClasses}>
                                <CircleDollarSign size={16} className="mr-2 opacity-70" /> Case Fee (KES)
                            </label>
                            <input
                                type="number" id="fee_edit" name="fee"
                                value={formData.fee} // Controlled component, handles empty string via handleChange
                                onChange={handleChange}
                                placeholder="e.g., 50000"
                                className={`${inputBaseClasses} ${errors.fee ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            />
                            {errors.fee && <p className={errorTextClasses}>{errors.fee}</p>}
                        </div>
                    </div>

                    {/* Case Description */}
                    <div>
                        <label htmlFor="case_description_edit" className={labelBaseClasses}>
                            <MessageSquare size={16} className="mr-2 opacity-70" /> Case Description
                        </label>
                        <textarea
                            id="case_description_edit" name="case_description"
                            rows={4}
                            value={formData.case_description} onChange={handleChange}
                            placeholder="Provide a detailed description of the case..."
                            className={`${inputBaseClasses} resize-none ${errors.case_description ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                        ></textarea>
                        {errors.case_description && <p className={errorTextClasses}>{errors.case_description}</p>}
                    </div>
                    
                    {Object.keys(errors).length > 0 && !Object.values(errors).every(val => !val) && (
                         <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-md text-center">
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center justify-center">
                                <AlertTriangle size={16} className="mr-2" /> Please review and correct the highlighted errors.
                            </p>
                        </div>
                    )}

                    <footer className="pt-4 flex flex-col sm:flex-row-reverse sm:justify-start gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
                         {/* ... (buttons JSX same as previous correct version) ... */}
                         <motion.button
                            type="submit"
                            className={`w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg text-white
                                        bg-gradient-to-r from-green-500 to-teal-600 dark:from-emerald-500 dark:to-cyan-600
                                        hover:from-green-600 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-cyan-700
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-cyan-500 
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
                                    Saving Changes...
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
                        >
                            Cancel
                        </motion.button>
                    </footer>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default UpdateCaseForm;