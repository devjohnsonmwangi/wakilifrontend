import React, { useState, useMemo, useEffect, useRef } from 'react';
// --- Corrected imports ---
import {
  useListAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  Appointment,
  AppointmentStatus,
  ListAppointmentsArgs,
} from '../../../../features/appointment/appointmentapi'; 
import {
  useFetchBranchLocationsQuery
} from '../../../../features/branchlocation/branchlocationapi'; 

// Define BranchLocation type here if not exported from the API module
interface BranchLocation {
  branch_id: number;
  name: string;
  // Add other fields as needed
}
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// --- Child components (ensure they are updated to accept the `Appointment` type) ---
import CreateAppointment from './createappointment';
import EditAppointment from './editappointments';   
import ConfirmationModal from './deletion';       
import ReasonDisplayModal from './ReasonDisplayModal'; 

import { PlusCircle, FilePenLine, Trash2, AlertTriangle, CalendarDays, RefreshCcw, Sun, Moon, ListFilter, Eye, Users, Briefcase, Search, ChevronDown, X } from 'lucide-react';

// --- Helper Interfaces ---
interface ApiError {
  status?: number | string;
  data?: { message?: string; error?: string; errors?: Array<{ field: string; message: string }>; [key: string]: unknown; };
  message?: string;
  error?: string;
}

// --- Helper Functions ---
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
  return 'Failed to perform action. Please check network and try again.';
};

const getStatusDisplayName = (status: string): string => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// --- Corrected status values to match the backend schema ---
const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

// --- Main Component ---
const BranchAppointments: React.FC = () => {
  // --- State Declarations ---
  const [selectedBranchId, setSelectedBranchId] = useState<number | ''>('');
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);

  // Filters
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchClientName, setSearchClientName] = useState(''); // For client-side text filtering
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');
  const [searchClientId, setSearchClientId] = useState<string | number | ''>(''); 

  // UI State
  const [isDarkMode, setIsDarkMode] = useState(() => typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] = useState(false);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<number | null>(null);
  
  // Data State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [reasonToDisplay, setReasonToDisplay] = useState('');
  const [reasonPartyName, setReasonPartyName] = useState('');
  const [displayableError, setDisplayableError] = useState<ApiError | null>(null);

  // Refs
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const statusFilterDropdownRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLTableDataCellElement>(null);

  // --- RTK Query Hooks ---
  const queryArgs: ListAppointmentsArgs | undefined = useMemo(() => {
    if (!selectedBranchId) return undefined; // Don't query if no branch is selected

    const args: ListAppointmentsArgs = { branchId: selectedBranchId };
    if (searchStatus) args.status = searchStatus;
    if (searchDateFrom) args.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString();
    if (searchDateTo) args.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString();
    if (searchClientId) args.clientId = Number(searchClientId);
    
    return args;
  }, [selectedBranchId, searchStatus, searchDateFrom, searchDateTo, searchClientId]);

  const { data: allBranches, isLoading: isLoadingBranches, isError: isErrorBranches, error: branchFetchError, refetch: refetchBranches } = useFetchBranchLocationsQuery();
  
  const { data: appointmentsData, isLoading: isLoadingAppointments, isError: isFetchAppointmentsError, error: queryError, refetch: refetchBranchAppointments } = useListAppointmentsQuery(
    queryArgs!,
    { 
      skip: !selectedBranchId, // Critically, do not run the query until a branch is selected
      refetchOnMountOrArgChange: true 
    }
  );

  const [updateAppointment, { isLoading: isStatusUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) setIsBranchDropdownOpen(false);
        if (statusFilterDropdownRef.current && !statusFilterDropdownRef.current.contains(event.target as Node)) setIsStatusFilterDropdownOpen(false);
        if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) setOpenStatusMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    let currentError: ApiError | null = null;
    if (selectedBranchId && isFetchAppointmentsError && queryError) {
      currentError = queryError as ApiError;
    }
    setDisplayableError(currentError);
  }, [isFetchAppointmentsError, queryError, selectedBranchId]);

  // --- Handlers ---
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openEditModal = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsEditModalOpen(true); };
  const closeEditModal = () => { setSelectedAppointment(null); setIsEditModalOpen(false); };
  const openReasonModal = (reason: string, clientName: string) => { setReasonToDisplay(reason); setReasonPartyName(clientName); setIsReasonModalOpen(true); };
  const closeReasonModal = () => { setIsReasonModalOpen(false); setReasonToDisplay(''); setReasonPartyName(''); };
  
  // Tag invalidation from mutations will handle refetching automatically
  const handleAppointmentCreated = () => { toast.success("Appointment created successfully!"); };
  const handleAppointmentUpdated = () => { toast.success("Appointment updated successfully!"); };

  const requestDeleteAppointment = (appointment: Appointment) => { setAppointmentToDelete(appointment); setIsConfirmDeleteModalOpen(true); };
  const cancelDeleteAppointment = () => { setAppointmentToDelete(null); setIsConfirmDeleteModalOpen(false); };

  const handleSelectBranch = (branch: BranchLocation) => {
    setSelectedBranchId(branch.branch_id);
    setSelectedBranchName(branch.name);
    setIsBranchDropdownOpen(false);
    // Reset filters when changing branch
    setSearchClientName(''); setSearchStatus(''); setSearchDateFrom(''); setSearchDateTo(''); setSearchClientId('');
  };
  const clearSelectedBranch = () => { setSelectedBranchId(''); setSelectedBranchName(null); };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    setOpenStatusMenuId(null);
    try {
      await updateAppointment({ appointment_id: appointmentId, updates: { status: newStatus } }).unwrap();
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}!`);
    } catch (err) { toast.error(`Failed to update status: ${getErrorMessage(err as ApiError)}`); }
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete.appointment_id).unwrap();
      toast.success(`Appointment for ${appointmentToDelete.client?.full_name} deleted!`);
      setIsConfirmDeleteModalOpen(false);
      setAppointmentToDelete(null);
    } catch (err) { toast.error(`Failed to delete: ${getErrorMessage(err as ApiError)}`); }
  };

  // --- Memos and Derived State ---
  const actualAppointmentsArray: Appointment[] = useMemo(() => Array.isArray(appointmentsData) ? appointmentsData : [], [appointmentsData]);
  
  const filteredAppointments = useMemo(() => {
    if (!actualAppointmentsArray.length) return [];
    // Client-side filtering for name, applied after backend filters have run
    return actualAppointmentsArray.filter(appointment => {
      const clientName = appointment.client?.full_name?.toLowerCase() || '';
      const searchLower = searchClientName.toLowerCase();
      return searchClientName ? clientName.includes(searchLower) : true;
    });
  }, [actualAppointmentsArray, searchClientName]);

  const isOverallLoading = isLoadingBranches || (!!selectedBranchId && isLoadingAppointments);
  const isFilteringActive = !!(searchClientName || searchStatus || searchDateFrom || searchDateTo || searchClientId);
  const showNoAppointmentsMessage = !!selectedBranchId && !isOverallLoading && !displayableError && filteredAppointments.length === 0;

  // --- Reusable Styles & Components ---
  const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:focus:ring-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
  const dropdownListVariants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  const LoadingIndicator: React.FC<{text?: string}> = ({text = "Loading..."}) => ( <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400"><RefreshCcw className="h-12 w-12 animate-spin mb-4" /><p className="text-lg">{text}</p></div> );
  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null, onTryAgain?: () => void }> = ({ errorToDisplay, onTryAgain }) => {
    if (!errorToDisplay) return null;
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert">
        <div className="flex items-center"><AlertTriangle className="h-8 w-8 mr-3" /><div><p className="font-bold text-lg">Error</p><p className="text-sm">{getErrorMessage(errorToDisplay)}</p></div></div>
        {onTryAgain && (<button onClick={onTryAgain} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center"><RefreshCcw className="h-4 w-4 mr-2" /> Try Again</button>)}
      </div>
    );
  };
  const NoAppointmentsMessage: React.FC<{ isFiltering: boolean; selectedBranchName?: string | null; onCreate: () => void; }> = ({ isFiltering, selectedBranchName, onCreate }) => ( <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6"><CalendarDays className="h-16 w-16 mb-4" /><p className="text-xl font-semibold mb-2">{isFiltering ? "No appointments match filters" : `No appointments for ${selectedBranchName || 'this branch'}`}</p><p className="text-sm text-center">{isFiltering ? "Try adjusting your search criteria." : "You can create the first one!"}</p>{!isFiltering && selectedBranchId && (<button onClick={onCreate} className="mt-6 flex items-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md"><PlusCircle className="h-5 w-5 mr-2" /> Create Appointment</button>)}</div> );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-2 sm:p-4 lg:p-6 font-sans`}>
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <header className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center"><Briefcase className="h-8 w-8 mr-3 text-sky-600 dark:text-sky-400" /><h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">{selectedBranchName ? `${selectedBranchName} Appointments` : 'Branch Appointments'}</h1></div>
            <div className="flex items-center space-x-3"><button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="Toggle Dark Mode">{isDarkMode ? <Sun /> : <Moon />}</button>{selectedBranchId && (<button onClick={openCreateModal} className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md text-sm"><PlusCircle className="h-5 w-5 mr-2" /> New </button>)}</div>
          </div>
        </header>

        <section className="p-4 md:p-6">
          {/* Branch Selector */}
          <div className="mb-6 p-4 bg-sky-50/70 dark:bg-sky-700/30 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700">
            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Select a Branch:</label>
            {isLoadingBranches ? (<LoadingIndicator text="Loading branches..." />) : 
             isErrorBranches ? (<ErrorDisplay errorToDisplay={branchFetchError as ApiError} onTryAgain={refetchBranches}/>) : 
            (<div ref={branchDropdownRef} className="relative md:w-1/2 lg:w-1/3"><button type="button" onClick={() => setIsBranchDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4 ${!selectedBranchId ? 'text-slate-400' : ''}`}>{selectedBranchName || '-- Choose a Branch --'}<div className="flex items-center">{selectedBranchId && (<button type="button" onClick={(e) => { e.stopPropagation(); clearSelectedBranch();}} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isBranchDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isBranchDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">{allBranches?.map(branch => (<li key={branch.branch_id}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50" onClick={() => handleSelectBranch(branch)}>{branch.name}</button></li>))}</motion.ul>)}</AnimatePresence></div>)}
          </div>

          {/* Filters (only show when a branch is selected) */}
          {selectedBranchId && (
            <div className="mb-6 p-4 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center"><ListFilter className="h-5 w-5 mr-2" />Filter Appointments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" placeholder="Client Name..." value={searchClientName} onChange={(e) => setSearchClientName(e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{searchClientName && (<button onClick={() => setSearchClientName('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16} /></button>)}</div>
                <div className="relative"><input type="number" placeholder="Client ID..." value={searchClientId} onChange={(e) => setSearchClientId(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-10`} />{searchClientId && (<button onClick={() => setSearchClientId('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16} /></button>)}</div>
                <div ref={statusFilterDropdownRef} className="relative"><button type="button" onClick={() => setIsStatusFilterDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4 ${!searchStatus ? 'text-slate-400' : ''}`}>{searchStatus ? getStatusDisplayName(searchStatus) : 'All Statuses'}<div className="flex items-center">{searchStatus && (<button type="button" onClick={(e) => { e.stopPropagation(); setSearchStatus(''); }} className="p-1 mr-1 text-slate-400 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusFilterDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusFilterDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border rounded-lg shadow-lg max-h-60 overflow-y-auto"><li key="all"><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50" onClick={() => setSearchStatus('')}>All Statuses</button></li>{APPOINTMENT_STATUS_VALUES.map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50" onClick={() => setSearchStatus(status)}>{getStatusDisplayName(status)}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                <div className="grid grid-cols-2 gap-2"><div className="relative"><input type="date" title="Date From" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} />{searchDateFrom && (<button onClick={() => setSearchDateFrom('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16} /></button>)}</div><div className="relative"><input type="date" title="Date To" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} min={searchDateFrom || undefined} />{searchDateTo && (<button onClick={() => setSearchDateTo('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16} /></button>)}</div></div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="mt-2">
            {!selectedBranchId && !isOverallLoading && (<div className="flex flex-col items-center justify-center py-10 text-slate-500 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow my-6 p-6"><Briefcase className="h-16 w-16 mb-4 text-slate-400" /><p className="text-xl font-semibold">Please select a branch</p><p className="text-sm">Choose a branch to view its appointments.</p></div>)}
            {selectedBranchId && ( isOverallLoading ? ( <LoadingIndicator text={`Loading appointments for ${selectedBranchName}...`} /> ) : displayableError ? ( <ErrorDisplay errorToDisplay={displayableError} onTryAgain={refetchBranchAppointments} /> ) : showNoAppointmentsMessage ? ( <NoAppointmentsMessage isFiltering={isFilteringActive} selectedBranchName={selectedBranchName} onCreate={openCreateModal} /> ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="min-w-full leading-normal">
                    <thead className="bg-sky-600 dark:bg-sky-700"><tr>{['ID', 'Client', 'Date & Time', 'Assigned To', 'Reason', 'Status', 'Actions'].map(header => (<th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">{header}</th>))}</tr></thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredAppointments.map((appointment) => {
                        const appointmentDateObj = new Date(appointment.appointment_datetime);
                        const displayDate = !isNaN(appointmentDateObj.getTime()) ? appointmentDateObj.toLocaleDateString() : 'Invalid Date';
                        const displayTime = !isNaN(appointmentDateObj.getTime()) ? appointmentDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid Time';
                        return (
                        <tr key={appointment.appointment_id} className="hover:bg-sky-50 dark:hover:bg-slate-700/60">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{appointment.appointment_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center"><Users className="w-5 h-5 mr-2 text-slate-400" />{appointment.client?.full_name || 'N/A'}</div></td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{displayDate} at {displayTime}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.assignees?.map(a => a.assignee?.full_name).join(', ') || <span className="italic text-slate-500">Not Assigned</span>}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm"><button onClick={() => openReasonModal(appointment.reason, appointment.client?.full_name || 'the client')} className="flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 text-xs" title="View Reason"><Eye className="h-4 w-4 mr-1" /><span>{truncateText(appointment.reason, 25)}</span></button></td>
                          <td ref={openStatusMenuId === appointment.appointment_id ? statusMenuRef : undefined} className="px-4 py-3 whitespace-nowrap text-sm min-w-[150px] relative"><button onClick={() => setOpenStatusMenuId(openStatusMenuId === appointment.appointment_id ? null : appointment.appointment_id)} disabled={isStatusUpdating} className={`${inputBaseClasses} py-1.5 pl-2 pr-8 text-xs flex justify-between items-center w-full`}><span>{getStatusDisplayName(appointment.status)}</span><ChevronDown size={16} className={`transition-transform ${openStatusMenuId === appointment.appointment_id ? 'rotate-180' : ''}`}/></button><AnimatePresence>{openStatusMenuId === appointment.appointment_id && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full right-0 mt-1 bg-white dark:bg-slate-900 border rounded-lg shadow-lg max-h-60 overflow-y-auto">{APPOINTMENT_STATUS_VALUES.map(status => (<li key={status}><button onClick={() => handleStatusChange(appointment.appointment_id, status)} className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">{getStatusDisplayName(status)}</button></li>))}</motion.ul>)}</AnimatePresence></td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium"><div className="flex items-center space-x-2"><button onClick={() => openEditModal(appointment)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 p-1 rounded-md" title="Edit"><FilePenLine className="h-5 w-5" /></button><button onClick={() => requestDeleteAppointment(appointment)} className="text-rose-500 hover:text-rose-700 dark:text-rose-400 p-1 rounded-md" title="Delete"><Trash2 className="h-5 w-5" /></button></div></td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </main>
        </section>
      </div>

      {/* Modals */}
      {isCreateModalOpen && selectedBranchId && (<CreateAppointment isDarkMode={isDarkMode} onAppointmentCreated={handleAppointmentCreated} onClose={closeCreateModal} forBranchId={selectedBranchId} />)}
      {isEditModalOpen && selectedAppointment && (<EditAppointment isDarkMode={isDarkMode} appointment={selectedAppointment} onAppointmentUpdated={handleAppointmentUpdated} onClose={closeEditModal} />)}
      <ConfirmationModal isOpen={isConfirmDeleteModalOpen} onClose={cancelDeleteAppointment} onConfirm={confirmDeleteAppointment} title="Confirm Deletion" message={<p>Are you sure you want to delete the appointment for <strong className="font-semibold">{appointmentToDelete?.client?.full_name || 'this client'}</strong>? This action is irreversible.</p>} confirmText="Yes, Delete" cancelText="Cancel" isLoading={isDeletingAppointment} />
      <ReasonDisplayModal isOpen={isReasonModalOpen} onClose={closeReasonModal} reason={reasonToDisplay} partyName={reasonPartyName} isDarkMode={isDarkMode} />
    </div>
  );
};

export default BranchAppointments;