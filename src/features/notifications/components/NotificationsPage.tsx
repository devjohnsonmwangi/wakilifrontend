// src/features/notifications/components/NotificationsPage.tsx

import  { useState, useEffect} from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice'; // Adjust path
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../notificationAPI'; // Adjust path
import NotificationItem from './NotificationItem';
import { BellRing, Check, BellOff, Loader2 } from 'lucide-react';

// Skeleton loader component for a better loading experience
const NotificationSkeleton = () => (
  <div className="flex items-center p-4 space-x-4 animate-pulse">
    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
    </div>
  </div>
);

const NotificationsPage = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [offset, setOffset] = useState(0);
  const limit = 15; // Number of items to fetch per page

  const currentUserId = useSelector(selectCurrentUserId);
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.5 });
  
  const { data: notifications = [], isLoading, isFetching } = useGetNotificationsQuery(
    {
      userId: currentUserId!,
      onlyUnread: filter === 'unread',
      limit,
      offset,
    },
    { skip: !currentUserId }
  );
  
  const [markAllAsRead, { isLoading: isMarkingAllRead }] = useMarkAllAsReadMutation();
  
  // Infinite scroll logic
  useEffect(() => {
    if (inView && !isFetching) {
      // Check if there are more items to load
      if (notifications.length >= offset + limit) {
        setOffset(prev => prev + limit);
      }
    }
  }, [inView, isFetching, notifications.length, offset]);
  
  // Reset offset when filter changes
  useEffect(() => {
    setOffset(0);
  }, [filter]);

  const handleMarkAll = () => {
    markAllAsRead();
  };
  
  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-white dark:bg-neutral-900 shadow-lg sm:rounded-lg sm:my-8">
      {/* Header */}
      <header className="sticky top-0 z-10 p-4 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BellRing className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              Notifications
            </h1>
          </div>
          <button
            onClick={handleMarkAll}
            disabled={isMarkingAllRead}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
          >
            {isMarkingAllRead ? (
               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
               <Check className="w-4 h-4 mr-2" />
            )}
            Mark all as read
          </button>
        </div>
        {/* Filter Tabs */}
        <div className="mt-4">
          <div className="flex space-x-2 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                filter === 'unread'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Unread
            </button>
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <main>
        {isLoading && offset === 0 ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)}
          </div>
        ) : notifications.length > 0 ? (
          <div>
            {notifications.map(notification => (
              <NotificationItem key={notification.notification_id} notification={notification} />
            ))}
            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-10 flex items-center justify-center">
              {isFetching && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <BellOff className="w-16 h-16 text-neutral-300 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-700 dark:text-neutral-300">
              You're all caught up!
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              New notifications will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;