import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store'; 
import { selectIsUserOnline } from '../../online/online'; 
import OnlineIndicator from './OnlineIndicator'; 

//  the props 
interface UserOnlineIndicatorProps {
  userId: number;       // user's ID to look up their status
  className?: string;
  size?: 'sm' | 'md';
}

const UserOnlineIndicator: React.FC<UserOnlineIndicatorProps> = ({ userId, className, size }) => {
  // This is the magic. The useSelector hook subscribes to the Redux store.
  // It uses our `selectIsUserOnline` selector to get the live status for this specific user.
  // This component will automatically re-render ONLY when this user's online status changes.
  const isOnline = useSelector((state: RootState) => selectIsUserOnline(state, userId));

  // It then renders  original OnlineIndicator component with the live data.
  return <OnlineIndicator isOnline={isOnline} className={className} size={size} />;
};

export default UserOnlineIndicator;