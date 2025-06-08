import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  useFetchEventsQuery,
  useDeleteEventMutation,
  EventDataTypes,
  EventType,
} from '../../../../features/events/events'; 

import EventCalendarView from './EventCalendarView';
import EventListView from './EventListView';
import EventFormModal from './EventFormModal';
import EventDetailsModal from './EventDetailsModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import NotificationSnackbar, { SnackbarMessage } from './components/NotificationSnackbar';
import { format } from 'date-fns';

export type ViewMode = 'calendar' | 'list';

// --- SVG Icons ---
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6" 
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6" 
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);


const EventsPage: React.FC = () => {
  const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      // If no stored theme, check OS preference (optional)
      // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      //   return true;
      // }
    }
    return true; // Default to dark mode
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

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

  const { data: events, isLoading, isError, isSuccess, error: fetchErrorData } = useFetchEventsQuery();
  const [deleteEvent, { isLoading: isDeletingEvent }] = useDeleteEventMutation();

  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
      setSnackbar({ message, severity, key: new Date().getTime() });
    },
    []
  );

  const handleCloseSnackbar = () => setSnackbar(null);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter(event => eventTypeFilter === 'all' || event.event_type === eventTypeFilter)
      .filter(event =>
        event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.event_description && event.event_description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [events, eventTypeFilter, searchTerm]);

  const handleViewChange = (newView: ViewMode) => setCurrentView(newView);
  const handleOpenCreateEventModal = () => {
    setEventToEdit(null);
    setIsEventFormModalOpen(true);
  };
  const handleOpenEditEventModal = (event: EventDataTypes) => {
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
    setEventToDeleteId(eventId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDeleteId) {
      try {
        await deleteEvent(eventToDeleteId).unwrap();
        showSnackbar('Event deleted successfully!', 'success');
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

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 shadow-lg p-6 mb-6 rounded-lg transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Event Management
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-colors duration-300"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <SunIcon /> // Sun icon for switching to light mode
              ) : (
                <MoonIcon /> // Moon icon for switching to dark mode
              )}
            </button>
            <button
              onClick={handleOpenCreateEventModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm hover:shadow-md transition-colors duration-150 flex items-center gap-2 text-sm sm:text-base"
              aria-label="Add New Event"
            >
              <span className="material-icons-outlined text-xl mr-1">add</span> Add Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
          <div className="flex gap-2 col-span-1 md:col-span-1">
            <button
              aria-label="Switch to Calendar View"
              className={`flex-1 p-2.5 rounded-md border text-sm font-medium transition-colors duration-150 
                ${currentView === 'calendar' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-700 dark:border-blue-500 dark:text-white' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-slate-600 dark:hover:bg-slate-700 dark:text-gray-300'
                }`}
              onClick={() => handleViewChange('calendar')}
            >
              <span className="material-icons-outlined mr-1.5 align-middle text-lg">calendar_today</span> Calendar
            </button>
            <button
              aria-label="Switch to List View"
              className={`flex-1 p-2.5 rounded-md border text-sm font-medium transition-colors duration-150 
                ${currentView === 'list' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-700 dark:border-blue-500 dark:text-white' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-slate-600 dark:hover:bg-slate-700 dark:text-gray-300'
                }`}
              onClick={() => handleViewChange('list')}
            >
              <span className="material-icons-outlined mr-1.5 align-middle text-lg">list</span> List
            </button>
          </div>

          <select
            id="eventTypeFilter"
            aria-label="Filter by event type"
            className="w-full p-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 col-span-1 md:col-span-1 transition-colors duration-300"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as EventType | 'all')}
          >
            <option value="all" className="dark:bg-slate-700 dark:text-gray-200">All Event Types</option>
            <option value="meeting" className="dark:bg-slate-700 dark:text-gray-200">Meeting</option>
            <option value="hearing" className="dark:bg-slate-700 dark:text-gray-200">Hearing</option>
            <option value="consultation" className="dark:bg-slate-700 dark:text-gray-200">Consultation</option>
            <option value="reminder" className="dark:bg-slate-700 dark:text-gray-200">General Event</option>
            <option value="court_date" className="dark:bg-slate-700 dark:text-gray-200">Court Date</option>
          </select>

          <input
            type="text"
            id="searchEvents"
            aria-label="Search events by title or description"
            className="w-full p-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 col-span-1 md:col-span-1 transition-colors duration-300"
            placeholder="Search Events (title, description)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div
        className={`bg-white dark:bg-slate-800 shadow-lg rounded-lg transition-colors duration-300
          ${(currentView === 'calendar' && filteredEvents.length > 0 && !isLoading && !isError) ? 
            '' : 
            'p-4 sm:p-6'
          }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px] text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">Loading events...</p>
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 dark:text-red-400 py-12 px-4 transition-colors duration-300">
            <span className="material-icons-outlined text-5xl text-red-400 dark:text-red-300 mb-3 transition-colors duration-300">error_outline</span>
            <h2 className="text-xl font-medium mb-2">Error Loading Events</h2>
            <p className="text-sm">
              {(fetchErrorData && typeof fetchErrorData === 'object' && 'data' in fetchErrorData && (fetchErrorData as { data?: { msg?: string } }).data?.msg) ||
               (fetchErrorData && typeof fetchErrorData === 'object' && 'error' in fetchErrorData && (fetchErrorData as { error?: string }).error) ||
               'An unexpected error occurred. Please try again.'}
            </p>
          </div>
        ) : isSuccess && (!events || events.length === 0) ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12 px-4 transition-colors duration-300">
            <span className="material-icons-outlined text-5xl text-gray-400 dark:text-gray-500 mb-3 transition-colors duration-300">event_busy</span>
            <h2 className="text-xl font-medium mb-2">No Events Yet</h2>
            <p className="text-sm">Click "Add Event" above to get started.</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12 px-4 transition-colors duration-300">
            <span className="material-icons-outlined text-5xl text-gray-400 dark:text-gray-500 mb-3 transition-colors duration-300">search_off</span>
            <h2 className="text-xl font-medium mb-2">No Matching Events</h2>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        ) : currentView === 'calendar' ? (
          <EventCalendarView
            events={filteredEvents}
            onEventClick={handleOpenDetailsModal}
            onDateSelect={(selectInfo) => {
              let startTimeISO: string;
              if (selectInfo.allDay) {
                startTimeISO = format(selectInfo.start, "yyyy-MM-dd");
              } else {
                startTimeISO = selectInfo.start.toISOString();
              }
              setEventToEdit({
                event_id: 0,
                user_id: 0,
                case_id: 0,
                event_type: 'meeting',
                event_title: '',
                start_time: startTimeISO,
                created_at: '',
                updated_at: ''
              });
              setIsEventFormModalOpen(true);
            }}
          />
        ) : (
          <EventListView
            events={filteredEvents}
            onEditEvent={handleOpenEditEventModal}
            onDeleteEvent={handleDeleteEventRequest}
            onViewEventDetails={handleOpenDetailsModal}
          />
        )}
      </div>

      {isEventFormModalOpen && (
        <EventFormModal
          open={isEventFormModalOpen}
          onClose={() => { setIsEventFormModalOpen(false); setEventToEdit(null); }}
          eventToEdit={eventToEdit}
        />
      )}

      {isDetailsModalOpen && selectedEventForDetails && (
        <EventDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          event={selectedEventForDetails}
          onEditEvent={(event) => { handleCloseDetailsModal(); handleOpenEditEventModal(event); }}
          onDeleteEvent={(eventId) => { handleCloseDetailsModal(); handleDeleteEventRequest(eventId); }}
          onSuccess={(message) => showSnackbar(message, 'success')}
          onError={(message) => showSnackbar(message, 'error')}
        />
      )}

      <ConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDeleteEvent}
        title="Confirm Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone and will also remove any associated reminders."
        isLoading={isDeletingEvent}
      />

      <NotificationSnackbar 
        snackbar={snackbar} 
        handleCloseSnackbar={handleCloseSnackbar} 
      />
    </div>
  );
};

export default EventsPage;