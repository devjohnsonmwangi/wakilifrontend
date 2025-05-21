import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  EventDataTypes,
} from '../../../../features/events/events';
import { toast } from 'sonner';

interface ApiError {
  data?: {
    msg?: string;
    errors?: Record<string, string>;
  };
}

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  eventToEdit?: Partial<EventDataTypes> | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const getInitialFormState = (event?: Partial<EventDataTypes> | null) => ({
  event_title: event?.event_title || '',
  event_type: event?.event_type || 'meeting',
  event_date: event?.event_date || '',
  start_time: event?.start_time || '',
  event_description: event?.event_description || '',
  case_id: event?.case_id ? String(event.case_id) : '',
  user_id: 1, // MOCK: Replace with auth user
});

const EventFormModal: React.FC<EventFormModalProps> = ({
  open,
  onClose,
  eventToEdit,
}) => {
  const [formData, setFormData] = useState(getInitialFormState(eventToEdit));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormState(eventToEdit));
      setErrors({});
    }
  }, [eventToEdit, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, event_date: date ? format(date, 'yyyy-MM-dd') : '' }));
  };

  const handleTimeChange = (time: Date | null) => {
    setFormData(prev => ({ ...prev, start_time: time ? format(time, 'HH:mm:ss') : '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.event_title.trim()) newErrors.event_title = "Title is required.";
    if (!formData.event_date) newErrors.event_date = "Date is required.";
    if (!formData.start_time) newErrors.start_time = "Start time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    // Ensure dates are formatted as strings
    const payload: Partial<EventDataTypes> = {
      ...formData,
      event_date: formData.event_date ? format(parse(formData.event_date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') : undefined,
      start_time: formData.start_time ? format(parse(formData.start_time, 'HH:mm:ss', new Date()), 'HH:mm:ss') : undefined,
      case_id: formData.case_id ? Number(formData.case_id) : undefined,
      user_id: 1,
    };
  
    try {
      if (eventToEdit?.event_id) {
        await updateEvent({ event_id: eventToEdit.event_id, ...payload }).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await createEvent(payload).unwrap();
        toast.success("Event created successfully!");
      }
      onClose();
    } catch (err) {
      const error = err as ApiError; // Ensure error is defined
      console.error(error);
      toast.error(error.data?.msg || 'Failed to save event.');
      if (error.data?.errors) {
        setErrors(prev => ({ ...prev }));
      }
    }
  };
  

  const eventDateForPicker = formData.event_date ? parse(formData.event_date, 'yyyy-MM-dd', new Date()) : null;
  const startTimeForPicker = formData.start_time ? parse(formData.start_time, 'HH:mm:ss', new Date()) : null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {eventToEdit?.event_id ? 'Edit Event' : 'Create New Event'}
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title *</label>
              <input
                name="event_title"
                value={formData.event_title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.event_title && <p className="text-sm text-red-600">{errors.event_title}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Event Type *</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="meeting">Meeting</option>
                <option value="hearing">Hearing</option>
                <option value="consultation">Consultation</option>
                <option value="reminder">General Event</option>
                <option value="court_date">Court Date</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Case ID (Optional)</label>
              <input
                name="case_id"
                type="number"
                value={formData.case_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <DatePicker
                    label="Event Date"
                    value={eventDateForPicker}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.event_date,
                        helperText: errors.event_date,
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TimePicker
                    label="Start Time"
                    value={startTimeForPicker}
                    onChange={handleTimeChange}
                    ampm={false}
                    views={['hours', 'minutes', 'seconds']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.start_time,
                        helperText: errors.start_time,
                      }
                    }}
                  />
                </div>
              </div>
            </LocalizationProvider>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="event_description"
                value={formData.event_description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : eventToEdit?.event_id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
