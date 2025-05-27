import React, { useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

import {
  EventDataTypes,
  EventReminderDataTypes,
  useFetchRemindersQuery,
  useDeleteReminderMutation,
} from '../../../../features/events/events'; // Path should be correct

import ReminderFormModal from './ReminderFormModal';
import EventTypeChip from './components/EventTypeChip';
import ConfirmationDialog from './components/ConfirmationDialog';

interface Props {
  currentUserId?: number;
  open: boolean;
  onClose: () => void;
  event: EventDataTypes;
  onEditEvent: (event: EventDataTypes) => void; // This prop is present but not used in the provided modal code
  onDeleteEvent: (eventId: number) => void;   // This prop is present but not used in the provided modal code
  onSuccess: (message: string) => void; // Likely for reminder operations
  onError: (message: string) => void;   // Likely for reminder operations
}

const EventDetailsModal: React.FC<Props> = ({
  open,
  onClose,
  event,
  // onEditEvent, // Not used in this component's current rendering logic
  // onDeleteEvent, // Not used in this component's current rendering logic
}) => {
  const { data: allReminders, isLoading, isError, error } = useFetchRemindersQuery(undefined, { skip: !open });
  const [deleteReminder, { isLoading: isDeleting }] = useDeleteReminderMutation();

  const reminders = useMemo(
    () => allReminders?.filter(r => r.event_id === event.event_id) || [],
    [allReminders, event.event_id]
  );

  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<EventReminderDataTypes | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [reminderToDeleteId, setReminderToDeleteId] = useState<number | null>(null);

  const handleOpenCreateReminder = () => {
    setReminderToEdit(null);
    setIsReminderFormOpen(true);
  };

  const handleEditReminder = (reminder: EventReminderDataTypes) => {
    setReminderToEdit(reminder);
    setIsReminderFormOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setReminderToDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!reminderToDeleteId) return;
    try {
      await deleteReminder(reminderToDeleteId).unwrap();
      toast.success('Reminder deleted successfully!');
    } catch (err: unknown) {
      toast.error((err as { data?: { msg?: string } })?.data?.msg || 'Failed to delete reminder.');
    } finally {
      setConfirmDeleteOpen(false);
      setReminderToDeleteId(null);
    }
  };

  // UPDATED: Combined function to display event start date and time from ISO string
  const displayEventStart = (startTimeISO: string) => {
    if (!startTimeISO) return 'N/A';
    try {
      const dateObj = parseISO(startTimeISO);
      // Check if the original ISO string likely represented an all-day event (e.g., "YYYY-MM-DD")
      if (startTimeISO.length === 10 && !startTimeISO.includes('T')) {
        return `${format(dateObj, 'PPP')} (All-day)`; // e.g., "Oct 26, 2023 (All-day)"
      }
      return format(dateObj, 'PPp'); // e.g., "Oct 26, 2023, 2:30 PM"
    } catch (e) {
      console.error("Error parsing event start_time:", e);
      return "Invalid date";
    }
  };

  // Kept for created_at, updated_at, reminder_time
  const formatDisplayDateTime = (dt?: string) => {
    if (!dt) return 'N/A';
    try {
      return format(parseISO(dt), 'PPpp'); // e.g., "Oct 26, 2023, 2:30:00 PM"
    } catch (e) {
      console.error("Error parsing datetime:", e);
      return "Invalid date";
    }
  }


  return (
    <>
      <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-lg w-full max-w-4xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{event.event_title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black">×</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Event Info */}
              <div className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                <p><strong>Type:</strong> <EventTypeChip eventType={event.event_type} /></p>
                {/* UPDATED: Display for event start time */}
                <p><strong>Starts:</strong> {displayEventStart(event.start_time)}</p>
                {/* REMOVED: Separate Date and Time fields */}
                {event.case_id && <p><strong>Case ID:</strong> {event.case_id}</p>}
                {event.event_description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="whitespace-pre-wrap">{event.event_description}</p>
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Created: {formatDisplayDateTime(event.created_at)} | Updated: {formatDisplayDateTime(event.updated_at)}
                </p>
              </div>

              {/* Reminders */}
              <div className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Reminders</h3>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                    onClick={handleOpenCreateReminder}
                  >
                    + Add
                  </button>
                </div>

                {isLoading && <p className="text-center text-gray-500">Loading reminders...</p>}
                {isError && <p className="text-red-500">Error: {(error as { data?: { msg?: string } })?.data?.msg || 'Could not load reminders.'}</p>}
                {!isLoading && !isError && reminders.length === 0 && (
                  <p className="text-gray-500">No reminders set for this event.</p>
                )}
                {!isLoading && reminders.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {reminders.map(reminder => (
                      <li key={reminder.reminder_id} className="flex justify-between items-start border-b pb-1">
                        <div>
                          <p className="font-medium">{reminder.reminder_message || 'General Reminder'}</p>
                          <p className="text-sm text-gray-600">Notify at: {formatDisplayDateTime(reminder.reminder_time)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReminder(reminder)}
                            className="text-blue-500 text-sm hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(reminder.reminder_id)}
                            className="text-red-500 text-sm hover:underline"
                            disabled={isDeleting && reminderToDeleteId === reminder.reminder_id}
                          >
                            {isDeleting && reminderToDeleteId === reminder.reminder_id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Reminder form modal */}
      {isReminderFormOpen && (
        <ReminderFormModal
          open={isReminderFormOpen}
          onClose={() => setIsReminderFormOpen(false)}
          reminderToEdit={reminderToEdit}
          eventId={event.event_id}
          eventTitle={event.event_title}
          onSuccess={() => {
            setIsReminderFormOpen(false);
            toast.success('Reminder saved successfully!');
          }}
          onError={(msg?: string) => {
            toast.error(msg || 'Failed to save reminder.');
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Reminder"
        description="Are you sure you want to delete this reminder?"
      />
    </>
  );
};

export default EventDetailsModal;