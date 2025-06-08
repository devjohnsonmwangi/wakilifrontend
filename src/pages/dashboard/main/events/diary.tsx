// src/components/MyDiary.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import {
  useFetchEventsQuery,
  useDeleteEventMutation,
  EventDataTypes,
  EventType,
} from '../../../../features/events/events';

import { useSelector } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectCurrentUserId,
    User, 
} from '../../../../features/users/userSlice';

import EventCalendarView from './EventCalendarView'; 
import EventListView from './EventListView';
import EventFormModal from './EventFormModal';
import EventDetailsModal from './EventDetailsModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import NotificationSnackbar, { SnackbarMessage } from './components/NotificationSnackbar';
import { format } from 'date-fns';
import { UserX, AlertTriangle, Sun, Moon, UserCircle2 } from 'lucide-react';

export type ViewMode = 'calendar' | 'list';

const MyDiary: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('calendar');
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventDataTypes | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventDataTypes | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkModeGlobal');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
    }
    return true; 
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkModeGlobal', String(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const loggedInUser = useSelector(selectCurrentUser) as User | null; // Cast if necessary
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUserId = useSelector(selectCurrentUserId);

  const { data: allEvents, isLoading, isError, isSuccess, error: fetchErrorData } = useFetchEventsQuery(undefined, {
    skip: !isAuthenticated || !currentUserId,
  });
  const [deleteEvent, { isLoading: isDeletingEvent }] = useDeleteEventMutation();
  
  const [userEvents, setUserEvents] = useState<EventDataTypes[]>([]);

  useEffect(() => {
    if (allEvents && currentUserId) {
      setUserEvents(allEvents.filter(event => event.user_id === currentUserId));
    } else {
      setUserEvents([]);
    }
  }, [allEvents, currentUserId]);


  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
      setSnackbar({ message, severity, key: new Date().getTime() });
    },
    []
  );

  const handleCloseSnackbar = () => setSnackbar(null);

  const filteredUserEvents = useMemo(() => {
    return userEvents
      .filter(event => eventTypeFilter === 'all' || event.event_type === eventTypeFilter)
      .filter(event =>
        event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.event_description && event.event_description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [userEvents, eventTypeFilter, searchTerm]);

  const handleViewChange = (newView: ViewMode) => setCurrentView(newView);

  const handleOpenCreateEventModal = () => {
    if (!currentUserId) {
        toast.error("User not identified. Cannot create event.");
        return;
    }
    setEventToEdit(null);
    setIsEventFormModalOpen(true);
  };

  const handleOpenEditEventModal = (event: EventDataTypes) => {
    if (event.user_id !== currentUserId) {
        toast.error("You can only edit your own events.");
        return;
    }
    setEventToEdit(event);
    setIsEventFormModalOpen(true);
  };

  const handleOpenDetailsModal = (event: EventDataTypes) => {
    setSelectedEventForDetails(event);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEventForDetails(null);
  };

  const handleDeleteEventRequest = (eventId: number) => {
    const event = userEvents.find(e => e.event_id === eventId);
    if (event && event.user_id !== currentUserId) {
        toast.error("You can only delete your own events.");
        return;
    }
    setEventToDeleteId(eventId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDeleteId && currentUserId) {
      const event = userEvents.find(e => e.event_id === eventToDeleteId);
      if (!event || event.user_id !== currentUserId) {
        toast.error("Action not allowed.");
        setIsConfirmDeleteDialogOpen(false);
        setEventToDeleteId(null);
        return;
      }
      try {
        await deleteEvent(eventToDeleteId).unwrap();
        showSnackbar('Event deleted successfully from your diary!', 'success');
      } catch (err: unknown) {
        const errorMessage = (err as { data?: { msg?: string } })?.data?.msg || 'Failed to delete event.';
        toast.error(errorMessage);
        showSnackbar(errorMessage, 'error');
      } finally {
        setIsConfirmDeleteDialogOpen(false);
        setEventToDeleteId(null);
      }
    }
  };

  if (!isAuthenticated || !currentUserId) {
    return (
        <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-100px)] bg-gray-100 dark:bg-gray-900">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <UserX size={64} className="mx-auto mb-4 text-red-500 dark:text-red-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Access Denied</h2>
                <p className="text-gray-600 dark:text-gray-400">Please log in to view your diary.</p>
            </div>
        </div>
    );
  }
  
  const getApiErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object') {
      if ('data' in error && (error as { data?: { msg?: string; error?: string } }).data) {
        const errorData = (error as { data: { msg?: string; error?: string } }).data;
        return errorData.msg || errorData.error || 'An error occurred.';
      }
      if ('error' in error && typeof (error as { error?: string }).error === 'string') {
        return (error as { error: string }).error;
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };


  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster richColors position="top-center" theme={isDarkMode ? 'dark' : 'light'} />
      <div className="bg-white dark:bg-gray-800 shadow-lg p-6 mb-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            {loggedInUser && loggedInUser.profile_picture ? (
              <img
                src={loggedInUser.profile_picture}
                alt={loggedInUser.full_name || "Profile"}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-green-500 dark:border-green-400"
              />
            ) : (
              <UserCircle2 
                className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" 
                strokeWidth={1.5} 
              />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400">
              My Diary {loggedInUser?.full_name ? `(${loggedInUser.full_name})` : ''}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateEventModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 rounded-md shadow-sm hover:shadow-md transition-colors duration-150 flex items-center gap-2 text-sm sm:text-base"
              aria-label="Add New Event to My Diary"
            >
              <span className="material-icons-outlined text-xl">add</span> Add Diary Entry
            </button>
            <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
          <div className="flex gap-2 col-span-1 md:col-span-1">
            <button
              aria-label="Switch to Calendar View"
              className={`flex-1 p-2.5 rounded-md border text-sm font-medium transition-colors duration-150 
                ${currentView === 'calendar' 
                  ? 'bg-blue-100 dark:bg-blue-700 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-100' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => handleViewChange('calendar')}
            >
              <span className="material-icons-outlined mr-1.5 align-middle text-lg">calendar_today</span> Calendar
            </button>            
            <button
              aria-label="Switch to List View"
              className={`flex-1 p-2.5 rounded-md border text-sm font-medium transition-colors duration-150 
                ${currentView === 'list' 
                  ? 'bg-blue-100 dark:bg-blue-700 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-100' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => handleViewChange('list')}
            >
              <span className="material-icons-outlined mr-1.5 align-middle text-lg">list</span> List
            </button>
          </div>

          <select
            id="eventTypeFilter"
            aria-label="Filter by event type"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 col-span-1 md:col-span-1"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as EventType | 'all')}
          >
            <option value="all">All Entry Types</option>
            <option value="meeting">Meeting</option>
            <option value="hearing">Hearing</option>
            <option value="consultation">Consultation</option>
            <option value="reminder">General Event</option>
            <option value="court_date">Court Date</option>
          </select>

          <input
            type="text"
            id="searchEvents"
            aria-label="Search diary entries by title or description"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 col-span-1 md:col-span-1"
            placeholder="Search My Diary (title, description)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
        {isError && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/[.4] border-l-4 border-red-500 dark:border-red-600 text-red-800 dark:text-red-200 rounded-md shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">Error Loading Diary Entries</h3>
                <p className="text-sm mt-1">{getApiErrorMessage(fetchErrorData)}</p>
              </div>
            </div>
          </div>
        )}

        {(isLoading && userEvents.length === 0 && !isError) && (
          <div className="flex justify-center items-center min-h-[200px] text-center">
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg ml-3">Loading your diary entries...</p>
          </div>
        )}

        {!(isLoading && userEvents.length === 0 && !isError) && (
          <>
            {currentView === 'calendar' ? (
              <>
                <EventCalendarView
                  events={filteredUserEvents}
                  onEventClick={handleOpenDetailsModal}
                  onDateSelect={(selectInfo) => {
                    if (!currentUserId) return;
                    let startTimeISO: string;
                    if (selectInfo.allDay) {
                      startTimeISO = format(selectInfo.start, "yyyy-MM-dd");
                    } else {
                      startTimeISO = selectInfo.start.toISOString();
                    }
                    setEventToEdit({
                      event_id: 0, 
                      user_id: currentUserId,
                      case_id: 0, 
                      event_type: 'reminder', 
                      event_title: '',
                      start_time: startTimeISO,
                      created_at: '', 
                      updated_at: ''
                    });
                    setIsEventFormModalOpen(true);
                  }}
                  isDarkMode={isDarkMode} 
                />
                {isSuccess && userEvents.length === 0 && !isError && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                    <span className="material-icons-outlined text-4xl text-gray-400 dark:text-gray-500 mb-2">calendar_today</span>
                    <p className="text-lg">Your Diary is Empty</p>
                    <p className="text-sm">Add an entry to see it on the calendar.</p>
                  </div>
                )}
                {filteredUserEvents.length === 0 && userEvents.length > 0 && !isError && (
                   <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                     <span className="material-icons-outlined text-4xl text-gray-400 dark:text-gray-500 mb-2">filter_list_off</span>
                     <p className="text-lg">No Matching Entries for Calendar</p>
                     <p className="text-sm">Try adjusting your search or filter criteria.</p>
                   </div>
                )}
              </>
            ) : ( 
              <>
                {isSuccess && userEvents.length === 0 && !isLoading && !isError ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12 px-4">
                    <span className="material-icons-outlined text-5xl text-gray-400 dark:text-gray-500 mb-3">event_busy</span>
                    <h2 className="text-xl font-medium mb-2">Your Diary is Empty</h2>
                    <p className="text-sm">Click "Add Diary Entry" above to get started.</p>
                  </div>
                ) : filteredUserEvents.length === 0 && userEvents.length > 0 && !isError ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12 px-4">
                    <span className="material-icons-outlined text-5xl text-gray-400 dark:text-gray-500 mb-3">search_off</span>
                    <h2 className="text-xl font-medium mb-2">No Matching Entries</h2>
                    <p className="text-sm">Try adjusting your search or filter criteria.</p>
                  </div>
                ) : filteredUserEvents.length > 0 && !isError ? (
                  <EventListView
                    events={filteredUserEvents}
                    onEditEvent={handleOpenEditEventModal}
                    onDeleteEvent={handleDeleteEventRequest}
                    onViewEventDetails={handleOpenDetailsModal}
                  />
                ) : (
                  !isError && <div className="text-center text-gray-500 dark:text-gray-400 py-4">No entries to display in the list.</div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {isEventFormModalOpen && currentUserId && (
        <EventFormModal
          open={isEventFormModalOpen}
          onClose={() => { setIsEventFormModalOpen(false); setEventToEdit(null); }}
          eventToEdit={eventToEdit}
          
        />
      )}

      {isDetailsModalOpen && selectedEventForDetails && currentUserId && (
        <EventDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          event={selectedEventForDetails}
          onEditEvent={(event) => { handleCloseDetailsModal(); handleOpenEditEventModal(event); }}
          onDeleteEvent={(eventId) => { handleCloseDetailsModal(); handleDeleteEventRequest(eventId); }}
          onSuccess={(message) => showSnackbar(message, 'success')}
          onError={(message) => showSnackbar(message, 'error')}
          currentUserId={currentUserId}
        />
      )}

      <ConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDeleteEvent}
        title="Confirm Delete Entry"
        description="Are you sure you want to delete this diary entry? This action cannot be undone."
        isLoading={isDeletingEvent}
      />

      <NotificationSnackbar snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </div>
  );
};

export default MyDiary;