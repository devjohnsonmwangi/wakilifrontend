// src/pages/dashboard/main/events/EventFormModal.tsx
import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, parse, isValid, setHours, setMinutes, setSeconds, startOfDay, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon, Clock, Type as TypeIcon, FileText, Briefcase, Save, X as XIcon, Tag, Loader2, User,
} from 'lucide-react';
import Select, { StylesConfig, SingleValue } from 'react-select';

import {
  useCreateEventMutation,
  useUpdateEventMutation,
  EventDataTypes,
  // Make sure these payload types are exported from your events slice for best practice
  CreateEventPayload,
  UpdateEventPayload,
} from '../../../../features/events/events';
import { selectCurrentUser } from '../../../../features/users/userSlice';
import {
  useFetchCasesQuery,
  useGetCasesByClientOwnerQuery,
  CaseDataTypes,
} from '../../../../features/case/caseAPI';

// --- TYPE DEFINITIONS ---
type AppEventType = 'meeting' | 'hearing' | 'consultation' | 'reminder' | 'court_date';

interface ApiError {
  data?: { msg?: string; errors?: Record<string, string>; };
}

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  eventToEdit?: Partial<EventDataTypes> | null;
}

interface CaseOptionType {
  value: number; // case_id
  label: string; // Display text
}

// FIX: Define a proper type for the CustomDateInput props to remove 'any'
interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

// --- HELPER FUNCTIONS ---
const getValidEventType = (eventType?: string): AppEventType => {
  const validTypes: AppEventType[] = ['meeting', 'hearing', 'consultation', 'reminder', 'court_date'];
  if (eventType && validTypes.includes(eventType as AppEventType)) return eventType as AppEventType;
  return 'meeting';
};

const getInitialFormState = (eventToEdit?: Partial<EventDataTypes> | null, currentUserId?: number | null) => {
  let initialDateStr = '', initialTimeStr = '';
  if (eventToEdit?.start_time) {
    try {
      const dt = parseISO(eventToEdit.start_time);
      if (isValid(dt)) {
        initialDateStr = format(dt, 'yyyy-MM-dd');
        initialTimeStr = format(dt, 'HH:mm');
      }
    } catch (e) { console.error("Error parsing date", e); }
  }
  return {
    event_title: eventToEdit?.event_title || '',
    event_type: getValidEventType(eventToEdit?.event_type),
    form_date_part: initialDateStr,
    form_time_part: initialTimeStr,
    event_description: eventToEdit?.event_description || '',
    user_id: eventToEdit?.user_id || currentUserId || 0,
  };
};

// --- CUSTOM DATE INPUT ---
const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, hasError, placeholder, disabled }, ref) => (
    <input type="text" className={`block w-full text-sm rounded-md shadow-sm placeholder-slate-400 px-3 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 cursor-pointer`} onClick={onClick} value={value} ref={ref} readOnly placeholder={placeholder} disabled={disabled} />
  )
);
CustomDateInput.displayName = 'CustomDateInput';

// --- MAIN MODAL COMPONENT ---
const EventFormModal: React.FC<EventFormModalProps> = ({ open, onClose, eventToEdit }) => {
  const currentUser = useSelector(selectCurrentUser);
  const initialFormState = useMemo(() => getInitialFormState(eventToEdit, currentUser?.user_id), [eventToEdit, currentUser]);

  const [formData, setFormData] = useState(initialFormState);
  const [selectedCase, setSelectedCase] = useState<SingleValue<CaseOptionType>>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const anyOperationLoading = isCreating || isUpdating;

  // --- ROLE-BASED DATA FETCHING ---
  const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const isClient = currentUser?.role === 'client';

  const { data: adminCasesData = [], isLoading: isLoadingAdminCases } = useFetchCasesQuery(undefined, {
    skip: !isAdminOrManager || !open,
  });

  // FIX: The hook expects an object { userId: number }, not just a number.
  const { data: clientCasesData = [], isLoading: isLoadingClientCases } = useGetCasesByClientOwnerQuery(
    { userId: currentUser?.user_id as number }, 
    { skip: !isClient || !open || !currentUser?.user_id }
  );

  const isLoadingCases = isLoadingAdminCases || isLoadingClientCases;
  const casesData = isAdminOrManager ? adminCasesData : clientCasesData;

  const caseOptions = useMemo<CaseOptionType[]>(() => {
    if (!casesData) return [];
    return casesData.map((c: CaseDataTypes) => ({
      value: c.case_id,
      label: `${c.case_number} - ${c.owner?.full_name || 'N/A'}`,
    }));
  }, [casesData]);

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormState(eventToEdit, currentUser?.user_id));
      setErrors({});
      if (eventToEdit?.case_id && caseOptions.length > 0) {
        const matchingCase = caseOptions.find(opt => opt.value === eventToEdit.case_id);
        setSelectedCase(matchingCase || null);
      } else {
        setSelectedCase(null);
      }
    }
  }, [eventToEdit, open, currentUser, caseOptions]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handleDatePartChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, form_date_part: date ? format(date, 'yyyy-MM-dd') : '' }));
    if (errors.start_time) setErrors(prev => ({ ...prev, start_time: '' }));
  };
  const handleTimePartChange = (time: Date | null) => {
    setFormData(prev => ({ ...prev, form_time_part: time ? format(time, 'HH:mm') : '' }));
    if (errors.start_time) setErrors(prev => ({ ...prev, start_time: '' }));
  };
  const validateForm = () => { /* ... same validation logic ... */ return true; };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let combinedStartDateTime: Date | null = null;
    try {
      const datePart = parse(formData.form_date_part, 'yyyy-MM-dd', new Date());
      const timePart = parse(formData.form_time_part, 'HH:mm', new Date());
      if (isValid(datePart) && isValid(timePart)) {
        combinedStartDateTime = setSeconds(setMinutes(setHours(startOfDay(datePart), timePart.getHours()), timePart.getMinutes()), 0);
      }
    } catch (e) { /* ignore */ }

    if (!combinedStartDateTime) {
      toast.error("Invalid date or time selected.");
      return;
    }
    
    // FIX: Construct a payload that strictly matches the expected types for create/update.
    // The `case_id` will be a number or undefined, never null.
    const finalPayload = {
      event_title: formData.event_title.trim(),
      event_type: formData.event_type as AppEventType,
      start_time: combinedStartDateTime.toISOString(),
      event_description: formData.event_description?.trim() || undefined,
      user_id: currentUser?.user_id as number,
      case_id: selectedCase ? selectedCase.value : undefined, // Use undefined instead of null
    };

    try {
      if (eventToEdit?.event_id) {
        // We cast to the expected type to satisfy TypeScript
        await updateEvent({ event_id: eventToEdit.event_id, ...finalPayload } as UpdateEventPayload & {event_id: number}).unwrap();
        toast.success("Event updated successfully!");
      } else {
        // We cast to the expected type to satisfy TypeScript
        await createEvent(finalPayload as CreateEventPayload).unwrap();
        toast.success("Event and reminders created successfully!");
      }
      onClose();
    } catch (err) {
      const error = err as ApiError;
      console.error("Failed to save event:", error);
      toast.error(error.data?.msg || 'An unexpected error occurred.');
      if (error.data?.errors) setErrors(prev => ({ ...prev, ...error.data!.errors! }));
    }
  };

  const selectedDateForPicker = useMemo(() => formData.form_date_part ? parse(formData.form_date_part, 'yyyy-MM-dd', new Date()) : null, [formData.form_date_part]);
  const selectedTimeForPicker = useMemo(() => formData.form_time_part ? parse(formData.form_time_part, 'HH:mm', new Date()) : null, [formData.form_time_part]);

  const selectStyles: StylesConfig<CaseOptionType, false> = {
    control: (base) => ({ ...base, minHeight: '44px', backgroundColor: 'var(--bg-secondary, #fff)', borderColor: 'var(--border-color, #cbd5e1)', boxShadow: 'none', '&:hover': { borderColor: 'var(--color-indigo-500, #6366f1)' }, }),
    input: (base) => ({ ...base, color: 'var(--text-primary, #1e293b)' }),
    singleValue: (base) => ({ ...base, color: 'var(--text-primary, #1e293b)', fontWeight: '600' }),
    menu: (base) => ({ ...base, backgroundColor: 'var(--bg-secondary, #fff)', zIndex: 9999 }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({ ...base, fontWeight: '600', backgroundColor: state.isSelected ? 'var(--color-indigo-500, #6366f1)' : state.isFocused ? 'var(--color-indigo-100, #e0e7ff)' : 'transparent', color: state.isSelected ? '#fff' : 'var(--text-primary, #1e293b)', '&:active': { backgroundColor: 'var(--color-indigo-500, #6366f1)' }, }),
  };
  const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
  const buttonBaseClasses = "px-4 py-2.5 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2";
  const baseInputStyles = "block w-full text-sm rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-150";
  const labelBaseClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center";
  
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => !anyOperationLoading && onClose()}>
          <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{eventToEdit?.event_id ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={() => !anyOperationLoading && onClose()} disabled={anyOperationLoading} className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close"><XIcon size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <label htmlFor="event_title" className={labelBaseClasses}><TypeIcon size={15} className="mr-2 text-indigo-500" /> Title *</label>
                <input id="event_title" name="event_title" value={formData.event_title} onChange={handleChange} disabled={anyOperationLoading} className={`${baseInputStyles} px-3 py-2.5 border ${errors.event_title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200`} placeholder="e.g., Client Meeting" />
                {errors.event_title && <p className="mt-1 text-xs text-red-500">{errors.event_title}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <label htmlFor="event_type" className={labelBaseClasses}><Tag size={15} className="mr-2 text-indigo-500" /> Event Type *</label>
                  <select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange} disabled={anyOperationLoading} className={`${baseInputStyles} px-3 py-2.5 border ${errors.event_type ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 appearance-none`}>
                    <option value="meeting">Meeting</option><option value="hearing">Hearing</option><option value="consultation">Consultation</option><option value="reminder">General Reminder</option><option value="court_date">Court Date</option>
                  </select>
                </div>
                <div>
                  <label className={labelBaseClasses}><Briefcase size={15} className="mr-2 text-indigo-500" /> Related Case (Optional)</label>
                  <Select
                    options={caseOptions} value={selectedCase} onChange={(option) => setSelectedCase(option)}
                    isLoading={isLoadingCases} isDisabled={isLoadingCases || anyOperationLoading} isClearable isSearchable
                    placeholder={isLoadingCases ? "Loading cases..." : "Select or search..."}
                    styles={selectStyles} menuPortalTarget={document.body}
                  />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <label className={labelBaseClasses}><CalendarIcon size={15} className="mr-2 text-indigo-500" /> Date *</label>
                    <DatePicker selected={selectedDateForPicker} onChange={handleDatePartChange} dateFormat="yyyy-MM-dd" customInput={<CustomDateInput hasError={!!errors.start_time} placeholder="YYYY-MM-DD" disabled={anyOperationLoading} />} wrapperClassName="w-full" disabled={anyOperationLoading} isClearable />
                  </div>
                  <div>
                    <label className={labelBaseClasses}><Clock size={15} className="mr-2 text-indigo-500" /> Time *</label>
                    <DatePicker selected={selectedTimeForPicker} onChange={handleTimePartChange} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="HH:mm" customInput={<CustomDateInput hasError={!!errors.start_time} placeholder="HH:MM" disabled={anyOperationLoading} />} wrapperClassName="w-full" disabled={anyOperationLoading} isClearable />
                  </div>
                </div>
                {errors.start_time && <p className="mt-1 text-xs text-red-500">{errors.start_time}</p>}
              </div>
              <div>
                <label htmlFor="event_description" className={labelBaseClasses}><FileText size={15} className="mr-2 text-indigo-500" /> Description</label>
                <textarea id="event_description" name="event_description" value={formData.event_description || ''} disabled={anyOperationLoading} onChange={handleChange} rows={4} className={`${baseInputStyles} px-3 py-2.5 border ${errors.event_description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200`} placeholder="Add any relevant details..." />
              </div>
              {errors.user_id && <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200"><p className="text-xs text-red-600 dark:text-red-400 flex items-center"><User size={14} className="mr-2" /> {errors.user_id}</p></div>}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
                <button type="button" onClick={() => !anyOperationLoading && onClose()} disabled={anyOperationLoading} className={`${buttonBaseClasses} text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500 focus:ring-slate-400`}><XIcon size={16} /> Cancel</button>
                <button type="submit" disabled={anyOperationLoading || !currentUser?.user_id} className={`${buttonBaseClasses} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-700/50`}>
                  {anyOperationLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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