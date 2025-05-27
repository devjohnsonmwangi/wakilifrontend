// src/features/users/usersAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
// Import RootState if you decide to switch to getting token from Redux state
// import type { RootState } from '../../app/store'; // Adjust path as needed

// ... (your existing interface definitions - UserApiResponse, UserDataTypes, etc. remain the same)
export interface UserApiResponse {
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: "admin" | "user" | "lawyer" | "client" | "clerks" | "manager" | "supports";
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface UserDataTypes extends UserApiResponse {
  password?: string;
}

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
    prepareHeaders: (headers, {  endpoint }) => { // getState and endpoint are available
      console.log(`[RTK Query] Preparing headers for endpoint: ${endpoint}`);

      // Option 1: Get token from localStorage (your current method)
      const tokenFromLocalStorage = localStorage.getItem('authToken');
      console.log('[RTK Query] Token from localStorage:', tokenFromLocalStorage);

      // Option 2: Example if token were in Redux state (e.g., in an 'auth' slice)
      // const tokenFromReduxState = (getState() as RootState).auth.token;
      // console.log('[RTK Query] Token from Redux state:', tokenFromReduxState);

      // Choose your token source. For now, sticking with localStorage as per your code.
      const token = tokenFromLocalStorage; // Or tokenFromReduxState if you switch

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        ('[RTK Query] Authorization header set.');
      } else {
        ('[RTK Query] No token found. Authorization header NOT set.');
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
    // === User CRUD & Fetch Endpoints ===

    registerUser: builder.mutation<UserApiResponse, Omit<UserDataTypes, 'user_id' | 'created_at' | 'updated_at' | 'role'>>({
      query: (newUser) => ({
        url: "auth/register",
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
      query: () => "users/roles",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'ROLES_LIST' },
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'ROLES_LIST' }, { type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserApiResponse, { user_id: number } & UserUpdatePayload>({
        query: ({ user_id, ...payloadToSend }) => {
            console.log('[RTK Query] updateUser query:', { url: `users/${user_id}`, method: "PUT", body: payloadToSend });
            return {
                url: `users/${user_id}`,
                method: "PUT",
                body: payloadToSend,
            };
        },
        async onQueryStarted({ user_id, ...patch }, { dispatch, queryFulfilled }) {
            const optimisticListUpdate = dispatch(
                usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                    const userIndex = draftUsers.findIndex(user => user.user_id === user_id);
                    if (userIndex !== -1) { Object.assign(draftUsers[userIndex], patch); }
                })
            );
            const optimisticSingleUserUpdate = dispatch(
                usersAPI.util.updateQueryData('getUserById', user_id, (draftUser) => {
                    if (draftUser) { Object.assign(draftUser, patch); }
                })
            );
            try {
                const { data: updatedUserFromServer } = await queryFulfilled;
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
                console.error('[RTK Query] Error in updateUser onQueryStarted:', error);
                optimisticListUpdate.undo();
                optimisticSingleUserUpdate.undo();
            }
        },
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(userIdToDelete, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
              usersAPI.util.updateQueryData('fetchUsers', undefined, (draftUsers) => {
                  return draftUsers.filter(user => user.user_id !== userIdToDelete);
              })
          );
          try {
              await queryFulfilled;
              dispatch(usersAPI.util.invalidateTags([{ type: 'User', id: userIdToDelete }]));
          } catch (error) {
              console.error('[RTK Query] Error in deleteUser onQueryStarted:', error);
              patchResult.undo();
          }
      },
    }),

    // === Password Management Endpoints ===
    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({ url: `users/request-password-reset`, method: "POST", body: payload }),
    }),
    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ url: `users/reset-password`, method: "POST", body: payload }),
    }),
    requestPasswordChange: builder.mutation<PasswordActionResponse, void>({
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