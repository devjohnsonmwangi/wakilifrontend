import {
    useUpdateCaseMutation,
    CaseDataTypes,
    CaseType,
    CaseStatus,
} from '../../../../features/case/caseAPI'; // Removed PaymentStatus import
import { Toaster, toast } from 'sonner';
import { useState, useEffect } from 'react';
import {
    FaExclamationTriangle, FaCheckCircle, FaTimes, FaSpinner, FaFolderOpen, FaBusinessTime, FaArchive, FaPauseCircle, FaCheck,  FaEdit
} from 'react-icons/fa';

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
    fee: number;
    case_description: string;
}

const UpdateCaseForm = ({ caseItem, isOpen, onClose }: EditCaseFormProps) => {
    const id = caseItem?.case_id || 0;
    const userId = caseItem?.user_id || 0;
    const [updateCase] = useUpdateCaseMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        case_type: caseItem?.case_type || 'criminal',
        case_status: caseItem?.case_status || 'open',
        case_number: caseItem?.case_number || '',
        case_track_number: caseItem?.case_track_number || '',
        fee: caseItem?.fee || 0,
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
                fee: caseItem.fee,
                case_description: caseItem.case_description ?? '',
            });
        }
    }, [caseItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!formData.case_type) {
            newErrors.case_type = 'Case type is required';
            isValid = false;
        }
        if (!formData.case_status) {
            newErrors.case_status = 'Case status is required';
            isValid = false;
        }
        if (!formData.case_number) {
            newErrors.case_number = 'Case number is required';
            isValid = false;
        } else if (formData.case_number.length < 5) {
            newErrors.case_number = 'Case number must be at least 5 characters';
            isValid = false;
        }
        if (!formData.case_track_number) {
            newErrors.case_track_number = 'Track number is required';
            isValid = false;
        } else if (formData.case_track_number.length < 5) {
            newErrors.case_track_number = 'Track number must be at least 5 characters';
            isValid = false;
        }

        if (formData.fee === null || formData.fee === undefined || isNaN(Number(formData.fee))) {
            newErrors.fee = 'Fee is required and must be a number';
            isValid = false;
        } else if (Number(formData.fee) <= 0) {
            newErrors.fee = 'Fee must be a positive number';
            isValid = false;
        }

        if (!formData.case_description) {
            newErrors.case_description = 'Case description is required';
            isValid = false;
        } else if (formData.case_description.length < 10) {
            newErrors.case_description = 'Description must be at least 10 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!id) {
            toast.error('Case ID is undefined.');
            return;
        }

        setIsLoading(true);

        try {
            const updateObject = {
                case_id: id,
                user_id: userId,
                case_type: formData.case_type,
                case_status: formData.case_status,
                case_number: formData.case_number,
                case_track_number: formData.case_track_number,
                fee: formData.fee,
                case_description: formData.case_description,
            };
            await updateCase(updateObject).unwrap();
            toast.success('Case updated successfully!', {
                icon: <FaCheckCircle className="text-green-500" />,
            });
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            toast.error('Failed to update case.', {
                icon: <FaExclamationTriangle className="text-red-500" />,
            });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toast.warning('Update cancelled', {
            icon: <FaExclamationTriangle className="text-yellow-500" />,
        });
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
                className="relative bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md mx-auto max-h-[95vh] flex flex-col" // Increased max-h, flex container
                onClick={(e) => e.stopPropagation()}
            >
                <Toaster
                    toastOptions={{
                        classNames: {
                            error: 'bg-red-600 text-white',
                            success: 'bg-green-600 text-white',
                            warning: 'bg-yellow-600 text-gray-800',
                            info: 'bg-blue-600 text-white',
                        },
                        duration: 3000,
                    }}
                />

                <button
                    type="button"
                    title="Close"
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <FaTimes className="h-6 w-6" />
                </button>

                <div className="px-6 py-8 sm:p-10 overflow-y-auto flex-grow"> {/* Added flex-grow to allow content to fill available space */}
                    <div className="text-center mb-6">
                        <FaEdit className="inline-block h-8 w-8 mb-2 text-blue-500" />
                        <h2 className="text-2xl font-semibold text-blue-900">Update Case</h2>
                        <p className="text-blue-500">Edit the case details below</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="case_type" className="block text-sm font-medium text-gray-700">
                                Case Type
                            </label>
                            <div className="mt-1">
                                <select
                                    id="case_type"
                                    name="case_type"
                                    value={formData.case_type}
                                    onChange={handleChange}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.case_type ? 'border-red-500' : ''}`}
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
                                    <option value="childrenCase">Children Case</option>
                                    <option value="tribunal">Tribunal</option>
                                    <option value="conveyances">Conveyances</option>
                                </select>
                                {errors.case_type && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="inline-block mr-1" />{errors.case_type}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="case_status" className="block text-sm font-medium text-gray-700">
                                Case Status
                            </label>
                            <div className="mt-1">
                                <select
                                    id="case_status"
                                    name="case_status"
                                    value={formData.case_status}
                                    onChange={handleChange}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.case_status ? 'border-red-500' : ''}`}
                                >
                                    <option value="open">Open <FaFolderOpen className="inline-block ml-1" /></option>
                                    <option value="in_progress">In Progress <FaBusinessTime className="inline-block ml-1" /></option>
                                    <option value="closed">Closed <FaArchive className="inline-block ml-1" /></option>
                                    <option value="on_hold">On Hold <FaPauseCircle className="inline-block ml-1" /></option>
                                    <option value="resolved">Resolved <FaCheck className="inline-block ml-1" /></option>
                                </select>
                                {errors.case_status && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="inline-block mr-1" />{errors.case_status}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="case_number" className="block text-sm font-medium text-gray-700">
                                Case Number
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="case_number"
                                    name="case_number"
                                    value={formData.case_number}
                                    onChange={handleChange}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.case_number ? 'border-red-500' : ''}`}
                                />
                                {errors.case_number && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="inline-block mr-1" />{errors.case_number}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="case_track_number" className="block text-sm font-medium text-gray-700">
                                Track Number
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="case_track_number"
                                    name="case_track_number"
                                    value={formData.case_track_number}
                                    onChange={handleChange}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.case_track_number ? 'border-red-500' : ''}`}
                                />
                                {errors.case_track_number && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="inline-block mr-1" />{errors.case_track_number}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
                                Fee
                                <span className="text-blue-500">Ksh</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    
                                </div>
                                <input
                                    type="number"
                                    id="fee"
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pl-7 ${errors.fee ? 'border-red-500' : ''}`}
                                    placeholder="0.00"
                                />
                                
                                {errors.fee && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="inline-block mr-1" />{errors.fee}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="case_description" className="block text-sm font-medium text-gray-700">
                                Case Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="case_description"
                                    name="case_description"
                                    rows={4}
                                    value={formData.case_description}
                                    onChange={handleChange}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.case_description ? 'border-red-500' : ''}`}
                                />
                                {errors.case_description && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="inline-block mr-1" />{errors.case_description}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={handleCloseModal}
                            >
                                Discard Changes
                            </button>
                            <button
                                type="submit"
                                className={`inline-flex items-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateCaseForm;