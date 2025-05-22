import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useFetchEventsQuery,
  useDeleteEventMutation,
  EventDataTypes,
  EventType,
} from '../../../../features/events/events'; // Assuming this path is correct

import EventCalendarView from './EventCalendarView';
import EventListView from './EventListView';
import EventFormModal from './EventFormModal';
import EventDetailsModal from './EventDetailsModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import NotificationSnackbar, { SnackbarMessage } from './components/NotificationSnackbar';
import { format } from 'date-fns'; // format is already imported

export type ViewMode = 'calendar' | 'list';

const EventsPage: React.FC = () => {
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
        // Optionally, refetch events or rely on cache invalidation
      } catch (err: unknown) {
        const errorMessage = (err as { data?: { msg?: string } })?.data?.msg || 'Failed to delete event.';
        toast.error(errorMessage); // Using Sonner for immediate feedback
        showSnackbar(errorMessage, 'error'); // And custom snackbar if desired
      } finally {
        setIsConfirmDeleteDialogOpen(false);
        setEventToDeleteId(null);
      }
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header and Controls Section - Always Visible */}
      <div className="bg-white shadow-lg p-6 mb-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-semibold text-gray-800">Event Management</h1>
          <button
            onClick={handleOpenCreateEventModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm hover:shadow-md transition-colors duration-150 flex items-center gap-2 text-sm sm:text-base"
            aria-label="Add New Event"
          >
            <span className="material-icons-outlined text-xl mr-1">add</span> Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
          <div className="flex gap-2 col-span-1 md:col-span-1">
            <button
              aria-label="Switch to Calendar View"
              className={`flex-1 p-2.5 rounded-md border text-sm font-medium transition-colors duration-150 ${currentView === 'calendar' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}
              onClick={() => handleViewChange('calendar')}
            >
              <span className="material-icons-outlined mr-1.5 align-middle text-lg">calendar_today</span> Calendar
            </button>
            <button
              aria-label="Switch to List View"
              className={`flex-1 p-2.5 rounded-md border text-sm font-medium transition-colors duration-150 ${currentView === 'list' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}
              onClick={() => handleViewChange('list')}
            >
              <span className="material-icons-outlined mr-1.5 align-middle text-lg">list</span> List
            </button>
          </div>

          <select
            id="eventTypeFilter"
            aria-label="Filter by event type"
            className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 col-span-1 md:col-span-1"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as EventType | 'all')}
          >
            <option value="all">All Event Types</option>
            <option value="meeting">Meeting</option>
            <option value="hearing">Hearing</option>
            <option value="consultation">Consultation</option>
            <option value="reminder">General Event</option> {/* Assuming 'reminder' is the value for "General Event" */}
            <option value="court_date">Court Date</option>
          </select>

          <input
            type="text"
            id="searchEvents"
            aria-label="Search events by title or description"
            className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 col-span-1 md:col-span-1"
            placeholder="Search Events (title, description)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Event Display Area */}
      <div
        className={`bg-white shadow-lg rounded-lg 
          ${(currentView === 'calendar' && filteredEvents.length > 0 && !isLoading && !isError) ? 
            '' : 
            'p-4 sm:p-6'
          }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px] text-center">
            {/* Consider adding a spinner component or simple text */}
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 py-12 px-4">
            <span className="material-icons-outlined text-5xl text-red-400 mb-3">error_outline</span>
            <h2 className="text-xl font-medium mb-2">Error Loading Events</h2>
            <p className="text-sm">
              {(fetchErrorData && typeof fetchErrorData === 'object' && 'data' in fetchErrorData && (fetchErrorData as { data?: { msg?: string } }).data?.msg) ||
               (fetchErrorData && typeof fetchErrorData === 'object' && 'error' in fetchErrorData && (fetchErrorData as { error?: string }).error) ||
               'An unexpected error occurred. Please try again.'}
            </p>
          </div>
        ) : isSuccess && (!events || events.length === 0) ? (
          <div className="text-center text-gray-600 py-12 px-4">
            <span className="material-icons-outlined text-5xl text-gray-400 mb-3">event_busy</span>
            <h2 className="text-xl font-medium mb-2">No Events Yet</h2>
            <p className="text-sm">Click "Add Event" above to get started.</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-gray-600 py-12 px-4">
            <span className="material-icons-outlined text-5xl text-gray-400 mb-3">search_off</span>
            <h2 className="text-xl font-medium mb-2">No Matching Events</h2>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        ) : currentView === 'calendar' ? (
          <EventCalendarView
            events={filteredEvents}
            onEventClick={handleOpenDetailsModal}
            onDateSelect={(selectInfo) => {
              // UPDATED: Construct start_time as ISO string
              let startTimeISO: string;
              if (selectInfo.allDay) {
                // For all-day selections, format as "YYYY-MM-DD"
                // FullCalendar's `start` for allDay selection is already at the beginning of the day.
                startTimeISO = format(selectInfo.start, "yyyy-MM-dd");
              } else {
                // For timed selections, use the full ISO string from the Date object.
                startTimeISO = selectInfo.start.toISOString();
              }

              setEventToEdit({
                event_id: 0, // Placeholder for new event
                user_id: 0,  // Placeholder, assuming this is set by backend or context
                case_id: 0,  // Placeholder, or to be selected in form
                event_type: 'meeting', // Default type for new event
                event_title: '',
                start_time: startTimeISO, // Correctly formatted ISO string
                // event_date is removed
                created_at: '', // Will be set by backend
                updated_at: ''  // Will be set by backend
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

      {/* Modals and Snackbar */}
      {isEventFormModalOpen && (
        <EventFormModal
          open={isEventFormModalOpen}
          onClose={() => { setIsEventFormModalOpen(false); setEventToEdit(null); }}
          eventToEdit={eventToEdit}
          // Assuming EventFormModal is updated to handle onSuccess/onError itself
          // or these are passed down and used within its save logic
        />
      )}

      {isDetailsModalOpen && selectedEventForDetails && (
        <EventDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          event={selectedEventForDetails}
          onEditEvent={(event) => { handleCloseDetailsModal(); handleOpenEditEventModal(event); }}
          onDeleteEvent={(eventId) => { handleCloseDetailsModal(); handleDeleteEventRequest(eventId); }}
          onSuccess={(message) => showSnackbar(message, 'success')} // For reminder success
          onError={(message) => showSnackbar(message, 'error')}     // For reminder error
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

      <NotificationSnackbar snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </div>
  );
};

export default EventsPage;