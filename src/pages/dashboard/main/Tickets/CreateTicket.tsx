// src/features/Tickets/components/MyTickets/CreateTicket.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { TicketAPI } from "../../../../features/Tickets/AllTickets";
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toaster, toast } from 'sonner';
import { Ticket, Loader2, Send, UserCircle } from 'lucide-react'; 
import {  useEffect } from 'react';

// Props for the component
export interface CreateTicketProps {
    userFullName?: string;
    userProfilePicture?: string;
    // For pre-filling the form, if needed
    initialSubject?: string;
    initialDescription?: string;
    // The modal ID from the parent is needed to close it
    modalId: string;
}

// Values managed by the form
export interface FormValues {
    subject: string;
    description: string;
}

const schema = yup.object().shape({
    subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters long'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters long'),
});

const CreateTicket: React.FC<CreateTicketProps> = ({
    userFullName,
    userProfilePicture,
    initialSubject = '',
    initialDescription = '',
    modalId,
}) => {
    const [createTicketApi, { isLoading: isCreatingTicket }] = TicketAPI.useCreateTicketMutation();
    const user = useSelector((state: RootState) => state.user);
    const user_id = user.user?.user_id ?? 0;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            subject: initialSubject,
            description: initialDescription,
        }
    });

    // Effect to reset form if initial values change (e.g., modal reopens with different context)
    useEffect(() => {
        reset({
            subject: initialSubject,
            description: initialDescription,
        });
    }, [initialSubject, initialDescription, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await createTicketApi({
                user_id: user_id, // This comes from Redux store
                ...data // subject, description from form
            }).unwrap();
            toast.success('🎉 Ticket created successfully!');
            reset(); // Clear the form
            // Close the modal
            const dialogElement = document.getElementById(modalId) as HTMLDialogElement;
            if (dialogElement) {
                dialogElement.close();
            }
        } catch (error: unknown) {
            console.error('Failed to create ticket:', error);
            let errorMessage = 'Failed to create ticket. Please try again.';

            interface ErrorWithData {
                data?: { message?: string };
                message?: string;
            }

            if (typeof error === 'object' && error !== null) {
                const err = error as ErrorWithData;
                if (err.data && typeof err.data.message === 'string') {
                    errorMessage = err.data.message;
                } else if (typeof err.message === 'string') {
                    errorMessage = err.message;
                }
            }
            toast.error(`❌ ${errorMessage}`);
        }
    };

    return (
        // This div is the content container within the modal-box
        <div className="p-2 sm:p-4 space-y-6 text-gray-800 dark:text-gray-200">
            <Toaster
                position="top-right"
                richColors // Uses default rich colors from Sonner which are often dark-mode aware
                toastOptions={{
                    className: 'font-sans', // Ensure font consistency
                    // More specific styling if needed:
                    // classNames: {
                    //   toast: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg',
                    //   success: '!bg-green-50 dark:!bg-green-900/50 !border-green-300 dark:!border-green-700 !text-green-700 dark:!text-green-300',
                    //   error: '!bg-red-50 dark:!bg-red-900/50 !border-red-300 dark:!border-red-700 !text-red-700 dark:!text-red-300',
                    // }
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
                            Creating a new support ticket
                        </p>
                    </div>
                </div>
            )}

            {/* Form Title (Optional, if the modal itself doesn't have a prominent title) */}
            <div className="flex items-center space-x-2">
                <Ticket className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-semibold">
                    Submit a New Ticket
                </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Subject Input */}
                <div>
                    <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        Subject
                    </label>
                    <input
                        id="subject"
                        type="text"
                        {...register('subject')}
                        placeholder="e.g., Issue with login"
                        className={`input input-bordered w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-sky-500 focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${errors.subject ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500' : ''}`}
                    />
                    {errors.subject && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.subject.message}</p>
                    )}
                </div>

                {/* Description Input */}
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={5}
                        {...register('description')}
                        placeholder="Please describe your issue in detail..."
                        className={`textarea textarea-bordered w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-sky-500 focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${errors.description ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500' : ''}`}
                    />
                    {errors.description && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div className="flex justify-end pt-2 gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            const dialogElement = document.getElementById(modalId) as HTMLDialogElement;
                            if (dialogElement) dialogElement.close();
                        }}
                        className="btn btn-ghost dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={isCreatingTicket}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 border-none"
                        disabled={isCreatingTicket}
                    >
                        {isCreatingTicket ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2" />
                                Create Ticket
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTicket;