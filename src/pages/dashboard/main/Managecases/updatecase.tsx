import React, { useState, useEffect } from 'react';
import {
    useUpdateCaseMutation,
    CaseDataTypes,
    CaseType,
    CaseStatus,
    UpdateCasePayload, // Import UpdateCasePayload for explicit typing if desired
} from '../../../../features/case/caseAPI'; // Adjust path as necessary
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
    X, Edit3, FolderKanban, BarChart3, Hash, Activity, CircleDollarSign, MessageSquare, AlertTriangle, Loader2
} from 'lucide-react';

interface EditCaseFormProps {
    isDarkMode?: boolean; // isDarkMode is not used in the provided JSX, but kept for consistency
    caseItem: CaseDataTypes | null;
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    case_type: CaseType;
    case_status: CaseStatus;
    case_number: string;
    case_track_number: string;
    fee: number | '';
    case_description: string;
    // If you add form fields for court, station, parties, add them here too
    court: string | null;
    station: string | null;
    parties: string | null;
}

interface ApiErrorData {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

interface RtkQueryErrorShape {
    status?: number;
    data?: ApiErrorData | string;
    error?: string;
}

const UpdateCaseForm: React.FC<EditCaseFormProps> = ({ caseItem, isOpen, onClose }) => {
    const id = caseItem?.case_id || 0;
    // user_id is part of UpdateCasePayload and should be sent if it's meant to be updatable
    // or if the backend requires it even for identification (though case_id in URL usually suffices for that).
    // Based on UpdateCasePayload, user_id *can* be part of the body.
    const userId = caseItem?.user_id || 0;

    const [updateCase, { isLoading }] = useUpdateCaseMutation();

    const [formData, setFormData] = useState<FormData>({
        case_type: caseItem?.case_type || 'criminal',
        case_status: caseItem?.case_status || 'open',
        case_number: caseItem?.case_number || '',
        case_track_number: caseItem?.case_track_number || '',
        fee: caseItem?.fee ?? '',
        case_description: caseItem?.case_description || '',
        court: caseItem?.court || null,
        station: caseItem?.station || null,
        parties: caseItem?.parties || null,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (caseItem) {
            setFormData({
                case_type: caseItem.case_type,
                case_status: caseItem.case_status,
                case_number: caseItem.case_number,
                case_track_number: caseItem.case_track_number,
                fee: caseItem.fee ?? '',
                case_description: caseItem.case_description ?? '',
                court: caseItem.court ?? null,
                station: caseItem.station ?? null,
                parties: caseItem.parties ?? null,
            });
            setErrors({});
        }
    }, [caseItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let processedValue: string | number | null = value;

        if (name === 'fee') {
            if (value === '') {
                processedValue = '';
            } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                    processedValue = numValue;
                } else {
                    processedValue = formData.fee;
                }
            }
        } else if (name === 'court' || name === 'station' || name === 'parties') {
            processedValue = value === '' ? null : value;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue as string | number | null })); // Explicit type assertion for union type
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

        if (formData.fee === '') {
            newErrors.fee = 'Fee is required.';
            isValid = false;
        } else {
            const feeAsNumber = Number(formData.fee);
            if (isNaN(feeAsNumber) || feeAsNumber <= 0) {
                newErrors.fee = 'Fee must be a positive number.';
                isValid = false;
            }
        }

        if (!formData.case_description || formData.case_description.length < 10) newErrors.case_description = 'Description must be at least 10 characters';
        
        // Optional: Add validation for court, station, parties if they become required
        // if (formData.court && formData.court.length < 3) newErrors.court = 'Court name is too short.';
        // if (formData.station && formData.station.length < 3) newErrors.station = 'Station name is too short.';
        // if (formData.parties && formData.parties.length < 3) newErrors.parties = 'Parties description is too short.';


        setErrors(newErrors);
        isValid = Object.keys(newErrors).length === 0;
        return isValid;
    };
    
    const getApiErrorMessage = (error: unknown): string => {
        if (typeof error === 'object' && error !== null) {
            const errorShape = error as RtkQueryErrorShape;
            if (errorShape.data) {
                if (typeof errorShape.data === 'string') return errorShape.data;
                if (typeof errorShape.data === 'object') {
                    const errorData = errorShape.data as ApiErrorData;
                    if (errorData.message) return errorData.message;
                    if (errorData.error) return errorData.error;
                    if (errorData.errors) {
                        const firstErrorField = Object.keys(errorData.errors)[0];
                        if (firstErrorField && errorData.errors[firstErrorField] && errorData.errors[firstErrorField].length > 0) {
                            return `${firstErrorField}: ${errorData.errors[firstErrorField][0]}`;
                        }
                    }
                }
            }
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

        const numericFee = formData.fee as number; // Validation ensures this is a number

        try {
            // Construct the payload for the request body carefully.
            // This object should conform to `UpdateCasePayload`.
            // It includes only the fields that are allowed to be updated.
            const bodyPayload: UpdateCasePayload = {
                // user_id might be part of UpdateCasePayload if your backend allows/requires it
                // If your `UpdateCasePayload` OMITs user_id (because it's immutable or derived server-side), remove it here.
                // Based on your current UpdateCasePayload, user_id is allowed.
                user_id: userId, 
                
                // Fields from the form data
                case_type: formData.case_type,
                case_status: formData.case_status,
                case_number: formData.case_number,
                case_track_number: formData.case_track_number,
                fee: numericFee,
                case_description: formData.case_description,

                // Other fields from CaseDataTypes that are part of UpdateCasePayload
                // and might be editable (even if not directly via this form's inputs).
                // If your form had inputs for these, they would come from formData too.
                // Since they are in formData now, they are covered.
                court: formData.court,
                station: formData.station,
                parties: formData.parties,
            };
            
            // The object passed to the `updateCase` mutation hook needs to match
            // its expected argument type: { case_id: number } & UpdateCasePayload
            await updateCase({
                case_id: id,    // For the URL parameter
                ...bodyPayload  // This becomes the request body, conforming to UpdateCasePayload
            }).unwrap();

            toast.success('Case updated successfully!');
            onClose();
        } catch (err) {
            console.error("Update case error object:", err); 
            const errorMessage = getApiErrorMessage(err);
            toast.error(`Failed to update case: ${errorMessage}`);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };
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
                        aria-label="Close edit case form"
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
                                <option value="on_hold">On Hold</option>
                                <option value="resolved">Resolved</option>
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
                        
                        {/* Court */}
                        <div>
                            <label htmlFor="court_edit" className={labelBaseClasses}>
                                <Activity size={16} className="mr-2 opacity-70" /> Court
                            </label>
                            <input
                                type="text" id="court_edit" name="court"
                                value={formData.court ?? ''} onChange={handleChange}
                                placeholder="e.g., Milimani Law Courts"
                                className={`${inputBaseClasses} ${errors.court ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            />
                            {errors.court && <p className={errorTextClasses}>{errors.court}</p>}
                        </div>

                        {/* Station */}
                        <div>
                            <label htmlFor="station_edit" className={labelBaseClasses}>
                                <Activity size={16} className="mr-2 opacity-70" /> Station
                            </label>
                            <input
                                type="text" id="station_edit" name="station"
                                value={formData.station ?? ''} onChange={handleChange}
                                placeholder="e.g., Nairobi Central"
                                className={`${inputBaseClasses} ${errors.station ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            />
                            {errors.station && <p className={errorTextClasses}>{errors.station}</p>}
                        </div>
                        
                        {/* Parties */}
                        <div className="md:col-span-2">
                            <label htmlFor="parties_edit" className={labelBaseClasses}>
                                <Activity size={16} className="mr-2 opacity-70" /> Parties Involved
                            </label>
                            <input
                                type="text" id="parties_edit" name="parties"
                                value={formData.parties ?? ''} onChange={handleChange}
                                placeholder="e.g., John Doe vs Jane Smith"
                                className={`${inputBaseClasses} ${errors.parties ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500 dark:focus:ring-emerald-500'}`}
                            />
                            {errors.parties && <p className={errorTextClasses}>{errors.parties}</p>}
                        </div>


                        {/* Fee */}
                        <div className="md:col-span-2">
                            <label htmlFor="fee_edit" className={labelBaseClasses}>
                                <CircleDollarSign size={16} className="mr-2 opacity-70" /> Case Fee (KES)
                            </label>
                            <input
                                type="number"
                                id="fee_edit"
                                name="fee"
                                value={formData.fee}
                                onChange={handleChange}
                                placeholder="e.g., 50000.00"
                                step="0.01"
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

                    {Object.values(errors).some(error => error) && (
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
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.03 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
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