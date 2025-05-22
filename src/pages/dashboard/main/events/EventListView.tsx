// src/features/events/EventListView.tsx
import React, { useState } from 'react';
// Assuming EventListView.tsx is in src/features/events/ and events.ts is also in src/features/events/
import { EventDataTypes } from '../../../../features/events/events';
import EventTypeChip from './components/EventTypeChip';
import { format, parseISO } from 'date-fns'; // Changed 'parse' to 'parseISO'
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface EventListViewProps {
  events: EventDataTypes[];
  onEditEvent: (event: EventDataTypes) => void;
  onDeleteEvent: (eventId: number) => void;
  onViewEventDetails: (event: EventDataTypes) => void;
}

const EventListView: React.FC<EventListViewProps> = ({
  events,
  onEditEvent,
  onDeleteEvent,
  onViewEventDetails,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // UPDATED: Takes full ISO string from event.start_time
  const formatEventDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const parsedDate = parseISO(isoString); // parseISO handles various ISO formats
      return format(parsedDate, 'MMM d, yyyy'); // e.g., Jan 1, 2023
    } catch (e) {
      console.error("Error formatting date from ISO string:", isoString, e);
      return 'Invalid Date';
    }
  };

  // UPDATED: Takes full ISO string from event.start_time
  const formatEventTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      // Check if the original ISO string likely represented an all-day event
      // A common format for all-day is "YYYY-MM-DD" (length 10 and no 'T' character)
      if (isoString.length === 10 && !isoString.includes('T')) {
        return 'All-day';
      }
      const parsedDate = parseISO(isoString);
      return format(parsedDate, 'p'); // e.g., 12:00 PM
    } catch (e) {
      console.error("Error formatting time from ISO string:", isoString, e);
      return 'Invalid Time';
    }
  };

  const paginatedEvents = events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(events.length / rowsPerPage);

  if (events.length === 0) {
    return <p className="text-center text-gray-600 my-8">No events found matching your criteria.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case ID
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEvents.map((event) => (
              <tr key={event.event_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer" onClick={() => onViewEventDetails(event)}>
                  {event.event_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <EventTypeChip eventType={event.event_type} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* UPDATED: Use event.start_time for date formatting */}
                  {formatEventDate(event.start_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* UPDATED: Use event.start_time for time formatting */}
                  {formatEventTime(event.start_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.case_id || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onViewEventDetails(event)}
                      title="View Details"
                      aria-label={`View details for ${event.event_title}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-100"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => onEditEvent(event)}
                      title="Edit Event"
                      aria-label={`Edit ${event.event_title}`}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 rounded-full hover:bg-yellow-100"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.event_id)}
                      title="Delete Event"
                      aria-label={`Delete ${event.event_title}`}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Pagination Controls */}
      {events.length > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{events.length > 0 ? page * rowsPerPage + 1 : 0}</span> to{' '}
                <span className="font-medium">{Math.min((page + 1) * rowsPerPage, events.length)}</span> of{' '}
                <span className="font-medium">{events.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                    id="rowsPerPage"
                    name="rowsPerPage"
                    className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                >
                    {[5, 10, 25, 50].map(rpp => (
                        <option key={rpp} value={rpp}>{rpp}</option>
                    ))}
                </select>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handleChangePage(0)}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  title="First page"
                >
                  <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  title="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  title="Next page"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleChangePage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  title="Last page"
                >
                  <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListView;