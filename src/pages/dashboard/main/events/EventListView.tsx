// src/features/events/EventListView.tsx
import React, { useState } from 'react';
import { EventDataTypes } from '../../../../features/events/events'; 
import EventTypeChip from './components/EventTypeChip'; 
import { format, parseISO, isValid } from 'date-fns'; 
import {
  Eye, Edit3, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
   
  ListFilter, // For "Rows per page"
  SearchX // For empty state
} from 'lucide-react';

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
    setPage(0); // Reset to first page when rows per page changes
  };

  const formatEventDateTime = (isoString?: string, timeOnly: boolean = false) => {
    if (!isoString) return 'N/A';
    try {
      const parsedDate = parseISO(isoString);
      if (!isValid(parsedDate)) return 'Invalid Date/Time';

      // Check for all-day event (common format "YYYY-MM-DD")
      if (isoString.length === 10 && !isoString.includes('T')) {
        return timeOnly ? 'All-day' : `${format(parsedDate, 'MMM d, yyyy')} (All-day)`;
      }
      
      return timeOnly ? format(parsedDate, 'p') : format(parsedDate, 'MMM d, yyyy, p'); // e.g., Jan 1, 2023, 12:00 PM
    } catch (e) {
      console.error("Error formatting date/time from ISO string:", isoString, e);
      return 'Invalid Date/Time';
    }
  };


  const paginatedEvents = events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(events.length / rowsPerPage);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 my-12 p-6 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
        <SearchX size={48} className="mb-4 text-slate-400 dark:text-slate-500" />
        <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">No Events Found</h3>
        <p className="text-sm">There are no events matching your current filters or search criteria.</p>
      </div>
    );
  }

  const thClasses = "px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider";
  const tdClasses = "px-6 py-4 whitespace-nowrap text-sm";
  const actionButtonBaseClasses = "p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-800 transition-all duration-150";

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-10"> {/* Sticky header */}
            <tr>
              <th scope="col" className={`${thClasses}`}>
                Title
              </th>
              <th scope="col" className={`${thClasses}`}>
                Type
              </th>
              <th scope="col" className={`${thClasses}`}>
                Date & Time
              </th>
              <th scope="col" className={`${thClasses}`}>
                Case ID
              </th>
              <th scope="col" className={`${thClasses} text-center`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {paginatedEvents.map((event) => (
              <tr key={event.event_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                <td 
                  className={`${tdClasses} font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer group`}
                  onClick={() => onViewEventDetails(event)}
                >
                  <span className="group-hover:underline">{event.event_title}</span>
                </td>
                <td className={`${tdClasses} text-slate-800 dark:text-slate-200`}>
                  <EventTypeChip eventType={event.event_type} />
                </td>
                <td className={`${tdClasses} text-slate-600 dark:text-slate-400`}>
                  {formatEventDateTime(event.start_time)}
                </td>
                <td className={`${tdClasses} text-slate-600 dark:text-slate-400`}>
                  {event.case_id || <span className="italic text-slate-400 dark:text-slate-500">N/A</span>}
                </td>
                <td className={`${tdClasses} text-center`}>
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                    <button
                      onClick={() => onViewEventDetails(event)}
                      title="View Details"
                      aria-label={`View details for ${event.event_title}`}
                      className={`${actionButtonBaseClasses} text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/20 focus:ring-sky-500`}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEditEvent(event)}
                      title="Edit Event"
                      aria-label={`Edit ${event.event_title}`}
                      className={`${actionButtonBaseClasses} text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 focus:ring-amber-500`}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.event_id)}
                      title="Delete Event"
                      aria-label={`Delete ${event.event_title}`}
                      className={`${actionButtonBaseClasses} text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 focus:ring-red-500`}
                    >
                      <Trash2 size={18} />
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
        <div className="px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-700 sm:px-6 bg-slate-50 dark:bg-slate-800/50">
          {/* Mobile Pagination (Simplified) */}
          <div className="flex-1 flex justify-between sm:hidden w-full mb-3 sm:mb-0">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
          
          {/* Desktop Pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
            <div className="flex items-center gap-2">
              <ListFilter size={16} className="text-slate-500 dark:text-slate-400" />
              <label htmlFor="rowsPerPage" className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">Rows:</label>
              <select
                  id="rowsPerPage"
                  name="rowsPerPage"
                  className="block pl-3 pr-8 py-2 text-sm border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 appearance-none"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
              >
                  {[5, 10, 15, 25].map(rpp => (
                      <option key={rpp} value={rpp} className="dark:bg-slate-700 dark:text-slate-200">{rpp}</option>
                  ))}
              </select>
              <p className="text-sm text-slate-700 dark:text-slate-300 ml-4 whitespace-nowrap">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{page * rowsPerPage + 1}</span>
                -
                <span className="font-semibold text-slate-800 dark:text-slate-100">{Math.min((page + 1) * rowsPerPage, events.length)}</span>
                {' '}of{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-100">{events.length}</span>
              </p>
            </div>
            
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {[
                { icon: ChevronsLeft, action: () => handleChangePage(0), disabled: page === 0, title: 'First page' },
                { icon: ChevronLeft, action: () => handleChangePage(page - 1), disabled: page === 0, title: 'Previous page' },
              ].map((item, idx) => (
                <button
                  key={`nav-start-${idx}`}
                  onClick={item.action}
                  disabled={item.disabled}
                  className={`relative inline-flex items-center px-2 py-2 ${idx === 0 ? 'rounded-l-md' : ''} border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors`}
                  title={item.title}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </button>
              ))}

              <span className="relative inline-flex items-center px-3.5 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200">
                {page + 1} / {totalPages}
              </span>

              {[
                { icon: ChevronRight, action: () => handleChangePage(page + 1), disabled: page >= totalPages - 1, title: 'Next page' },
                { icon: ChevronsRight, action: () => handleChangePage(totalPages - 1), disabled: page >= totalPages - 1, title: 'Last page' },
              ].map((item, idx) => (
                <button
                  key={`nav-end-${idx}`}
                  onClick={item.action}
                  disabled={item.disabled}
                  className={`relative inline-flex items-center px-2 py-2 ${idx === 1 ? 'rounded-r-md' : ''} border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors`}
                  title={item.title}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListView;