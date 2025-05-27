// src/components/MyDiary.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  useFetchEventsQuery, // Or useFetchUserEventsQuery(userId) if available
  useDeleteEventMutation,
  EventDataTypes,
  EventType,
} from '../../../../features/events/events'; // Adjust path

// Import Redux hooks and selectors
import { useSelector } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectCurrentUserId, // Using this directly
} from '../../../../features/users/userSlice'; // <<--- Path to YOUR userSlice.ts

import EventCalendarView from './EventCalendarView';
import EventListView from './EventListView';
import EventFormModal from './EventFormModal';
import EventDetailsModal from './EventDetailsModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import NotificationSnackbar, { SnackbarMessage } from './components/NotificationSnackbar';
import { format } from 'date-fns';
import { UserX } from 'lucide-react'; // For Access Denied

export type ViewMode = 'calendar' | 'list';

// Ensure EventDataTypes includes user_id
// export interface EventDataTypes {
//   event_id: number;
//   user_id: number; // <<< IMPORTANT FOR FILTERING
//   // ... other fields
// }

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

  // Get user info from Redux store
  const loggedInUser = useSelector(selectCurrentUser); // Gets the User object or null
  const isAuthenticated = useSelector(selectIsAuthenticated); // Gets boolean
  const currentUserId = useSelector(selectCurrentUserId); // Gets number | undefined

  // Fetch events
  const { data: allEvents, isLoading, isError, isSuccess, error: fetchErrorData } = useFetchEventsQuery(undefined, {
    skip: !isAuthenticated || !currentUserId, // Skip if not authenticated or no user ID
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
    if (!currentUserId) { // Check currentUserId directly
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

  // This is the primary guard now.
  if (!isAuthenticated || !currentUserId) {
    return (
        <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-100px)]">
            <div className="text-center">
                <UserX size={64} className="mx-auto mb-4 text-red-500 dark:text-red-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Access Denied</h2>
                <p className="text-gray-600 dark:text-gray-400">Please log in to view your diary.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg p-6 mb-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-green-800">
            My Diary {loggedInUser?.full_name ? `(${loggedInUser.full_name})` : ''}
          </h1>
          <button
            onClick={handleOpenCreateEventModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm hover:shadow-md transition-colors duration-150 flex items-center gap-2 text-sm sm:text-base"
            aria-label="Add New Event to My Diary"
          >
            <span className="material-icons-outlined text-xl mr-1">add</span> Add Diary Entry
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
            className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 col-span-1 md:col-span-1"
            placeholder="Search My Diary (title, description)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div
        className={`bg-white shadow-lg rounded-lg 
          ${(currentView === 'calendar' && filteredUserEvents.length > 0 && !isLoading && !isError) ? 
            '' : 
            'p-4 sm:p-6'
          }`}
      >
        {isLoading && userEvents.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px] text-center">
            <p className="text-gray-600 text-lg">Loading your diary entries...</p>
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 py-12 px-4">
            <span className="material-icons-outlined text-5xl text-red-400 mb-3">error_outline</span>
            <h2 className="text-xl font-medium mb-2">Error Loading Diary</h2>
            <p className="text-sm">
              {/* Error message display logic */}
              {(fetchErrorData && typeof fetchErrorData === 'object' && 'data' in fetchErrorData && (fetchErrorData as { data?: { msg?: string } }).data?.msg) ||
               (fetchErrorData && typeof fetchErrorData === 'object' && 'error' in fetchErrorData && (fetchErrorData as { error?: string }).error) ||
               'An unexpected error occurred. Please try again.'}
            </p>
          </div>
        ) : isSuccess && userEvents.length === 0 && !isLoading ? (
          <div className="text-center text-gray-600 py-12 px-4">
            <span className="material-icons-outlined text-5xl text-gray-400 mb-3">event_busy</span>
            <h2 className="text-xl font-medium mb-2">Your Diary is Empty</h2>
            <p className="text-sm">Click "Add Diary Entry" above to get started.</p>
          </div>
        ) : filteredUserEvents.length === 0 && userEvents.length > 0 ? (
          <div className="text-center text-gray-600 py-12 px-4">
            <span className="material-icons-outlined text-5xl text-gray-400 mb-3">search_off</span>
            <h2 className="text-xl font-medium mb-2">No Matching Entries</h2>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        ) : currentView === 'calendar' ? (
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
                user_id: currentUserId, // Pre-fill with current user's ID
                case_id: 0, 
                event_type: 'reminder', 
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
            events={filteredUserEvents}
            onEditEvent={handleOpenEditEventModal}
            onDeleteEvent={handleDeleteEventRequest}
            onViewEventDetails={handleOpenDetailsModal}
          />
        )}
      </div>

      {isEventFormModalOpen && currentUserId && (
        <EventFormModal
          open={isEventFormModalOpen}
          onClose={() => { setIsEventFormModalOpen(false); setEventToEdit(null); }}
          eventToEdit={eventToEdit}
          currentUserId={currentUserId} // Pass currentUserId to the form
        />
      )}

      {isDetailsModalOpen && selectedEventForDetails && currentUserId && ( // Added currentUserId check for consistency
        <EventDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          event={selectedEventForDetails}
          onEditEvent={(event) => { handleCloseDetailsModal(); handleOpenEditEventModal(event); }}
          onDeleteEvent={(eventId) => { handleCloseDetailsModal(); handleDeleteEventRequest(eventId); }}
          onSuccess={(message) => showSnackbar(message, 'success')}
          onError={(message) => showSnackbar(message, 'error')}
          currentUserId={currentUserId} // Pass for potential ownership checks
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