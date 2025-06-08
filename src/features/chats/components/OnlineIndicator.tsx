// src/features/chats/components/OnlineIndicator.tsx
import React from 'react';

interface OnlineIndicatorProps {
  isOnline: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ isOnline, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <span
      className={`inline-block rounded-full ${sizeClasses} ${
        isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400' // subtle pulse for online
      } ${className}`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
};

export default OnlineIndicator;