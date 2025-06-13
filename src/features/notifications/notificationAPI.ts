// src/features/notifications/notificationsAPI.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store'; 
import { APIDomain } from '../../utils/APIDomain'; 

// --- TypeScript Interfaces for the API ---

export type NotificationType = 
  | 'new_chat_message'
  | 'event_reminder'
  | 'upcoming_event'
  | 'ticket_update'
  | 'case_update'
  | 'new_assignment'
  | 'appointment_booked'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'general_announcement';

export interface Notification {
  notification_id: number;
  user_id: number;
  type: NotificationType;
  title: string | null;
  message: string;
  link_url: string | null;
  related_entity_id: number | null;
  related_entity_type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface GetNotificationsParams {
  userId: number; // For cache key
  limit?: number;
  offset?: number;
  onlyUnread?: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// --- API Slice Definition ---

export const notificationsAPI = createApi({
  reducerPath: 'notificationsAPI',
  // SOLUTION: The baseUrl is now the root domain because your Hono app
  // mounts the notificationRouter at app.route('/', notificationRouter).
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
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

    // Route: GET /?params -> Matches `notificationRouter.get('/', ...)`
    getNotifications: builder.query<Notification[], GetNotificationsParams>({
      query: ({ limit = 20, offset = 0, onlyUnread = false }) => {
        const params = new URLSearchParams();
        params.append('limit', String(limit));
        params.append('offset', String(offset));
        if (onlyUnread) {
          params.append('unread', 'true');
        }
        // SOLUTION: The path starts with '/' because the baseUrl is now the domain root.
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

    // Route: GET /unread-count -> Matches `notificationRouter.get('/unread-count', ...)`
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/unread-count',
      providesTags: ['UnreadCount'],
    }),

    // === MUTATIONS (Changing Data) ===

    // Route: POST /:id/read -> Matches `notificationRouter.post('/:id/read', ...)`
    markAsRead: builder.mutation<Notification, number>({
      query: (notificationId) => ({
        url: `/${notificationId}/read`,
        method: 'POST',
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const currentUserId = state.user?.user?.user_id;
        if (!currentUserId) return;

        const patchResults = [
          dispatch(notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: false }, (draft) => {
              const notification = draft.find(n => n.notification_id === notificationId);
              if (notification) notification.is_read = true;
          })),
          dispatch(notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: true }, (draft) => {
              const index = draft.findIndex(n => n.notification_id === notificationId);
              if (index > -1) draft.splice(index, 1);
          })),
        ];
        
        try {
          await queryFulfilled;
          dispatch(notificationsAPI.util.invalidateTags(['UnreadCount', { type: 'NotificationList', id: 'LIST' }]));
        } catch {
          patchResults.forEach(p => p.undo());
        }
      },
    }),
    
    // Route: POST /read-all -> Matches `notificationRouter.post('/read-all', ...)`
    markAllAsRead: builder.mutation<{ message: string }, void>({
        query: () => ({
            url: '/read-all',
            method: 'POST',
        }),
        invalidatesTags: ['NotificationList', 'UnreadCount'],
    }),

    // Route: POST /read-multiple -> Matches `notificationRouter.post('/read-multiple', ...)`
    markMultipleAsRead: builder.mutation<{ message: string }, number[]>({
        query: (notificationIds) => ({
            url: '/read-multiple',
            method: 'POST',
            body: { ids: notificationIds }
        }),
        invalidatesTags: ['NotificationList', 'UnreadCount'],
    }),

    // Route: DELETE /:id -> Matches `notificationRouter.delete('/:id', ...)`
    deleteNotification: builder.mutation<{ message: string }, number>({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const currentUserId = state.user?.user?.user_id;
        if (!currentUserId) return;

        const patchResults = [
          dispatch(notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: false }, (draft) => {
              const index = draft.findIndex(n => n.notification_id === notificationId);
              if (index !== -1) draft.splice(index, 1);
          })),
          dispatch(notificationsAPI.util.updateQueryData('getNotifications', { userId: currentUserId, onlyUnread: true }, (draft) => {
              const index = draft.findIndex(n => n.notification_id === notificationId);
              if (index !== -1) draft.splice(index, 1);
          })),
        ];

        try {
          await queryFulfilled;
          dispatch(notificationsAPI.util.invalidateTags(['UnreadCount']));
        } catch {
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
  useMarkMultipleAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsAPI;