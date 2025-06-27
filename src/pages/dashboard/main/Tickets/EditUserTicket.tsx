// src/features/Tickets/components/MyTickets/EditUserTicket.tsx 
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { Toaster, toast } from 'sonner';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FileEdit, Loader2, Save, UserCircle, X, ChevronDown, Check } from 'lucide-react';

interface EditTicketFormProps {
    userFullName?: string;
    userProfilePicture?: string;
    ticket: TypeTickets | null;
    modalId: string;
}

// Form data type
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
    const user_id = ticket?.user_id;

    const [updateTicketApi, { isLoading: isUpdatingTicket }] = TicketAPI.useUpdateTicketMutation();

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });
    
    // State and Ref for custom dropdown
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const currentStatus = watch('status');

    useEffect(() => {
        if (ticket) {
            setValue('subject', ticket.subject);
            setValue('description', ticket.description);
            const validStatus = ticket.status === "Open" || ticket.status === "Closed" ? ticket.status : "Open";
            setValue('status', validStatus);
        } else {
            reset({ subject: '', description: '', status: 'Open' });
        }
    }, [ticket, setValue, reset]);
    
    // Effect to close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!ticket_id || user_id === undefined) {
            toast.error('Ticket information is incomplete.');
            return;
        }

        type ApiError = { data?: { message?: string }; message?: string; };

        try {
            await updateTicketApi({ ticket_id, user_id, ...data }).unwrap();
            toast.success('Ticket updated successfully!');
            setTimeout(() => {
                const dialogElement = document.getElementById(modalId) as HTMLDialogElement;
                if (dialogElement) dialogElement.close();
            }, 1200);
        } catch (err: unknown) {
            let errorMessage = 'Failed to update ticket. Please try again.';
            if (typeof err === 'object' && err !== null) {
                const apiErr = err as ApiError;
                if (apiErr.data?.message) errorMessage = apiErr.data.message;
                else if (apiErr.message) errorMessage = apiErr.message;
            }
            toast.error(`❌ ${errorMessage}`);
        }
    };

    const handleCloseModal = (event?: React.MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault();
        const dialogElement = document.getElementById(modalId) as HTMLDialogElement;
        if (dialogElement) dialogElement.close();
    };
    
    // --- Reusable Styles & Variants ---
    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    if (!ticket) return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading ticket details...</div>;

    return (
        <div className="p-2 sm:p-4 space-y-6 text-gray-800 dark:text-gray-200">
            <Toaster position="top-right" richColors toastOptions={{ className: 'font-sans' }} />

            {(userFullName || userProfilePicture) && (
                <div className="flex items-center gap-3 p-1 pb-4 border-b border-gray-200 dark:border-gray-700">
                    {userProfilePicture ? ( <img src={userProfilePicture} alt={userFullName || 'User Profile'} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" /> ) : ( <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-sky-500 dark:text-sky-400" /> )}
                    <div>
                        {userFullName && <p className="font-semibold text-md sm:text-lg">{userFullName}</p>}
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Editing Ticket #{ticket.ticket_id}</p>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-2">
                <FileEdit className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-semibold">Update Ticket Details</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label htmlFor="edit-subject" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Subject</label>
                    <input id="edit-subject" type="text" {...register('subject')} placeholder="e.g., Issue with login" className={`${inputBaseClasses} py-2.5 px-4 ${errors.subject ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                    {errors.subject && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Description</label>
                    <textarea id="edit-description" rows={5} {...register('description')} placeholder="Please describe your issue in detail..." className={`${inputBaseClasses} py-2.5 px-4 ${errors.description ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                    {errors.description && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div ref={statusDropdownRef} className="relative">
                    <label htmlFor="edit-status-button" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Status</label>
                    <button id="edit-status-button" type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4 ${errors.status ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
                        <span className="font-semibold">{currentStatus}</span>
                        <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {isStatusDropdownOpen && (
                            <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {(['Open', 'Closed'] as const).map(status => (
                                    <li key={status}>
                                        <button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50 flex items-center justify-between" onClick={() => { setValue('status', status, { shouldValidate: true }); setIsStatusDropdownOpen(false); }}>
                                            <span>{status}</span>
                                            {currentStatus === status && <Check className="h-4 w-4 text-sky-500" />}
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                    {errors.status && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.status.message}</p>}
                </div>

                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 flex items-center gap-2" disabled={isUpdatingTicket}>
                        <X className="w-5 h-5" /> Cancel
                    </button>
                    <button type="submit" className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2" disabled={isUpdatingTicket}>
                        {isUpdatingTicket ? ( <><Loader2 className="animate-spin h-5 w-5" /> Saving...</> ) : ( <><Save className="w-5 h-5" /> Save Changes</> )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserTicket;