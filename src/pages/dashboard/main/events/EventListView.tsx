// src/features/events/EventListView.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { EventDataTypes } from '../../../../features/events/events'; // Adjust path
import EventTypeChip from './components/EventTypeChip';
import { format } from 'date-fns';

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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        // Backend sends just YYYY-MM-DD for event_date
        // No need to parseISO if it's already in this format and not a full ISO string
        return format(new Date(dateString + 'T00:00:00'), 'PP'); // e.g., Jan 1, 2023 - ensure dateString is just YYYY-MM-DD
    } catch (e) {
        return 'Invalid Date';
    }
  };

  const formatEventTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    // Assuming timeString is "HH:MM:SS" or "HH:MM"
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'p'); // e.g., 12:00 PM
  };


  if (events.length === 0) {
    return <Typography sx={{ textAlign: 'center', my: 3 }}>No events found matching your criteria.</Typography>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}> {/* Adjust maxHeight as needed */}
        <Table stickyHeader aria-label="events table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Case ID</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => (
              <TableRow
                hover
                key={event.event_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}} onClick={() => onViewEventDetails(event)}>
                  {event.event_title}
                </TableCell>
                <TableCell><EventTypeChip eventType={event.event_type} /></TableCell>
                <TableCell>{formatEventDate(event.event_date)}</TableCell>
                <TableCell>{formatEventTime(event.start_time)}</TableCell>
                <TableCell>{event.case_id || 'N/A'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton onClick={() => onViewEventDetails(event)} color="primary" aria-label={`View details for ${event.event_title}`}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Event">
                    <IconButton onClick={() => onEditEvent(event)} color="secondary" aria-label={`Edit ${event.event_title}`}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Event">
                    <IconButton onClick={() => onDeleteEvent(event.event_id)} color="error" aria-label={`Delete ${event.event_title}`}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={events.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EventListView;