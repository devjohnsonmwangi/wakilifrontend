// src/features/chats/chatsAPI.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIDomain } from '../../utils/APIDomain'; // Path to your APIDomain
import { RootState } from '../../app/store';   // Path to your RootState

// --- TypeScript Types Defined In-File (Keep these as they are well-defined) ---

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
  sender_name?: string;
}

export interface ParticipantInConversation {
  user_id: number;
  conversation_id: number;
  joined_at: string;
  last_read_at?: string | null;
  user: UserSummary;
}

export interface Conversation {
  conversation_id: number;
  title: string | null;
  is_group_chat: boolean;
  creator_id: number | null;
  creator?: UserSummary;
  last_message_id: number | null;
  last_message_content_preview: string | null;
  last_message_sent_at: string | null;
  last_message_sender_id: number | null;
  last_message_sender_name: string | null;
  created_at: string;
  updated_at: string;
  user_last_read_at?: string | null;
  unread_count?: number;
  participants?: ParticipantInConversation[] | UserSummary[];
}

// Payloads for Mutations
// Updated to include userId where the backend controller now expects it
export interface CreateConversationPayload {
  creatorUserId: number; // User performing the action
  participantUserIds: number[];
  title?: string;
  isGroup?: boolean;
}

export interface FindOrCreateOneOnOnePayload {
  requestingUserId: number; // User performing the action
  otherUserId: number;
}

export interface SendMessagePayload {
  conversationId: number;
  senderUserId: number; // User sending the message
  content: string;
  messageType?: string;
}

export interface MarkAsReadPayload {
  conversationId: number;
  userId: number; // User whose "read" status is being updated
}

export interface AddUserToGroupPayload {
  conversationId: number;
  performingUserId: number; // User performing the action
  userIdToAdd: number;
}

// --- End TypeScript Types ---


// Helper function to get the token (remains the same)
const getToken = (state: RootState | undefined) => {
  if (state?.user?.token) {
    return state.user.token;
  }
  return localStorage.getItem('authToken');
};


export const chatsAPI = createApi({
  reducerPath: 'chatsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = getToken(getState() as RootState | undefined);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Conversation', 'Message', 'Participant', 'UnreadCount', 'UserConversations'], // Added UserConversations
  endpoints: (builder) => ({
    // QUERIES
    getUserConversations: builder.query<Conversation[], number>({ // Argument is userId
      query: (userId) => `/conversations?userId=${userId}`, // Backend expects userId as query param
      providesTags: (result, _error, userId) =>
        result
          ? [
              ...result.map(({ conversation_id }) => ({ type: 'Conversation' as const, id: conversation_id })),
              { type: 'UserConversations', id: userId }, // Tag for this specific user's list
              { type: 'Conversation', id: 'LIST' }, // General list (might be redundant if UserConversations covers it)
              { type: 'UnreadCount', id: 'TOTAL' }, // Assuming unread count is global or per user
            ]
          : [{ type: 'UserConversations', id: userId }, { type: 'Conversation', id: 'LIST' }, { type: 'UnreadCount', id: 'TOTAL' }],
    }),

    getMessagesForConversation: builder.query<ChatMessage[], { conversationId: number; requestingUserId: number; limit?: number; offset?: number }>({
      // requestingUserId is needed for backend to check permissions
      query: ({ conversationId, requestingUserId, limit = 30, offset = 0 }) =>
        `/conversations/${conversationId}/messages?requestingUserId=${requestingUserId}&limit=${limit}&offset=${offset}`,
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'Message', id: `LIST-${conversationId}` },
      ],
      serializeQueryArgs: ({ queryArgs }) => `getMessagesForConversation-${queryArgs.conversationId}-${queryArgs.requestingUserId}`, // Include requestingUserId
      merge: (currentCache, newItems, { arg }) => {
        // Merge logic remains the same
        if (arg.offset && arg.offset > 0) {
          const existingIds = new Set(currentCache.map(m => m.message_id));
          const uniqueNewItems = newItems.filter(item => !existingIds.has(item.message_id));
          currentCache.unshift(...uniqueNewItems);
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        // Force refetch if conversationId OR requestingUserId changes
        return currentArg?.conversationId !== previousArg?.conversationId || currentArg?.requestingUserId !== previousArg?.requestingUserId;
      }
    }),

    getConversationParticipants: builder.query<UserSummary[], { conversationId: number /*, requestingUserId?: number */ }>({
      // If backend needs requestingUserId for permissions, add it to args and query
      // query: ({ conversationId, requestingUserId }) => `/chats/conversations/${conversationId}/participants?requestingUserId=${requestingUserId}`,
      query: ({ conversationId }) => `/chats/conversations/${conversationId}/participants`, // Current version from controller
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'Participant', id: `LIST-${conversationId}` },
      ],
    }),

    // MUTATIONS
    createConversation: builder.mutation<Conversation, CreateConversationPayload>({
      // Payload now includes creatorUserId
      query: (body) => ({
        url: '/conversations',
        method: 'POST',
        body, // Body contains { creatorUserId, participantUserIds, ... }
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Conversation', id: 'LIST' },
        { type: 'UserConversations', id: arg.creatorUserId } // Invalidate specific user's list
      ],
    }),

    findOrCreateOneOnOneConversation: builder.mutation<Conversation, FindOrCreateOneOnOnePayload>({
      // Payload now includes requestingUserId
      query: (body) => ({
        url: '/conversations/direct', // Assuming your controller uses '/conversations/one-on-one' or similar
        method: 'POST',
        body, // Body contains { requestingUserId, otherUserId }
      }),
      invalidatesTags: (result, _error, arg) =>
        result
          ? [
              { type: 'Conversation', id: 'LIST' },
              { type: 'Conversation', id: result.conversation_id },
              { type: 'UserConversations', id: arg.requestingUserId }
            ]
          : [{ type: 'Conversation', id: 'LIST' }, { type: 'UserConversations', id: arg.requestingUserId }],
    }),

    sendMessage: builder.mutation<ChatMessage, SendMessagePayload>({
      // Payload now includes senderUserId
      query: ({ conversationId, ...body }) => ({ // body now includes senderUserId
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      async onQueryStarted({ conversationId, senderUserId, content, messageType }, { dispatch, queryFulfilled, getState }) {
        // Optimistic update logic needs to use the passed senderUserId
        const tempId = `temp_${Date.now()}`;
        const state = getState() as RootState;

        // For sender info, try to get from current user state if senderUserId matches current user
        // Otherwise, optimistic update might not have full sender details if not the current user
        // (though typically, sendMessage is for the current user)
        let senderDetails: UserSummary | undefined = undefined;
        if (state.user?.user?.user_id === senderUserId) {
          senderDetails = {
            user_id: state.user.user.user_id,
            full_name: state.user.user.full_name,
            profile_picture: state.user.user.profile_picture,
            // email and role might not be needed for display in message item's sender
          };
        }

        const defaultMessagesQueryArgs = { conversationId, requestingUserId: senderUserId, limit: 30, offset: 0 }; // Pass requestingUserId

        const patchResult = dispatch(
          chatsAPI.util.updateQueryData('getMessagesForConversation', defaultMessagesQueryArgs, (draft) => {
            if (!Array.isArray(draft)) {
                // If draft is not an array, initialize it for optimistic update.
                draft = [];
            }
            draft.push({
              message_id: tempId,
              conversation_id: conversationId,
              sender_id: senderUserId, // Use passed senderUserId
              content,
              message_type: messageType || 'text',
              sent_at: new Date().toISOString(),
              sender: senderDetails,
            });
            return draft; // Ensure the modified draft is returned
          })
        );

        try {
          const { data: sentMessage } = await queryFulfilled;
          dispatch(
            chatsAPI.util.updateQueryData('getMessagesForConversation', defaultMessagesQueryArgs, (draft) => {
              if (!Array.isArray(draft)) {
                  // This case should be less likely if the above patchResult initializes draft
                  draft = [sentMessage];
                  return draft;
              }
              const msgIndex = draft.findIndex(m => m.message_id === tempId);
              if (msgIndex !== -1) {
                draft[msgIndex] = sentMessage;
              } else {
                if (!draft.find(m => m.message_id === sentMessage.message_id)) {
                    draft.push(sentMessage);
                }
              }
              return draft; // Ensure the modified draft is returned
            })
          );
          // Invalidate conversation list for the sender to update last message etc.
          dispatch(chatsAPI.util.invalidateTags([
            { type: 'UserConversations', id: senderUserId },
            { type: 'Conversation', id: 'LIST' }, // General list
            { type: 'Conversation', id: conversationId }, // Specific conversation
            { type: 'UnreadCount', id: 'TOTAL'}
          ]));
        } catch (err) {
          console.error("Optimistic update for sendMessage failed:", err);
          patchResult.undo();
        }
      },
    }),

    markConversationAsRead: builder.mutation<void, MarkAsReadPayload>({
      // Payload now includes userId
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/read`,
        method: 'POST',
        body: { userId }, // Backend expects userId in body
      }),
      async onQueryStarted({ conversationId, userId }, { dispatch, queryFulfilled }) {
        // Optimistic update for the specific user's conversation list
        const patchResult = dispatch(
          chatsAPI.util.updateQueryData('getUserConversations', userId, (draft) => {
            const convo = draft?.find(c => c.conversation_id === conversationId);
            if (convo) {
              convo.unread_count = 0;
              convo.user_last_read_at = new Date().toISOString(); // Optimistically update read time
            }
          })
        );
        try {
          await queryFulfilled;
          dispatch(chatsAPI.util.invalidateTags([
            { type: 'Conversation', id: conversationId }, // Specific conversation details
            { type: 'UserConversations', id: userId },    // Specific user's list
            { type: 'Conversation', id: 'LIST' },        // General list if still used
            { type: 'UnreadCount', id: 'TOTAL' }         // Global unread count
          ]));
        } catch {
          patchResult.undo();
        }
      }
    }),

    addUserToGroupChat: builder.mutation<{ message: string }, AddUserToGroupPayload>({
      // Payload now includes performingUserId
      query: ({ conversationId, performingUserId, userIdToAdd }) => ({
        url: `/conversations/${conversationId}/participants`,
        method: 'POST',
        body: { performingUserId, userIdToAdd }, // Backend expects these in body
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Participant', id: `LIST-${conversationId}` },
        { type: 'Conversation', id: conversationId },
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