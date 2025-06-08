// src/features/notifications/notificationsAPI.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store'; 
import { APIDomain } from '../../utils/APIDomain'; 

// --- TypeScript Interfaces for the API ---

export interface Notification {
  notification_id: number;
  user_id: number;
  type: 'new_message' | 'new_follower' | 'booking_confirmation' | 'booking_request' | 'payment_received' | 'system_alert' | string;
  message: string;
  link_url: string | null;
  related_entity_id: number | null;
  is_read: boolean;
  created_at: string;
}

export interface GetNotificationsParams {
  userId: number;
  limit?: number;
  offset?: number;
  onlyUnread?: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

// --- API Slice Definition ---

export const notificationsAPI = createApi({
  reducerPath: 'notificationsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${APIDomain}/notifications`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token || localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['NotificationList', 'UnreadCount'],

  endpoints: (builder) => ({
    // === QUERIES (Fetching Data) ===

    getNotifications: builder.query<Notification[], GetNotificationsParams>({
      query: ({ limit = 20, offset = 0, onlyUnread = false }) => {
        const params = new URLSearchParams();
        params.append('limit', String(limit));
        params.append('offset', String(offset));
        if (onlyUnread) {
          params.append('unread', 'true');
        }
        return `/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ notification_id }) => ({ type: 'NotificationList' as const, id: notification_id })),
              { type: 'NotificationList', id: 'LIST' },
            ]
          : [{ type: 'NotificationList', id: 'LIST' }],
      serializeQueryArgs: ({ queryArgs }) => {
        // CORRECTION: We must include the userId in the serialized key
        // so that different users don't share the same notification cache.
        const { onlyUnread, userId } = queryArgs;
        return { onlyUnread, userId };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.offset && arg.offset > 0) {
          currentCache.push(...newItems);
        } else {
          return newItems;
        }
      },
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/unread-count',
      providesTags: ['UnreadCount'],
    }),

    // === MUTATIONS (Changing Data) ===

    markAsRead: builder.mutation<Notification, number>({
      query: (notificationId) => ({
        url: `/${notificationId}/read`,
        method: 'POST',
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled, getState }) {
        // 1: Get the full state to access the current user's ID.
        const state = getState() as unknown as RootState;
        const currentUserId = state.user?.user?.user_id;

        if (!currentUserId) return; // Don't do anything if no user is logged in

        //  patch both the 'all' and 'unread' lists if they are in the cache.
        const patchPromises = [
          // Patch the 'all' list
          dispatch(
            notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: false }, (draft) => {
              const notification = draft.find(n => n.notification_id === notificationId);
              if (notification) {
                notification.is_read = true;
              }
            })
          ),
          // Patch the 'unread' list (which will cause the item to be removed on next refetch)
          dispatch(
            notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: true }, (draft) => {
               const notification = draft.find(n => n.notification_id === notificationId);
               if (notification) {
                 notification.is_read = true;
               }
            })
          ),
        ];
        
        try {
          await queryFulfilled;
          dispatch(notificationsAPI.util.invalidateTags(['UnreadCount', 'NotificationList']));
        } catch {
          // Undo both patches on failure
          patchPromises.forEach(p => p.undo());
        }
      },
    }),
    
    markAllAsRead: builder.mutation<{ message: string }, void>({
        query: () => ({
            url: '/read-all',
            method: 'POST',
        }),
        invalidatesTags: ['NotificationList', 'UnreadCount'],
    }),

    deleteNotification: builder.mutation<{ message: string }, number>({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled, getState }) {
        //  1 (same as above): Get the current user's ID from the state.
        const state = getState() as unknown as RootState;
        const currentUserId = state.user?.user?.user_id;

        if (!currentUserId) return;

        //  2: Create patch results for both 'all' and 'unread' filters.
        const patchResults = [
          dispatch(
            notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: false }, (draft) => {
              const index = draft.findIndex(n => n.notification_id === notificationId);
              if (index !== -1) draft.splice(index, 1);
            })
          ),
          dispatch(
            notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: true }, (draft) => {
              const index = draft.findIndex(n => n.notification_id === notificationId);
              if (index !== -1) draft.splice(index, 1);
            })
          ),
        ];

        try {
          await queryFulfilled;
          dispatch(notificationsAPI.util.invalidateTags(['UnreadCount']));
        } catch {
          // Undo all patches if the server call fails.
          patchResults.forEach(patch => patch.undo());
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsAPI;