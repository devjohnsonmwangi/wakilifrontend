// BranchAppointments.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  useFetchAppointmentsByBranchQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  AppointmentDataTypes, 
  AppointmentStatus,    
  UpdateAppointmentPayload,
  FetchAppointmentsArgs, 
} from '../../../../features/appointment/appointmentapi'; 
import {
  useFetchBranchLocationsQuery,
  BranchLocationDataTypes
} from '../../../../features/branchlocation/branchlocationapi'; 
import { Toaster, toast } from 'sonner';
import CreateAppointment from './createappointment';
import EditAppointment from './editappointments';   
import ConfirmationModal from './deletion';       
import ReasonDisplayModal from './ReasonDisplayModal'; 

import {
  PlusCircle,
  FilePenLine,
  Trash2,
  AlertTriangle,
  CalendarDays,
  RefreshCcw,
  
  Sun,
  Moon,
  ListFilter,
  Eye,
  Users,    
  Briefcase, 
} from 'lucide-react';

interface ApiError {
  status?: number | string;
  data?: { message?: string; error?: string; errors?: Array<{ field: string; message: string }>; [key: string]: unknown; };
  message?: string;
  error?: string;
}

interface ApiMessageResponse { message: string; }

function isApiMessageResponse(data: unknown): data is ApiMessageResponse {
  return data !== null && typeof data === 'object' && 'message' in data && typeof (data as ApiMessageResponse).message === 'string';
}

const NO_APPOINTMENTS_FOUND_MESSAGE = "No appointments found for this branch.";

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
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface NoAppointmentsMessageProps {
  isFiltering: boolean; 
  selectedBranchName?: string | null;
}


const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "rescheduled", "no_show"];

const BranchAppointments: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | number | ''>('');
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);

  // State for filters to be passed as queryParams
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  const [searchPartyOrClient, setSearchPartyOrClient] = useState(''); 
  const [searchDateFrom, setSearchDateFrom] = useState(''); // YYYY-MM-DD
  const [searchDateTo, setSearchDateTo] = useState('');   // YYYY-MM-DD
  const [searchClientId, setSearchClientId] = useState<string | number | ''>(''); 


  const queryParamsForFetch: Omit<FetchAppointmentsArgs, 'branchId'> = useMemo(() => {
    const params: Omit<FetchAppointmentsArgs, 'branchId'> = {};
    if (searchStatus) params.status = searchStatus;
    if (searchDateFrom) params.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString();
    if (searchDateTo) params.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString();
    if (searchClientId) params.clientId = Number(searchClientId); 
    // Add limit/offset if implementing pagination
    // params.limit = 20;
    // params.offset = 0;
    return params;
  }, [searchStatus, searchDateFrom, searchDateTo, searchClientId]);


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
  } = useFetchAppointmentsByBranchQuery(
    { branchId: selectedBranchId, queryParams: queryParamsForFetch },
    {
      skip: !selectedBranchId,
      refetchOnMountOrArgChange: true,
    }
  );

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

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    let noAppointmentsSignal = false;
    let currentError: ApiError | null = null;

    if (!selectedBranchId) {
      setIsBackendNoAppointments(false); // No branch selected, so no data to expect
      setDisplayableError(null);
      return;
    }

    if (isFetchAppointmentsError && queryError) {
      const typedQueryError = queryError as ApiError;
      const errorMessageText = getErrorMessage(typedQueryError);
      if (errorMessageText === NO_APPOINTMENTS_FOUND_MESSAGE || typedQueryError.status === 404) {
        noAppointmentsSignal = true;
      } else {
        currentError = typedQueryError;
      }
    } else if (!isLoadingAppointments && appointmentsData) {
      if (isApiMessageResponse(appointmentsData) && appointmentsData.message === NO_APPOINTMENTS_FOUND_MESSAGE) {
         noAppointmentsSignal = true;
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
      // Reset other filters when branch changes
      setSearchPartyOrClient('');
      setSearchStatus('');
      setSearchDateFrom('');
      setSearchDateTo('');
      setSearchClientId('');
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

  const openReasonModal = (reason: string, party: string) => {
    setReasonToDisplay(reason);
    setReasonPartyName(party);
    setIsReasonModalOpen(true);
  };
  const closeReasonModal = () => {
    setIsReasonModalOpen(false);
    setReasonToDisplay('');
    setReasonPartyName('');
  };

  const handleAppointmentCreated = () => {
    if (selectedBranchId) refetchBranchAppointments();
  };
  const handleAppointmentUpdated = () => {
    if (selectedBranchId) refetchBranchAppointments();
  };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    // `appointment_datetime` is not changed here, only status.
    // If editing date/time was allowed directly from table, it would be part of UpdateAppointmentPayload
    const payload: UpdateAppointmentPayload = { appointment_id: appointmentId, status: newStatus };
    try {
      await updateAppointment(payload).unwrap();
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}!`);
      // refetchBranchAppointments(); 
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
      toast.success(`Appointment for ${appointmentToDelete.party} deleted!`);
      setAppointmentToDelete(null);
      setIsConfirmDeleteModalOpen(false);
      // refetchBranchAppointments(); 
    } catch (err) {
      const errorMessage = getErrorMessage(err as ApiError);
      toast.error(`Failed to delete: ${errorMessage}`);
    }
  };
  const cancelDeleteAppointment = () => {
    setAppointmentToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const actualAppointmentsArray: AppointmentDataTypes[] = useMemo(() => {
    if (Array.isArray(appointmentsData)) {
      return appointmentsData;
    }
    return [];
  }, [appointmentsData]);

  // Client-side filtering for party/client name.
  
  const filteredAppointments = useMemo(() => {
    if (!selectedBranchId || isBackendNoAppointments || displayableError) return [];
    return actualAppointmentsArray.filter(appointment => {
      const partyName = appointment.party?.toLowerCase() || '';
      const clientName = appointment.client?.full_name?.toLowerCase() || '';
      const searchLower = searchPartyOrClient.toLowerCase();
      const partyOrClientMatch = searchPartyOrClient
        ? partyName.includes(searchLower) || clientName.includes(searchLower)
        : true;
      return partyOrClientMatch;
    });
  }, [actualAppointmentsArray, selectedBranchId, isBackendNoAppointments, displayableError, searchPartyOrClient]);

  const LoadingIndicator: React.FC<{text?: string}> = ({text = "Loading..."}) => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
      <RefreshCcw className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg">{text}</p>
    </div>
  );

  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null, onTryAgain?: () => void }> = ({ errorToDisplay, onTryAgain }) => {
    if (!errorToDisplay) return null;
    const message = getErrorMessage(errorToDisplay);
    
    if (message === NO_APPOINTMENTS_FOUND_MESSAGE && !onTryAgain) return null;
    return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <div>
              <p className="font-bold text-lg">Error</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
          {onTryAgain && (
            <button onClick={onTryAgain} className="mt-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors">
              <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
            </button>
          )}
        </div>
    );
  };

  const NoAppointmentsMessage: React.FC<NoAppointmentsMessageProps> = ({ isFiltering, selectedBranchName }) => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6">
      <CalendarDays className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" />
      <p className="text-xl font-semibold mb-2">
        {isFiltering ? "No appointments match your filters" : `No appointments found for ${selectedBranchName || 'this branch'}`}
      </p>
      <p className="text-sm text-center">{isFiltering ? "Try adjusting your search or filter criteria." : "You can create the first one for this branch!"}</p>
      {!isFiltering && selectedBranchId && (
        <button onClick={openCreateModal} className="mt-6 flex items-center bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-opacity-75">
          <PlusCircle className="h-5 w-5 mr-2" /> Create Appointment
        </button>
      )}
    </div>
  );

  const isOverallLoading = isLoadingBranches || (!!selectedBranchId && isLoadingAppointments);
  const isFilteringActive = !!(searchPartyOrClient || searchStatus || searchDateFrom || searchDateTo || searchClientId);

  const showNoAppointmentsMessage =
    !!selectedBranchId &&
    !isOverallLoading &&
    !displayableError &&
    filteredAppointments.length === 0; // Check client-side filtered length

  const inputClass = "block w-full p-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500";

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300`}>
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full lg:max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
        <header className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 mr-3 text-sky-600 dark:text-sky-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                {selectedBranchName ? `${selectedBranchName} Appointments` : 'Branch Appointments'}
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
              Select a Branch to Manage Appointments:
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
                    {branch.name} ({branch.address})
                  </option>
                ))}
              </select>
            )}
            {allBranches?.length === 0 && !isLoadingBranches && !isErrorBranches && (
                 <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No branches available. Please add one in the branch management section.</p>
            )}
          </div>

          {selectedBranchId && (
            <div className="mb-6 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
                <ListFilter className="h-5 w-5 mr-2" />
                Filter Appointments in <strong className='ml-1'>{selectedBranchName || 'Selected Branch'}</strong>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                <input
                    type="text"
                    placeholder="Filter by Party or Client..."
                    value={searchPartyOrClient}
                    onChange={(e) => setSearchPartyOrClient(e.target.value)}
                    className={inputClass}
                />
                <input
                    type="number"
                    placeholder="Filter by Client ID..."
                    value={searchClientId}
                    onChange={(e) => setSearchClientId(e.target.value)}
                    className={inputClass}
                />
                <select
                    title='Filter by status'
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value as AppointmentStatus | '')}
                    className={inputClass}
                >
                    <option value="">All Statuses</option>
                    {APPOINTMENT_STATUS_VALUES.map(status => (
                        <option key={status} value={status}>{getStatusDisplayName(status)}</option>
                    ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                    <input type="date" title="Date From" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={inputClass} />
                    <input type="date" title="Date To" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={inputClass} min={searchDateFrom || undefined} />
                </div>
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
              showNoAppointmentsMessage ? ( <NoAppointmentsMessage isFiltering={isFilteringActive} selectedBranchName={selectedBranchName} /> ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="min-w-full leading-normal">
                    <thead className="bg-sky-600 dark:bg-sky-700">
                      <tr>
                        {['ID', 'Client', 'Party', 'Date & Time', 'Assigned To', 'Reason', 'Status', 'Actions'].map(header => (
                          <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-white dark:text-sky-100 uppercase tracking-wider whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredAppointments.map((appointment, index) => {
                        const appointmentDateObj = new Date(appointment.appointment_datetime); // MODIFIED
                        const displayDate = !isNaN(appointmentDateObj.getTime()) ? appointmentDateObj.toLocaleDateString() : 'Invalid Date';
                        const displayTime = !isNaN(appointmentDateObj.getTime()) ? appointmentDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid Time';

                        return (
                        <tr key={appointment.appointment_id} className={`${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/70 dark:bg-slate-900/50'} hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors`}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{appointment.appointment_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                            <div className="flex items-center">
                                {appointment.client?.profile_picture ? (
                                    <img src={appointment.client.profile_picture} alt={appointment.client.full_name || 'Client'} className="w-6 h-6 rounded-full mr-2 object-cover" />
                                ) : (
                                    <Users className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" />
                                )}
                                {appointment.client?.full_name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.party}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                            
                            {displayDate} at {displayTime}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                            {appointment.assignees && appointment.assignees.length > 0
                              ? appointment.assignees.map((a, idx) => (
                                  <span key={a.assignee_user_id} className='inline-block mr-1'>
                                    {a.assignee?.full_name || `Staff ID: ${a.assignee_user_id}`}
                                    {idx < (appointment.assignees?.length ?? 0) - 1 ? ',' : ''}
                                  </span>
                                ))
                              : <span className="italic text-slate-500">Not Assigned</span>
                            }
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs whitespace-nowrap">
                            <button onClick={() => openReasonModal(appointment.reason, appointment.party)} className="flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700 text-xs" title="View Full Reason">
                              <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{truncateText(appointment.reason, 25)}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 min-w-[140px]">
                            <select title="Change Status" value={appointment.status} onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)} className="block text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 w-full p-1.5 shadow-sm transition-colors disabled:opacity-70" disabled={isStatusUpdating}>
                                {APPOINTMENT_STATUS_VALUES.map(statusValue => (
                                    <option key={statusValue} value={statusValue}>{getStatusDisplayName(statusValue)}</option>
                                ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => openEditModal(appointment)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700" title="Edit Appointment"> <FilePenLine className="h-5 w-5" /> </button>
                              <button onClick={() => requestDeleteAppointment(appointment)} className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled={isDeletingAppointment && appointmentToDelete?.appointment_id === appointment.appointment_id} title="Delete Appointment"> <Trash2 className="h-5 w-5" /> </button>
                            </div>
                          </td>
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

      {isCreateModalOpen && selectedBranchId && (
        <CreateAppointment
          isDarkMode={isDarkMode}
          onAppointmentCreated={handleAppointmentCreated}
          onClose={closeCreateModal}
          forBranchId={selectedBranchId} // Pass selected branch ID
        />
      )}
      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          isDarkMode={isDarkMode}
          appointment={selectedAppointment} // This appointment will have `appointment_datetime`
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={closeEditModal}
          // isClientView={false} // Not needed or set to false for admin/staff view
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
              <strong className="font-semibold">{appointmentToDelete.party}</strong> (Client: {appointmentToDelete.client?.full_name || 'N/A'}) on{' '}
              {/* MODIFIED: Use appointment_datetime for display */}
              {new Date(appointmentToDelete.appointment_datetime).toLocaleDateString()} at{' '}
              {new Date(appointmentToDelete.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              ? This action cannot be undone.
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