// myappointments.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import {
  useListAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  Appointment,
  AppointmentStatus,
  ListAppointmentsArgs,
  
} from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi';
import { selectCurrentUserId, selectCurrentUser } from '../../../../features/users/userSlice';

import CreateAppointment from './createappointment';
import EditAppointment from './editappointments';
import ConfirmationModal from './deletion';
import ReasonDisplayModal from './ReasonDisplayModal';

import { PlusCircle, FilePenLine, Trash2, AlertTriangle, CalendarDays, RefreshCcw, Sun, Moon, User as UserProfileIcon, LogIn, ImageOff, Eye, Briefcase, ListFilter, Search, ChevronDown, X } from 'lucide-react';

// --- Type and Helper Function Definitions ---
interface ApiError {
  status?: number | string;
  data?: { message?: string; error?: string; };
}

const NO_APPOINTMENTS_FOUND_MESSAGE = "You have no appointments assigned to you.";

// --- ACTION: Corrected the getErrorMessage function ---
const getErrorMessage = (error: ApiError | null | undefined): string => {
  if (!error) return 'An unknown error occurred.';
  // Prioritize the nested message from the backend `data` object.
  if (error.data?.message) return error.data.message;
  if (error.data?.error) return error.data.error;
  // Fallback for other error structures
  return `Error (Status: ${error.status || 'N/A'}). Please try again.`;
};

const getStatusDisplayName = (status: string): string => status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
const truncateText = (text: string | null | undefined, maxLength: number): string => !text || text.length <= maxLength ? text || '' : `${text.substring(0, maxLength)}...`;
const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

const UserAppointments: React.FC = () => {
  // Redux & User State
  const assigneeId = useSelector(selectCurrentUserId);
  const currentUser = useSelector(selectCurrentUser);
  const userFullName = currentUser?.full_name || "User";
  const profilePictureUrl = currentUser?.profile_picture || null;
  const [imgError, setImgError] = useState(false);

  // Filters
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchClientName, setSearchClientName] = useState('');
  const [searchBranchId, setSearchBranchId] = useState<number | ''>('');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');

  // UI State
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reasonToDisplay, setReasonToDisplay] = useState('');
  const [reasonContextName, setReasonContextName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false);

  // Refs
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const statusFilterDropdownRef = useRef<HTMLDivElement>(null);

  // RTK Query Hooks
  const queryArgs: ListAppointmentsArgs | undefined = useMemo(() => {
    if (!assigneeId) return undefined;
    // --- ACTION: This now correctly matches the updated ListAppointmentsArgs type ---
    const args: ListAppointmentsArgs = { assigneeId }; 
    if (searchStatus) args.status = searchStatus;
    if (searchBranchId) args.branchId = searchBranchId;
    if (searchDateFrom) args.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString();
    if (searchDateTo) args.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString();
    return args;
  }, [assigneeId, searchStatus, searchBranchId, searchDateFrom, searchDateTo]);

  const { data: appointmentsData, isLoading: isLoadingAppointments, isError, error: queryError, refetch } = useListAppointmentsQuery(
    queryArgs!, { skip: !assigneeId, refetchOnMountOrArgChange: true }
  );

  const { data: branchLocations, isLoading: isLoadingBranchLocations } = useFetchBranchLocationsQuery();
  const [updateAppointment, { isLoading: isStatusUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  // Effects
  useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); localStorage.setItem('darkMode', String(isDarkMode)); }, [isDarkMode]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) setIsLocationDropdownOpen(false);
        if (statusFilterDropdownRef.current && !statusFilterDropdownRef.current.contains(event.target as Node)) setIsStatusFilterDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => { setImgError(false); }, [profilePictureUrl]);

  // Handlers
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openEditModal = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsEditModalOpen(true); };
  const closeEditModal = () => { setSelectedAppointment(null); setIsEditModalOpen(false); };
  const openReasonModal = (reason: string, clientName?: string) => { setReasonToDisplay(reason); setReasonContextName(clientName || 'the client'); setIsReasonModalOpen(true); };
  const closeReasonModal = () => setIsReasonModalOpen(false);
  const handleAppointmentCreated = () => toast.success("Appointment created successfully!");
  const handleAppointmentUpdated = () => toast.success("Appointment updated successfully!");
  const requestDeleteAppointment = (appointment: Appointment) => { setAppointmentToDelete(appointment); setIsConfirmDeleteModalOpen(true); };
  const cancelDeleteAppointment = () => setAppointmentToDelete(null);

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment({ id: appointmentId, payload: { status: newStatus } }).unwrap();
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}!`);
    } catch (err) { toast.error(`Failed to update status: ${getErrorMessage(err as ApiError)}`); }
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete.appointment_id).unwrap();
      toast.success(`Appointment with ${appointmentToDelete.client?.full_name} has been deleted.`);
      setAppointmentToDelete(null); 
      setIsConfirmDeleteModalOpen(false);
    } catch (err) { toast.error(`Failed to delete appointment: ${getErrorMessage(err as ApiError)}`); }
  };

  // Memos and Derived State
  const filteredAppointments = useMemo(() => {
    const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
    if (!searchClientName) return appointments;
    return appointments.filter(appointment => appointment.client?.full_name?.toLowerCase().includes(searchClientName.toLowerCase()));
  }, [appointmentsData, searchClientName]);

  const isActuallyLoading = isLoadingAppointments || isLoadingBranchLocations;
  const isFilteringActive = !!(searchClientName || searchBranchId || searchStatus || searchDateFrom || searchDateTo);
  const showNoAppointmentsMessage = !isActuallyLoading && !queryError && filteredAppointments.length === 0;

  // Reusable UI Components
  const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors placeholder:text-slate-400`;
  const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
  const ProfilePictureFallback = () => <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-400 dark:bg-slate-600 dark:text-slate-300"><ImageOff className="h-6 w-6" /></div>;

  if (!assigneeId || !currentUser) return <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-900"><div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800"><LogIn className="mx-auto mb-6 h-16 w-16 text-sky-500" /><h2 className="mb-3 text-2xl font-semibold text-slate-700 dark:text-slate-200">Access Denied</h2><p className="text-slate-500 dark:text-slate-400">Please log in to view your assigned appointments.</p></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 p-2 font-sans dark:from-slate-900 dark:to-sky-950 sm:p-4 lg:p-6">
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="mx-auto max-w-full overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800 lg:max-w-7xl">
        <header className="border-b border-slate-200 p-4 dark:border-slate-700 md:p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center"><div className="mr-3 flex-shrink-0">{profilePictureUrl && !imgError ? <img src={profilePictureUrl} alt={userFullName} className="h-10 w-10 rounded-full border-2 border-sky-200 object-cover dark:border-sky-700" onError={() => setImgError(true)} /> : <ProfilePictureFallback />}</div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">My Assigned Appointments</h1></div>
            <div className="mt-4 flex items-center space-x-3 sm:mt-0"><button onClick={toggleDarkMode} className="rounded-full p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" title="Toggle Dark Mode">{isDarkMode ? <Sun /> : <Moon />}</button><button onClick={openCreateModal} className="flex items-center rounded-lg bg-emerald-500 py-2.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-emerald-600"><PlusCircle className="mr-2 h-5 w-5" />New Appointment</button></div>
          </div>
        </header>

        <section className="p-4 md:p-6">
          <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50/70 p-4 shadow-sm dark:border-sky-700 dark:bg-sky-700/30">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-700 dark:text-slate-200"><ListFilter className="mr-2 h-5 w-5 text-slate-500" />Filter My Appointments</h2>
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Client Name..." value={searchClientName} onChange={(e) => setSearchClientName(e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{searchClientName && <button onClick={() => setSearchClientName('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}</div>
              <div ref={locationDropdownRef} className="relative"><button onClick={() => setIsLocationDropdownOpen(p => !p)} className={`${inputBaseClasses} flex items-center justify-between py-2.5 px-4 text-left`} disabled={isLoadingBranchLocations}><span className={`truncate font-semibold ${!searchBranchId ? 'font-normal text-slate-400' : ''}`}>{isLoadingBranchLocations ? 'Loading...' : branchLocations?.find(b => b.branch_id === searchBranchId)?.name || 'All Locations'}</span><div className="flex items-center">{searchBranchId && <button onClick={(e) => { e.stopPropagation(); setSearchBranchId(''); }} className="mr-1 rounded-full p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isLocationDropdownOpen && <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg dark:border-slate-600 dark:bg-slate-900"><li><button onClick={() => { setSearchBranchId(''); setIsLocationDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">All Locations</button></li>{branchLocations?.map(loc => <li key={loc.branch_id}><button onClick={() => { setSearchBranchId(loc.branch_id); setIsLocationDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">{loc.name}</button></li>)}</motion.ul>}</AnimatePresence></div>
              <div ref={statusFilterDropdownRef} className="relative"><button onClick={() => setIsStatusFilterDropdownOpen(p => !p)} className={`${inputBaseClasses} flex items-center justify-between py-2.5 px-4 text-left`}><span className={`truncate font-semibold ${!searchStatus ? 'font-normal text-slate-400' : ''}`}>{searchStatus ? getStatusDisplayName(searchStatus) : 'All Statuses'}</span><div className="flex items-center">{searchStatus && <button onClick={(e) => { e.stopPropagation(); setSearchStatus(''); }} className="mr-1 rounded-full p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusFilterDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusFilterDropdownOpen && <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg dark:border-slate-600 dark:bg-slate-900"><li><button onClick={() => { setSearchStatus(''); setIsStatusFilterDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">All Statuses</button></li>{APPOINTMENT_STATUS_VALUES.map(status => <li key={status}><button onClick={() => { setSearchStatus(status); setIsStatusFilterDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">{getStatusDisplayName(status)}</button></li>)}</motion.ul>}</AnimatePresence></div>
              <div className="grid grid-cols-2 gap-2"><div className="relative"><input type="date" title="Date From" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} />{searchDateFrom && <button onClick={() => setSearchDateFrom('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400"><X size={16} /></button>}</div><div className="relative"><input type="date" title="Date To" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} min={searchDateFrom || undefined} />{searchDateTo && <button onClick={() => setSearchDateTo('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400"><X size={16} /></button>}</div></div>
            </div>
          </div>
          
          <main className="mt-2">
            {isActuallyLoading ? <div className="flex items-center justify-center py-10"><RefreshCcw className="h-8 w-8 animate-spin text-sky-500 mr-3" /> Loading appointments...</div> :
             isError ? <div className="my-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-800 shadow dark:bg-red-900/30 dark:text-red-300"><div className="flex items-center"><AlertTriangle className="mr-3 h-6 w-6" /><p className="font-semibold">{getErrorMessage(queryError as ApiError)}</p></div><button onClick={refetch} className="mt-3 rounded-md bg-red-200 px-3 py-1 text-sm font-medium hover:bg-red-300 dark:bg-red-800/50 dark:hover:bg-red-800">Try Again</button></div> :
             showNoAppointmentsMessage ? <div className="my-6 rounded-lg bg-slate-50 p-6 text-center shadow dark:bg-slate-700/50"><CalendarDays className="mx-auto mb-4 h-16 w-16 text-slate-400" /><p className="text-xl font-semibold">{isFilteringActive ? "No appointments match your filters" : NO_APPOINTMENTS_FOUND_MESSAGE}</p><p className="text-sm">{isFilteringActive ? "Try adjusting your search criteria." : "New assignments will appear here."}</p></div> :
             (<div className="overflow-x-auto rounded-lg border border-slate-200 shadow-lg dark:border-slate-700"><table className="min-w-full leading-normal"><thead className="bg-sky-600 dark:bg-sky-700"><tr>{['ID', 'Client', 'Date & Time', 'Branch', 'Reason', 'Status', 'Actions'].map(header => <th key={header} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">{filteredAppointments.map(appointment => <tr key={appointment.appointment_id} className="hover:bg-sky-50 dark:hover:bg-slate-700/60"><td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-200">{appointment.appointment_id}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center"><UserProfileIcon className="mr-2 h-5 w-5 text-slate-400" />{appointment.client?.full_name || 'N/A'}</div></td><td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{new Date(appointment.appointment_datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center"><Briefcase className="mr-1.5 h-4 w-4 text-slate-400" />{appointment.branch?.name || 'N/A'}</div></td><td className="max-w-xs whitespace-nowrap px-4 py-3 text-sm"><button onClick={() => openReasonModal(appointment.reason, appointment.client?.full_name)} className="flex items-center rounded-md p-1 text-xs text-sky-600 hover:text-sky-800 dark:text-sky-400" title="View Reason"><Eye className="mr-1 h-4 w-4 shrink-0" /><span>{truncateText(appointment.reason, 25)}</span></button></td><td className="min-w-[140px] whitespace-nowrap px-4 py-3 text-sm"><select title="Change Status" value={appointment.status} onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)} className={`${inputBaseClasses} w-full p-1.5 text-xs`} disabled={isStatusUpdating}>{APPOINTMENT_STATUS_VALUES.map(statusValue => <option key={statusValue} value={statusValue}>{getStatusDisplayName(statusValue)}</option>)}</select></td><td className="whitespace-nowrap px-4 py-3 text-sm font-medium"><div className="flex items-center space-x-2"><button onClick={() => openEditModal(appointment)} className="rounded-md p-1 text-sky-600 hover:text-sky-800 dark:text-sky-400" title="Edit"><FilePenLine className="h-5 w-5" /></button><button onClick={() => requestDeleteAppointment(appointment)} className="rounded-md p-1 text-rose-500 hover:text-rose-700 dark:text-rose-400" title="Delete" disabled={isDeletingAppointment && appointmentToDelete?.appointment_id === appointment.appointment_id}><Trash2 className="h-5 w-5" /></button></div></td></tr>)}</tbody></table></div>)
            }
          </main>
        </section>
      </div>

      {isCreateModalOpen && <CreateAppointment isDarkMode={isDarkMode} onAppointmentCreated={handleAppointmentCreated} onClose={closeCreateModal} />}
      {isEditModalOpen && selectedAppointment && <EditAppointment isDarkMode={isDarkMode} appointment={selectedAppointment} onAppointmentUpdated={handleAppointmentUpdated} onClose={closeEditModal} />}
      <ConfirmationModal isOpen={isConfirmDeleteModalOpen} onClose={cancelDeleteAppointment} onConfirm={confirmDeleteAppointment} title="Confirm Deletion" message={appointmentToDelete ? <>Are you sure you want to delete the appointment for <strong className="font-semibold">{appointmentToDelete.client?.full_name}</strong> on {new Date(appointmentToDelete.appointment_datetime).toLocaleDateString()}?</> : "Are you sure?"} confirmText="Yes, Delete" cancelText="Cancel" isLoading={isDeletingAppointment}  />
      <ReasonDisplayModal isOpen={isReasonModalOpen} onClose={closeReasonModal} reason={reasonToDisplay} partyName={reasonContextName} isDarkMode={isDarkMode} />
    </div>
  );
};

export default UserAppointments;