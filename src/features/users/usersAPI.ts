// src/features/users/usersAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this points to your backend base URL

// Type for user data returned by API (Password typically excluded in responses)
export interface UserApiResponse {
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string; // Make optional if it can be null/undefined from API
  address?: string;    // Make optional if it can be null/undefined from API
  role: "admin" | "user" | "lawyer" | "client" | "clerks" | "manager" | "supports";
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

// Type for full user data including password (used for registration or internal logic if needed)
export interface UserDataTypes extends UserApiResponse {
  password?: string; // Only for specific operations like registration
}

// Type for the payload when updating a user.
// Excludes fields that shouldn't be updated via this general endpoint.
export interface UserUpdatePayload extends Partial<Omit<UserApiResponse, 'user_id' | 'created_at' | 'updated_at'>> {
  // Fields that can be updated:
  // full_name?: string;
  // email?: string;
  // phone_number?: string;
  // address?: string;
  // role?: "admin" | "user" | "lawyer" | "client" | "clerk" | "manager" | "support";
  // profile_picture?: string;
}

// Type for the payload when requesting password reset
export interface PasswordResetRequestPayload {
  email: string;
}

// Type for the payload when resetting/changing password with a token
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// Type for the generic success response from password endpoints
export interface PasswordActionResponse {
  msg: string;
}

// Type for the delete user success response
export interface DeleteUserResponse {
    msg: string;
}


export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain, // Example: "http://localhost:8000" or "http://localhost:8000/api"
                        // Ensure this matches how your Hono backend is structured.
    prepareHeaders: (headers /*, { getState } */) => { // getState can be used if token is in Redux store
      const token = localStorage.getItem('authToken'); // Example: Get token from localStorage
      // const token = (getState() as RootState).auth.token; // Example: Get token from Redux state
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Users", "User"], // 'Users' for lists, 'User' for individual items
  endpoints: (builder) => ({
    // === User CRUD & Fetch Endpoints ===

    registerUser: builder.mutation<UserApiResponse, Omit<UserDataTypes, 'user_id' | 'created_at' | 'updated_at' | 'role'>>({
      query: (newUser) => ({
        url: "auth/register", // Assuming registration endpoint
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    getUserById: builder.query<UserApiResponse, number>({
      query: (user_id) => `users/${user_id}`,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    fetchUsers: builder.query<UserApiResponse[], void>({
      query: () => "users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    fetchUsersByRole: builder.query<UserApiResponse[], void>({
      query: () => "users/roles", // Endpoint for fetching users by specific roles
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'ROLES_LIST' }, // Specific tag for this list
              { type: 'Users', id: 'LIST' },       // Also potentially invalidates general list
            ]
          : [{ type: 'Users', id: 'ROLES_LIST' }, { type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserApiResponse, { user_id: number } & UserUpdatePayload>({
        query: ({ user_id, ...payloadToSend }) => {
            // Debugging log to see what's being sent
            console.log('RTK Query: Sending to updateUser API:', { url: `users/${user_id}`, method: "PUT", body: payloadToSend });
            return {
                url: `users/${user_id}`,
                method: "PUT", // Or "PATCH" if your API uses PATCH for partial updates
                body: payloadToSend, // Contains fields like { role: "newRole" } or { full_name: "..." }
            };
        },
        async onQueryStarted({ user_id, ...patch }, { dispatch, queryFulfilled }) {
            // Optimistic update for the list of users
            const optimisticListUpdate = dispatch(
                usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                    const userIndex = draftUsers.findIndex(user => user.user_id === user_id);
                    if (userIndex !== -1) {
                        Object.assign(draftUsers[userIndex], patch); // Apply patch to the user in the list
                    }
                })
            );
            // Optimistic update for the individual user query, if cached
            const optimisticSingleUserUpdate = dispatch(
                usersAPI.util.updateQueryData('getUserById', user_id, (draftUser) => {
                    if (draftUser) {
                        Object.assign(draftUser, patch); // Apply patch to the single user
                    }
                })
            );
            try {
                const { data: updatedUserFromServer } = await queryFulfilled;
                // If successful, update caches with the authoritative response from the server
                dispatch(
                    usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                        const userIndex = draftUsers.findIndex(user => user.user_id === user_id);
                        if (userIndex !== -1) {
                            draftUsers[userIndex] = updatedUserFromServer;
                        }
                        // Optionally, handle case where user might not be in list (e.g., after filtering)
                    })
                );
                dispatch(
                    usersAPI.util.updateQueryData('getUserById', user_id, () => updatedUserFromServer)
                );
            } catch {
                optimisticListUpdate.undo(); // Rollback list update on error
                optimisticSingleUserUpdate.undo(); // Rollback single user update on error
            }
        },
        // Fallback invalidation if not using onQueryStarted
        // invalidatesTags: (_, __, { user_id }) => [{ type: "User", id: user_id }, { type: 'Users', id: 'LIST' }],
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(userIdToDelete, { dispatch, queryFulfilled }) {
          // Optimistic update: remove user from the list
          const patchResult = dispatch(
              usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                  return draftUsers.filter(user => user.user_id !== userIdToDelete);
              })
          );
          try {
              await queryFulfilled;
              // If successful, also invalidate the specific user tag if it was fetched individually
              dispatch(usersAPI.util.invalidateTags([{ type: 'User', id: userIdToDelete }]));
          } catch {
              patchResult.undo(); // Rollback on error
          }
      },
      // Fallback invalidation
      // invalidatesTags: (_, __, id) => [{ type: "User", id }, { type: 'Users', id: 'LIST' }],
    }),

    // === Password Management Endpoints ===

    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({
        url: `users/request-password-reset`,
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: `users/reset-password`,
        method: "POST",
        body: payload,
      }),
    }),

    requestPasswordChange: builder.mutation<PasswordActionResponse, void>({
        query: () => ({
          url: `users/request-password-change`,
          method: "POST",
          // Backend c.get('userId') gets user ID from auth token (from prepareHeaders)
        }),
    }),

    changePassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: `users/change-password`,
        method: "POST",
        body: payload, // Sends { token, newPassword }
      }),
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useFetchUsersQuery,
  useFetchUsersByRoleQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRequestPasswordChangeMutation,
  useChangePasswordMutation,
} = usersAPI;