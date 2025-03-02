import { useUpdateCaseMutation, CaseDataTypes, CaseType, CaseStatus, PaymentStatus } from '../../../../features/case/caseAPI';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toaster, toast } from 'sonner';
import { useState, useEffect } from 'react';

interface EditCaseFormProps {
    caseItem: CaseDataTypes | null;
    modalId: string;
}

// Define the expected form data based on your validation schema.
interface FormData {
    case_type: CaseType;
    case_status: CaseStatus;
    case_number: string;
    case_track_number: string;
    fee: number;
    payment_status: PaymentStatus;
    case_description: string;
}

// Validation schema using Yup for Update Case
const validationSchema = yup.object().shape({
    case_type: yup.mixed<CaseType>().required('Case type is required'),
    case_status: yup.mixed<CaseStatus>().required('Case status is required'),
    case_number: yup.string().required('Case number is required').min(5, 'Case number must be at least 5 characters'),
    case_track_number: yup.string().required('Track number is required').min(5, 'Track number must be at least 5 characters'),
    fee: yup.number().typeError('Fee must be a number').required('Fee is required').positive('Fee must be a positive number'),
    payment_status: yup.mixed<PaymentStatus>().required('Payment status is required'),
    case_description: yup.string().required('Case description is required').min(10, 'Description must be at least 10 characters'),
});

const UpdateCaseForm = ({ caseItem, modalId }: EditCaseFormProps) => {
    const id = Number(caseItem?.case_id);
    const userId = caseItem?.user_id;
    const [updateCase] = useUpdateCaseMutation();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (caseItem) {
            setValue('case_type', caseItem.case_type);
            setValue('case_status', caseItem.case_status);
            setValue('case_number', caseItem.case_number);
            setValue('case_track_number', caseItem.case_track_number);
            setValue('fee', caseItem.fee);
            setValue('payment_status', caseItem.payment_status);
            setValue('case_description', caseItem?.case_description ?? '');
        }
    }, [caseItem, setValue]);

    const onSubmit = async (data: FormData) => {
        if (!id) {
            toast.error('Case ID is undefined.');
            return;
        }

        setIsLoading(true);

        try {
            const updateObject = {
                case_id: id,
                user_id: userId,
                case_type: data.case_type,
                case_status: data.case_status,
                case_number: data.case_number,
                case_track_number: data.case_track_number,
                fee: data.fee,
                payment_status: data.payment_status,
                case_description: data.case_description,
            };
            await updateCase(updateObject).unwrap();
            toast.success('Case updated successfully!');
            setTimeout(() => {
                (document.getElementById(modalId) as HTMLDialogElement)?.close();
            }, 1000);
            reset();
        } catch (err) {
            toast.error('Failed to update case.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toast.warning('Update cancelled');
        setTimeout(() => {
            (document.getElementById(modalId) as HTMLDialogElement)?.close();
        }, 1000);
    };

    return (
        <div id={modalId} className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <Toaster
                toastOptions={{
                    classNames: {
                        error: 'bg-red-400',
                        success: 'text-green-400',
                        warning: 'text-yellow-400',
                        info: 'bg-blue-400',
                    },
                }}
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
            >
                <h2 className="bg-blue-500 text-white text-xl font-bold text-center py-3 rounded-md">Update Case</h2>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="case_type" className="font-medium text-gray-700">Case Type</label>
                        <select {...register('case_type')} className="p-2 border rounded-md">
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
                        {errors.case_type && <p className="text-red-500 text-sm">{errors.case_type.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="case_status" className="font-medium text-gray-700">Case Status</label>
                        <select {...register('case_status')} className="p-2 border rounded-md">
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                            <option value="on_hold">On Hold</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        {errors.case_status && <p className="text-red-500 text-sm">{errors.case_status.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="case_number" className="font-medium text-gray-700">Case Number</label>
                        <input type="text" {...register('case_number')} className="p-2 border rounded-md" />
                        {errors.case_number && <p className="text-red-500 text-sm">{errors.case_number.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="case_track_number" className="font-medium text-gray-700">Track Number</label>
                        <input type="text" {...register('case_track_number')} className="p-2 border rounded-md" />
                        {errors.case_track_number && <p className="text-red-500 text-sm">{errors.case_track_number.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="fee" className="font-medium text-gray-700">Fee</label>
                        <input type="number" {...register('fee')} className="p-2 border rounded-md" />
                        {errors.fee && <p className="text-red-500 text-sm">{errors.fee.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="payment_status" className="font-medium text-gray-700">Payment Status</label>
                        <select {...register('payment_status')} className="p-2 border rounded-md">
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                        {errors.payment_status && <p className="text-red-500 text-sm">{errors.payment_status.message}</p>}
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="case_description" className="font-medium text-gray-700">Case Description</label>
                        <textarea
                            {...register('case_description')}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            rows={4}
                        ></textarea>
                        {errors.case_description && <p className="text-red-500 text-sm">{errors.case_description.message}</p>}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-4">
                    <button
                        className="bg-red-500 text-white py-1 px-2 rounded-md text-sm mb-2 sm:mb-0"
                        onClick={handleCloseModal}
                    >
                        ✖ Discard Changes
                    </button>
                    <button
                        className={`bg-blue-600 text-white hover:bg-blue-700 font-bold py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center space-x-2 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin border-4 border-t-4 border-white w-4 h-4 rounded-full"></div>
                        ) : (
                            <span>💾 Save Changes</span>
                        )}
                    </button>
                </div>

                {isLoading && <p className="text-blue-500 text-center mt-4">Updating...</p>}
            </form>
        </div>
    );
};

export default UpdateCaseForm;
