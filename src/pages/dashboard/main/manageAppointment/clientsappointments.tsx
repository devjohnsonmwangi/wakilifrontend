import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- ACTION: Corrected imports to use the new unified API and types ---
import {
  useListAppointmentsQuery,
  Appointment,
  AppointmentStatus,
  ListAppointmentsArgs,
   // Import BranchLocation from the correct file
} from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi';
import { selectCurrentUserId, selectCurrentUser } from '../../../../features/users/userSlice';

// Child components (ensure they are updated for the `Appointment` type)
import EditAppointment from './editappointments';
import ReasonDisplayModal from './ReasonDisplayModal';

import { FilePenLine, AlertTriangle, CalendarDays, RefreshCcw, Sun, Moon, LogIn, ImageOff, Eye, Briefcase, Users as StaffIcon, ListFilter, Search, ChevronDown, X } from 'lucide-react';

// --- Type and Helper Function Definitions ---
interface ApiError {
  status?: number | string;
  data?: { message?: string; error?: string; };
}

const NO_APPOINTMENTS_FOUND_MESSAGE = "You have no scheduled appointments.";
const getErrorMessage = (error: ApiError | null | undefined): string => error?.data?.message || error?.data?.error || `Error: ${error?.status || 'Unknown'}`;
const getStatusDisplayName = (status: string): string => status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
const truncateText = (text: string | null | undefined, maxLength: number): string => !text || text.length <= maxLength ? text || '' : `${text.substring(0, maxLength)}...`;
const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

const ClientAppointments: React.FC = () => {
  // Redux & User State
  const clientId = useSelector(selectCurrentUserId);
  const currentUser = useSelector(selectCurrentUser);
  const userFullName = currentUser?.full_name || "Client";
  const profilePictureUrl = currentUser?.profile_picture || null;
  const [imgError, setImgError] = useState(false);

  // Filters
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchStaffName, setSearchStaffName] = useState('');
  const [searchBranchId, setSearchBranchId] = useState<number | ''>('');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');

  // UI State
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reasonToDisplay, setReasonToDisplay] = useState('');
  const [reasonContextName, setReasonContextName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false);

  // Refs
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const statusFilterDropdownRef = useRef<HTMLDivElement>(null);

  // --- ACTION: Consolidated all filters into a single `queryArgs` object ---
  const queryArgs: ListAppointmentsArgs | undefined = useMemo(() => {
    if (!clientId) return undefined;
    const args: ListAppointmentsArgs = { clientId };
    if (searchStatus) args.status = searchStatus;
    if (searchBranchId) args.branchId = searchBranchId;
    if (searchDateFrom) args.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString();
    if (searchDateTo) args.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString();
    return args;
  }, [clientId, searchStatus, searchBranchId, searchDateFrom, searchDateTo]);

  // --- ACTION: Replaced old hook with the unified `useListAppointmentsQuery` ---
  const { data: appointmentsData, isLoading: isLoadingAppointments, isError, error: queryError, refetch } = useListAppointmentsQuery(
    queryArgs!, { skip: !clientId, refetchOnMountOrArgChange: true }
  );

  const { data: branchLocations, isLoading: isLoadingBranchLocations } = useFetchBranchLocationsQuery();

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
  const openEditModal = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsEditModalOpen(true); };
  const closeEditModal = () => setSelectedAppointment(null);
  const openReasonModal = (reason: string, party: string) => { setReasonToDisplay(reason); setReasonContextName(party); setIsReasonModalOpen(true); };
  const closeReasonModal = () => setIsReasonModalOpen(false);
  const handleAppointmentUpdated = () => toast.success("Your appointment change request has been submitted.");

  // Memos & Derived State
  const filteredAppointments = useMemo(() => {
    const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
    if (!searchStaffName) return appointments;
    // Client-side search for staff names
    return appointments.filter(appointment =>
      appointment.assignees?.some(a => a.assignee?.full_name?.toLowerCase().includes(searchStaffName.toLowerCase()))
    );
  }, [appointmentsData, searchStaffName]);

  const isActuallyLoading = isLoadingAppointments || isLoadingBranchLocations;
  const isFilteringActive = !!(searchStaffName || searchBranchId || searchStatus || searchDateFrom || searchDateTo);
  const showNoAppointmentsMessage = !isActuallyLoading && !queryError && filteredAppointments.length === 0;

  // Reusable UI Components
  const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors placeholder:text-slate-400`;
  const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
  const ProfilePictureFallback = () => <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-400 dark:bg-slate-600 dark:text-slate-300"><ImageOff className="h-6 w-6" /></div>;

  if (!clientId || !currentUser) return <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-900"><div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800"><LogIn className="mx-auto mb-6 h-16 w-16 text-sky-500" /><h2 className="mb-3 text-2xl font-semibold text-slate-700 dark:text-slate-200">View Your Appointments</h2><p className="text-slate-500 dark:text-slate-400">Please log in to see your scheduled appointments.</p></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 p-2 font-sans dark:from-slate-900 dark:to-sky-950 sm:p-4 lg:p-6">
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="mx-auto max-w-full overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800 lg:max-w-7xl">
        <header className="border-b border-slate-200 p-4 dark:border-slate-700 md:p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center"><div className="mr-3 flex-shrink-0">{profilePictureUrl && !imgError ? <img src={profilePictureUrl} alt={userFullName} className="h-10 w-10 rounded-full border-2 border-sky-200 object-cover dark:border-sky-700" onError={() => setImgError(true)} /> : <ProfilePictureFallback />}</div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">My Appointments</h1></div>
            <div className="mt-4 flex items-center space-x-3 sm:mt-0"><button onClick={toggleDarkMode} className="rounded-full p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" title="Toggle Dark Mode">{isDarkMode ? <Sun /> : <Moon />}</button></div>
          </div>
        </header>

        <section className="p-4 md:p-6">
          <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50/70 p-4 shadow-sm dark:border-sky-700 dark:bg-sky-700/30">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-700 dark:text-slate-200"><ListFilter className="mr-2 h-5 w-5 text-slate-500" />Filter Appointments</h2>
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search by Staff Name..." value={searchStaffName} onChange={(e) => setSearchStaffName(e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{searchStaffName && <button onClick={() => setSearchStaffName('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}</div>
              <div ref={locationDropdownRef} className="relative"><button onClick={() => setIsLocationDropdownOpen(p => !p)} className={`${inputBaseClasses} flex items-center justify-between py-2.5 px-4 text-left`} disabled={isLoadingBranchLocations}><span className={`truncate font-semibold ${!searchBranchId ? 'font-normal text-slate-400' : ''}`}>{isLoadingBranchLocations ? 'Loading...' : branchLocations?.find(b => b.branch_id === searchBranchId)?.name || 'All Locations'}</span><div className="flex items-center">{searchBranchId && <button onClick={(e) => { e.stopPropagation(); setSearchBranchId(''); }} className="mr-1 rounded-full p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isLocationDropdownOpen && <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg dark:border-slate-600 dark:bg-slate-900"><li><button onClick={() => { setSearchBranchId(''); setIsLocationDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">All Locations</button></li>{branchLocations?.map(loc => <li key={loc.branch_id}><button onClick={() => { setSearchBranchId(loc.branch_id); setIsLocationDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">{loc.name}</button></li>)}</motion.ul>}</AnimatePresence></div>
              <div ref={statusFilterDropdownRef} className="relative"><button onClick={() => setIsStatusFilterDropdownOpen(p => !p)} className={`${inputBaseClasses} flex items-center justify-between py-2.5 px-4 text-left`}><span className={`truncate font-semibold ${!searchStatus ? 'font-normal text-slate-400' : ''}`}>{searchStatus ? getStatusDisplayName(searchStatus) : 'All Statuses'}</span><div className="flex items-center">{searchStatus && <button onClick={(e) => { e.stopPropagation(); setSearchStatus(''); }} className="mr-1 rounded-full p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusFilterDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusFilterDropdownOpen && <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg dark:border-slate-600 dark:bg-slate-900"><li><button onClick={() => { setSearchStatus(''); setIsStatusFilterDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">All Statuses</button></li>{APPOINTMENT_STATUS_VALUES.map(status => <li key={status}><button onClick={() => { setSearchStatus(status); setIsStatusFilterDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/50">{getStatusDisplayName(status)}</button></li>)}</motion.ul>}</AnimatePresence></div>
              <div className="grid grid-cols-2 gap-2"><div className="relative"><input type="date" title="Date From" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} />{searchDateFrom && <button onClick={() => setSearchDateFrom('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400"><X size={16} /></button>}</div><div className="relative"><input type="date" title="Date To" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={`${inputBaseClasses} py-2.5 px-4 pr-8`} min={searchDateFrom || undefined} />{searchDateTo && <button onClick={() => setSearchDateTo('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400"><X size={16} /></button>}</div></div>
            </div>
          </div>
          
          <main className="mt-2">
            {isActuallyLoading ? <div className="flex items-center justify-center py-10"><RefreshCcw className="h-8 w-8 animate-spin text-sky-500 mr-3" /> Loading appointments...</div> :
             isError ? <div className="my-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-800 shadow dark:bg-red-900/30 dark:text-red-300"><div className="flex items-center"><AlertTriangle className="mr-3 h-6 w-6" /><p className="font-semibold">{getErrorMessage(queryError as ApiError)}</p></div><button onClick={refetch} className="mt-3 rounded-md bg-red-200 px-3 py-1 text-sm font-medium hover:bg-red-300 dark:bg-red-800/50 dark:hover:bg-red-800">Try Again</button></div> :
             showNoAppointmentsMessage ? <div className="my-6 rounded-lg bg-slate-50 p-6 text-center shadow dark:bg-slate-700/50"><CalendarDays className="mx-auto mb-4 h-16 w-16 text-slate-400" /><p className="text-xl font-semibold">{isFilteringActive ? "No appointments match your filters" : NO_APPOINTMENTS_FOUND_MESSAGE}</p><p className="text-sm">{isFilteringActive ? "Try adjusting your search criteria." : "New appointments will appear here."}</p></div> :
             (<div className="overflow-x-auto rounded-lg border border-slate-200 shadow-lg dark:border-slate-700"><table className="min-w-full leading-normal"><thead className="bg-sky-600 dark:bg-sky-700"><tr>{['ID', 'Date & Time', 'Branch', 'Assigned Staff', 'Reason', 'Status', 'Actions'].map(header => <th key={header} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">{filteredAppointments.map(appointment => <tr key={appointment.appointment_id} className="hover:bg-sky-50 dark:hover:bg-slate-700/60"><td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-200">{appointment.appointment_id}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{new Date(appointment.appointment_datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center"><Briefcase className="mr-1.5 h-4 w-4 text-slate-400" />{appointment.branch?.name || 'N/A'}</div></td><td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{appointment.assignees?.map(a => <div key={a.assignee_user_id} className="flex items-center my-0.5"><StaffIcon className="mr-1.5 h-4 w-4 text-slate-400" /><span className="truncate max-w-[150px]">{a.assignee?.full_name || '...'}</span></div>) || <span className="italic text-slate-500">Pending</span>}</td><td className="max-w-xs whitespace-nowrap px-4 py-3 text-sm"><button onClick={() => openReasonModal(appointment.reason, "Appointment Reason")} className="flex items-center rounded-md p-1 text-xs text-sky-600 hover:text-sky-800 dark:text-sky-400" title="View Reason"><Eye className="mr-1 h-4 w-4 shrink-0" /><span>{truncateText(appointment.reason, 20)}</span></button></td><td className="whitespace-nowrap px-4 py-3 text-sm"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : appointment.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' : appointment.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'}`}>{getStatusDisplayName(appointment.status)}</span></td><td className="whitespace-nowrap px-4 py-3 text-sm font-medium"><div className="flex items-center space-x-2"><button onClick={() => openEditModal(appointment)} className="rounded-md p-1 text-sky-600 hover:text-sky-800 dark:text-sky-400" title="View Details / Request Change"><FilePenLine className="h-5 w-5" /></button></div></td></tr>)}</tbody></table></div>)
            }
          </main>
        </section>
      </div>

      {isEditModalOpen && selectedAppointment && clientId && (<EditAppointment isDarkMode={isDarkMode} appointment={selectedAppointment} onAppointmentUpdated={handleAppointmentUpdated} onClose={closeEditModal} isClientView={true} />)}
      <ReasonDisplayModal isOpen={isReasonModalOpen} onClose={closeReasonModal} reason={reasonToDisplay} partyName={reasonContextName} isDarkMode={isDarkMode} />
    </div>
  );
};

export default ClientAppointments;