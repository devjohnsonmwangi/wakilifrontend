// src/pages/dashboard/main/events/EventCalendarView.tsx
import React, { useRef, useEffect } from 'react';
import FullCalendar, { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { EventDataTypes, EventType } from '../../../../features/events/events';

interface EventCalendarViewProps {
  events: EventDataTypes[];
  onEventClick: (event: EventDataTypes) => void;
  onDateSelect: (selectInfo: { start: Date; end: Date; allDay: boolean }) => void;
}

const getEventColor = (eventType: EventType, theme: Theme): string => {
  switch (eventType) {
    case 'meeting':
      return theme.palette.info.main;
    case 'hearing':
      return theme.palette.error.main;
    case 'consultation':
      return theme.palette.success.main;
    case 'reminder':
      return theme.palette.warning.main;
    case 'court_date':
      return theme.palette.secondary.main;
    default:
      return theme.palette.grey[500];
  }
};

const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  onEventClick,
  onDateSelect
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef<FullCalendar | null>(null);

  const calendarEvents: EventInput[] = events.map((event) => ({
    id: String(event.event_id),
    title: event.event_title,
    start: `${event.event_date}T${event.start_time}`,
    allDay: false,
    backgroundColor: getEventColor(event.event_type, theme),
    borderColor: getEventColor(event.event_type, theme),
    extendedProps: event
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    onEventClick(clickInfo.event.extendedProps as EventDataTypes);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateSelect({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay
    });

    calendarRef.current?.getApi().unselect();
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      if (isMobile) {
        calendarApi.changeView('listWeek');
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next',
          center: 'title',
          right: 'listWeek,dayGridMonth'
        });
      } else {
        calendarApi.changeView(calendarApi.view.type);
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        });
      }
    }
  }, [isMobile]);

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        '.fc-button': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        },
        '.fc-event': {
          cursor: 'pointer'
        }
      }}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={calendarEvents}
        selectable
        selectMirror
        dayMaxEvents
        weekends
        eventClick={handleEventClick}
        select={handleDateSelect}
        height="auto"
        contentHeight="auto"
        aspectRatio={isMobile ? 1.5 : 2}
        longPressDelay={500}
      />
    </Box>
  );
};

export default EventCalendarView;
