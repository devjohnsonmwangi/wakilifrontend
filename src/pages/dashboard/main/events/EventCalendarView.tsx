// src/pages/dashboard/main/events/EventCalendarView.tsx
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventDataTypes, EventType } from '../../../../features/events/events'; // Adjust path if needed

interface EventCalendarViewProps {
  events: EventDataTypes[];
  onEventClick: (event: EventDataTypes) => void;
  onDateSelect: (selectInfo: { start: Date; end: Date; allDay: boolean }) => void;
}

// Define Tailwind color classes for event types
// Ensure these colors are defined in your tailwind.config.js or are standard Tailwind colors
const getEventColorClasses = (eventType: EventType): { backgroundColor: string; borderColor: string; textColor?: string } => {
  switch (eventType) {
    case 'meeting': // Example: Blue
      return { backgroundColor: 'bg-blue-500', borderColor: 'border-blue-700', textColor: 'text-white' };
    case 'hearing': // Example: Red
      return { backgroundColor: 'bg-red-500', borderColor: 'border-red-700', textColor: 'text-white' };
    case 'consultation': // Example: Green
      return { backgroundColor: 'bg-green-500', borderColor: 'border-green-700', textColor: 'text-white' };
    case 'reminder': // Example: Yellow/Orange
      return { backgroundColor: 'bg-yellow-500', borderColor: 'border-yellow-700', textColor: 'text-black' }; // text-black for better contrast on yellow
    case 'court_date': // Example: Purple
      return { backgroundColor: 'bg-purple-500', borderColor: 'border-purple-700', textColor: 'text-white' };
    default: // Example: Gray
      return { backgroundColor: 'bg-gray-400', borderColor: 'border-gray-600', textColor: 'text-white' };
  }
};

const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  onEventClick,
  onDateSelect,
}) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640); // Tailwind 'sm' breakpoint is 640px

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640); // Check against Tailwind's 'sm' breakpoint
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const calendarEvents: EventInput[] = events.map((event) => {
    const colorClasses = getEventColorClasses(event.event_type);
    return {
      id: String(event.event_id),
      title: event.event_title,
      // UPDATED: event.start_time is now a full ISO string
      start: event.start_time, // Ensure event.start_time is a valid ISO 8601 string
      // If event.start_time only contains a date (e.g., "2023-01-01"), FullCalendar treats it as all-day.
      // If it contains date and time (e.g., "2023-01-01T10:00:00"), it's not all-day by default.
      // If your backend guarantees start_time always includes a time component for non-all-day events,
      // then `allDay: false` might not be strictly necessary, as FullCalendar can infer.
      // However, if you want to explicitly state non-all-day for events with time, keep it.
      // For now, let's assume start_time always includes time part for specific timed events.
      allDay: event.start_time.length === 10, // Basic check: if ISO string is 'YYYY-MM-DD', it's likely all-day.
                                              // More robust: parse and check if time is 00:00:00Z and it ends on same day or not provided
                                              // Or, ideally, backend sends an `allDay` flag.
                                              // For simplicity with current EventDataTypes, this is a guess.
                                              // If start_time always includes a time, then `allDay: false` is safer.
                                              // Let's revert to a safer default if no explicit allDay flag from backend:
      // allDay: false, // Re-evaluating this: if start_time is 'YYYY-MM-DD', FullCalendar will make it allDay.
                        // If it's 'YYYY-MM-DDTHH:mm:ss', it won't be. So this is fine to let FC handle.
      // classNames for styling
      classNames: [
        colorClasses.backgroundColor,
        colorClasses.borderColor,
        colorClasses.textColor || 'text-white', // Default text color if not specified
        'border', // Add a base border style if your theme requires it
        '!p-1', // Example: Force padding for events using !important if needed
      ],
      extendedProps: event,
    };
  });

  const handleEventClick = (clickInfo: EventClickArg) => {
    onEventClick(clickInfo.event.extendedProps as EventDataTypes);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateSelect({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    });
    calendarRef.current?.getApi().unselect();
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentViewType = calendarApi.view.type;

      if (isMobileView) {
        if (currentViewType !== 'listWeek') {
          calendarApi.changeView('listWeek');
        }
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next',
          center: 'title',
          right: 'listWeek,dayGridMonth',
        });
      } else {
        if (currentViewType === 'listWeek' && calendarApi.getOption('initialView') !== 'listWeek') {
            calendarApi.changeView('dayGridMonth'); // Or your preferred default desktop view
        }
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        });
      }
    }
  }, [isMobileView, calendarRef]);

  return (
    <div className="p-2 sm:p-4 md:p-6 event-calendar-wrapper">
      <style>{`
        .event-calendar-wrapper .fc-button {
          background-color: #4f46e5; /* example: indigo-600 */
          color: white;
          border: none;
          padding: 0.5em 1em;
          margin: 0.2em;
          border-radius: 0.25em;
        }
        .event-calendar-wrapper .fc-button:hover {
          background-color: #4338ca; /* example: indigo-700 */
        }
        .event-calendar-wrapper .fc-button-primary:disabled {
            opacity: 0.65;
        }
        .event-calendar-wrapper .fc-event { /* For event items themselves */
          cursor: pointer;
          font-size: 0.85em;
        }
        .event-calendar-wrapper .fc-event:hover {
            opacity: 0.85;
        }
        .event-calendar-wrapper .fc-today-button {
            background-color: #10b981; /* example: emerald-500 */
        }
        .event-calendar-wrapper .fc-today-button:hover {
            background-color: #059669; /* example: emerald-600 */
        }
        .event-calendar-wrapper .fc-toolbar-title {
            font-size: 1.25em; /* Tailwind: text-xl */
            font-weight: 600; /* Tailwind: font-semibold */
            color: #1f2937; /* Tailwind: text-gray-800 */
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={isMobileView ? 'listWeek' : 'dayGridMonth'}
        events={calendarEvents}
        selectable
        selectMirror
        dayMaxEvents
        weekends
        eventClick={handleEventClick}
        select={handleDateSelect}
        height="auto"
        contentHeight="auto"
        aspectRatio={isMobileView ? 1.3 : 1.8}
        longPressDelay={500}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List'
        }}
        // eventTimeFormat can be used to format time display if needed
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        // slotLabelFormat can be used to format time in timeGrid views
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short'
        }}
      />
    </div>
  );
};

export default EventCalendarView;