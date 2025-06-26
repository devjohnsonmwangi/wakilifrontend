// ClientAppointments.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useFetchAppointmentsByClientQuery,
  AppointmentDataTypes, 
  AppointmentStatus,
  FetchAppointmentsArgs, 
} from '../../../../features/appointment/appointmentapi'; 
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; 
import { Toaster, toast } from 'sonner';
import EditAppointment from './editappointments';
import ReasonDisplayModal from './ReasonDisplayModal';

import {
  selectCurrentUserId,
  selectCurrentUser
} from '../../../../features/users/userSlice'; 

import {
  FilePenLine,
  AlertTriangle,
  CalendarDays,
  RefreshCcw,
  Sun,
  Moon,
  User,
  LogIn,
  ImageOff,
  Eye,
  Briefcase,
  Users as StaffIcon,
  ListFilter, 
  X, // <<< ADDED: Icon for the clear button
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

const NO_APPOINTMENTS_FOUND_MESSAGE = "You have no scheduled appointments.";

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
  return 'Failed to load appointments. Please check network and try again.';
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


const APPOINTMENT_STATUS_VALUES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "rescheduled", "no_show"];


const ClientAppointments: React.FC = () => {
  const clientId = useSelector(selectCurrentUserId);
  const currentUser = useSelector(selectCurrentUser);
  const userFullName = currentUser?.full_name || "Client";
  const profilePictureUrl = currentUser?.profile_picture || null;

  const [imgError, setImgError] = useState(false);

  // State for query parameters for useFetchAppointmentsByClientQuery
  const [searchStatus, setSearchStatus] = useState<AppointmentStatus | ''>('');
  // For client-side filtering, not directly for the query 
  const [searchPartyOrStaff, setSearchPartyOrStaff] = useState('');
  const [searchLocationId, setSearchLocationId] = useState<string | number | ''>('');
  
  const [searchDateFrom, setSearchDateFrom] = useState(''); // YYYY-MM-DD
  const [searchDateTo, setSearchDateTo] = useState('');   // YYYY-MM-DD


  // Construct queryParams object for the hook
  const queryParamsForFetch: Omit<FetchAppointmentsArgs, 'clientId'> = useMemo(() => {
    const params: Omit<FetchAppointmentsArgs, 'clientId'> = {};
    if (searchStatus) params.status = searchStatus;
    if (searchDateFrom) params.dateTimeFrom = new Date(searchDateFrom + "T00:00:00.000Z").toISOString();
    if (searchDateTo) params.dateTimeTo = new Date(searchDateTo + "T23:59:59.999Z").toISOString();
    return params;
  }, [searchStatus, searchDateFrom, searchDateTo]);


  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    isError: isFetchAppointmentsError,
    error: queryError,
    refetch,
  } = useFetchAppointmentsByClientQuery(
    { clientId: clientId as string | number, queryParams: queryParamsForFetch },
    {
      skip: !clientId,
      refetchOnMountOrArgChange: true, 
    }
  );


  const { data: branchLocations, isLoading: isLoadingBranchLocations } = useFetchBranchLocationsQuery();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataTypes | null>(null);
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
    setImgError(false);
  }, [profilePictureUrl]);

  useEffect(() => {
    let noAppointmentsSignal = false;
    let currentError: ApiError | null = null;
    if (!clientId) {
        setIsBackendNoAppointments(true);
        setDisplayableError(null);
        return;
    }
    if (isFetchAppointmentsError && queryError) {
      const typedQueryError = queryError as ApiError;
      const errorMessage = getErrorMessage(typedQueryError);
      if (errorMessage === NO_APPOINTMENTS_FOUND_MESSAGE || (typedQueryError.status === 404)) {
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
  }, [isFetchAppointmentsError, queryError, appointmentsData, isLoadingAppointments, clientId]);

  const openEditModal = (appointment: AppointmentDataTypes) => { setSelectedAppointment(appointment); setIsEditModalOpen(true); };
  const closeEditModal = () => { setSelectedAppointment(null); setIsEditModalOpen(false); };
  const openReasonModal = (reason: string, party: string) => { setReasonToDisplay(reason); setReasonPartyName(party); setIsReasonModalOpen(true); };
  const closeReasonModal = () => { setIsReasonModalOpen(false); setReasonToDisplay(''); setReasonPartyName(''); };

  const handleAppointmentUpdated = () => {
    if (clientId) refetch();
    toast.success("Appointment details have been updated or your request has been submitted.");
  };

  const actualAppointmentsArray: AppointmentDataTypes[] = useMemo(() => Array.isArray(appointmentsData) ? appointmentsData : [], [appointmentsData]);

  const filteredAppointments = useMemo(() => {
    if (!clientId || isBackendNoAppointments || displayableError) return [];
    return actualAppointmentsArray.filter(appointment => {
      const partyNameLower = appointment.party?.toLowerCase() || '';
      const assignedStaffNamesLower = appointment.assignees?.map(a => a.assignee?.full_name?.toLowerCase() || '').join(' ') || '';
      const searchLower = searchPartyOrStaff.toLowerCase();
      const partyOrStaffMatch = searchPartyOrStaff ? partyNameLower.includes(searchLower) || assignedStaffNamesLower.includes(searchLower) : true;
      const locationMatch = searchLocationId ? appointment.branch_id === Number(searchLocationId) : true;
      return partyOrStaffMatch && locationMatch; 
    });
  }, [actualAppointmentsArray, clientId, isBackendNoAppointments, displayableError, searchPartyOrStaff, searchLocationId]);

  const LoadingIndicator: React.FC<{text?: string}> = ({text = "Loading your appointments..."}) => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
      <RefreshCcw className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg">{text}</p>
    </div>
  );

  const ErrorDisplay: React.FC<{ errorToDisplay: ApiError | null, onRetry?: () => void }> = ({ errorToDisplay, onRetry }) => {
    if (!errorToDisplay) return null;
    const message = getErrorMessage(errorToDisplay);
    if (message === NO_APPOINTMENTS_FOUND_MESSAGE && !onRetry) return null; 
    return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md my-6" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <div>
              <p className="font-bold text-lg">Error Loading Appointments</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
          {onRetry && <button onClick={onRetry} className="mt-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"> <RefreshCcw className="h-4 w-4 mr-2" /> Try Again </button>}
        </div>
    );
  };

  const NoAppointmentsMessage: React.FC<{ isFiltering: boolean }> = ({ isFiltering }) => (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow my-6 p-6">
      <CalendarDays className="h-16 w-16 mb-4 text-slate-400 dark:text-slate-500" />
      <p className="text-xl font-semibold mb-2">{isFiltering ? "No appointments match your filters" : NO_APPOINTMENTS_FOUND_MESSAGE}</p>
      <p className="text-sm text-center">{isFiltering ? "Try adjusting your search or filter criteria." : "Once an appointment is scheduled for you, it will appear here."}</p>
    </div>
  );

  if (!clientId || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 text-center">
            <LogIn className="h-16 w-16 mx-auto mb-6 text-sky-500 dark:text-sky-400" />
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-3">View Your Appointments</h2>
            <p className="text-slate-500 dark:text-slate-400">Please log in to see your scheduled appointments.</p>
        </div>
      </div>
    );
  }

  const isActuallyLoading = isLoadingAppointments || isLoadingBranchLocations;
  const isFilteringActive = !!(searchPartyOrStaff || searchLocationId || searchStatus || searchDateFrom || searchDateTo);
  const showNoAppointmentsMessage = !isActuallyLoading && !displayableError && filteredAppointments.length === 0;

  // <<< OPTIMIZED: Centralized input styling inspired by reference code
  const inputBaseClasses = `w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm [color-scheme:light] dark:[color-scheme:dark]`;
  
  // <<< ADDED: Reusable clear button component for inputs
  const ClearButton: React.FC<{ onClick: () => void; rightClass?: string }> = ({ onClick, rightClass = 'pr-3' }) => (
    <button
      type="button"
      onClick={onClick}
      className={`absolute inset-y-0 right-0 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none z-10 ${rightClass}`}
      aria-label="Clear input"
    >
      <X size={16} />
    </button>
  );

  const ProfilePictureFallback: React.FC<{ name?: string | null, size?: number }> = ({ name, size = 8 }) => {
    const initials = name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || '';
    const classSize = `h-${size} w-${size}`; 
    const iconSize = `h-${Math.floor(size/1.5)} w-${Math.floor(size/1.5)}`;

    if (imgError && profilePictureUrl) {
        return <div className={`flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-300 ${classSize}`}><ImageOff className={iconSize} /></div>;
    }
    if (initials) return <div className={`flex items-center justify-center rounded-full bg-sky-500 text-white dark:bg-sky-600 text-xs font-semibold ${classSize}`}>{initials}</div>;
    return <div className={`flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 ${classSize}`}><User className={iconSize} /></div>;
  };

  return (
    // <<< OPTIMIZED: Padding reduced on mobile for more content space
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-2 sm:p-4 lg:p-8 font-sans transition-colors duration-300`}>
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="max-w-full lg:max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
        <header className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                {profilePictureUrl && !imgError ? (
                  <img src={profilePictureUrl} alt={userFullName} className="h-10 w-10 rounded-full object-cover border-2 border-sky-200 dark:border-sky-700" onError={() => setImgError(true)} />
                ) : ( <ProfilePictureFallback name={userFullName} size={10} /> )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                My Appointments
              </h1>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}> {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />} </button>
            </div>
          </div>
        </header>

        {/* <<< OPTIMIZED: Section padding reduced on mobile */}
        <section className="p-4 md:p-6">
          <div className="mb-6 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-700/30 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center"> <ListFilter className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> Filter Appointments </h2>
            {/* <<< REWRITTEN: Grid for filters with working clearable inputs and enhanced dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <input type="text" placeholder="Party or Staff Name..." value={searchPartyOrStaff} onChange={(e) => setSearchPartyOrStaff(e.target.value)} className={`${inputBaseClasses} pr-10`} />
                {searchPartyOrStaff && <ClearButton onClick={() => setSearchPartyOrStaff('')} />}
              </div>
              <div className="relative">
                <select title="Filter by location" value={searchLocationId} onChange={(e) => setSearchLocationId(e.target.value)} className={`${inputBaseClasses} font-semibold truncate pr-10 appearance-none`} disabled={isLoadingBranchLocations}>
                  <option value="">All Locations</option>
                  {isLoadingBranchLocations ? <option disabled>Loading...</option> : branchLocations?.map(loc => <option key={loc.branch_id} value={loc.branch_id}>{loc.name}</option>)}
                </select>
                {searchLocationId && <ClearButton onClick={() => setSearchLocationId('')} rightClass="pr-8" />}
              </div>
              <div className="relative">
                <select title='Filter by status' value={searchStatus} onChange={(e) => setSearchStatus(e.target.value as AppointmentStatus | '')} className={`${inputBaseClasses} font-semibold truncate pr-10 appearance-none`}>
                  <option value="">All Statuses</option>
                  {APPOINTMENT_STATUS_VALUES.map(statusVal => (
                      <option key={statusVal} value={statusVal}>{getStatusDisplayName(statusVal)}</option>
                  ))}
                </select>
                {searchStatus && <ClearButton onClick={() => setSearchStatus('')} rightClass="pr-8" />}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input type="date" title="Date From" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} className={`${inputBaseClasses} pr-10`} />
                  {searchDateFrom && <ClearButton onClick={() => setSearchDateFrom('')} />}
                </div>
                <div className="relative">
                  <input type="date" title="Date To" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} className={`${inputBaseClasses} pr-10`} min={searchDateFrom || undefined} />
                  {searchDateTo && <ClearButton onClick={() => setSearchDateTo('')} />}
                </div>
              </div>
            </div>
          </div>

          <main className="mt-2">
            {isActuallyLoading ? ( <LoadingIndicator /> ) :
             displayableError ? ( <ErrorDisplay errorToDisplay={displayableError} onRetry={refetch} /> ) :
             showNoAppointmentsMessage ? ( <NoAppointmentsMessage isFiltering={isFilteringActive} /> ) : (
              <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full leading-normal">
                  <thead className="bg-sky-600 dark:bg-sky-700">
                    <tr>
                      {['ID', 'Party', 'Date & Time', 'Branch / Location', 'Assigned Staff', 'Reason', 'Status', 'Actions'].map(header => (
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{appointment.party}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                            {displayDate} at {displayTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                              <div className="flex items-center">
                                  <Briefcase className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
                                  {appointment.branch?.name || 'N/A'}
                              </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"> 
                              {appointment.assignees && appointment.assignees.length > 0
                                ? appointment.assignees.map((a, idx) => (
                                  <div key={a.assignee_user_id} className="flex items-center my-0.5">
                                      {a.assignee?.profile_picture ? (
                                          <img src={a.assignee.profile_picture} alt={a.assignee.full_name || ''} className="w-5 h-5 rounded-full mr-1.5 object-cover"/>
                                      ) : (
                                          <StaffIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
                                      )}
                                      <span className="truncate max-w-[150px]">{a.assignee?.full_name || `Staff ID: ${a.assignee_user_id}`}</span>
                                      {idx < (appointment.assignees?.length ?? 0) -1 && <span className='mx-1'>,</span>}
                                  </div>
                                  ))
                                : <span className="italic text-slate-500 dark:text-slate-400">Pending Assignment</span>
                              }
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs whitespace-nowrap">
                            <button onClick={() => openReasonModal(appointment.reason, appointment.party)} className="flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700 text-xs" title="View Full Reason">
                              <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{truncateText(appointment.reason, 20)}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${appointment.status === 'confirmed' ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100' :
                                    appointment.status === 'completed' ? 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100' :
                                    appointment.status === 'rescheduled' ? 'bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-100' :
                                    appointment.status === 'no_show' ? 'bg-orange-100 dark:bg-orange-700 text-orange-800 dark:text-orange-100' :
                                    'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100'}`}>
                                  {getStatusDisplayName(appointment.status)}
                              </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                  <button onClick={() => openEditModal(appointment)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors p-1 rounded-md hover:bg-sky-100 dark:hover:bg-slate-700" title="View Details / Request Change"><FilePenLine className="h-5 w-5" /></button>
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

      {isEditModalOpen && selectedAppointment && clientId && (
        <EditAppointment
          isDarkMode={isDarkMode}
          appointment={selectedAppointment}
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={closeEditModal}
          isClientView={true}
        />
      )}

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

export default ClientAppointments;