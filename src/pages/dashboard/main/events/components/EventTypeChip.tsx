// src/features/events/components/EventTypeChip.tsx
import React from 'react';



import { EventType } from '../../../../../features/events/events'; 

interface EventTypeChipProps {
  eventType: EventType;
}


const getEventTypeStyle = (
  type: EventType
): { className: string; label: string } => {
  switch (type) {
    case 'meeting':
      return {
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200', // Added dark mode variants
        label: 'Meeting',
      };
    case 'hearing':
      return {
        className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200', // Added dark mode variants
        label: 'Hearing',
      };
    case 'consultation':
      return {
        className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200', // Added dark mode variants
        label: 'Consultation',
      };
    case 'reminder':
      return {
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100', // Adjusted for better contrast and dark mode
        label: 'General Event',
      };
    case 'court_date':
      return {
        className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200', // Added dark mode variants
        label: 'Court Date',
      };
    default: { 
      const formattedLabel = (type as string)
        .replace(/_/g, ' ') 
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
      return {
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200', // Added dark mode variants
        label: formattedLabel,
      };
    } 
  }
};

const EventTypeChip: React.FC<EventTypeChipProps> = ({ eventType }) => {
  const { className, label } = getEventTypeStyle(eventType);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

export default EventTypeChip;