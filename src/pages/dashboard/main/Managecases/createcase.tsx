import { useSelector } from 'react-redux';
import { useCreateCaseMutation } from '../../../../features/case/caseAPI';
import { RootState } from '../../../../app/store';
import { Toaster, toast } from 'sonner';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define the types for the case data
type CaseType =
    | 'criminal'
    | 'civil'
    | 'family'
    | 'corporate'
    | 'property'
    | 'employment'
    | 'intellectual_property'
    | 'immigration'
    | 'elc'
    | 'childrenCase'
    | 'tribunal'
    | 'conveyances';
type CaseStatus = 'open' | 'in_progress' | 'closed';

// Define the type for form data
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
}

const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ isOpen, onClose }) => {
    const [createCase, { isLoading }] = useCreateCaseMutation();
    const user = useSelector((state: RootState) => state.user);
    const userId = user.user?.user_id ?? 0;

    const { register, handleSubmit, reset } = useForm<FormData>({
        mode: 'onSubmit', // Validate on submit
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

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validate = (data: FormData): boolean => {
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!data.case_type) {
            newErrors.case_type = 'Case type is required';
            isValid = false;
        }

        if (!data.case_status) {
            newErrors.case_status = 'Case status is required';
            isValid = false;
        }

        if (!data.case_number) {
            newErrors.case_number = 'Case number is required';
            isValid = false;
        } else if (data.case_number.length < 5) {
            newErrors.case_number = 'Case number must be at least 5 characters';
            isValid = false;
        }

        if (!data.case_track_number) {
            newErrors.case_track_number = 'Track number is required';
            isValid = false;
        } else if (data.case_track_number.length < 5) {
            newErrors.case_track_number = 'Track number must be at least 5 characters';
            isValid = false;
        }

        if (!data.court) {
            newErrors.court = 'Court is required';
            isValid = false;
        }

        if (!data.station) {
            newErrors.station = 'Court station is required';
            isValid = false;
        }

        if (!data.parties) {
            newErrors.parties = 'Parties are required';
            isValid = false;
        } else if (data.parties.length < 5) {
            newErrors.parties = 'Parties must be at least 5 characters';
            isValid = false;
        }

        if (data.fee === null || data.fee === undefined || isNaN(Number(data.fee))) {
            newErrors.fee = 'Fee is required and must be a number';
            isValid = false;
        } else if (Number(data.fee) <= 0) {
            newErrors.fee = 'Fee must be a positive number';
            isValid = false;
        }

        if (!data.case_description) {
            newErrors.case_description = 'Case description is required';
            isValid = false;
        } else if (data.case_description.length < 10) {
            newErrors.case_description = 'Description must be at least 10 characters';
            isValid = false;
        }
        setFormErrors(newErrors);
        return isValid;
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        if (!validate(data)) {
            return;
        }

        try {
            const caseData = {
                ...data,
                user_id: userId,
                case_type: data.case_type as CaseType,
                case_status: data.case_status as CaseStatus,
            };

            await createCase(caseData).unwrap();
            toast.success('🎉 Case created successfully!', { duration: 3000 });
            reset();
            onClose(); // Close the modal on success
        } catch (error) {
            console.error('Error creating case:', error);
            toast.error('❌ Failed to create case. Please check the details and try again.', { duration: 3000 });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
                className="relative bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-3xl mx-auto" // Added mx-auto
                onClick={(e) => e.stopPropagation()}
            >
                <Toaster position="top-right" />

                <button
                    title="close"
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 px-6">
                    <h2 className="text-3xl font-extrabold text-center tracking-tight">Create a New Case</h2>
                    <p className="mt-2 text-lg text-gray-200 text-center">
                        Fill in the details below to create a new case record.
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 py-6 overflow-y-auto max-h-[70vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Case Type */}
                            <div>
                                <label
                                    htmlFor="case_type"
                                    className="block text-sm font-semibold text-gray-700 tracking-wide"
                                >
                                    Case Type
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="case_type"
                                        {...register('case_type')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.case_type ? 'border-red-500' : ''}`}
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
                                    {formErrors.case_type && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.case_type}</p>
                                    )}
                                </div>
                            </div>

                            {/* Case Status */}
                            <div>
                                <label
                                    htmlFor="case_status"
                                    className="block text-sm font-semibold text-gray-700 tracking-wide"
                                >
                                    Case Status
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="case_status"
                                        {...register('case_status')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.case_status ? 'border-red-500' : ''}`}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    {formErrors.case_status && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.case_status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Case Number */}
                            <div>
                                <label
                                    htmlFor="case_number"
                                    className="block text-sm font-semibold text-gray-700 tracking-wide"
                                >
                                    Case Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="case_number"
                                        {...register('case_number')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.case_number ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.case_number && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.case_number}</p>
                                    )}
                                </div>
                            </div>

                            {/* Case Track Number */}
                            <div>
                                <label
                                    htmlFor="case_track_number"
                                    className="block text-sm font-semibold text-gray-700 tracking-wide"
                                >
                                    Track Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="case_track_number"
                                        {...register('case_track_number')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.case_track_number ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.case_track_number && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.case_track_number}</p>
                                    )}
                                </div>
                            </div>

                            {/* Court */}
                            <div>
                                <label htmlFor="court" className="block text-sm font-semibold text-gray-700 tracking-wide">
                                    Court
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="court"
                                        {...register('court')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.court ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.court && <p className="text-red-500 text-xs mt-1">{formErrors.court}</p>}
                                </div>
                            </div>

                            {/* Station */}
                            <div>
                                <label
                                    htmlFor="station"
                                    className="block text-sm font-semibold text-gray-700 tracking-wide"
                                >
                                    Station
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="station"
                                        {...register('station')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.station ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.station && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.station}</p>
                                    )}
                                </div>
                            </div>

                            {/* Parties */}
                            <div>
                                <label
                                    htmlFor="parties"
                                    className="block text-sm font-semibold text-gray-700 tracking-wide"
                                >
                                    Parties
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="parties"
                                        {...register('parties')}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.parties ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.parties && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.parties}</p>
                                    )}
                                </div>
                            </div>

                            {/* Fee */}
                            <div>
                                <label htmlFor="fee" className="block text-sm font-semibold text-gray-700 tracking-wide">
                                    Fee
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        id="fee"
                                        {...register('fee', { valueAsNumber: true })}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.fee ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.fee && <p className="text-red-500 text-xs mt-1">{formErrors.fee}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Case Description */}
                        <div>
                            <label
                                htmlFor="case_description"
                                className="block text-sm font-semibold text-gray-700 tracking-wide"
                            >
                                Case Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="case_description"
                                    {...register('case_description')}
                                    rows={4}
                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.case_description ? 'border-red-500' : ''}`}
                                ></textarea>
                                {formErrors.case_description && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.case_description}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    'Create Case'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between sm:px-6">
                    <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <p className="text-sm text-gray-500 self-center">© {new Date().getFullYear()} wakili. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default CreateCaseForm;