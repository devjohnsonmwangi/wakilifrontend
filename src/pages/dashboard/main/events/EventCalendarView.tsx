// src/pages/dashboard/main/events/EventCalendarView.tsx
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
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

const getEventColorClasses = (eventType: EventType): { backgroundColor: string; borderColor: string; textColor?: string } => {
  switch (eventType) {
    case 'meeting':
      return { backgroundColor: 'bg-blue-500', borderColor: 'border-blue-700', textColor: 'text-white' };
    case 'hearing':
      return { backgroundColor: 'bg-red-500', borderColor: 'border-red-700', textColor: 'text-white' };
    case 'consultation':
      return { backgroundColor: 'bg-green-500', borderColor: 'border-green-700', textColor: 'text-white' };
    case 'reminder':
      return { backgroundColor: 'bg-yellow-500', borderColor: 'border-yellow-700', textColor: 'text-black' };
    case 'court_date':
      return { backgroundColor: 'bg-purple-500', borderColor: 'border-purple-700', textColor: 'text-white' };
    default:
      return { backgroundColor: 'bg-gray-400', borderColor: 'border-gray-600', textColor: 'text-white' };
  }
};

const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  onEventClick,
  onDateSelect,
}) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calendarEvents: EventInput[] = events.map((event) => {
    const colorClasses = getEventColorClasses(event.event_type);
    return {
      id: String(event.event_id),
      title: event.event_title,
      start: event.start_time,
      allDay: event.start_time.length === 10,
      classNames: [
        colorClasses.backgroundColor,
        colorClasses.borderColor,
        colorClasses.textColor || 'text-white',
        'border',
        '!p-1', // Base padding for events (0.25rem), will be overridden by more specific CSS below for mobile month view
      ],
      extendedProps: event,
    };
  });

  const handleEventClick = (clickInfo: EventClickArg) => {
    onEventClick(clickInfo.event.extendedProps as EventDataTypes);
  };

  const handleDateSelectRange = (selectInfo: DateSelectArg) => {
    onDateSelect({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    });
    calendarRef.current?.getApi().unselect();
  };

  const handleCalendarDateClick = (clickInfo: DateClickArg) => {
    const endDate = new Date(clickInfo.date.valueOf());
    if (clickInfo.allDay) {
      endDate.setDate(clickInfo.date.getDate() + 1);
    }
    onDateSelect({
      start: clickInfo.date,
      end: endDate,
      allDay: clickInfo.allDay,
    });
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentViewType = calendarApi.view.type;
      const preferredMobileGridView = 'dayGridMonth';

      if (isMobileView) {
        if (currentViewType !== preferredMobileGridView) {
          calendarApi.changeView(preferredMobileGridView);
        }
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridDay,listWeek',
        });
        if (currentViewType === 'dayGridMonth' || calendarApi.view.type === preferredMobileGridView) {
          // For mobile month view, limit displayed events.
          // Adjust 'dayMaxEvents' (e.g., 2 or 3) to control how many events are shown
          // before a "+more" link. Fewer events mean each can appear wider.
          calendarApi.setOption('dayMaxEvents', 2); // Example: show up to 2 events
        } else {
          calendarApi.setOption('dayMaxEvents', true);
        }
      } else {
        const preferredDesktopView = 'dayGridMonth';
        if ((currentViewType === 'listWeek' || currentViewType === 'timeGridDay' || currentViewType === preferredMobileGridView) && currentViewType !== preferredDesktopView) {
           calendarApi.changeView(preferredDesktopView);
        }
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        });
        calendarApi.setOption('dayMaxEvents', true); // Or a higher number for desktop
      }
    }
  }, [isMobileView, calendarRef]);

  const initialCalendarView = 'dayGridMonth';

  return (
    <div className="p-2 sm:p-4 md:p-6 event-calendar-wrapper max-h-[70vh] overflow-y-auto sm:max-h-none sm:overflow-y-visible">
      <style>{`
        .event-calendar-wrapper .fc-button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 0.5em 1em;
          margin: 0.2em;
          border-radius: 0.25em;
          font-size: 0.875rem;
        }
        .event-calendar-wrapper .fc-button:hover {
          background-color: #4338ca;
        }
        .event-calendar-wrapper .fc-button-primary:disabled {
            opacity: 0.65;
        }
        .event-calendar-wrapper .fc-event { /* General event styling */
          cursor: pointer;
          font-size: 0.85em;
          /* Default padding is applied via Tailwind's !p-1 on the event itself */
        }
        .event-calendar-wrapper .fc-event:hover {
            opacity: 0.85;
        }
        .event-calendar-wrapper .fc-today-button {
            background-color: #10b981;
        }
        .event-calendar-wrapper .fc-today-button:hover {
            background-color: #059669;
        }
        .event-calendar-wrapper .fc-toolbar-title {
            font-size: 1.25em;
            font-weight: 600;
            color: #1f2937;
        }
        .event-calendar-wrapper .fc {
            min-height: 400px;
        }

        @media (max-width: 639px) { /* Below Tailwind 'sm' breakpoint */
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-day-frame {
            min-height: 85px; /* Increased height for day cells in mobile month view. Adjust as needed. */
            /* Width is implicitly 1/7th of calendar width. */
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-day-top {
            flex-direction: row;
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-day-number {
            font-size: 0.8em;
            padding: 2px 4px;
          }
          /* Event styling specific to mobile month view for better text fit */
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-event {
            font-size: 0.70em; /* Slightly smaller font for events on mobile month view */
            line-height: 1.25; /* Adjust line height for the smaller font */
            /* Override Tailwind's !p-1 for finer control on mobile month view */
            /* This provides less padding than default p-1 (0.25rem or ~4px) */
            padding-top: 2px !important;
            padding-bottom: 2px !important;
            padding-left: 3px !important;  /* Slightly more horizontal space for text */
            padding-right: 3px !important;
            margin-bottom: 2px; /* Add a little space between stacked events */
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-more-link {
            font-size: 0.7em;
            margin-top: 1px; /* Adjust if it overlaps with events */
          }
        }

        @media (min-width: 640px) { /* sm breakpoint and up */
            .event-calendar-wrapper .fc {
                 min-height: 550px;
            }
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={initialCalendarView}
        headerToolbar={{
          left: isMobileView ? 'prev,next' : 'prev,next today',
          center: 'title',
          right: isMobileView ? 'dayGridMonth,timeGridDay,listWeek' : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={calendarEvents}
        selectable
        selectMirror
        weekends
        eventClick={handleEventClick}
        select={handleDateSelectRange}
        dateClick={handleCalendarDateClick}
        height="auto"
        contentHeight="auto"
        longPressDelay={300}
        buttonText={{
          today: 'Today', month: 'Month', week: 'Week', day: 'Day', list: 'List'
        }}
        eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: false }}
        slotLabelFormat={{ hour: 'numeric', minute: '2-digit', omitZeroMinute: false, meridiem: false }}
        // dayMaxEvents is now dynamically set in useEffect
      />
    </div>
  );
};

export default EventCalendarView;