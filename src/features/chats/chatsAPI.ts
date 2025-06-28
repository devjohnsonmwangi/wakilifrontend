// src/features/chats/chatsAPI.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIDomain } from '../../utils/APIDomain';
import { RootState } from '../../app/store';

// --- TypeScript Interfaces 
export interface UserSummary {
  user_id: number;
  full_name: string | null;
  profile_picture?: string | null;
  email?: string | null;
  role?: string | null;
}
export interface ChatMessage {
  message_id: number | string;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  sent_at: string;
  sender?: UserSummary;
}
export interface Conversation {
  conversation_id: number;
  title: string | null;
  is_group_chat: boolean;
  creator?: UserSummary;
  last_message_content_preview: string | null;
  last_message_sent_at: string | null;
  updated_at: string;
  user_last_read_at?: string | null;
  unread_count?: number;
  participants?: UserSummary[];
}

export interface CreateConversationPayload {
  creator_id: number;
  participant_user_ids: number[];
  title?: string;
  is_group?: boolean;
}
export interface FindOrCreateOneOnOnePayload {
  user_id_1: number;
  user_id_2: number;
}
export interface SendMessagePayload {
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type?: string;
}
export interface MarkAsReadPayload {
  conversation_id: number;
  user_id: number;
}
export interface AddUserToGroupPayload {
  conversation_id: number;
  added_by_user_id: number;
  user_id_to_add: number;
}

export const chatsAPI = createApi({
  reducerPath: 'chatsAPI',
  // ✨ MODIFICATION: Simplified and standardized baseQuery
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers, { getState }) => {
      // Get token directly from the Redux store state
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ConversationList', 'Conversation', 'Message', 'Participant'],
  endpoints: (builder) => ({
    // QUERIES
    getUserConversations: builder.query<Conversation[], number>({
      query: (userId) => `/conversations?userId=${userId}`,
      providesTags: (result, _error, userId) =>
        result
          ? [
              ...result.map(({ conversation_id }) => ({ type: 'Conversation' as const, id: conversation_id })),
              { type: 'ConversationList' as const, id: userId }
            ]
          : [{ type: 'ConversationList' as const, id: userId }],
    }),

    getMessagesForConversation: builder.query<ChatMessage[], { conversationId: number; requestingUserId: number; limit?: number; offset?: number }>({
      query: ({ conversationId, requestingUserId, limit = 30, offset = 0 }) => `/conversations/${conversationId}/messages?requestingUserId=${requestingUserId}&limit=${limit}&offset=${offset}`,
      providesTags: (_result, _error, { conversationId }) => [{ type: 'Message', id: `LIST-${conversationId}` }],
      serializeQueryArgs: ({ queryArgs }) => `messages-${queryArgs.conversationId}`,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.offset && arg.offset > 0) {
          const existingIds = new Set(currentCache.map(m => m.message_id));
          const uniqueNewItems = newItems.filter(item => !existingIds.has(item.message_id));
          return [...uniqueNewItems, ...currentCache];
        }
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.conversationId !== previousArg?.conversationId;
      }
    }),

    getConversationParticipants: builder.query<UserSummary[], number>({
      query: (conversationId) => `/conversations/${conversationId}/participants`,
      providesTags: (_result, _error, conversationId) => [{ type: 'Participant', id: `LIST-${conversationId}` }],
    }),

    // MUTATIONS
    createConversation: builder.mutation<Conversation, CreateConversationPayload>({
      query: (body) => ({ url: '/conversations', method: 'POST', body }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'ConversationList', id: arg.creator_id }],
    }),

    findOrCreateOneOnOneConversation: builder.mutation<Conversation, FindOrCreateOneOnOnePayload>({
      query: (body) => ({ url: '/conversations/direct', method: 'POST', body }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'ConversationList', id: arg.user_id_1 }],
    }),

    sendMessage: builder.mutation<ChatMessage, SendMessagePayload>({
      query: ({ conversation_id, ...body }) => ({ url: `/conversations/${conversation_id}/messages`, method: 'POST', body }),
      async onQueryStarted({ conversation_id, sender_id, content, message_type }, { dispatch, queryFulfilled, getState }) {
        const tempId = `temp_${Date.now()}`;
        const state = getState() as RootState;
        
        const senderDetails = state.user?.user?.user_id === sender_id ? state.user.user : undefined;
        const queryArgs = { conversationId: conversation_id, requestingUserId: sender_id, limit: 30, offset: 0 }; // Ensure args match query

        const patchResult = dispatch(
          chatsAPI.util.updateQueryData('getMessagesForConversation', queryArgs, (draft) => {
            draft.push({
              message_id: tempId,
              conversation_id: conversation_id,
              sender_id: sender_id,
              content,
              message_type: message_type || 'text',
              sent_at: new Date().toISOString(),
              sender: senderDetails,
            });
          })
        );
        try {
          const { data: sentMessage } = await queryFulfilled;
          dispatch(chatsAPI.util.updateQueryData('getMessagesForConversation', queryArgs, (draft) => {
              const msgIndex = draft.findIndex(m => m.message_id === tempId);
              if (msgIndex !== -1) draft[msgIndex] = sentMessage;
            })
          );
          dispatch(chatsAPI.util.invalidateTags([{ type: 'ConversationList', id: sender_id }]));
        } catch {
          patchResult.undo();
        }
      },
    }),

    markConversationAsRead: builder.mutation<void, MarkAsReadPayload>({
      query: ({ conversation_id, user_id }) => ({ url: `/conversations/${conversation_id}/read`, method: 'POST', body: { user_id } }),
      onQueryStarted({ conversation_id, user_id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chatsAPI.util.updateQueryData('getUserConversations', user_id, (draft) => {
            const convo = draft.find(c => c.conversation_id === conversation_id);
            if (convo) convo.unread_count = 0;
          })
        );
        queryFulfilled.catch(patchResult.undo);
      }
    }),

    addUserToGroupChat: builder.mutation<{ message: string }, AddUserToGroupPayload>({
      query: ({ conversation_id, ...body }) => ({ url: `/conversations/${conversation_id}/participants`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { conversation_id }) => [
        { type: 'Participant', id: `LIST-${conversation_id}` },
        { type: 'Conversation', id: conversation_id },
      ],
    }),
  }),
});

export const {
  useGetUserConversationsQuery,
  useGetMessagesForConversationQuery,
  useGetConversationParticipantsQuery,
  useCreateConversationMutation,
  useFindOrCreateOneOnOneConversationMutation,
  useSendMessageMutation,
  useMarkConversationAsReadMutation,
  useAddUserToGroupChatMutation,
} = chatsAPI;