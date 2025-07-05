// src/pages/dashboard/main/events/EventFormModal.tsx
import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, parse, isValid, setHours, setMinutes, setSeconds, startOfDay, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EventFormModal.css'; // We'll add a small CSS file for the date picker theme
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon, Clock, Type as TypeIcon, FileText, Briefcase, Save, X as XIcon, Tag, User, Info,
} from 'lucide-react';
import Select, { StylesConfig, SingleValue } from 'react-select';

import {
  useCreateEventMutation,
  useUpdateEventMutation,
  EventDataTypes,
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
interface ApiError { data?: { msg?: string; errors?: Record<string, string>; }; }
interface EventFormModalProps { open: boolean; onClose: () => void; eventToEdit?: Partial<EventDataTypes> | null; }
interface CaseOptionType { value: number; label: string; }
interface CustomDateInputProps { value?: string; onClick?: () => void; hasError?: boolean; placeholder?: string; disabled?: boolean; }

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

// --- CUSTOM STYLED COMPONENTS ---
const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, hasError, placeholder, disabled }, ref) => (
    <div className="relative">
      <input type="text" className={`w-full h-11 pl-3 pr-10 text-sm rounded-lg shadow-sm placeholder-slate-400 transition-colors duration-150 border ${hasError ? 'border-red-400 focus:ring-red-500/50' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500/50'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-200 cursor-pointer`} onClick={onClick} value={value} ref={ref} readOnly placeholder={placeholder} disabled={disabled} />
      <CalendarIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
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
  const { data: adminCasesData = [], isLoading: isLoadingAdminCases } = useFetchCasesQuery(undefined, { skip: !isAdminOrManager || !open });
  const { data: clientCasesData = [], isLoading: isLoadingClientCases } = useGetCasesByClientOwnerQuery({ userId: currentUser?.user_id as number }, { skip: !isClient || !open || !currentUser?.user_id });
  const isLoadingCases = isLoadingAdminCases || isLoadingClientCases;
  const casesData = isAdminOrManager ? adminCasesData : clientCasesData;

  const caseOptions = useMemo<CaseOptionType[]>(() => casesData.map((c: CaseDataTypes) => ({ value: c.case_id, label: `${c.case_number} - ${c.owner?.full_name || 'N/A'}` })), [casesData]);

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormState(eventToEdit, currentUser?.user_id));
      setErrors({});
      if (eventToEdit?.case_id && caseOptions.length > 0) {
        setSelectedCase(caseOptions.find(opt => opt.value === eventToEdit.case_id) || null);
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
  const handleDateChange = (date: Date | null, field: 'form_date_part' | 'form_time_part') => {
    const formatStr = field === 'form_date_part' ? 'yyyy-MM-dd' : 'HH:mm';
    setFormData(prev => ({ ...prev, [field]: date ? format(date, formatStr) : '' }));
    if (errors.start_time) setErrors(prev => ({ ...prev, start_time: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.event_title.trim()) newErrors.event_title = "Title is required.";
    if (!formData.form_date_part) newErrors.start_time = "Date is required.";
    if (!formData.form_time_part && !newErrors.start_time) newErrors.start_time = "Time is required.";
    if (!formData.user_id) newErrors.user_id = "User information is missing. Please re-login.";
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
      const timePart = parse(formData.form_time_part, 'HH:mm', new Date());
      if (isValid(datePart) && isValid(timePart)) {
        combinedStartDateTime = setSeconds(setMinutes(setHours(startOfDay(datePart), timePart.getHours()), timePart.getMinutes()), 0);
      }
    } catch (e) { /* ignore */ }
    if (!combinedStartDateTime) {
      toast.error("Invalid date or time selected.");
      return;
    }
    
    const finalPayload = {
      event_title: formData.event_title.trim(),
      event_type: formData.event_type as AppEventType,
      start_time: combinedStartDateTime.toISOString(),
      event_description: formData.event_description?.trim() || undefined,
      user_id: currentUser?.user_id as number,
      case_id: selectedCase ? selectedCase.value : undefined,
    };

    try {
      if (eventToEdit?.event_id) {
        await updateEvent({ event_id: eventToEdit.event_id, ...finalPayload } as UpdateEventPayload & { event_id: number }).unwrap();
        toast.success("Event updated successfully!");
      } else {
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
    control: (base, state) => ({ ...base, minHeight: '44px', backgroundColor: 'var(--bg-secondary)', border: `1px solid ${state.isFocused ? 'var(--color-indigo-500)' : 'var(--border-color)'}`, boxShadow: state.isFocused ? '0 0 0 2px var(--color-indigo-200)' : 'none', borderRadius: '0.5rem', '&:hover': { borderColor: 'var(--color-indigo-500)' }, }),
    input: (base) => ({ ...base, color: 'var(--text-primary)' }),
    singleValue: (base) => ({ ...base, color: 'var(--text-primary)', fontWeight: '500' }),
    menu: (base) => ({ ...base, backgroundColor: 'var(--bg-menu)', zIndex: 9999, borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({ ...base, fontWeight: '600', backgroundColor: state.isSelected ? 'var(--color-indigo-500)' : state.isFocused ? 'var(--color-indigo-100)' : 'transparent', color: state.isSelected ? '#fff' : 'var(--text-primary)', '&:active': { backgroundColor: 'var(--color-indigo-500)' }, }),
    placeholder: (base) => ({...base, color: '#9ca3af'})
  };

  const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
  const baseInputStyles = "w-full h-11 pl-3 text-sm rounded-lg shadow-sm placeholder-slate-400 transition-colors duration-150 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
  const labelBaseClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2";
  const buttonBaseClasses = "px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-150 flex items-center justify-center gap-2";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => !anyOperationLoading && onClose()}>
          <motion.div className="bg-slate-50 dark:bg-slate-800/80 dark:backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{eventToEdit?.event_id ? 'Edit Event' : 'Schedule New Event'}</h2>
              <button onClick={() => !anyOperationLoading && onClose()} disabled={anyOperationLoading} className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close"><XIcon size={20} /></button>
            </header>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Event Details Section */}
              <section className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <label htmlFor="event_title" className={labelBaseClasses}><TypeIcon size={16} className="text-indigo-500" /> Title *</label>
                  <input id="event_title" name="event_title" value={formData.event_title} onChange={handleChange} disabled={anyOperationLoading} className={`${baseInputStyles} ${errors.event_title ? 'border-red-400' : ''}`} placeholder="e.g., Client Strategy Meeting" />
                  {errors.event_title && <p className="mt-1 text-xs text-red-500">{errors.event_title}</p>}
                </div>
                <div>
                  <label htmlFor="event_description" className={labelBaseClasses}><FileText size={16} className="text-indigo-500" /> Description</label>
                  <textarea id="event_description" name="event_description" value={formData.event_description || ''} disabled={anyOperationLoading} onChange={handleChange} rows={3} className={`${baseInputStyles} pt-2`} placeholder="Add any relevant details, notes, or agenda..." />
                </div>
              </section>

              {/* Scheduling Section */}
              <section className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBaseClasses}><CalendarIcon size={16} className="text-indigo-500" /> Date *</label>
                    <DatePicker selected={selectedDateForPicker} onChange={(d) => handleDateChange(d, 'form_date_part')} dateFormat="yyyy-MM-dd" customInput={<CustomDateInput hasError={!!errors.start_time} placeholder="YYYY-MM-DD" disabled={anyOperationLoading} />} wrapperClassName="w-full" disabled={anyOperationLoading} popperPlacement="bottom-start" />
                  </div>
                  <div>
                    <label className={labelBaseClasses}><Clock size={16} className="text-indigo-500" /> Time *</label>
                    <DatePicker selected={selectedTimeForPicker} onChange={(t) => handleDateChange(t, 'form_time_part')} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="HH:mm" customInput={<CustomDateInput hasError={!!errors.start_time} placeholder="HH:MM" disabled={anyOperationLoading} />} wrapperClassName="w-full" disabled={anyOperationLoading} popperPlacement="bottom-start" />
                  </div>
                </div>
                {errors.start_time && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><Info size={14}/>{errors.start_time}</p>}
              </section>

              {/* Categorization Section */}
              <section className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event_type" className={labelBaseClasses}><Tag size={16} className="text-indigo-500" /> Event Type *</label>
                    <select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange} disabled={anyOperationLoading} className={`${baseInputStyles} appearance-none`}>
                      <option value="meeting">Meeting</option><option value="hearing">Hearing</option><option value="consultation">Consultation</option><option value="reminder">General Reminder</option><option value="court_date">Court Date</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelBaseClasses}><Briefcase size={16} className="text-indigo-500" /> Related Case (Optional)</label>
                    <Select options={caseOptions} value={selectedCase} onChange={(option) => setSelectedCase(option)} isLoading={isLoadingCases} isDisabled={isLoadingCases || anyOperationLoading} isClearable isSearchable placeholder="Select or search for a case..." styles={selectStyles} menuPortalTarget={document.body} />
                  </div>
                </div>
              </section>
              
              {errors.user_id && <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700/50"><p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2"><User size={16} /> {errors.user_id}</p></div>}
              
              <footer className="flex justify-end gap-3 pt-5 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => !anyOperationLoading && onClose()} disabled={anyOperationLoading} className={`${buttonBaseClasses} text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-slate-400`}><XIcon size={18} /> Cancel</button>
                <button type="submit" disabled={anyOperationLoading || !currentUser?.user_id} className={`${buttonBaseClasses} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed`}><Save size={18} /> {anyOperationLoading ? 'Saving...' : (eventToEdit?.event_id ? 'Update Event' : 'Create Event')}</button>
              </footer>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventFormModal;