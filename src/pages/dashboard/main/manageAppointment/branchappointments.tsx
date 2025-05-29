// BranchAppointments.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  useFetchBranchAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  AppointmentDataTypes,
  AppointmentStatus,
} from '../../../../features/appointment/appointmentapi'; // Adjust path
import { 
  useFetchBranchLocationsQuery,
  BranchLocationDataTypes
} from '../../../../features/branchlocation/branchlocationapi'; // Adjust path
import { Toaster, toast } from 'sonner';
import CreateAppointment from './createappointment'; // Adjust path
import EditAppointment from './editappointments';   // Adjust path
import ConfirmationModal from './deletion'; // IMPORT THE CONFIRMATION MODAL
import ReasonDisplayModal from './ReasonDisplayModal'; // IMPORT THE REASON MODAL (adjust path if needed)

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
  MapPin,
  ListFilter,
  Eye, // For View Reason button
 // For Reason Modal (icon)
} from 'lucide-react';

interface ApiError {
  status?: number | string;
  data?: { message?: string; [key: string]: unknown; };
  message?: string;
  error?: string;
}
interface ApiMessageResponse { message: string; }

function isApiMessageResponse(data: unknown): data is ApiMessageResponse {
  return data !== null && typeof data === 'object' && 'message' in data && typeof (data as ApiMessageResponse).message === 'string';
}

const NO_APPOINTMENTS_FOUND_MESSAGE = "❌ No appointments found for this branch."; // Specific message for this component

const getErrorMessage = (error: ApiError | null | undefined): string => {
  if (!error) return 'An unknown error occurred. Please try again.';
  const dataMessage = (error.data as { message?: string })?.message;
  if (typeof dataMessage === 'string') {
    if (dataMessage === NO_APPOINTMENTS_FOUND_MESSAGE) { // Check for this specific message
      return NO_APPOINTMENTS_FOUND_MESSAGE;
    }
    return dataMessage;
  }
  if (typeof error.error === 'string') return error.error;
  if (typeof error.message === 'string') return error.message;
  return 'Failed to load. Please check network and try refreshing.';
};

// Helper to get a display-friendly status name (copied from ListAppointments)
const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'confirmed': return 'Confirmed';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default:
      if (typeof status === 'string' && status.length > 0) {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }
      return String(status);
  }
};

// Helper to truncate text (copied from ListAppointments)
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''; 
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};


interface NoAppointmentsMessageProps {
  isInitialEmptyState: boolean;
}


const BranchAppointments: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | number | ''>('');
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);

  const { 
    data: allBranches, 
    isLoading: isLoadingBranches, 
    isError: isErrorBranches,
    error: branchFetchError,
    refetch: refetchBranches,
  } = useFetchBranchLocationsQuery();

  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    isError: isFetchAppointmentsError,
    error: queryError,
    refetch: refetchBranchAppointments,
  } = useFetchBranchAppointmentsQuery(selectedBranchId!, {
    skip: !selectedBranchId,
    refetchOnMountOrArgChange: true,
  });
  
  const [updateAppointment, { isLoading: isStatusUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataTypes | null>(null);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentDataTypes | null>(null);

  // State for Reason Display Modal
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reasonToDisplay, setReasonToDisplay] = useState('');
  const [reasonPartyName, setReasonPartyName] = useState('');

  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchParty, setSearchParty] = useState('');

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

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    let noAppointmentsSignal = false;
    let currentError: ApiError | null = null;

    if (!selectedBranchId) {
      setIsBackendNoAppointments(false);
      setDisplayableError(null);
      return;
    }

    if (isFetchAppointmentsError && queryError) {
      const typedQueryError = queryError as ApiError;
      const errorMessageText = getErrorMessage(typedQueryError); // Use the local getErrorMessage
      if (errorMessageText === NO_APPOINTMENTS_FOUND_MESSAGE) {
        noAppointmentsSignal = true;
      } else {
        currentError = typedQueryError;
      }
    } else if (!isLoadingAppointments && appointmentsData) {
      if (isApiMessageResponse(appointmentsData)) {
         if(appointmentsData.message === NO_APPOINTMENTS_FOUND_MESSAGE) noAppointmentsSignal = true;
      } else if (Array.isArray(appointmentsData) && appointmentsData.length === 0) {
        noAppointmentsSignal = true;
      }
    }
    
    setIsBackendNoAppointments(noAppointmentsSignal);
    setDisplayableError(currentError);

  }, [isFetchAppointmentsError, queryError, appointmentsData, isLoadingAppointments, selectedBranchId]);

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranchId = event.target.value;
    setSelectedBranchId(newBranchId);
    if (newBranchId) {
      const branch = allBranches?.find(b => String(b.branch_id) === newBranchId);
      setSelectedBranchName(branch?.name || 'Unknown Branch');
      // Reset filters when branch changes
      setSearchParty('');
      setSearchStatus('');
    } else {
      setSelectedBranchName(null);
    }
  };

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
  
  // Functions for Reason Display Modal
  const openReasonModal = (reason: string, partyName: string) => {
    setReasonToDisplay(reason);
    setReasonPartyName(partyName);
    setIsReasonModalOpen(true);
  };
  const closeReasonModal = () => {
    setIsReasonModalOpen(false);
    setReasonToDisplay('');
    setReasonPartyName('');
  };
  
  const handleAppointmentCreated = () => { 
    if (selectedBranchId) refetchBranchAppointments(); 
    toast.success('Appointment created successfully!'); 
  };
  const handleAppointmentUpdated = () => { 
    if (selectedBranchId) refetchBranchAppointments(); 
    toast.success('Appointment updated successfully!'); 
  };
  
  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment({ appointment_id: appointmentId, status: newStatus }).unwrap();
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}!`); // Use display name
    } catch (err) {
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
      toast.success(`Appointment for ${appointmentToDelete.party} (Branch: ${selectedBranchName || 'N/A'}) deleted!`);
      setAppointmentToDelete(null);
      setIsConfirmDeleteModalOpen(false);
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      const errorMessage = getErrorMessage(err as ApiError);
      toast.error(`Failed to delete: ${errorMessage}`);
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
    if (!selectedBranchId || isBackendNoAppointments || displayableError) return []; // Added conditions
    return actualAppointmentsArray;
  }, [actualAppointmentsArray, selectedBranchId, isBackendNoAppointments, displayableError]);
  
  const filteredAppointments = useMemo(() => {
    return safeAppointmentsData.filter(appointment => {
      const statusMatch = searchStatus ? appointment.status === searchStatus : true;
      const partyMatch = searchParty ? appointment.party.toLowerCase().includes(searchParty.toLowerCase()) : true;
      return statusMatch && partyMatch;
    });
  }, [safeAppointmentsData, searchStatus, searchParty]);

  const LoadingIndicator: React.FC<{text?: string}> = ({text = "Loading..."}) => ( 
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
      <RefreshCcw className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg">{text}</p>
    </div>
  );
  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null, onTryAgain?: () => void }> = ({ errorToDisplay, onTryAgain }) => { 
    if (!errorToDisplay) return null;
    const message = getErrorMessage(errorToDisplay); // Use local getErrorMessage
    // Don't show error if it's the "no appointments" message and no try again button (handled by NoAppointmentsMessage)
    if (message === NO_APPOINTMENTS_FOUND_MESSAGE && !onTryAgain) return null; 
    return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert">
        <div className="flex items-center"> <AlertTriangle className="h-8 w-8 mr-3" /> <div> <p className="font-bold text-lg">Error</p> <p className="text-sm">{message}</p> </div> </div>
        {onTryAgain && (
            <button onClick={onTryAgain} className="mt-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"> <RefreshCcw className="h-4 w-4 mr-2" /> Try Again </button>
        )}
        </div>
    );
  };
  
  const NoAppointmentsMessage: React.FC<NoAppointmentsMessageProps> = ({ isInitialEmptyState }) => ( 
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6">
      <CalendarDays className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" />
      <p className="text-xl font-semibold mb-2">{isInitialEmptyState ? `${NO_APPOINTMENTS_FOUND_MESSAGE} for ${selectedBranchName || 'this branch'}` : "No appointments match your filters"}</p>
      <p className="text-sm text-center">{isInitialEmptyState ? "Be the first to add one!" : "Try adjusting your search criteria or clearing some filters."}</p>
      {isInitialEmptyState && selectedBranchId && (<button onClick={openCreateModal} className="mt-6 flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-opacity-75"> <PlusCircle className="h-5 w-5 mr-2" /> Create Appointment </button>)}
    </div>
  );

  const isOverallLoading = isLoadingBranches || (!!selectedBranchId && isLoadingAppointments);
  const isFilteringActive = !!(searchParty || searchStatus);
  
  const isEffectivelyInitialEmpty = 
    !isOverallLoading && 
    !displayableError && 
    !isErrorBranches &&
    !!selectedBranchId &&
    !isFilteringActive && 
    (isBackendNoAppointments || (actualAppointmentsArray.length === 0 && !isFetchAppointmentsError));
  
  const showNoAppointmentsMessage = 
    !!selectedBranchId && 
    !isOverallLoading &&
    !displayableError && 
    filteredAppointments.length === 0;

  const inputClass = "block w-full p-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-4 sm:p-6 lg:p-8 font-sans">
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full lg:max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl">
        <header className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
           <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 mr-3 text-sky-600 dark:text-sky-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                {selectedBranchName ? `${selectedBranchName} - Appointments` : 'Branch Appointments'}
              </h1>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Toggle Dark Mode"> {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />} </button>
              {selectedBranchId && (
                <button onClick={openCreateModal} className="flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md"> <PlusCircle className="h-5 w-5 mr-2" /> New Appointment </button>
              )}
            </div>
          </div>
        </header>

        <section className="p-6 md:p-8">
          <div className="mb-8 p-4 sm:p-6 bg-sky-50/70 dark:bg-sky-700/30 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700">
            <label htmlFor="branch-select" className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Select a Branch:
            </label>
            {isLoadingBranches ? (
              <LoadingIndicator text="Loading branches..." />
            ) : isErrorBranches ? (
                <ErrorDisplay errorToDisplay={branchFetchError as ApiError} onTryAgain={refetchBranches}/>
            ) : (
              <select
                id="branch-select"
                value={selectedBranchId}
                onChange={handleBranchChange}
                className={`${inputClass} md:w-1/2 lg:w-1/3`}
                disabled={!allBranches || allBranches.length === 0}
              >
                <option value="">-- Choose a Branch --</option>
                {allBranches?.map((branch: BranchLocationDataTypes) => ( 
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            )}
            {allBranches?.length === 0 && !isLoadingBranches && !isErrorBranches && (
                 <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No branches available to select. Add one in settings.</p>
            )}
          </div>

          {selectedBranchId && (
            <div className="mb-6 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center"> <Search className="h-5 w-5 mr-2" /> Filter Appointments in {selectedBranchName || 'Selected Branch'} </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Filter by party name..." value={searchParty} onChange={(e) => setSearchParty(e.target.value)} className={inputClass} />
                <select title='Filter by status' value={searchStatus} onChange={(e) => setSearchStatus(e.target.value as AppointmentStatus | '')} className={inputClass}> 
                    <option value="">All Statuses</option> 
                    <option value="pending">{getStatusDisplayName('pending')}</option>
                    <option value="confirmed">{getStatusDisplayName('confirmed')}</option>
                    <option value="completed">{getStatusDisplayName('completed')}</option>
                    <option value="cancelled">{getStatusDisplayName('cancelled')}</option>
                </select>
              </div>
            </div>
          )}
          
          <main className="mt-2">
            {!selectedBranchId && !isLoadingBranches && !isErrorBranches && !isLoadingAppointments && (
                 <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6">
                    <ListFilter className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" />
                    <p className="text-xl font-semibold mb-2">Please select a branch</p>
                    <p className="text-sm text-center">Choose a branch from the dropdown above to view its appointments.</p>
                 </div>
            )}

            {selectedBranchId && (
              isOverallLoading ? ( <LoadingIndicator text={`Loading appointments for ${selectedBranchName || 'this branch'}...`} /> ) : 
              displayableError ? ( <ErrorDisplay errorToDisplay={displayableError} onTryAgain={refetchBranchAppointments} /> ) : 
              showNoAppointmentsMessage ? ( <NoAppointmentsMessage isInitialEmptyState={isEffectivelyInitialEmpty} /> ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="min-w-full leading-normal">
                    <thead className="bg-sky-600 dark:bg-sky-700">
                      <tr>
                        {['ID', 'Party', 'Date', 'Time', 'Reason', 'Status', 'Actions'].map(header => (
                          <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-white dark:text-sky-100 uppercase tracking-wider whitespace-nowrap">
                            {/* Added whitespace-nowrap */}
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
                          
                          {/* MODIFIED REASON COLUMN */}
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs whitespace-nowrap">
                            {appointment.reason ? (
                              <button
                                onClick={() => openReasonModal(appointment.reason, appointment.party)}
                                className="flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700 text-xs"
                                title="View Full Reason"
                              >
                                <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span>{truncateText(appointment.reason, 25)}</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 italic text-xs">No reason</span>
                            )}
                          </td>

                          {/* MODIFIED STATUS COLUMN */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 min-w-[130px]">
                            <select
                              title="Change Status"
                              value={appointment.status}
                              onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)}
                              className="block text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 w-full p-2 shadow-sm transition-colors disabled:opacity-70"
                              disabled={isStatusUpdating}
                            >
                              <option value="pending">{getStatusDisplayName('pending')}</option>
                              <option value="confirmed">{getStatusDisplayName('confirmed')}</option>
                              <option value="completed">{getStatusDisplayName('completed')}</option>
                              <option value="cancelled">{getStatusDisplayName('cancelled')}</option>
                            </select>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => openEditModal(appointment)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700" title="Edit Appointment"> <FilePenLine className="h-5 w-5" /> </button>
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
              )
            )}
          </main>
        </section>
      </div>

      {isCreateModalOpen && selectedBranchId && (
        <CreateAppointment
          isDarkMode={isDarkMode}
          onAppointmentCreated={handleAppointmentCreated}
          onClose={closeCreateModal}
          forBranchId={selectedBranchId} 
        />
      )}
      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          isDarkMode={isDarkMode}
          appointment={selectedAppointment}
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={closeEditModal}
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
              {appointmentToDelete.appointment_time} for branch <strong className="font-semibold">{selectedBranchName || 'N/A'}</strong>? 
              This action cannot be undone.
            </>
          ) : (
            "Are you sure you want to delete this appointment? This action cannot be undone."
          )
        }
        confirmText="Yes, Delete It"
        cancelText="No, Keep It"
        isLoading={isDeletingAppointment}
        isDarkMode={isDarkMode}
      />

      {/* REASON DISPLAY MODAL RENDER */}
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

export default BranchAppointments;