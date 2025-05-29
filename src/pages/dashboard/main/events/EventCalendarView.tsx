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
  isDarkMode?: boolean;
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
  isDarkMode,
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
        '!p-1',
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
          calendarApi.setOption('dayMaxEvents', 2);
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
        calendarApi.setOption('dayMaxEvents', true);
      }
    }
  }, [isMobileView, calendarRef]);

  const initialCalendarView = 'dayGridMonth';

  // Helper class for the main div to ensure index.css dark styles are applied
  // by FullCalendar if your app's dark mode is activated by a class on <html> or <body>
  const calendarWrapperClass = `p-2 sm:p-4 md:p-6 event-calendar-wrapper ${isDarkMode ? 'fc-dark-manual-trigger' : ''} max-h-[70vh] overflow-y-auto sm:max-h-none sm:overflow-y-visible`;
  // If your global dark mode is triggered by adding 'dark' class to <html>,
  // then FullCalendar's own CSS variables for `.dark` in index.css should activate automatically.
  // The `isDarkMode` prop passed to this component is now primarily for any component-specific logic
  // that *isn't* handled by FC's own .dark CSS.

  return (
    <div className={calendarWrapperClass}>
      {/*
        NOTE: The 'fc-dark' class on the wrapper was for component-level dark mode styles.
        If your index.css uses a class like '.dark' on the <html> or <body> tag to activate
        FullCalendar's dark mode variables, you might not need to manually add a class here
        for FullCalendar's own dark styling.
        The component-level dark mode styles below are being reduced.
      */}
      <style>{`
        /* Component-level styles that are NOT primarily for dark mode colors,
           or are overrides that index.css doesn't cover. */
        .event-calendar-wrapper .fc-button {
          /* These might be fine if they don't conflict with index.css variables or if you prefer these */
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
        .event-calendar-wrapper .fc-event {
          cursor: pointer;
          font-size: 0.85em;
        }
        .event-calendar-wrapper .fc-event:hover {
            opacity: 0.85;
        }
        .event-calendar-wrapper .fc-today-button {
            /* This is likely overridden by index.css .dark .fc .fc-button if that's more specific */
            background-color: #10b981;
        }
        .event-calendar-wrapper .fc-today-button:hover {
            background-color: #059669;
        }
        .event-calendar-wrapper .fc-toolbar-title {
            /* Default light mode title color, index.css handles dark mode */
            font-size: 1.25em;
            font-weight: 600;
            color: #1f2937;
        }
        .event-calendar-wrapper .fc {
            min-height: 400px;
        }

        @media (max-width: 639px) {
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-day-frame {
            min-height: 85px;
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-day-top {
            flex-direction: row;
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-day-number {
            /* Default light mode, index.css handles dark mode */
            font-size: 0.8em;
            padding: 2px 4px;
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-event {
            font-size: 0.70em;
            line-height: 1.25;
            padding-top: 2px !important;
            padding-bottom: 2px !important;
            padding-left: 3px !important;
            padding-right: 3px !important;
            margin-bottom: 2px;
          }
          .event-calendar-wrapper .fc-dayGridMonth-view .fc-daygrid-more-link {
            font-size: 0.7em;
            margin-top: 1px;
          }
        }

        @media (min-width: 640px) {
            .event-calendar-wrapper .fc {
                 min-height: 550px;
            }
        }

        /* --- Dark Mode Styles (REDUCED - Deferring to index.css) --- */
        /* The following dark mode specific color rules previously here are
           now expected to be handled by src/index.css using CSS variables
           and the .dark class on a parent element (e.g., <html> or <body>). */

        /*
          REMOVED/COMMENTED OUT:
          .event-calendar-wrapper.fc-dark .fc-toolbar-title { color: #E5E7EB; }
          .event-calendar-wrapper.fc-dark .fc-col-header-cell-cushion,
          .event-calendar-wrapper.fc-dark .fc-daygrid-day-number,
          .event-calendar-wrapper.fc-dark .fc-list-day-text,
          .event-calendar-wrapper.fc-dark .fc-list-day-side-text { color: #D1D5DB !important; }
          .event-calendar-wrapper.fc-dark .fc-daygrid-day-number { color: #D1D5DB !important; }
          .event-calendar-wrapper.fc-dark .fc-timegrid-axis { color: #FFFFFF !important; }
          .event-calendar-wrapper.fc-dark .fc-list-event-time { color: #22c55e !important; }
          .event-calendar-wrapper.fc-dark .fc-list-event-title a { color: #E5E7EB !important; }
          .event-calendar-wrapper.fc-dark .fc-list-event.text-black .fc-list-event-title a { color: #E5E7EB !important; }
          .event-calendar-wrapper.fc-dark .fc-list-event-dot { border-color: #E5E7EB !important; }
          .event-calendar-wrapper.fc-dark .fc-theme-standard td,
          .event-calendar-wrapper.fc-dark .fc-theme-standard th,
          .event-calendar-wrapper.fc-dark .fc-list { border-color: #4B5563; }
          .event-calendar-wrapper.fc-dark .fc-day-today { background-color: rgba(55, 65, 81, 0.5) !important; }
          .event-calendar-wrapper.fc-dark .fc-list-empty { color: #9CA3AF; }
        */

        /* If you have structural dark mode styles (not color) specific to the component, keep them.
           For example, if a border style changes beyond just color.
           Most color-related dark mode styles should now be managed by index.css.
        */
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
      />
    </div>
  );
};

export default EventCalendarView;