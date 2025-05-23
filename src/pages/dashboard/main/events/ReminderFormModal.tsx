// ReminderFormModal.tsx
import React, { useEffect, useState, useMemo, forwardRef } from 'react';
import {
  
  isValid,
  parseISO,
  format,
  parse,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import datepicker CSS
import { toast } from 'sonner'; // Import Sonner

import {
  // Make sure this type includes event_id if it comes from the backend
  EventReminderDataTypes,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
} from '../../../../features/events/events'; // Adjust path
import { Dialog } from '@headlessui/react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Save, X, Trash2, Loader2 } from 'lucide-react';
export interface ReminderFormModalProps {
  open: boolean;
  onClose: () => void;
  reminderToEdit: EventReminderDataTypes | null;
  eventId: number;
  eventTitle: string;
  onSuccess: () => void;
  onError: (msg?: string) => void;
}

interface ReminderFormData {
  form_date_part: string;
  form_time_part: string;
  reminder_message: string;
}

const getInitialReminderFormState = (
  eventTitle: string,
  reminder?: EventReminderDataTypes | null
): ReminderFormData => {
  let initialDateStr = '';
  let initialTimeStr = '';

  if (reminder?.reminder_time) {
    try {
      const dt = parseISO(reminder.reminder_time);
      if (isValid(dt)) {
        initialDateStr = format(dt, 'yyyy-MM-dd');
        initialTimeStr = format(dt, 'HH:mm:ss');
      } else {
        console.warn('Invalid reminder_time for initialization:', reminder.reminder_time);
      }
    } catch (e) {
      console.error('Error parsing reminder.reminder_time for form', e);
    }
  }

  return {
    form_date_part: initialDateStr,
    form_time_part: initialTimeStr,
    reminder_message: reminder?.reminder_message || `Reminder for: ${eventTitle}`,
  };
};

const inputBaseClasses = "block w-full text-sm rounded-md shadow-sm read-only:bg-gray-100 dark:read-only:bg-slate-700";
const labelBaseClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, hasError, placeholder, disabled }, ref) => (
    <input
      type="text"
      className={`${inputBaseClasses} px-3 py-2 border ${
        hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200`}
      onClick={onClick}
      value={value}
      ref={ref}
      readOnly
      placeholder={placeholder}
      disabled={disabled}
    />
  )
);
CustomDateInput.displayName = 'CustomDateInput';


const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
  open,
  onClose,
  eventId,
  eventTitle,
  reminderToEdit,
}) => {
  const [formData, setFormData] = useState<ReminderFormData>(getInitialReminderFormState(eventTitle, reminderToEdit));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();
  const [deleteReminderMutation, { isLoading: isDeletingRem }] = useDeleteReminderMutation(); // Renamed to avoid conflict

  // Effect to reset form content when modal opens or its core data changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialReminderFormState(eventTitle, reminderToEdit));
      setErrors({});
      // Do not reset isDeleteConfirmModalOpen here, to allow it to open
    }
  }, [open, reminderToEdit, eventTitle, eventId]);

  // Effect to ensure delete confirmation closes if the main modal is forced closed
  useEffect(() => {
    if (!open && isDeleteConfirmModalOpen) {
      setIsDeleteConfirmModalOpen(false);
    }
  }, [open, isDeleteConfirmModalOpen]);


  const handleDatePartChange = (date: Date | null) => {
    const newDateString = date && isValid(date) ? format(date, 'yyyy-MM-dd') : '';
    setFormData(prev => ({ ...prev, form_date_part: newDateString }));
    if (errors.reminder_time && newDateString && formData.form_time_part) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors.reminder_time; return newErrors; });
    }
  };

  const handleTimePartChange = (time: Date | null) => {
    const newTimeString = time && isValid(time) ? format(time, 'HH:mm:ss') : '';
    setFormData(prev => ({ ...prev, form_time_part: newTimeString }));
    if (errors.reminder_time && newTimeString && formData.form_date_part) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors.reminder_time; return newErrors; });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, reminder_message: value }));
    if (errors.reminder_message) {
      setErrors((prev) => ({ ...prev, reminder_message: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.form_date_part) newErrors.reminder_time = "Date is required.";
    if (!formData.form_time_part) {
        newErrors.reminder_time = (newErrors.reminder_time || "") + (newErrors.reminder_time ? " and Time are required." : "Time is required.");
    }
    if (!formData.reminder_message.trim()) {
      newErrors.reminder_message = 'Reminder message is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    let combinedReminderDateTime: Date | null = null;
    try {
        const datePart = parse(formData.form_date_part, 'yyyy-MM-dd', new Date());
        const timePart = parse(formData.form_time_part, 'HH:mm:ss', new Date());

        if (isValid(datePart) && isValid(timePart)) {
            let tempDate = startOfDay(datePart);
            tempDate = setHours(tempDate, timePart.getHours());
            tempDate = setMinutes(tempDate, timePart.getMinutes());
            tempDate = setSeconds(tempDate, timePart.getSeconds());
            combinedReminderDateTime = tempDate;
        }
    } catch (err) { console.error("Error combining date and time", err); }

    if (!combinedReminderDateTime || !isValid(combinedReminderDateTime)) {
        setErrors(prev => ({ ...prev, reminder_time: "Invalid date or time." }));
        toast.error("Invalid date or time selected.");
        return;
    }

    const payloadForApi = {
      reminder_time: combinedReminderDateTime.toISOString(),
      reminder_message: formData.reminder_message.trim(),
    };

    try {
      if (reminderToEdit?.reminder_id) {
        // Ensure reminderToEdit.event_id is part of EventReminderDataTypes
        const eventIdForUpdate = reminderToEdit.event_id ?? eventId; 
        if (eventIdForUpdate === undefined || eventIdForUpdate === null) {
            toast.error("Failed to update: Event association missing.");
            return;
        }
        const updatePayload = { ...payloadForApi, event_id: eventIdForUpdate };
        await updateReminder({ reminder_id: reminderToEdit.reminder_id, ...updatePayload }).unwrap();
        toast.success('Reminder updated successfully!');
      } else {
        if (eventId === undefined || eventId === null) {
            toast.error("Failed to create: Parent event info missing.");
            return;
        }
        const createPayload = { ...payloadForApi, event_id: eventId };
        await createReminder(createPayload).unwrap();
        toast.success('Reminder added successfully!');
      }
      onClose(); // Close main modal on success
    } catch (err: unknown) {
      console.error('API Error:', err);
      let errorMsg = 'An error occurred.';
      if (typeof err === 'object' && err !== null) {
        const errorObj = err as { data?: { msg?: string; message?: string; errors?: Record<string, string> }; message?: string };
        errorMsg = errorObj.data?.msg || errorObj.data?.message || errorObj.message || errorMsg;
        if (errorObj.data && errorObj.data.errors) {
          setErrors(prev => ({ ...prev, ...errorObj.data!.errors }));
        }
      }
      toast.error(errorMsg);
    }
  };

  const handleOpenDeleteConfirm = () => {
    if (!reminderToEdit?.reminder_id) {
      toast.error('No reminder selected for deletion.');
      return;
    }
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmActualDelete = async () => {
    if (!reminderToEdit?.reminder_id) {
      toast.error('Deletion failed: Reminder ID missing.');
      setIsDeleteConfirmModalOpen(false);
      return;
    }
    try {
      await deleteReminderMutation(reminderToEdit.reminder_id).unwrap();
      toast.success('Reminder deleted successfully!');
      setIsDeleteConfirmModalOpen(false);
      onClose(); // Close main modal after successful deletion
    } catch (err: any) {
      console.error('Delete API Error:', err);
      const errorMsg = err.data?.msg || err.data?.message || err.message || 'Failed to delete reminder.';
      toast.error(errorMsg);
      setIsDeleteConfirmModalOpen(false);
    }
  };

  const anyOperationLoading = isCreating || isUpdating || isDeletingRem;

  const selectedDateForPicker = useMemo(() =>
    formData.form_date_part ? parse(formData.form_date_part, 'yyyy-MM-dd', new Date()) : null,
    [formData.form_date_part]
  );

  const selectedTimeForPicker = useMemo(() =>
    formData.form_time_part ? parse(formData.form_time_part, 'HH:mm:ss', new Date()) : null,
    [formData.form_time_part]
  );

  return (
    <>
      {/* Main Reminder Form Modal */}
      <Dialog open={open} onClose={() => !anyOperationLoading && onClose()} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            as="form" // Using form element for Dialog.Panel
            onSubmit={handleSubmit}
            className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all"
          >
            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100 mb-4">
              {reminderToEdit ? `Edit Reminder for "${eventTitle}"` : `Add Reminder for "${eventTitle}"`}
            </Dialog.Title>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="form_date_part" className={labelBaseClasses}>
                    <CalendarIcon size={14} className="inline mr-1.5 mb-0.5" /> Date*
                  </label>
                  <DatePicker
                    id="form_date_part"
                    selected={selectedDateForPicker && isValid(selectedDateForPicker) ? selectedDateForPicker : null}
                    onChange={handleDatePartChange}
                    dateFormat="yyyy-MM-dd"
                    customInput={<CustomDateInput hasError={!!errors.reminder_time?.includes("Date")} placeholder="YYYY-MM-DD" disabled={anyOperationLoading}/>}
                    wrapperClassName="w-full"
                    disabled={anyOperationLoading}
                    showPopperArrow={false}
                  />
                </div>
                <div>
                  <label htmlFor="form_time_part" className={labelBaseClasses}>
                    <Clock size={14} className="inline mr-1.5 mb-0.5" /> Time*
                  </label>
                  <DatePicker
                    id="form_time_part"
                    selected={selectedTimeForPicker && isValid(selectedTimeForPicker) ? selectedTimeForPicker : null}
                    onChange={handleTimePartChange}
                    showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                    dateFormat="HH:mm" // Display format
                    customInput={<CustomDateInput hasError={!!errors.reminder_time?.includes("Time")} placeholder="HH:MM" disabled={anyOperationLoading}/>}
                    wrapperClassName="w-full"
                    disabled={anyOperationLoading}
                    showPopperArrow={false}
                  />
                </div>
              </div>
              {errors.reminder_time && <p className="col-span-full text-xs text-red-500 -mt-3">{errors.reminder_time}</p>}
              
              <div>
                <label htmlFor="reminder_message" className={labelBaseClasses}>
                  Reminder Message*
                </label>
                <textarea
                  id="reminder_message"
                  name="reminder_message"
                  rows={3}
                  value={formData.reminder_message}
                  onChange={handleMessageChange}
                  className={`${inputBaseClasses} px-3 py-2 border ${
                    errors.reminder_message ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200`}
                  required
                  disabled={anyOperationLoading}
                  placeholder="E.g., Prepare documents for court hearing"
                />
                {errors.reminder_message && <p className="mt-1 text-xs text-red-500">{errors.reminder_message}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <div className="w-full sm:w-auto">
                {reminderToEdit?.reminder_id && (
                  <button
                    type="button"
                    onClick={handleOpenDeleteConfirm}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 transition-colors"
                    disabled={anyOperationLoading || isDeletingRem}
                  >
                    {isDeletingRem ? (<Loader2 size={16} className="animate-spin mr-2" />) : (<Trash2 size={16} className="mr-2" />)}
                    {isDeletingRem ? 'Deleting...' : 'Delete Reminder'} 
                  </button>
                )}
              </div>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => !anyOperationLoading && onClose()}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-60 transition-colors"
                  disabled={anyOperationLoading}
                >
                  <X size={16} className="mr-2" /> Cancel
                </button>
                <button
                  type="submit" // Submit button for the form
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
                  disabled={anyOperationLoading}
                >
                  {isCreating || isUpdating ? (<Loader2 size={16} className="animate-spin mr-2" />) : (<Save size={16} className="mr-2" />)}
                  {isCreating ? 'Adding...' : isUpdating ? 'Updating...' : reminderToEdit ? 'Update Reminder' : 'Add Reminder'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmModalOpen}
        onClose={() => !isDeletingRem && setIsDeleteConfirmModalOpen(false)}
        className="relative z-[60]" // Ensure higher z-index
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-lg">
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-700 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-200" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    Delete Reminder
                    </Dialog.Title>
                    <div className="mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Are you sure you want to delete the reminder for "{eventTitle}"? This action cannot be undone.
                    </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-60"
                onClick={confirmActualDelete}
                disabled={isDeletingRem}
              >
                {isDeletingRem ? (<Loader2 size={16} className="animate-spin mr-2" />) : <Trash2 size={16} className="mr-2" />}
                {isDeletingRem ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-60"
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                disabled={isDeletingRem}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ReminderFormModal;