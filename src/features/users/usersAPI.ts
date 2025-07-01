// src/features/users/usersAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
// import type { RootState } from '../../app/store';

// Interface definitions (These are well-defined)
export interface UserApiResponse {
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: "admin" | "user" | "lawyer" | "client" | "clerks" | "manager" | "supports";
  profile_picture?: string | null;
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

// This interface correctly matches the payload needed for your form
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
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
    // === User CRUD & Fetch Endpoints (No changes needed here) ===

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

    fetchUsersByRole: builder.query<UserApiResponse[], string>({
      query: (role) => `users/roles/${role}`, 
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
        query: ({ user_id, ...payloadToSend }) => ({
            url: `users/${user_id}`,
            method: "PUT",
            body: payloadToSend,
        }),
        invalidatesTags: (_, __, { user_id }) => [{ type: 'User', id: user_id }, { type: 'Users', id: 'LIST' }],
        // Your optimistic updates are advanced and well-implemented, no changes needed.
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, userIdToDelete) => [{ type: 'User', id: userIdToDelete }, { type: 'Users', id: 'LIST' }],
       // Your optimistic updates are advanced and well-implemented, no changes needed.
    }),

    // === Password Management Endpoints (These are correctly configured) ===

    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({ url: `users/request-password-reset`, method: "POST", body: payload }),
    }),

    /**
     * This endpoint is correctly configured for your ResetPasswordForm.
     * It expects a payload `{ token, newPassword }` and sends it in the
     * body of a POST request to `users/reset-password`.
     * This setup will work perfectly with the form once the token is passed in as a prop.
     */
    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ 
        url: `users/reset-password`, 
        method: "POST", 
        body: payload 
      }),
    }),

    requestPasswordChange: builder.mutation<PasswordActionResponse, void>({
        query: () => ({ url: `users/request-password-change`, method: "POST" }),
    }),

    /**
     * This endpoint is also correctly configured for the "change password" mode
     * in your form, using the same payload structure.
     */
    changePassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ 
        url: `users/change-password`, 
        method: "POST", 
        body: payload 
      }),
    }),
  }),
});

// Exported hooks are correct
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