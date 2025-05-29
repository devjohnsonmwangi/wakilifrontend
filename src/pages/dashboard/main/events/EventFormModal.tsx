// src/pages/dashboard/main/events/EventFormModal.tsx
import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, parse, isValid, setHours, setMinutes, setSeconds, startOfDay, parseISO } from 'date-fns'; // Added parseISO
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Base styles
// import '../styles/datepicker-theme.css'; // IF YOU CREATED A SEPARATE CSS FILE FOR DATEPICKER, IMPORT IT
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Clock,
  Type as TypeIcon, // Renamed to avoid conflict with type keyword
  FileText,
  Briefcase,
  Save,
  X as XIcon,
  Tag,
  Loader2,
  User, // Icon for User ID (though not directly editable)
} from 'lucide-react';

import {
  useCreateEventMutation,
  useUpdateEventMutation,
  EventDataTypes,
  EventType as RawEventType,
} from '../../../../features/events/events';
import { selectCurrentUserId } from '../../../../features/users/userSlice';

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
  //currentUserId: number;
  // currentUserId prop is removed as we get it from Redux
}

const getValidEventType = (eventType?: string): AppEventType => {
  const validTypes: AppEventType[] = ['meeting', 'hearing', 'consultation', 'reminder', 'court_date'];
  if (eventType && validTypes.includes(eventType as AppEventType)) {
    return eventType as AppEventType;
  }
  return 'meeting'; // Default event type
};

const getInitialFormState = (
  eventToEdit?: Partial<EventDataTypes> | null,
  currentUserId?: number | null
) => {
  let initialDateStr = '';
  let initialTimeStr = '';

  if (eventToEdit?.start_time) {
    try {
      const dt = parseISO(eventToEdit.start_time); // Use parseISO for reliability
      if (isValid(dt)) {
        initialDateStr = format(dt, 'yyyy-MM-dd');
        // Check if original was all-day (time part can be omitted or set to 00:00:00)
        if (eventToEdit.start_time.length === 10 && !eventToEdit.start_time.includes('T')) {
          initialTimeStr = '00:00:00'; // Or '00:00' if you prefer HH:mm for time picker
        } else {
          initialTimeStr = format(dt, 'HH:mm:ss'); // Or 'HH:mm'
        }
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
    user_id: eventToEdit?.user_id || currentUserId || 0,
  };
};

// Enhanced base classes
const baseInputStyles = "block w-full text-sm rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-150";
const labelBaseClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center";
const formFieldWrapperClasses = "space-y-1"; // For consistent spacing around label and input

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  // onChange is not typically needed here as DatePicker controls it
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, hasError, placeholder, disabled }, ref) => (
    <input
      type="text"
      className={`${baseInputStyles} px-3 py-2.5 border ${ // Consistent padding
        hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                 : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
      } focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 cursor-pointer read-only:bg-slate-100 dark:read-only:bg-slate-600`}
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


const EventFormModal: React.FC<EventFormModalProps> = ({
  open,
  onClose,
  eventToEdit,
}) => {
  const currentUserIdFromStore = useSelector(selectCurrentUserId);
  const currentUserId = typeof currentUserIdFromStore === 'number' ? currentUserIdFromStore : null;


  const initialFormState = useMemo(() => getInitialFormState(eventToEdit, currentUserId), [eventToEdit, currentUserId]);

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const anyOperationLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormState(eventToEdit, currentUserId));
      setErrors({});
    }
  }, [eventToEdit, open, currentUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'event_type' ? getValidEventType(value) : value }));
    if (errors[name] && value.trim()) {
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
    // Using HH:mm for user display/input, backend will get full ISO.
    const newTimeString = time && isValid(time) ? format(time, 'HH:mm') : '';
    setFormData(prev => ({ ...prev, form_time_part: newTimeString }));
    if (errors.start_time && newTimeString && formData.form_date_part) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors.start_time; return newErrors; });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.event_title.trim()) newErrors.event_title = "Title is required.";
    if (!formData.form_date_part) newErrors.start_time = "Date is required.";
    if (!formData.form_time_part) {
        newErrors.start_time = (newErrors.start_time || "") + (newErrors.start_time ? " and Time are required." : "Time is required.");
    }
    if (!formData.case_id || isNaN(Number(formData.case_id))) newErrors.case_id = "A valid Case ID is required.";
    if (!formData.user_id) newErrors.user_id = "User information is missing. Please re-login or refresh.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error("Please check the form for errors.");
        return;
    }

    if (!formData.user_id) { // Double check, though validateForm should catch it
        toast.error("User information is missing. Cannot save event.");
        return;
    }

    let combinedStartDateTime: Date | null = null;
    try {
        const datePartDate = parse(formData.form_date_part, 'yyyy-MM-dd', new Date());
        const timePartDate = parse(formData.form_time_part, 'HH:mm', new Date()); // Parsed from HH:mm

        if (isValid(datePartDate) && isValid(timePartDate)) {
            let tempDate = startOfDay(datePartDate);
            tempDate = setHours(tempDate, timePartDate.getHours());
            tempDate = setMinutes(tempDate, timePartDate.getMinutes());
            tempDate = setSeconds(tempDate, 0); // Explicitly set seconds to 0
            combinedStartDateTime = tempDate;
        }
    } catch (e) { console.error("Error combining date and time for submission", e); }

    if (!combinedStartDateTime || !isValid(combinedStartDateTime)) {
        setErrors(prev => ({ ...prev, start_time: "Invalid date or time combination." }));
        toast.error("Invalid date or time selected.");
        return;
    }

    interface EventPayloadForApi {
        event_title: string;
        event_type: AppEventType;
        start_time: string;
        event_description?: string;
        case_id: number;
        user_id: number;
    }

    const payload: EventPayloadForApi = {
      event_title: formData.event_title.trim(),
      event_type: formData.event_type,
      start_time: combinedStartDateTime.toISOString(),
      event_description: formData.event_description?.trim() || undefined, // Send undefined if empty
      case_id: Number(formData.case_id),
      user_id: Number(formData.user_id),
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
      const error = err as ApiError;
      console.error("Failed to save event:", error);
      const errorMessage = error.data?.msg || 'Failed to save event. Please try again.';
      toast.error(errorMessage);
      if (error.data?.errors) {
        setErrors(prev => ({ ...prev, ...error.data!.errors! }));
      }
    }
  };

  const selectedDateForPicker = useMemo(() =>
    formData.form_date_part ? parse(formData.form_date_part, 'yyyy-MM-dd', new Date()) : null,
    [formData.form_date_part]
  );

  const selectedTimeForPicker = useMemo(() =>
    formData.form_time_part ? parse(formData.form_time_part, 'HH:mm', new Date()) : null, // Expects HH:mm
    [formData.form_time_part]
  );

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  const buttonBaseClasses = "px-4 py-2.5 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 p-4"
          onClick={() => !anyOperationLoading && onClose()}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {eventToEdit?.event_id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={() => !anyOperationLoading && onClose()} 
                disabled={anyOperationLoading}
                className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 transition-colors" 
                aria-label="Close modal">
                <XIcon size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              <div className={formFieldWrapperClasses}>
                <label htmlFor="event_title" className={labelBaseClasses}>
                  <TypeIcon size={15} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Title *
                </label>
                <input id="event_title" name="event_title" value={formData.event_title} onChange={handleChange} disabled={anyOperationLoading}
                  className={`${baseInputStyles} px-3 py-2.5 border ${errors.event_title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'} focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200`} 
                  placeholder="e.g., Client Meeting" />
                {errors.event_title && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.event_title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                <div className={formFieldWrapperClasses}>
                  <label htmlFor="event_type" className={labelBaseClasses}>
                    <Tag size={15} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Event Type *
                  </label>
                  <select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange} disabled={anyOperationLoading}
                    className={`${baseInputStyles} px-3 py-2.5 border ${errors.event_type ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'} focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 appearance-none`}>
                    <option value="meeting">Meeting</option>
                    <option value="hearing">Hearing</option>
                    <option value="consultation">Consultation</option>
                    <option value="reminder">General Event/Reminder</option>
                    <option value="court_date">Court Date</option>
                  </select>
                  {errors.event_type && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.event_type}</p>}
                </div>
                <div className={formFieldWrapperClasses}>
                  <label htmlFor="case_id" className={labelBaseClasses}>
                    <Briefcase size={15} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Case ID *
                  </label>
                  <input id="case_id" name="case_id" type="number" value={formData.case_id} onChange={handleChange} disabled={anyOperationLoading}
                    className={`${baseInputStyles} px-3 py-2.5 border ${errors.case_id ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'} focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200`} 
                    placeholder="e.g., 123" />
                  {errors.case_id && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.case_id}</p>}
                </div>
              </div>

              <div className={formFieldWrapperClasses}> {/* Group for Date/Time and their shared error */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                    <div>
                        <label htmlFor="form_date_part" className={labelBaseClasses}>
                            <CalendarIcon size={15} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Date *
                        </label>
                        <DatePicker
                            id="form_date_part"
                            selected={selectedDateForPicker && isValid(selectedDateForPicker) ? selectedDateForPicker : null}
                            onChange={handleDatePartChange}
                            dateFormat="yyyy-MM-dd"
                            customInput={<CustomDateInput hasError={!!errors.start_time?.includes("Date")} placeholder="YYYY-MM-DD" disabled={anyOperationLoading}/>}
                            wrapperClassName="w-full"
                            disabled={anyOperationLoading}
                            isClearable showPopperArrow={false} popperPlacement="bottom-start"
                        />
                    </div>
                    <div>
                        <label htmlFor="form_time_part" className={labelBaseClasses}>
                            <Clock size={15} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Time *
                        </label>
                        <DatePicker
                            id="form_time_part"
                            selected={selectedTimeForPicker && isValid(selectedTimeForPicker) ? selectedTimeForPicker : null}
                            onChange={handleTimePartChange}
                            showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time"
                            dateFormat="HH:mm" // User sees HH:mm
                            customInput={<CustomDateInput hasError={!!errors.start_time?.includes("Time")} placeholder="HH:MM" disabled={anyOperationLoading}/>}
                            wrapperClassName="w-full"
                            disabled={anyOperationLoading}
                            isClearable showPopperArrow={false} popperPlacement="bottom-start"
                        />
                    </div>
                </div>
                {errors.start_time && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.start_time}</p>}
              </div>

              <div className={formFieldWrapperClasses}>
                <label htmlFor="event_description" className={labelBaseClasses}>
                  <FileText size={15} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Description
                </label>
                <textarea id="event_description" name="event_description" value={formData.event_description} disabled={anyOperationLoading}
                  onChange={handleChange} rows={4}
                  className={`${baseInputStyles} px-3 py-2.5 border ${errors.event_description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'} focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200`}
                  placeholder="Add any relevant details..." />
                {errors.event_description && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.event_description}</p>}
              </div>
              
              {/* User ID Info - Non-editable, for info/debugging or if there's an error */}
              {errors.user_id && (
                 <div className={`${formFieldWrapperClasses} p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-700`}>
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                        <User size={14} className="mr-2" /> {errors.user_id}
                    </p>
                 </div>
              )}


              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
                <button type="button" onClick={() => !anyOperationLoading && onClose()} disabled={anyOperationLoading}
                  className={`${buttonBaseClasses} text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500 focus:ring-slate-400`}>
                  <XIcon size={16} /> Cancel
                </button>
                <button type="submit" disabled={anyOperationLoading || !formData.user_id}
                  className={`${buttonBaseClasses} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-700/50 disabled:cursor-not-allowed`}>
                  {anyOperationLoading ? (<Loader2 size={16} className="animate-spin" />) : (<Save size={16} />)}
                  {anyOperationLoading ? 'Saving...' : (eventToEdit?.event_id ? 'Update Event' : 'Create Event')}
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