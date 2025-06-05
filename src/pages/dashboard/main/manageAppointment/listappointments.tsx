// ListAppointments.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  useFetchAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  AppointmentDataTypes,
  AppointmentStatus,
  FetchAppointmentsArgs,
} from '../../../../features/appointment/appointmentapi'; // ADJUSTED PATH
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; // Assuming this stays
import { Toaster, toast } from 'sonner';
import CreateAppointment from './createappointment'; // Adjust path
import EditAppointment from './editappointments';   // Adjust path
import ConfirmationModal from './deletion';         // Adjust path
import ReasonDisplayModal from './ReasonDisplayModal'; // Adjust path

import {
  PlusCircle,
  FilePenLine,
  Trash2,
  AlertTriangle, // Will be used in ErrorDisplay
  CalendarDays,
  RefreshCcw,   // Will be used in LoadingIndicator & ErrorDisplay
         // Will be used in filter section
  Sun,
  Moon,
  Eye,
  ListFilter,
} from 'lucide-react';

interface ApiError {
  status?: number | string;
  data?: { message?: string; error?: string; errors?: Array<{ field: string; message: string }>; [key: string]: unknown; };
  message?: string;
  error?: string;
}

const NO_APPOINTMENTS_FOUND_MESSAGE = "🔍 No appointments found. Please add one! 📝";

const getErrorMessage = (error: ApiError | null | undefined): string => {
  if (!error) return 'An unknown error occurred. Please try again.';
  const data = error.data;
  if (data) {
    if (typeof data === 'string') return data; // Use the string directly if it's the error message
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map(e => `${e.field ? `${e.field}: ` : ''}${e.message}`).join('; ');
    }
  }
  if (error.message) return error.message;
  if (error.error) return error.error; // Common for client-side fetch errors
  if (error.status) return `An error occurred (Status: ${error.status}). Please try again.`;
  return 'Failed to perform action. Please check network or try again.';
};

const getStatusDisplayName = (status: AppointmentStatus | string): string => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "rescheduled", "no_show"];

const ListAppointments: React.FC = () => {
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchParty, setSearchParty] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBranchId, setSearchBranchId] = useState<string | number | ''>('');
  const [searchClientId, setSearchClientId] = useState<string | number | ''>('');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');

  const queryArgs: FetchAppointmentsArgs | void = useMemo(() => {
    const args: FetchAppointmentsArgs = {};
    let hasArgs = false;
    if (searchStatus) { args.status = searchStatus; hasArgs = true; }
    if (searchBranchId) { args.branchId = Number(searchBranchId); hasArgs = true; }
    if (searchClientId) { args.clientId = Number(searchClientId); hasArgs = true; }
    if (searchDateFrom) { args.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString(); hasArgs = true; }
    if (searchDateTo) { args.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString(); hasArgs = true; }
    // args.limit = 20;
    // args.offset = 0;
    return hasArgs ? args : undefined;
  }, [searchStatus, searchBranchId, searchClientId, searchDateFrom, searchDateTo]);

  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    isError: isFetchAppointmentsError,
    error: queryError,
    refetch // Now used in ErrorDisplay
  } = useFetchAppointmentsQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const { data: branchLocations, isLoading: isLoadingBranchLocations } = useFetchBranchLocationsQuery();
  const [updateAppointment, { isLoading: isStatusUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataTypes | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentDataTypes | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reasonToDisplay, setReasonToDisplay] = useState('');
  const [reasonPartyName, setReasonPartyName] = useState('');
  const [displayableError, setDisplayableError] = useState<ApiError | null>(null);
  const [isBackendNoAppointments, setIsBackendNoAppointments] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      return storedPreference ? storedPreference === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    if (typeof window !== 'undefined') localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);

  useEffect(() => {
    let noAppointmentsSignal = false;
    let currentError: ApiError | null = null;
    if (isFetchAppointmentsError && queryError) {
      const typedQueryError = queryError as ApiError;
      const errorMessage = getErrorMessage(typedQueryError);
      if (errorMessage === NO_APPOINTMENTS_FOUND_MESSAGE || typedQueryError.status === 404) {
        noAppointmentsSignal = true;
      } else {
        currentError = typedQueryError;
      }
    } else if (!isLoadingAppointments && appointmentsData) {
      if (Array.isArray(appointmentsData) && appointmentsData.length === 0) {
        noAppointmentsSignal = true;
      }
    }
    setIsBackendNoAppointments(noAppointmentsSignal);
    setDisplayableError(currentError);
  }, [isFetchAppointmentsError, queryError, appointmentsData, isLoadingAppointments]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openEditModal = (appointment: AppointmentDataTypes) => { setSelectedAppointment(appointment); setIsEditModalOpen(true); };
  const closeEditModal = () => { setSelectedAppointment(null); setIsEditModalOpen(false); };
  const openReasonModal = (reason: string, partyName: string) => { setReasonToDisplay(reason); setReasonPartyName(partyName); setIsReasonModalOpen(true); };
  const closeReasonModal = () => { setReasonToDisplay(''); setReasonPartyName(''); setIsReasonModalOpen(false); };

  const handleAppointmentCreated = () => { toast.success('Appointment created successfully!'); };
  const handleAppointmentUpdated = () => { toast.success('Appointment updated successfully!'); };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment({ appointment_id: appointmentId, status: newStatus }).unwrap();
      toast.success(`Appointment status updated to ${getStatusDisplayName(newStatus)}!`);
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      const errorMessage = getErrorMessage(err as ApiError);
      toast.error(`Failed to update status: ${errorMessage}`);
    }
  };

  const requestDeleteAppointment = (appointment: AppointmentDataTypes) => {
    setAppointmentToDelete(appointment);
    setIsConfirmDeleteModalOpen(true);
  };
  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete.appointment_id).unwrap();
      toast.success(`Appointment for ${appointmentToDelete.party} deleted successfully!`);
      setAppointmentToDelete(null);
      setIsConfirmDeleteModalOpen(false);
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      const errorMessage = getErrorMessage(err as ApiError);
      toast.error(`Failed to delete appointment: ${errorMessage}`);
    }
  };
  const cancelDeleteAppointment = () => { setAppointmentToDelete(null); setIsConfirmDeleteModalOpen(false); };

  const actualAppointmentsArray = useMemo(() => {
    return Array.isArray(appointmentsData) ? appointmentsData : [];
  }, [appointmentsData]);

  const filteredAppointments = useMemo(() => {
    if (isBackendNoAppointments || displayableError) return [];
    return actualAppointmentsArray.filter(appointment => {
      const partyMatch = searchParty ? (appointment.party?.toLowerCase() || '').includes(searchParty.toLowerCase()) || (appointment.client?.full_name?.toLowerCase() || '').includes(searchParty.toLowerCase()) : true;
      const branchLocationName = appointment.branch?.name?.toLowerCase() || '';
      const locationMatch = searchLocation ? branchLocationName.includes(searchLocation.toLowerCase()) : true;
      return partyMatch && locationMatch;
    });
  }, [actualAppointmentsArray, isBackendNoAppointments, displayableError, searchParty, searchLocation]);

  const LoadingIndicator: React.FC<{ text?: string }> = ({ text = "Loading appointments..." }) => ( // Added text prop
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
      <RefreshCcw className="h-12 w-12 animate-spin mb-4" /> {/* USED RefreshCcw */}
      <p className="text-lg">{text}</p>
    </div>
  );

  // CORRECTED ErrorDisplay Component
  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null; onRetry?: () => void }> = ({ errorToDisplay, onRetry }) => {
    if (!errorToDisplay) return null; // Return null if no error
    const message = getErrorMessage(errorToDisplay);
    // Don't show "no appointments" as a big red error if it's handled elsewhere
    if (message === NO_APPOINTMENTS_FOUND_MESSAGE && !onRetry) return null;

    return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert">
            <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 mr-3" /> {/* USED AlertTriangle */}
                <div>
                    <p className="font-bold text-lg">Error Loading Appointments</p>
                    <p className="text-sm">{message}</p>
                </div>
            </div>
            {onRetry && ( // Only show retry button if onRetry is provided
                <button
                    onClick={onRetry}
                    className="mt-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"
                >
                    <RefreshCcw className="h-4 w-4 mr-2" /> {/* USED RefreshCcw */}
                    Try Again
                </button>
            )}
        </div>
    );
  };

  const NoAppointmentsMessage: React.FC<{ isFiltering: boolean }> = ({ isFiltering }) => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6">
      <CalendarDays className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" />
      <p className="text-xl font-semibold mb-2">
        {isFiltering ? "No Appointments Match Your Filters" : "No Appointments Yet"}
      </p>
      <p className="text-sm text-center">
        {isFiltering
          ? "Try adjusting your search criteria or clearing some filters."
          : "Get started by creating a new appointment!"}
      </p>
      {!isFiltering && (
         <button
            onClick={openCreateModal}
            className="mt-6 flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-opacity-75"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create First Appointment
          </button>
      )}
    </div>
  );

  const isActuallyLoading = isLoadingAppointments || isLoadingBranchLocations;
  const isFilteringActive = !!(searchParty || searchLocation || searchStatus || searchBranchId || searchClientId || searchDateFrom || searchDateTo);
  const showNoAppointmentsMessage = !isActuallyLoading && !displayableError && filteredAppointments.length === 0;

  const inputClass = "block w-full p-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500";

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300`}>
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full lg:max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
        <header className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
              Appointments Dashboard
            </h1>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}> {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />} </button>
              <button onClick={openCreateModal} className="flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all"> <PlusCircle className="h-5 w-5 mr-2" /> New Appointment </button>
            </div>
          </div>
        </header>

        <section className="p-6 md:p-8">
          <div className="mb-6 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
              <ListFilter className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> {/* USED ListFilter if preferred over Search */}
              Filter Appointments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
              <input type="text" placeholder="Party/Client (Client-side)..." value={searchParty} onChange={(e) => setSearchParty(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Location Name (Client-side)..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className={inputClass}/>
              <select title='Status (Server-side)' value={searchStatus} onChange={(e) => setSearchStatus(e.target.value as AppointmentStatus | '')} className={inputClass}>
                <option value="">All Statuses</option>
                {APPOINTMENT_STATUS_VALUES.map(status => (<option key={status} value={status}>{getStatusDisplayName(status)}</option>))}
              </select>
              <select title="Branch (Server-side)" value={searchBranchId} onChange={(e) => setSearchBranchId(e.target.value)} className={inputClass} disabled={isLoadingBranchLocations}>
                <option value="">All Branches</option>
                {isLoadingBranchLocations ? <option disabled>Loading...</option> : branchLocations?.map(loc => <option key={loc.branch_id} value={loc.branch_id}>{loc.name}</option>)}
              </select>
              <input type="number" placeholder="Client ID (Server-side)..." value={searchClientId} onChange={(e) => setSearchClientId(e.target.value)} className={inputClass} />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" title="Date From (Server-side)" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={inputClass} />
                <input type="date" title="Date To (Server-side)" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={inputClass} min={searchDateFrom || undefined} />
              </div>
            </div>
          </div>

          <main className="mt-2">
            {isActuallyLoading ? ( <LoadingIndicator /> ) :
             displayableError ? ( <ErrorDisplay errorToDisplay={displayableError} onRetry={refetch} /> ) : // Passed refetch to onRetry
             showNoAppointmentsMessage ? ( <NoAppointmentsMessage isFiltering={isFilteringActive} /> ) : (
              <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full leading-normal">
                  <thead className="bg-sky-600 dark:bg-sky-700">
                    <tr>
                      {['ID', 'Client', 'Party', 'Date & Time', 'Reason', 'Status', 'Location', 'Actions'].map(header => (
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.client?.full_name || 'N/A'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.party}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                            {displayDate} at {displayTime}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs whitespace-nowrap">
                            {appointment.reason ? (
                              <button onClick={() => openReasonModal(appointment.reason, appointment.party)} className="flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700 text-xs" title="View Full Reason">
                                <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span>{truncateText(appointment.reason, 25)}</span>
                              </button>
                            ) : ( <span className="text-slate-400 dark:text-slate-500 italic text-xs">No reason</span> )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 min-w-[130px]">
                            <select title="Change Status" value={appointment.status} onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)} className="block text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 w-full p-1.5 shadow-sm transition-colors disabled:opacity-70" disabled={isStatusUpdating}>
                              {APPOINTMENT_STATUS_VALUES.map(statusValue => (
                                  <option key={statusValue} value={statusValue}>{getStatusDisplayName(statusValue)}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                            {appointment.branch?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => openEditModal(appointment)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700" title="Edit Appointment"> <FilePenLine className="h-5 w-5" /> </button>
                              <button onClick={() => requestDeleteAppointment(appointment)} className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled={isDeletingAppointment && appointmentToDelete?.appointment_id === appointment.appointment_id} title="Delete Appointment"> <Trash2 className="h-5 w-5" /> </button>
                            </div>
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

      {isCreateModalOpen && (
        <CreateAppointment
          forBranchId={searchBranchId || (branchLocations && branchLocations.length > 0 ? String(branchLocations[0].branch_id) : '')}
          onAppointmentCreated={handleAppointmentCreated}
          onClose={closeCreateModal}
          isDarkMode={isDarkMode}
        />
      )}

      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          appointment={selectedAppointment}
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={closeEditModal}
          isDarkMode={isDarkMode}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={cancelDeleteAppointment}
        onConfirm={confirmDeleteAppointment}
        title="Confirm Deletion"
        message={
          appointmentToDelete ? (
            <>
              Are you sure you want to delete the appointment for{' '}
              <strong className="font-semibold">{appointmentToDelete.party}</strong> on{' '}
              {new Date(appointmentToDelete.appointment_datetime).toLocaleDateString()} at{' '}
              {new Date(appointmentToDelete.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              ? This action cannot be undone.
            </>
          ) : ( "Are you sure you want to delete this appointment? This action cannot be undone." )
        }
        confirmText="Yes, Delete Appointment"
        cancelText="No, Keep It"
        isLoading={isDeletingAppointment}
        isDarkMode={isDarkMode}
      />

      <ReasonDisplayModal
        isOpen={isReasonModalOpen}
        onClose={closeReasonModal}
        reason={reasonToDisplay}
        partyName={reasonPartyName}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ListAppointments;