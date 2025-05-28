// src/features/Tickets/components/MyTickets/EditUserTicket.tsx (or your path)
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TicketAPI } from "../../../../features/Tickets/AllTickets";
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { TypeTickets } from '../../../../features/Tickets/AllTickets';
import { FileEdit, Loader2, Save, UserCircle, XCircle } from 'lucide-react'; // Modern Lucide icons

interface EditTicketFormProps {
    userFullName?: string;
    userProfilePicture?: string;
    useremail?: string; // Kept for potential future use
    ticket: TypeTickets | null;
    modalId: string;
}

// Define the form data type
interface FormData {
    subject: string;
    description: string;
    status: "Open" | "Closed";
}

const validationSchema = yup.object().shape({
    subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters long'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters long'),
    status: yup.string().oneOf(['Open', 'Closed'], 'Invalid status').required('Status is required'),
});

const EditUserTicket: React.FC<EditTicketFormProps> = ({
    userFullName,
    userProfilePicture,
    ticket,
    modalId
}) => {
    const ticket_id = Number(ticket?.ticket_id);
    const user_id = ticket?.user_id; // This seems correct as it's the user who owns the ticket

    // Use the isLoading state directly from the mutation hook
    const [updateTicketApi, { isLoading: isUpdatingTicket }] = TicketAPI.useUpdateTicketMutation();

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (ticket) {
            setValue('subject', ticket.subject);
            setValue('description', ticket.description);
            // Ensure status is either "Open" or "Closed" before setting
            const validStatus = ticket.status === "Open" || ticket.status === "Closed" ? ticket.status : "Open";
            setValue('status', validStatus);
        } else {
            // If ticket becomes null (e.g. modal reopens without a ticket), reset form
            reset({ subject: '', description: '', status: 'Open' });
        }
    }, [ticket, setValue, reset]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!ticket_id || user_id === undefined) { // Check user_id as well
            toast.error('Ticket information is incomplete.');
            return;
        }

        // Define a type for the error object
        type ApiError = {
            data?: { message?: string };
            message?: string;
        };

        try {
            await updateTicketApi({ ticket_id, user_id, ...data }).unwrap();
            toast.success('Ticket updated successfully!');
            setTimeout(() => {
                const dialogElement = document.getElementById(modalId) as HTMLDialogElement;
                if (dialogElement) dialogElement.close();
            }, 1200); // Slightly longer for user to read success toast
        } catch (err: unknown) {
            console.error('Failed to update ticket:', err);
            let errorMessage = 'Failed to update ticket. Please try again.';
            if (typeof err === 'object' && err !== null) {
                const apiErr = err as ApiError;
                if ('data' in apiErr && typeof apiErr.data?.message === 'string') {
                    errorMessage = apiErr.data!.message!;
                } else if ('message' in apiErr && typeof apiErr.message === 'string') {
                    errorMessage = apiErr.message;
                }
            }
            toast.error(`❌ ${errorMessage}`);
        }
    };

    const handleCloseModal = (event?: React.MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault(); // Prevent form submission if it's a button inside a form
        // No "Update Cancelled" toast unless explicitly requested, as user might just be closing
        const dialogElement = document.getElementById(modalId) as HTMLDialogElement;
        if (dialogElement) {
            dialogElement.close();
        }
    };

    if (!ticket) {
        // Optionally, render a placeholder or null if the ticket is not yet available
        // This helps prevent errors if the modal opens before 'ticket' prop is populated
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Loading ticket details...
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4 space-y-6 text-gray-800 dark:text-gray-200">
            <Toaster
                position="top-right"
                richColors
                toastOptions={{
                    className: 'font-sans',
                }}
            />

            {/* User Info Header */}
            {(userFullName || userProfilePicture) && (
                <div className="flex items-center gap-3 p-1 pb-4 border-b border-gray-200 dark:border-gray-700">
                    {userProfilePicture ? (
                        <img
                            src={userProfilePicture}
                            alt={userFullName || 'User Profile'}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                        />
                    ) : (
                        <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-sky-500 dark:text-sky-400" />
                    )}
                    <div>
                        {userFullName && (
                            <p className="font-semibold text-md sm:text-lg">
                                {userFullName}
                            </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Editing Ticket #{ticket.ticket_id}
                        </p>
                    </div>
                </div>
            )}

            {/* Form Title */}
            <div className="flex items-center space-x-2">
                <FileEdit className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-semibold">
                    Update Ticket Details
                </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Subject Input */}
                <div>
                    <label
                        htmlFor="edit-subject" // Unique ID for label
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        Subject
                    </label>
                    <input
                        id="edit-subject"
                        type="text"
                        {...register('subject')}
                        placeholder="e.g., Issue with login"
                        className={`input input-bordered w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-sky-500 focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${errors.subject ? 'input-error focus:border-red-500 dark:focus:border-red-400' : ''}`}
                    />
                    {errors.subject && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                {/* Description Input */}
                <div>
                    <label
                        htmlFor="edit-description" // Unique ID
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        Description
                    </label>
                    <textarea
                        id="edit-description"
                        rows={5}
                        {...register('description')}
                        placeholder="Please describe your issue in detail..."
                        className={`textarea textarea-bordered w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-sky-500 focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${errors.description ? 'textarea-error focus:border-red-500 dark:focus:border-red-400' : ''}`}
                    />
                    {errors.description && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Status Select */}
                <div>
                    <label
                        htmlFor="edit-status" // Unique ID
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        Status
                    </label>
                    <select
                        id="edit-status"
                        {...register('status')}
                        className={`select select-bordered w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-sky-500 focus:border-sky-500 ${errors.status ? 'select-error focus:border-red-500 dark:focus:border-red-400' : ''}`}
                    >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                    {errors.status && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.status.message}</p>}
                </div>


                <div className="flex justify-end pt-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleCloseModal()}
                        className="btn btn-ghost dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={isUpdatingTicket}
                    >
                        <XCircle className="w-5 h-5 mr-1 sm:mr-2" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 border-none"
                        disabled={isUpdatingTicket}
                    >
                        {isUpdatingTicket ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-1 sm:mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserTicket;