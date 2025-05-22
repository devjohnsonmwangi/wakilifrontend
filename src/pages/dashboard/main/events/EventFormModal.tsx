// src/pages/dashboard/main/events/EventFormModal.tsx
import React, { useState, useEffect, forwardRef } from 'react';
import { format, parse, isValid, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Clock,
  Type,
  FileText,
  Briefcase,
  Save,
  X,
  Tag,
  Loader2,
} from 'lucide-react';

import {
  useCreateEventMutation,
  useUpdateEventMutation,
  EventDataTypes, // Will expect start_time as ISO string, no event_date
  EventType as RawEventType,
} from '../../../../features/events/events';

type AppEventType = RawEventType | 'meeting' | 'hearing' | 'consultation' | 'reminder' | 'court_date';

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
}

const getValidEventType = (eventType?: string): AppEventType => {
  const validTypes: AppEventType[] = ['meeting', 'hearing', 'consultation', 'reminder', 'court_date'];
  if (eventType && validTypes.includes(eventType as AppEventType)) {
    return eventType as AppEventType;
  }
  return 'meeting';
};

const getInitialFormState = (eventToEdit?: Partial<EventDataTypes> | null) => {
  let initialDateStr = '';
  let initialTimeStr = '';

  if (eventToEdit?.start_time) {
    try {
      const dt = new Date(eventToEdit.start_time);
      if (isValid(dt)) {
        initialDateStr = format(dt, 'yyyy-MM-dd');
        initialTimeStr = format(dt, 'HH:mm:ss');
      }
    } catch (e) { console.error("Error parsing eventToEdit.start_time for form", e); }
  }

  return {
    event_title: eventToEdit?.event_title || '',
    event_type: getValidEventType(eventToEdit?.event_type),
    form_date_part: initialDateStr,
    form_time_part: initialTimeStr,
    event_description: eventToEdit?.event_description || '',
    case_id: eventToEdit?.case_id ? String(eventToEdit.case_id) : '',
    user_id: 1, // MOCK
  };
};


const inputBaseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm read-only:bg-gray-50";
const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  placeholder?: string;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, onChange, hasError, placeholder }, ref) => (
    <input
      type="text"
      className={`${inputBaseClasses} ${hasError ? 'border-red-500' : ''}`}
      onClick={onClick}
      value={value}
      ref={ref}
      readOnly
      placeholder={placeholder}
      onChange={onChange}
    />
  )
);
CustomDateInput.displayName = 'CustomDateInput';


const EventFormModal: React.FC<EventFormModalProps> = ({
  open,
  onClose,
  eventToEdit,
}) => {
  const [formData, setFormData] = useState(getInitialFormState(eventToEdit));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormState(eventToEdit));
      setErrors({});
    }
  }, [eventToEdit, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'event_type' ? getValidEventType(value) : value }));
    if (errors[name]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    }
  };

  const handleDatePartChange = (date: Date | null) => {
    const newDateString = date && isValid(date) ? format(date, 'yyyy-MM-dd') : '';
    setFormData(prev => ({ ...prev, form_date_part: newDateString }));
    if (errors.start_time && newDateString && formData.form_time_part) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors.start_time; return newErrors; });
    }
  };

  const handleTimePartChange = (time: Date | null) => {
    const newTimeString = time && isValid(time) ? format(time, 'HH:mm:ss') : '';
    setFormData(prev => ({ ...prev, form_time_part: newTimeString }));
    if (errors.start_time && newTimeString && formData.form_date_part) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors.start_time; return newErrors; });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.event_title.trim()) newErrors.event_title = "Title is required.";
    if (!formData.form_date_part) newErrors.start_time = "Date is required.";
    if (!formData.form_time_part) newErrors.start_time = (newErrors.start_time || "") + " Time is required.";
    if (!formData.case_id) newErrors.case_id = "Case ID is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error("Please fill in all required fields.");
        return;
    }

    let combinedStartDateTime: Date | null = null;
    try {
        const datePart = parse(formData.form_date_part, 'yyyy-MM-dd', new Date());
        const timePart = parse(formData.form_time_part, 'HH:mm:ss', new Date());

        if (isValid(datePart) && isValid(timePart)) {
            let tempDate = startOfDay(datePart);
            tempDate = setHours(tempDate, timePart.getHours());
            tempDate = setMinutes(tempDate, timePart.getMinutes());
            tempDate = setSeconds(tempDate, timePart.getSeconds());
            combinedStartDateTime = tempDate;
        }
    } catch (e) { console.error("Error combining date and time for submission", e); }

    if (!combinedStartDateTime || !isValid(combinedStartDateTime)) {
        setErrors(prev => ({ ...prev, start_time: "Invalid date or time combination." }));
        toast.error("Invalid date or time selected.");
        return;
    }

    // Payload type to match what RTK Query createEvent/updateEvent expects
    // (excluding event_id, created_at, updated_at for creation)
    type EventCreationPayload = Omit<EventDataTypes, 'event_id' | 'created_at' | 'updated_at' | 'event_date'> & { event_date?: never };


    const payload: EventCreationPayload = {
      event_title: formData.event_title,
      event_type: formData.event_type,
      start_time: combinedStartDateTime.toISOString(), // Key field for datetime
      // event_date is removed from payload
      event_description: formData.event_description,
      case_id: Number(formData.case_id),
      user_id: Number(formData.user_id),
    };

    try {
      if (eventToEdit?.event_id) {
        // For update, the payload type might be Partial of EventDataTypes, but still excluding event_date
        type EventUpdatePayload = Partial<Omit<EventDataTypes, 'event_id' | 'created_at' | 'updated_at' | 'event_date'>> & { event_date?: never };
        await updateEvent({ event_id: eventToEdit.event_id, ...(payload as EventUpdatePayload) }).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await createEvent(payload).unwrap();
        toast.success("Event created successfully!");
      }
      onClose();
    } catch (err) {
      const error = err as ApiError;
      console.error("Failed to save event:", error);
      const errorMessage = error.data?.msg || 'Failed to save event. Please try again.';
      toast.error(errorMessage);
      if (error.data?.errors) {
        setErrors(prev => ({ ...prev, ...error.data!.errors! }));
      }
    }
  };

  const selectedDateForPicker = formData.form_date_part ? parse(formData.form_date_part, 'yyyy-MM-dd', new Date()) : null;
  const selectedTimeForPicker = formData.form_time_part
    ? parse(formData.form_time_part, 'HH:mm:ss', new Date())
    : null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {eventToEdit?.event_id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              className="p-6 space-y-5"
            >
              <div>
                <label htmlFor="event_title" className={labelBaseClasses}>
                  <Type size={14} className="inline mr-1 mb-0.5" /> Title *
                </label>
                <input id="event_title" name="event_title" value={formData.event_title} onChange={handleChange}
                  className={`${inputBaseClasses} ${errors.event_title ? 'border-red-500' : ''}`} placeholder="e.g., Client Meeting" />
                {errors.event_title && <p className="mt-1 text-xs text-red-600">{errors.event_title}</p>}
              </div>
              <div>
                <label htmlFor="event_type" className={labelBaseClasses}>
                  <Tag size={14} className="inline mr-1 mb-0.5" /> Event Type *
                </label>
                <select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange}
                  className={`${inputBaseClasses} ${errors.event_type ? 'border-red-500' : ''}`}>
                  <option value="meeting">Meeting</option>
                  <option value="hearing">Hearing</option>
                  <option value="consultation">Consultation</option>
                  <option value="reminder">General Event/Reminder</option>
                  <option value="court_date">Court Date</option>
                </select>
                {errors.event_type && <p className="mt-1 text-xs text-red-600">{errors.event_type}</p>}
              </div>
              <div>
                <label htmlFor="case_id" className={labelBaseClasses}>
                  <Briefcase size={14} className="inline mr-1 mb-0.5" /> Case ID *
                </label>
                <input id="case_id" name="case_id" type="number" value={formData.case_id} onChange={handleChange}
                  className={`${inputBaseClasses} ${errors.case_id ? 'border-red-500' : ''}`} placeholder="e.g., 123" />
                {errors.case_id && <p className="mt-1 text-xs text-red-600">{errors.case_id}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="form_date_part" className={labelBaseClasses}> {/* Changed htmlFor */}
                    <CalendarIcon size={14} className="inline mr-1 mb-0.5" /> Date *
                  </label>
                  <DatePicker
                    id="form_date_part" // Changed id
                    selected={selectedDateForPicker && isValid(selectedDateForPicker) ? selectedDateForPicker : null}
                    onChange={handleDatePartChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date (YYYY-MM-DD)"
                    customInput={<CustomDateInput hasError={!!errors.start_time && errors.start_time.includes("Date")} />}
                    wrapperClassName="w-full"
                    isClearable showPopperArrow={false} />
                </div>
                <div>
                  <label htmlFor="form_time_part" className={labelBaseClasses}> {/* Changed htmlFor */}
                    <Clock size={14} className="inline mr-1 mb-0.5" /> Time *
                  </label>
                  <DatePicker
                    id="form_time_part" // Changed id
                    selected={selectedTimeForPicker && isValid(selectedTimeForPicker) ? selectedTimeForPicker : null}
                    onChange={handleTimePartChange}
                    showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                    dateFormat="HH:mm:ss" timeFormat="HH:mm:ss" placeholderText="Select time (HH:MM:SS)"
                    customInput={<CustomDateInput hasError={!!errors.start_time && errors.start_time.includes("Time")} />}
                    wrapperClassName="w-full"
                    isClearable showPopperArrow={false} />
                </div>
              </div>
              {errors.start_time && <p className="mt-1 text-xs text-red-600">{errors.start_time}</p>}

              <div>
                <label htmlFor="event_description" className={labelBaseClasses}>
                  <FileText size={14} className="inline mr-1 mb-0.5" /> Description
                </label>
                <textarea id="event_description" name="event_description" value={formData.event_description}
                  onChange={handleChange} rows={3}
                  className={`${inputBaseClasses} ${errors.event_description ? 'border-red-500' : ''}`}
                  placeholder="Add any relevant details..." />
                {errors.event_description && <p className="mt-1 text-xs text-red-600">{errors.event_description}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                  <X size={16} className="inline mr-1.5" /> Cancel
                </button>
                <button type="submit" disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center">
                  {isLoading ? (<Loader2 size={16} className="inline mr-1.5 animate-spin" />) : (<Save size={16} className="inline mr-1.5" />)}
                  {isLoading ? 'Saving...' : (eventToEdit?.event_id ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventFormModal;