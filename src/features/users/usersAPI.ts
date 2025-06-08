// src/features/users/usersAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
// Import RootState if you decide to switch to getting token from Redux state
// import type { RootState } from '../../app/store'; // Adjust path as needed

// Interface definitions
export interface UserApiResponse {
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: "admin" | "user" | "lawyer" | "client" | "clerks" | "manager" | "supports";
  profile_picture?: string | null; // Explicitly allow null if backend accepts it for clearing
  created_at: string;
  updated_at: string;
}

export interface UserDataTypes extends UserApiResponse {
  password?: string;
}

// This payload should allow sending profile_picture: null to clear it if needed.
// Partial<Omit<...>> already makes profile_picture optional.
// If UserApiResponse allows profile_picture?: string | null, then this is fine.
export interface UserUpdatePayload extends Partial<Omit<UserApiResponse, 'user_id' | 'created_at' | 'updated_at'>> {}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface PasswordActionResponse {
  msg: string;
}

export interface DeleteUserResponse {
    msg: string;
}


export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers) => { // getState and endpoint are available
      // Option 1: Get token from localStorage (current method)
      const tokenFromLocalStorage = localStorage.getItem('authToken');

      // Option 2: Example if token were in Redux state (e.g., in an 'auth' slice)
      // const tokenFromReduxState = (getState() as RootState).auth.token;

      // Choose your token source. Sticking with localStorage as per your code.
      const token = tokenFromLocalStorage;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Users", "User"], // "Users" for lists, "User" for individual entities
  endpoints: (builder) => ({
    // === User CRUD & Fetch Endpoints ===

    registerUser: builder.mutation<UserApiResponse, Omit<UserDataTypes, 'user_id' | 'created_at' | 'updated_at' | 'role'>>({
      query: (newUser) => ({
        url: "auth/register", // Corrected path for registration
        method: "POST",
        body: newUser,
      }),
      // Invalidates the list of all users after registration
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
              { type: 'Users', id: 'LIST' }, // General list tag
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    fetchUsersByRole: builder.query<UserApiResponse[], string>({ //  role is a string parameter
      query: (role) => `users/roles/${role}`, 
      // query: () => "users/roles", 
      providesTags: (result, ) => // Use _error, _arg if arg is used for tagging
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'ROLES_LIST' }, // A specific tag for role-based lists
              { type: 'Users', id: 'LIST' }, // Also invalidates general list
            ]
          : [{ type: 'Users', id: 'ROLES_LIST' }, { type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserApiResponse, { user_id: number } & UserUpdatePayload>({
        query: ({ user_id, ...payloadToSend }) => ({
            url: `users/${user_id}`,
            method: "PUT",
            body: payloadToSend, // payloadToSend can include profile_picture: string | null
        }),
        async onQueryStarted({ user_id, ...patch }, { dispatch, queryFulfilled }) {
            // Optimistic update for the list of all users
            const optimisticListUpdate = dispatch(
                usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                    const userIndex = draftUsers.findIndex(user => user.user_id === user_id);
                    if (userIndex !== -1) { Object.assign(draftUsers[userIndex], patch); }
                })
            );
            // Optimistic update for the individual user query
            const optimisticSingleUserUpdate = dispatch(
                usersAPI.util.updateQueryData('getUserById', user_id, (draftUser) => {
                    if (draftUser) { Object.assign(draftUser, patch); }
                })
            );
            try {
                const { data: updatedUserFromServer } = await queryFulfilled;
                // On success, update caches with server response
                dispatch(
                    usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                        const userIndex = draftUsers.findIndex(user => user.user_id === user_id);
                        if (userIndex !== -1) { draftUsers[userIndex] = updatedUserFromServer; }
                    })
                );
                dispatch(
                    usersAPI.util.updateQueryData('getUserById', user_id, () => updatedUserFromServer)
                );
            } catch (error) {
                // On error, revert optimistic updates
                console.error('[RTK Query] Error in updateUser onQueryStarted:', error);
                optimisticListUpdate.undo();
                optimisticSingleUserUpdate.undo();
            }
        },
       
        // invalidatesTags: (_, __, { user_id }) => [{ type: 'User', id: user_id }, { type: 'Users', id: 'LIST' }],
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(userIdToDelete, { dispatch, queryFulfilled }) {
          // Optimistic update for the list of all users
          const patchResult = dispatch(
              usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                  return draftUsers.filter(user => user.user_id !== userIdToDelete);
              })
          );
          try {
              await queryFulfilled;
              // On success, also invalidate the specific user tag if other components might be using it
              dispatch(usersAPI.util.invalidateTags([{ type: 'User', id: userIdToDelete }]));
          } catch (error) {
              // On error, revert optimistic update
              console.error('[RTK Query] Error in deleteUser onQueryStarted:', error);
              patchResult.undo();
          }
      },
      // Alternative/additional invalidation:
      // invalidatesTags: (_, __, userIdToDelete) => [{ type: 'User', id: userIdToDelete }, { type: 'Users', id: 'LIST' }],
    }),

    // === Password Management Endpoints ===
    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({ url: `users/request-password-reset`, method: "POST", body: payload }),
    }),
    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ url: `users/reset-password`, method: "POST", body: payload }),
    }),
    requestPasswordChange: builder.mutation<PasswordActionResponse, void>({ // Assuming this takes no payload
        query: () => ({ url: `users/request-password-change`, method: "POST" }),
    }),
    changePassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ url: `users/change-password`, method: "POST", body: payload }),
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