// ListAppointments.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
// --- ACTION: Updated imports to use the new API slice and types ---
import {
  useListAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  Appointment, // Use the new detailed Appointment type
  AppointmentStatus,
} from '../../../../features/appointment/appointmentapi'; // Adjusted path to new API slice
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; // This remains for fetching branch data
import { Toaster, toast } from 'sonner';
// --- NOTE: These child components will also need to be updated to accept the new `Appointment` type ---
import CreateAppointment from './createappointment';
import EditAppointment from './editappointments';
import ConfirmationModal from './deletion';
import ReasonDisplayModal from './ReasonDisplayModal';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { PlusCircle, FilePenLine, Trash2, AlertTriangle, CalendarDays, RefreshCcw, Sun, Moon, Eye, ListFilter, Search, ChevronDown, X } from 'lucide-react';

// --- Type Definitions (can be moved to a shared types file) ---
interface ApiError {
  status?: number | string;
  data?: { message?: string; error?: string; errors?: Array<{ field: string; message: string }>; [key: string]: unknown; };
  message?: string;
  error?: string;
}

// Arguments for the listAppointments query
interface ListAppointmentsArgs {
  status?: AppointmentStatus;
  branchId?: number;
  clientId?: number;
  dateTimeFrom?: string;
  dateTimeTo?: string;
}

// --- Constants & Helpers ---
const NO_APPOINTMENTS_FOUND_MESSAGE = "🔍 No appointments found. Please add one! 📝";

// ACTION: Updated to reflect backend status enum from the API slice. Removed "rescheduled" and "no_show" as they are not in the backend schema.
const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

const getErrorMessage = (error: ApiError | null | undefined): string => {
  if (!error) return 'An unknown error occurred. Please try again.';
  const data = error.data;
  if (data) {
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map(e => `${e.field ? `${e.field}: ` : ''}${e.message}`).join('; ');
    }
  }
  if (error.message) return error.message;
  if (error.error) return error.error;
  if (error.status) return `An error occurred (Status: ${error.status}). Please try again.`;
  return 'Failed to perform action. Please check network or try again.';
};

const getStatusDisplayName = (status: AppointmentStatus | string): string => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};


const ListAppointments: React.FC = () => {
  // --- Filter State ---
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchClient, setSearchClient] = useState(''); // Changed from searchParty
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBranchId, setSearchBranchId] = useState<string | number | ''>('');
  const [searchClientId, setSearchClientId] = useState<string | number | ''>('');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');

  // --- Dropdown State & Refs ---
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // --- RTK Query Hooks ---
  const queryArgs: ListAppointmentsArgs = useMemo(() => {
    const args: ListAppointmentsArgs = {};
    if (searchStatus) args.status = searchStatus;
    if (searchBranchId) args.branchId = Number(searchBranchId);
    if (searchClientId) args.clientId = Number(searchClientId);
    if (searchDateFrom) args.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString();
    if (searchDateTo) args.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString();
    return args;
  }, [searchStatus, searchBranchId, searchClientId, searchDateFrom, searchDateTo]);

  // ACTION: Switched to useListAppointmentsQuery hook
  const { data: appointmentsData, isLoading: isLoadingAppointments, isError: isFetchAppointmentsError, error: queryError, refetch } = useListAppointmentsQuery(queryArgs, { refetchOnMountOrArgChange: true });
  
  const { data: branchLocations, isLoading: isLoadingBranchLocations } = useFetchBranchLocationsQuery();
  const [updateAppointment, { isLoading: isStatusUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  // --- Modal and Component State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // ACTION: Updated state to use the new `Appointment` type
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reasonToDisplay, setReasonToDisplay] = useState('');
  const [reasonPartyName, setReasonPartyName] = useState('');
  const [displayableError, setDisplayableError] = useState<ApiError | null>(null);
  const [isBackendNoAppointments, setIsBackendNoAppointments] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false));

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    if (typeof window !== 'undefined') localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) setIsBranchDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let noAppointmentsSignal = false;
    let currentError: ApiError | null = null;
    if (isFetchAppointmentsError && queryError) {
      const typedQueryError = queryError as ApiError;
      const errorMessage = getErrorMessage(typedQueryError);
      if (errorMessage === NO_APPOINTMENTS_FOUND_MESSAGE || typedQueryError.status === 404) {
        noAppointmentsSignal = true;
      } else { currentError = typedQueryError; }
    } else if (!isLoadingAppointments && appointmentsData) {
      if (Array.isArray(appointmentsData) && appointmentsData.length === 0) noAppointmentsSignal = true;
    }
    setIsBackendNoAppointments(noAppointmentsSignal);
    setDisplayableError(currentError);
  }, [isFetchAppointmentsError, queryError, appointmentsData, isLoadingAppointments]);

  // --- Handlers ---
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  // ACTION: Handler now accepts the new `Appointment` type
  const openEditModal = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsEditModalOpen(true); };
  const closeEditModal = () => { setSelectedAppointment(null); setIsEditModalOpen(false); };
  const openReasonModal = (reason: string, partyName: string) => { setReasonToDisplay(reason); setReasonPartyName(partyName); setIsReasonModalOpen(true); };
  const closeReasonModal = () => { setReasonToDisplay(''); setReasonPartyName(''); setIsReasonModalOpen(false); };
  const handleAppointmentCreated = () => { toast.success('Appointment created successfully!'); };
  const handleAppointmentUpdated = () => { toast.success('Appointment updated successfully!'); };
  const requestDeleteAppointment = (appointment: Appointment) => { setAppointmentToDelete(appointment); setIsConfirmDeleteModalOpen(true); };
  
  const confirmDeleteAppointment = async () => { 
    if (!appointmentToDelete) return; 
    try { 
      // ACTION: Updated toast message to use the new data structure
      await deleteAppointment(appointmentToDelete.appointment_id).unwrap(); 
      toast.success(`Appointment for ${appointmentToDelete.client?.full_name || 'Client'} deleted successfully!`); 
      setAppointmentToDelete(null); 
      setIsConfirmDeleteModalOpen(false); 
    } catch (err) { 
      toast.error(`Failed to delete appointment: ${getErrorMessage(err as ApiError)}`); 
    } 
  };
  
  const cancelDeleteAppointment = () => { setAppointmentToDelete(null); setIsConfirmDeleteModalOpen(false); };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      // ACTION: Updated mutation payload to match the new API slice structure
      await updateAppointment({ 
        appointment_id: appointmentId, 
        updates: { status: newStatus } 
      }).unwrap();
      toast.success(`Appointment status updated to ${getStatusDisplayName(newStatus)}!`);
    } catch (err) {
      toast.error(`Failed to update status: ${getErrorMessage(err as ApiError)}`);
    }
  };

  // --- Memos and Derived State ---
  const actualAppointmentsArray = useMemo(() => Array.isArray(appointmentsData) ? appointmentsData : [], [appointmentsData]);

  const filteredAppointments = useMemo(() => {
    if (isBackendNoAppointments || displayableError) return [];
    return actualAppointmentsArray.filter(appointment => {
      // ACTION: Updated client-side filtering to use the new data structure
      const clientName = appointment.client?.full_name?.toLowerCase() || '';
      const clientMatch = searchClient ? clientName.includes(searchClient.toLowerCase()) : true;
      
      const branchLocationName = appointment.branch?.name?.toLowerCase() || '';
      const locationMatch = searchLocation ? branchLocationName.includes(searchLocation.toLowerCase()) : true;
      
      return clientMatch && locationMatch;
    });
  }, [actualAppointmentsArray, isBackendNoAppointments, displayableError, searchClient, searchLocation]);

  const isActuallyLoading = isLoadingAppointments || isLoadingBranchLocations;
  const isFilteringActive = !!(searchClient || searchLocation || searchStatus || searchBranchId || searchClientId || searchDateFrom || searchDateTo);
  const showNoAppointmentsMessage = !isActuallyLoading && !displayableError && filteredAppointments.length === 0;

  // --- Reusable Components and Styles (unchanged) ---
  const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:focus:ring-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
  const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };
  const LoadingIndicator: React.FC<{ text?: string }> = ({ text = "Loading appointments..." }) => ( <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400"><RefreshCcw className="h-12 w-12 animate-spin mb-4" /><p className="text-lg">{text}</p></div> );
  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null; onRetry?: () => void }> = ({ errorToDisplay, onRetry }) => { if (!errorToDisplay) return null; const message = getErrorMessage(errorToDisplay); if (message === NO_APPOINTMENTS_FOUND_MESSAGE && !onRetry) return null; return ( <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert"><div className="flex items-center"><AlertTriangle className="h-8 w-8 mr-3" /><div><p className="font-bold text-lg">Error Loading Appointments</p><p className="text-sm">{message}</p></div></div>{onRetry && <button onClick={onRetry} className="mt-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"><RefreshCcw className="h-4 w-4 mr-2" />Try Again</button>}</div> ); };
  const NoAppointmentsMessage: React.FC<{ isFiltering: boolean }> = ({ isFiltering }) => ( <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6"><CalendarDays className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" /><p className="text-xl font-semibold mb-2">{isFiltering ? "No Appointments Match Your Filters" : "No Appointments Yet"}</p><p className="text-sm text-center">{isFiltering ? "Try adjusting your search criteria or clearing some filters." : "Get started by creating a new appointment!"}</p>{!isFiltering && <button onClick={openCreateModal} className="mt-6 flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all"><PlusCircle className="h-5 w-5 mr-2" />Create First Appointment</button>}</div> );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-2 sm:p-4 lg:p-6 font-sans transition-colors duration-300`}>
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
        {/* Header remains the same */}
        <header className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4"><h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Appointments Dashboard</h1><div className="flex items-center space-x-3"><button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}> {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />} </button><button onClick={openCreateModal} className="flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md text-sm"> <PlusCircle className="h-5 w-5 mr-2" /> New Appointment </button></div></div>
        </header>

        {/* Filters Section */}
        <section className="p-4 md:p-6">
          <div className="mb-6 p-4 bg-sky-50/70 dark:bg-sky-700/30 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center"><ListFilter className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" />Filter Appointments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* ACTION: Changed from "Party" to "Client" */}
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none"/><input type="text" placeholder="Client Name..." value={searchClient} onChange={(e) => setSearchClient(e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{searchClient && (<button type="button" onClick={() => setSearchClient('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}</div>
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none"/><input type="text" placeholder="Location Name..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{searchLocation && (<button type="button" onClick={() => setSearchLocation('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}</div>
              {/* Status Dropdown */}
              <div ref={statusDropdownRef} className="relative"><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!searchStatus ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{searchStatus ? getStatusDisplayName(searchStatus) : 'All Statuses'}</span><div className="flex items-center">{searchStatus && (<button type="button" onClick={(e) => { e.stopPropagation(); setSearchStatus(''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50" onClick={() => { setSearchStatus(''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{APPOINTMENT_STATUS_VALUES.map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setSearchStatus(status); setIsStatusDropdownOpen(false); }}>{getStatusDisplayName(status)}</button></li>))} </motion.ul>)}</AnimatePresence></div>
              {/* Branch Dropdown */}
              <div ref={branchDropdownRef} className="relative"><button type="button" onClick={() => setIsBranchDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`} disabled={isLoadingBranchLocations}><span className={`truncate font-semibold ${!searchBranchId ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{isLoadingBranchLocations ? 'Loading...' : (branchLocations?.find(b => b.branch_id.toString() === searchBranchId.toString())?.name || 'All Branches')}</span><div className="flex items-center">{searchBranchId && (<button type="button" onClick={(e) => { e.stopPropagation(); setSearchBranchId(''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isBranchDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isBranchDropdownOpen && !isLoadingBranchLocations && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50" onClick={() => { setSearchBranchId(''); setIsBranchDropdownOpen(false); }}>All Branches</button></li>{branchLocations?.map(loc => (<li key={loc.branch_id}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setSearchBranchId(loc.branch_id); setIsBranchDropdownOpen(false); }}>{loc.name}</button></li>))} </motion.ul>)}</AnimatePresence></div>
              {/* Other filters */}
              <div className="relative"><input type="number" placeholder="Client ID..." value={searchClientId} onChange={(e) => setSearchClientId(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-10`} />{searchClientId && (<button type="button" onClick={() => setSearchClientId('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}</div><div className="grid grid-cols-2 gap-2 col-span-1 sm:col-span-2 lg:col-span-1"><div className="relative"><input type="date" title="Date From" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} />{searchDateFrom && <button type="button" onClick={() => setSearchDateFrom('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none"><X size={16} /></button>}</div><div className="relative"><input type="date" title="Date To" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} min={searchDateFrom || undefined} />{searchDateTo && <button type="button" onClick={() => setSearchDateTo('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none"><X size={16} /></button>}</div></div>
            </div>
          </div>
          
          {/* Main Content: Table or Messages */}
          <main className="mt-2">
            {isActuallyLoading ? ( <LoadingIndicator /> ) :
             displayableError ? ( <ErrorDisplay errorToDisplay={displayableError} onRetry={refetch} /> ) :
             showNoAppointmentsMessage ? ( <NoAppointmentsMessage isFiltering={isFilteringActive} /> ) : (
              <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full leading-normal">
                  <thead className="bg-sky-600 dark:bg-sky-700">
                    <tr>
                      {/* ACTION: Removed the redundant "Party" column */}
                      {['ID', 'Client', 'Date & Time', 'Reason', 'Status', 'Location', 'Actions'].map(header => (
                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-white dark:text-sky-100 uppercase tracking-wider whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredAppointments.map((appointment, index) => {
                      const appointmentDateObj = new Date(appointment.appointment_datetime);
                      const displayDate = !isNaN(appointmentDateObj.getTime()) ? appointmentDateObj.toLocaleDateString() : 'Invalid Date';
                      const displayTime = !isNaN(appointmentDateObj.getTime()) ? appointmentDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid Time';

                      return (
                        <tr key={appointment.appointment_id} className={`${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/70 dark:bg-slate-900/50'} hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors`}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{appointment.appointment_id}</td>
                          {/* ACTION: Updated to display client's full name from the relational data */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.client?.full_name || 'N/A'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{displayDate} at {displayTime}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs whitespace-nowrap">
                            {appointment.reason ? (
                              // ACTION: Updated to use client's full name for the reason modal
                              <button onClick={() => openReasonModal(appointment.reason!, appointment.client?.full_name || 'the client')} className="flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700 text-xs" title="View Full Reason">
                                <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span>{truncateText(appointment.reason, 25)}</span>
                              </button>
                            ) : ( <span className="text-slate-400 dark:text-slate-500 italic text-xs">No reason</span> )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 min-w-[130px]">
                            <select title="Change Status" value={appointment.status} onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)} className="block text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-sky-500 focus:border-sky-500 w-full p-1.5 shadow-sm transition-colors disabled:opacity-70" disabled={isStatusUpdating}>
                              {APPOINTMENT_STATUS_VALUES.map(statusValue => (<option key={statusValue} value={statusValue}>{getStatusDisplayName(statusValue)}</option>))}
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.branch?.name || 'N/A'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2"><button onClick={() => openEditModal(appointment)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700" title="Edit Appointment"> <FilePenLine className="h-5 w-5" /> </button><button onClick={() => requestDeleteAppointment(appointment)} className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled={isDeletingAppointment && appointmentToDelete?.appointment_id === appointment.appointment_id} title="Delete Appointment"> <Trash2 className="h-5 w-5" /> </button></div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </section>
      </div>

      {/* --- ACTION: These modals must be updated to handle the new `Appointment` prop type --- */}
      {isCreateModalOpen && (<CreateAppointment onAppointmentCreated={handleAppointmentCreated} onClose={closeCreateModal} isDarkMode={isDarkMode}/>)}
      {isEditModalOpen && selectedAppointment && (<EditAppointment appointment={selectedAppointment} onAppointmentUpdated={handleAppointmentUpdated} onClose={closeEditModal} isDarkMode={isDarkMode}/>)}
      {/* ACTION: Updated confirmation modal message to use new data structure */}
      <ConfirmationModal isOpen={isConfirmDeleteModalOpen} onClose={cancelDeleteAppointment} onConfirm={confirmDeleteAppointment} title="Confirm Deletion" message={appointmentToDelete ? (<>Are you sure you want to delete the appointment for <strong className="font-semibold">{appointmentToDelete.client?.full_name || 'this client'}</strong> on {new Date(appointmentToDelete.appointment_datetime).toLocaleDateString()} at {new Date(appointmentToDelete.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}? This action cannot be undone.</>) : ("Are you sure you want to delete this appointment? This action cannot be undone.")} confirmText="Yes, Delete Appointment" cancelText="No, Keep It" isLoading={isDeletingAppointment} />
      <ReasonDisplayModal isOpen={isReasonModalOpen} onClose={closeReasonModal} reason={reasonToDisplay} partyName={reasonPartyName} isDarkMode={isDarkMode}/>
    </div>
  );
};

export default ListAppointments;