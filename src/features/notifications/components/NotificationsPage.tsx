// src/features/notifications/components/NotificationsPage.tsx

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice'; // Adjust path
import { useGetNotificationsQuery, useMarkAllAsReadMutation, Notification } from '../notificationAPI'; // Adjust path. Also import the Notification type.
import NotificationItem from './NotificationItem';
import { BellRing, Check, BellOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [hasMore, setHasMore] = useState(true);
  
  // This ref helps prevent the infinite scroll from triggering on the very first render.
  const initialLoadDone = useRef(false);

  const limit = 15; // Number of items to fetch per page

  const currentUserId = useSelector(selectCurrentUserId);
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 });
  
  // Use a local state for notifications to correctly manage infinite scroll data
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  
  const { data: fetchedNotifications, isLoading, isFetching, isSuccess } = useGetNotificationsQuery(
    {
      // SOLUTION: Removed the non-null assertion (`!`).
      // The `skip` option below will handle cases where currentUserId is null.
      userId: currentUserId as number,
      onlyUnread: filter === 'unread',
      limit,
      offset,
    },
    // This is the correct way to prevent the query from running until the user ID is available.
    { skip: !currentUserId }
  );
  
  const [markAllAsRead, { isLoading: isMarkingAllRead }] = useMarkAllAsReadMutation();
  
  // Effect to merge fetched data into our local state for a stable list
  useEffect(() => {
    if (isSuccess && fetchedNotifications) {
      if (offset === 0) {
        // If it's the first page (offset 0), replace the list
        setLocalNotifications(fetchedNotifications);
      } else {
        // For subsequent pages, append new items, avoiding duplicates
        setLocalNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.notification_id));
            const newItems = fetchedNotifications.filter(n => !existingIds.has(n.notification_id));
            return [...prev, ...newItems];
        });
      }
      
      // IMPROVED: More reliable check for more data
      setHasMore(fetchedNotifications.length === limit);
      initialLoadDone.current = true;
    }
  }, [fetchedNotifications, isSuccess, offset]);

  // Infinite scroll trigger logic
  useEffect(() => {
    // Only trigger if not fetching, there's more data, and the initial load is complete
    if (inView && !isFetching && hasMore && initialLoadDone.current) {
      setOffset(prev => prev + limit);
    }
  }, [inView, isFetching, hasMore]);
  
  // Reset state when the filter changes
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setLocalNotifications([]); // Clear local data to show loading skeleton
    initialLoadDone.current = false;
  }, [filter, currentUserId]);

  const handleMarkAll = () => {
    const promise = markAllAsRead().unwrap();
    toast.promise(promise, {
      loading: 'Marking all as read...',
      success: 'All notifications marked as read!',
      error: 'Failed to mark all as read.',
    });
  };
  
  // GUARD CLAUSE: If we are still waiting for the user ID, show a loading state.
  if (!currentUserId) {
    return (
      <div className="max-w-3xl mx-auto min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

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
            disabled={isMarkingAllRead || localNotifications.filter(n => !n.is_read).length === 0}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/* Show skeleton only on the very first load of a filter */}
        {isLoading && offset === 0 ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)}
          </div>
        ) : localNotifications.length > 0 ? (
          <div>
            {localNotifications.map(notification => (
              <NotificationItem key={notification.notification_id} notification={notification} />
            ))}
            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-10 flex items-center justify-center">
              {isFetching && hasMore && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />}
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