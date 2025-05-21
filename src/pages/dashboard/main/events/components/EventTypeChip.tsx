// src/features/events/components/EventTypeChip.tsx
import React from 'react';
import Chip from '@mui/material/Chip';
import { EventType } from '../../../../../features/events/events'; // Adjust path as needed

interface EventTypeChipProps {
  eventType: EventType;
}

const getEventTypeStyle = (
  type: EventType
): { backgroundColor: string; color: string; label: string } => {
  switch (type) {
    case 'meeting':
      return { backgroundColor: '#e3f2fd', color: '#1976d2', label: 'Meeting' }; // Light Blue
    case 'hearing':
      return { backgroundColor: '#ffebee', color: '#d32f2f', label: 'Hearing' }; // Light Red
    case 'consultation':
      return { backgroundColor: '#e8f5e9', color: '#388e3c', label: 'Consultation' }; // Light Green
    case 'reminder':
      return { backgroundColor: '#fff3e0', color: '#f57c00', label: 'General Event' }; // Light Orange
    case 'court_date':
      return { backgroundColor: '#f3e5f5', color: '#7b1fa2', label: 'Court Date' }; // Light Purple
    default:
      return {
        backgroundColor: '#f5f5f5',
        color: '#616161',
        label: (type as string).replace('_', ' ').toUpperCase(),
      };
  }
};

const EventTypeChip: React.FC<EventTypeChipProps> = ({ eventType }) => {
  const { backgroundColor, color, label } = getEventTypeStyle(eventType);

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor,
        color,
        fontWeight: 'medium',
        textTransform: 'capitalize',
      }}
    />
  );
};

export default EventTypeChip;
