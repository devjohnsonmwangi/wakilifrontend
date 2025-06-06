import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store'; // Adjust the path to your store if needed
import { selectIsUserOnline } from '../../online/online'; // We will use the selector we created
import OnlineIndicator from './OnlineIndicator'; // Import your existing presentational component

// Define the props for our new smart component
interface UserOnlineIndicatorProps {
  userId: number;       // We only need the user's ID to look up their status
  className?: string;
  size?: 'sm' | 'md';
}

const UserOnlineIndicator: React.FC<UserOnlineIndicatorProps> = ({ userId, className, size }) => {
  // This is the magic. The useSelector hook subscribes to the Redux store.
  // It uses our `selectIsUserOnline` selector to get the live status for this specific user.
  // This component will automatically re-render ONLY when this user's online status changes.
  const isOnline = useSelector((state: RootState) => selectIsUserOnline(state, userId));

  // It then renders your original OnlineIndicator component with the live data.
  return <OnlineIndicator isOnline={isOnline} className={className} size={size} />;
};

export default UserOnlineIndicator;