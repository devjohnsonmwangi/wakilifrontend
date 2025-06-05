// src/features/chats/components/UserAvatar.tsx
import React from 'react';
import OnlineIndicator from './OnlineIndicator'; // Assuming OnlineIndicator is in the same directory

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs'| 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
  showOnlineIndicator?: boolean; // Control whether to show the indicator
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline,
  className = '',
  showOnlineIndicator = false, // Default to false, explicitly enable
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const getInitials = (fullName?: string | null) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 0 || names[0] === '') return '?';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'User Avatar'}
          className={`rounded-full object-cover ${sizeMap[size]}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold ${sizeMap[size]}`}
        >
          {getInitials(name)}
        </div>
      )}
      {showOnlineIndicator && isOnline !== undefined && (
        <OnlineIndicator
          isOnline={isOnline}
          size={size === 'xs' || size === 'sm' ? 'sm' : 'md'}
          className={`absolute bottom-0 right-0 border-2 border-white dark:border-neutral-800 rounded-full`}
        />
      )}
    </div>
  );
};
export default UserAvatar;