import React, { useEffect, useState } from 'react';
import { formatISO, isValid, parseISO } from 'date-fns';
import { EventReminderDataTypes, useCreateReminderMutation, useUpdateReminderMutation } from '../../../../features/events/events';
//       await deleteReminder(reminderToDeleteId).unwrap();
//       toast.success('Reminder deleted successfully!');
import { Dialog } from '@headlessui/react';

interface ReminderFormModalProps {
  open: boolean;
  onClose: () => void;
  eventId: number;
  eventTitle: string;
  reminderToEdit?: EventReminderDataTypes | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const getInitialReminderFormState = (
  eventTitle: string,
  reminder?: EventReminderDataTypes | null
): Pick<EventReminderDataTypes, 'reminder_time' | 'reminder_message'> => ({
  reminder_time: reminder?.reminder_time || '',
  reminder_message: reminder?.reminder_message || `Reminder for: ${eventTitle}`,
});

const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
  open,
  onClose,
  eventId,
  eventTitle,
  reminderToEdit,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState(getInitialReminderFormState(eventTitle, reminderToEdit));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();

  useEffect(() => {
    if (open) {
      setFormData(getInitialReminderFormState(eventTitle, reminderToEdit));
      setErrors({});
    }
  }, [open, reminderToEdit, eventTitle]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, reminder_time: value }));
    if (errors.reminder_time) {
      setErrors((prev) => ({ ...prev, reminder_time: '' }));
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
    if (!formData.reminder_time || !isValid(parseISO(formData.reminder_time))) {
      newErrors.reminder_time = 'Valid reminder date and time is required.';
    }
    if (!(formData.reminder_message ?? '').trim()) {
      newErrors.reminder_message = 'Reminder message is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      event_id: eventId,
      reminder_time: new Date(formData.reminder_time).toISOString(),
      reminder_message: formData.reminder_message,
    };

    try {
      if (reminderToEdit?.reminder_id) {
        await updateReminder({ reminder_id: reminderToEdit.reminder_id, ...payload }).unwrap();
        onSuccess('Reminder updated successfully!');
      } else {
        await createReminder(payload).unwrap();
        onSuccess('Reminder added successfully!');
      }
      onClose();
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'data' in err) {
        const errorData = (err as { data?: { msg?: string; errors?: Record<string, string> } }).data;
        onError(errorData?.msg || 'An error occurred.');
        if (errorData?.errors) {
          setErrors((prev) => ({ ...prev, ...errorData.errors }));
        }
      } else {
        onError('An error occurred.');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

        <form
          onSubmit={handleSubmit}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 z-50"
        >
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {reminderToEdit ? `Edit Reminder for "${eventTitle}"` : `Add Reminder for "${eventTitle}"`}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label htmlFor="reminder_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reminder Date & Time*
              </label>
              <input
                type="datetime-local"
                id="reminder_time"
                name="reminder_time"
                value={
                  formData.reminder_time
                    ? formatISO(parseISO(formData.reminder_time)).slice(0, 16)
                    : ''
                }
                onChange={handleDateChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.reminder_time ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                required
              />
              {errors.reminder_time && <p className="text-sm text-red-500 mt-1">{errors.reminder_time}</p>}
            </div>

            <div>
              <label htmlFor="reminder_message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reminder Message*
              </label>
              <textarea
                id="reminder_message"
                name="reminder_message"
                rows={3}
                value={formData.reminder_message}
                onChange={handleMessageChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.reminder_message ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                required
              />
              {errors.reminder_message && (
                <p className="text-sm text-red-500 mt-1">{errors.reminder_message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              disabled={isCreating || isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : reminderToEdit ? 'Update Reminder' : 'Add Reminder'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ReminderFormModal;
