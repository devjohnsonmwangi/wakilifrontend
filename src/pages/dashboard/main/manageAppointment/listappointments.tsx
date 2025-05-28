// ListAppointments.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  useFetchAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  AppointmentDataTypes,
  AppointmentStatus,
} from '../../../../features/appointment/appointmentapi'; // Adjust path
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; // Adjust path
import { Toaster, toast } from 'sonner';
import CreateAppointment from './createappointment'; // Adjust path
import EditAppointment from './editappointments'; // Adjust path
import ConfirmationModal from './deletion'; // IMPORT THE NEW MODAL (adjust path)

import {
  PlusCircle,
  FilePenLine,
  Trash2,
  AlertTriangle,
  CalendarDays,
  RefreshCcw,
  Search,
  Sun,
  Moon,
} from 'lucide-react';

interface ApiError {
  status?: number | string;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  message?: string;
  error?: string;
}

interface ApiMessageResponse {
  message: string;
}

function isApiMessageResponse(data: unknown): data is ApiMessageResponse {
  return data !== null && typeof data === 'object' && 'message' in data && typeof (data as ApiMessageResponse).message === 'string';
}

const NO_APPOINTMENTS_FOUND_MESSAGE = "🔍 No appointments found. Please add one! 📝";

const getErrorMessage = (error: ApiError | null | undefined): string => {
  if (!error) return 'An unknown error occurred. Please try again.';
  
  const dataMessage = (error.data as { message?: string })?.message;
  if (typeof dataMessage === 'string') {
    if (dataMessage === NO_APPOINTMENTS_FOUND_MESSAGE) {
        return NO_APPOINTMENTS_FOUND_MESSAGE; 
    }
    return dataMessage;
  }
  if (typeof error.error === 'string') {
    return error.error;
  }
  if (typeof error.message === 'string') {
    return error.message;
  }
  return 'Failed to load appointments. Please check your network connection and try refreshing. If the problem persists, contact support.';
};


const ListAppointments: React.FC = () => {
  const { 
    data: appointmentsData, 
    isLoading: isLoadingAppointments, 
    isError: isFetchAppointmentsError, 
    error: queryError, 
    refetch 
  } = useFetchAppointmentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: branchLocations, isLoading: isLoadingBranchLocations } = useFetchBranchLocationsQuery();
  const [updateAppointment, { isLoading: isStatusUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataTypes | null>(null);

  // State for the confirmation modal
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentDataTypes | null>(null);


  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchParty, setSearchParty] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  const [displayableError, setDisplayableError] = useState<ApiError | null>(null);
  const [isBackendNoAppointments, setIsBackendNoAppointments] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference) {
        return storedPreference === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    let noAppointmentsSignal = false;
    let currentError: ApiError | null = null;

    if (isFetchAppointmentsError && queryError) {
      const typedQueryError = queryError as ApiError;
      const errorMessage = getErrorMessage(typedQueryError);
      if (errorMessage === NO_APPOINTMENTS_FOUND_MESSAGE) {
        noAppointmentsSignal = true;
      } else {
        currentError = typedQueryError;
      }
    } else if (!isLoadingAppointments && appointmentsData) { 
      if (isApiMessageResponse(appointmentsData) && appointmentsData.message === NO_APPOINTMENTS_FOUND_MESSAGE) {
        noAppointmentsSignal = true;
      } else if (Array.isArray(appointmentsData) && appointmentsData.length === 0 && !isFetchAppointmentsError) {
        // If API successfully returns an empty array, it's also a "no appointments" scenario for initial display
        noAppointmentsSignal = true;
      }
    }
    
    setIsBackendNoAppointments(noAppointmentsSignal);
    setDisplayableError(currentError);

  }, [isFetchAppointmentsError, queryError, appointmentsData, isLoadingAppointments]);


  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (appointment: AppointmentDataTypes) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedAppointment(null);
    setIsEditModalOpen(false);
  };

  const handleAppointmentCreated = () => {
    refetch();
    toast.success('Appointment created successfully!');
  };

  const handleAppointmentUpdated = () => {
    refetch();
    toast.success('Appointment updated successfully!');
  };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment({ appointment_id: appointmentId, status: newStatus }).unwrap();
      toast.success(`Appointment status updated to ${newStatus}!`);
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
      // refetch(); // RTK Query's tag invalidation should handle this
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      const errorMessage = getErrorMessage(err as ApiError);
      toast.error(`Failed to delete appointment: ${errorMessage}`);
      // Optionally keep modal open on error, or close it
      // setIsConfirmDeleteModalOpen(false); 
    }
  };

  const cancelDeleteAppointment = () => {
    setAppointmentToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };
  
  const actualAppointmentsArray = useMemo(() => {
    if (Array.isArray(appointmentsData)) {
        return appointmentsData;
    }
    return [];
  }, [appointmentsData]);

  const safeAppointmentsData = useMemo(() => {
    // Use actualAppointmentsArray which is guaranteed to be an array or empty
    // The conditions for isBackendNoAppointments handle API specific "no data" messages.
    if (isBackendNoAppointments || displayableError) {
        return [];
    }
    return actualAppointmentsArray;
  }, [actualAppointmentsArray, isBackendNoAppointments, displayableError]);


  const filteredAppointments = useMemo(() => {
    return safeAppointmentsData.filter(appointment => {
      const statusMatch = searchStatus ? appointment.status === searchStatus : true;
      const partyMatch = searchParty ? appointment.party.toLowerCase().includes(searchParty.toLowerCase()) : true;
      
      const branchLocationName = branchLocations?.find(location => location.branch_id === appointment.branch_id)?.name || '';
      const locationMatch = searchLocation ? branchLocationName.toLowerCase().includes(searchLocation.toLowerCase()) : true;

      return statusMatch && partyMatch && locationMatch;
    });
  }, [safeAppointmentsData, searchStatus, searchParty, searchLocation, branchLocations]);

  const LoadingIndicator: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
      <RefreshCcw className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg">Loading appointments...</p>
    </div>
  );

  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null }> = ({ errorToDisplay }) => {
    if (!errorToDisplay) return null; 
    const message = getErrorMessage(errorToDisplay);
     // Do not display if it's the special "no appointments" message, as that's handled by NoAppointmentsMessage
    if (message === NO_APPOINTMENTS_FOUND_MESSAGE) return null;


    return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert">
        <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <div>
            <p className="font-bold text-lg">Error Loading Appointments</p>
            <p className="text-sm">{message}</p>
            </div>
        </div>
        <button
            onClick={() => {
              setDisplayableError(null); 
              refetch();
            }}
            className="mt-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"
        >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
        </button>
        </div>
    );
  };

  const NoAppointmentsMessage: React.FC<{ isInitialEmptyState: boolean }> = ({ isInitialEmptyState }) => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6">
      <CalendarDays className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" />
      <p className="text-xl font-semibold mb-2">
        {isInitialEmptyState ? "No Appointments Yet" : "No Appointments Match Your Filters"}
      </p>
      <p className="text-sm text-center">
        {isInitialEmptyState
          ? "Get started by creating a new appointment!"
          : "Try adjusting your search criteria or clearing some filters."}
      </p>
      {isInitialEmptyState && (
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
  const isFilteringActive = !!(searchParty || searchLocation || searchStatus);

  const isEffectivelyInitialEmpty =
    !isActuallyLoading &&
    !displayableError &&
    !isFilteringActive &&
    (isBackendNoAppointments || (actualAppointmentsArray.length === 0 && !isFetchAppointmentsError));

  const showNoAppointmentsMessage = 
    !isActuallyLoading &&
    !displayableError && 
    filteredAppointments.length === 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-4 sm:p-6 lg:p-8 font-sans">
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full lg:max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl">
        <header className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
              Appointments Dashboard
            </h1>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-opacity-75"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                New Appointment
              </button>
            </div>
          </div>
        </header>

        <section className="p-6 md:p-8">
          <div className="mb-6 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" />
              Filter Appointments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Filter by party name..."
                value={searchParty}
                onChange={(e) => setSearchParty(e.target.value)}
                className="block w-full p-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
              />
              <input
                type="text"
                placeholder="Filter by location name..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="block w-full p-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                disabled={isLoadingBranchLocations}
              />
              <select
                title='Filter by status'
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value as AppointmentStatus | '')}
                className="block w-full p-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <main className="mt-2">
            {isActuallyLoading ? (
              <LoadingIndicator />
            ) : displayableError ? (
              <ErrorDisplay errorToDisplay={displayableError} />
            ) : showNoAppointmentsMessage ? (
                <NoAppointmentsMessage 
                    isInitialEmptyState={isEffectivelyInitialEmpty}
                />
            ) : (
              <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full leading-normal">
                  <thead className="bg-sky-600 dark:bg-sky-700">
                    <tr>
                      {['ID', 'Party', 'Date', 'Time', 'Reason', 'Status', 'Location', 'Actions'].map(header => (
                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-white dark:text-sky-100 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredAppointments.map((appointment, index) => (
                      <tr key={appointment.appointment_id} className={`${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/70 dark:bg-slate-900/50'} hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{appointment.appointment_id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.party}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.appointment_time}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs">
                          <textarea
                            title='Reason'
                            readOnly
                            value={appointment.reason}
                            rows={2}
                            className="w-full h-auto read-only:bg-transparent read-only:border-none p-0 focus:ring-0 resize-none text-sm text-slate-700 dark:text-slate-300 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                          <select
                            title="Change Status"
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)}
                            className="text-xs sm:text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 block w-full p-1.5 sm:p-2 shadow-sm transition-colors disabled:opacity-70"
                            disabled={isStatusUpdating}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                          {isLoadingBranchLocations ? 'Loading...' : (branchLocations?.find(location => location.branch_id === appointment.branch_id)?.name || 'N/A')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(appointment)}
                              className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700"
                              title="Edit Appointment"
                            >
                              <FilePenLine className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => requestDeleteAppointment(appointment)}
                              className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-100 dark:hover:bg-slate-700 disabled:opacity-50"
                              disabled={isDeletingAppointment && appointmentToDelete?.appointment_id === appointment.appointment_id}
                              title="Delete Appointment"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </section>
      </div>

      {isCreateModalOpen && (
        <CreateAppointment
          // Pass a default branchId if needed, or make CreateAppointment handle empty forBranchId
          forBranchId={branchLocations && branchLocations.length > 0 ? branchLocations[0].branch_id : ''}
          onAppointmentCreated={handleAppointmentCreated}
          onClose={closeCreateModal}
          isDarkMode={isDarkMode} // Pass dark mode to CreateAppointment
        />
      )}

      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          appointment={selectedAppointment}
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={closeEditModal}
          isDarkMode={isDarkMode} // Pass dark mode to EditAppointment
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
              {new Date(appointmentToDelete.appointment_date).toLocaleDateString()} at{' '}
              {appointmentToDelete.appointment_time}? This action cannot be undone.
            </>
          ) : (
            "Are you sure you want to delete this appointment? This action cannot be undone."
          )
        }
        confirmText="Yes, Delete Appointment"
        cancelText="No, Keep It"
        isLoading={isDeletingAppointment}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ListAppointments;