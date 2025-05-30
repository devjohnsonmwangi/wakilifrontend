import React, { useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'sonner';
import { format, parseISO, isValid } from 'date-fns'; // Added isValid
import {
  X as XIcon,
  Info,
  CalendarDays,
  Clock,
  FileText,
  Tag,
  BellRing,
  PlusCircle,
  Edit3,
 // Trash2,
  Loader2, // For loading states on buttons
  AlertCircle, // For error states
} from 'lucide-react'; // Added more icons

import {
  EventDataTypes,
  EventReminderDataTypes,
  useFetchRemindersQuery,
 // useDeleteReminderMutation,
} from '../../../../features/events/events'; // Path should be correct

import ReminderFormModal from './ReminderFormModal'; // Assumed to be dark-mode ready
import EventTypeChip from './components/EventTypeChip'; // Assumed to be dark-mode ready
//import ConfirmationDialog from './components/ConfirmationDialog'; // Assumed to be dark-mode ready

interface Props {
  currentUserId?: number; // Not currently used, but kept
  open: boolean;
  onClose: () => void;
  event: EventDataTypes;
  onEditEvent?: (event: EventDataTypes) => void; // Optional, if you add UI for it
  onDeleteEvent?: (eventId: number) => void;   // Optional, if you add UI for it
  // onSuccess/onError are passed to ReminderFormModal. Delete in this modal uses toast directly.
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const EventDetailsModal: React.FC<Props> = ({
  open,
  onClose,
  event,
  onSuccess, // Passed to ReminderFormModal
  onError,   // Passed to ReminderFormModal
}) => {
  const { data: allReminders, isLoading: isLoadingReminders, isError: isRemindersError, error: remindersErrorObj } = useFetchRemindersQuery(undefined, { skip: !open || !event?.event_id });
  //const [deleteReminder, { isLoading: isDeletingReminder }] = useDeleteReminderMutation();

  const reminders = useMemo(
    () => allReminders?.filter(r => r.event_id === event.event_id) || [],
    [allReminders, event.event_id]
  );

  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<EventReminderDataTypes | null>(null);
 // const [confirmDeleteReminderOpen, setConfirmDeleteReminderOpen] = useState(false);
  //onst [reminderToDeleteId, setReminderToDeleteId] = useState<number | null>(null);

  const handleOpenCreateReminder = () => {
    setReminderToEdit(null);
    setIsReminderFormOpen(true);
  };

  const handleEditReminder = (reminder: EventReminderDataTypes) => {
    setReminderToEdit(reminder);
    setIsReminderFormOpen(true);
  };

  // const handleDeleteReminderRequest = (id: number) => {
  //   setReminderToDeleteId(id);
  //   setConfirmDeleteReminderOpen(true);
  // };

 

  const displayEventStart = (startTimeISO: string) => {
    if (!startTimeISO) return 'N/A';
    try {
      const dateObj = parseISO(startTimeISO);
      if (!isValid(dateObj)) return "Invalid date";
      if (startTimeISO.length === 10 && !startTimeISO.includes('T')) {
        return `${format(dateObj, 'PPP')} (All-day)`;
      }
      return format(dateObj, 'PPP p'); // e.g., "Oct 26, 2023, 2:30 PM" - using 'p' for locale-friendly time
    } catch (e) {
      console.error("Error parsing event start_time:", e);
      return "Invalid date";
    }
  };

  const formatDisplayDateTime = (dt?: string) => {
    if (!dt) return 'N/A';
    try {
      const dateObj = parseISO(dt);
      if (!isValid(dateObj)) return "Invalid date";
      return format(dateObj, 'MMM d, yyyy, h:mm a'); // More readable format
    } catch (e) {
      console.error("Error parsing datetime:", e);
      return "Invalid date";
    }
  };

  const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | React.ReactNode; className?: string }> = ({
    icon: Icon,
    label,
    value,
    className = ''
  }) => (
    value ? (
      <div className={`flex items-start ${className}`}>
        <Icon className="w-4 h-4 mr-2.5 mt-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
        <div>
          <span className="font-medium text-slate-700 dark:text-slate-300">{label}:</span>
          <div className="text-slate-600 dark:text-slate-400 ml-1 inline-block">{value}</div>
        </div>
      </div>
    ) : null
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" />

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left align-middle shadow-2xl transition-all">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <Dialog.Title as="h3" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {event.event_title}
              </Dialog.Title>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                aria-label="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Event Info Section */}
              <section className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" /> Event Details
                </h4>
                <div className="space-y-3">
                  <DetailItem icon={Tag} label="Type" value={<EventTypeChip eventType={event.event_type} />} />
                  <DetailItem icon={CalendarDays} label="Starts" value={displayEventStart(event.start_time)} />
                  {event.case_id && <DetailItem icon={FileText} label="Case ID" value={String(event.case_id)} />}
                  {event.event_description && (
                    <div className="flex items-start">
                       <FileText className="w-4 h-4 mr-2.5 mt-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                       <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Description:</span>
                        <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400 mt-0.5">{event.event_description}</p>
                       </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
                    Created: {formatDisplayDateTime(event.created_at)} | Updated: {formatDisplayDateTime(event.updated_at)}
                  </p>
                </div>
              </section>

              {/* Reminders Section */}
              <section className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <BellRing className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" /> Reminders
                  </h4>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
                    onClick={handleOpenCreateReminder}
                  >
                    <PlusCircle className="w-4 h-4" /> Add Reminder
                  </button>
                </div>

                {isLoadingReminders && (
                  <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 py-4">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading reminders...
                  </div>
                )}
                {isRemindersError && (
                  <div className="flex items-center text-red-600 dark:text-red-400 py-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                     <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0"/> 
                     {(remindersErrorObj as { data?: { msg?: string } })?.data?.msg || 'Could not load reminders.'}
                  </div>
                )}
                {!isLoadingReminders && !isRemindersError && reminders.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">No reminders set for this event.</p>
                )}
                {!isLoadingReminders && reminders.length > 0 && (
                  <ul className="space-y-3">
                    {reminders.map(reminder => (
                      <li key={reminder.reminder_id} className="p-3 bg-white dark:bg-slate-700/50 rounded-md shadow-sm border border-slate-200 dark:border-slate-600/80 flex justify-between items-start gap-3">
                        <div className="flex-grow">
                          <p className="font-medium text-slate-800 dark:text-slate-100">{reminder.reminder_message || 'General Reminder'}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                            <Clock className="w-3.5 h-3.5 mr-1.5" /> {formatDisplayDateTime(reminder.reminder_time)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <button
                            onClick={() => handleEditReminder(reminder)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                            aria-label="Edit reminder"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {/* <button
                            onClick={() => handleDeleteReminderRequest(reminder.reminder_id)}
                            className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            disabled={isDeletingReminder && reminderToDeleteId === reminder.reminder_id}
                            aria-label="Delete reminder"
                          >
                            {isDeletingReminder && reminderToDeleteId === reminder.reminder_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Reminder Form Modal */}
      {isReminderFormOpen && event && (
        <ReminderFormModal
          open={isReminderFormOpen}
          onClose={() => setIsReminderFormOpen(false)}
          reminderToEdit={reminderToEdit}
          eventId={event.event_id}
          eventTitle={event.event_title}
          onSuccess={(message) => {
            setIsReminderFormOpen(false);
            toast.success(message || 'Reminder saved successfully!');
            if (onSuccess) onSuccess(message || 'Reminder saved successfully!');
          }}
          onError={(msg?: string) => {
            toast.error(msg || 'Failed to save reminder.');
            if (onError) onError(msg || 'Failed to save reminder.');
          }}
        />
      )}

      {/* Confirmation Dialog for Reminder Deletion */}
     
    </>
  );
};

export default EventDetailsModal;