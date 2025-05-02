// src/store/apis/usersAPI.ts (or your file path)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this points to your backend base URL

// Type for user data returned by API (Password typically excluded in responses)
export interface UserApiResponse {
  user_id: number;
  full_name: string ;
  email: string;
  phone_number: string ;
  address: string ;
  role: "admin" | "user" | "lawyer" | "client" | "clerk" | "manager" | "support" ;
  profile_picture?: string ;
  created_at: string;
  updated_at: string;
}

// Type for full user data including password (used internally, e.g., for type safety in inputs if needed)
export interface UserDataTypes extends UserApiResponse {
    // This type might be used less often now if API consistently omits password
    password?: string; // Password might be present in some specific internal scenarios or older types
}


// Type for the payload when requesting password reset
interface PasswordResetRequestPayload {
  email: string;
}

// Type for the payload when resetting/changing password with a token
interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// Type for the generic success response from password endpoints
interface PasswordActionResponse {
  msg: string;
}


export const usersAPI = createApi({
  reducerPath: "usersAPI", // Changed from userAPI to usersAPI for consistency
  // Ensure your baseQuery is configured to add the Authorization header if needed
  // See RTK Query docs for prepareHeaders: https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
  baseQuery: fetchBaseQuery({
      baseUrl: `${APIDomain}/api`, // Assuming your user routes are under /api
      prepareHeaders: (headers) => {
        // Example: Get token from your auth state
        // const token = (getState() as RootState).auth.token; // Adjust according to your state structure
        const token = localStorage.getItem('authToken'); // Or wherever you store the token

        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Users", "User"], // Keep existing tags
  endpoints: (builder) => ({
    // === Existing User Endpoints (adjusted response type) ===

    // Register user - Input may vary based on your backend (e.g., might not need role)
    // Output likely returns the created user profile without password
    registerUser: builder.mutation<UserApiResponse, Omit<UserDataTypes, 'user_id' | 'created_at' | 'updated_at' | 'role'>>({
      query: (newUser) => ({
        url: "auth/register", // Adjust if register endpoint is different
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // Get user by ID (Backend should omit password)
    getUserById: builder.query<UserApiResponse, number>({
      query: (user_id) => `users/${user_id}`,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    // Fetch all users (Backend should omit password)
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

    // Fetch users by role (Backend should omit password)
    fetchUsersByRole: builder.query<UserApiResponse[], void>({
      query: () => "users/roles",
       providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'ROLE_LIST' }, // Specific tag for this list
            ]
          : [{ type: 'Users', id: 'ROLE_LIST' }],
    }),

    // Fetch users by role and user_id (Endpoint seems specific, ensure backend supports it)
    // If this endpoint doesn't exist anymore, remove it. Backend should omit password.
    // fetchUsersByRoleAndId: builder.query<UserApiResponse[], { role: string; user_id: number }>({
    //   query: ({ role, user_id }) => `users/roles/${role}/${user_id}`,
    //   providesTags: ["Users"], // Adjust tagging if needed
    // }),

    // Update user (Backend handles not updating password, should return user without password)
    updateUser: builder.mutation<UserApiResponse, Partial<Omit<UserDataTypes, 'created_at' | 'updated_at'  >> & { user_id: number }>({
      query: ({ user_id, ...rest }) => ({
        url: `users/${user_id}`,
        method: "PUT",
        body: rest, // Send only allowed fields
      }),
      // Invalidate specific user and the general list
      invalidatesTags: (_, __, { user_id }) => [
          { type: "User", id: user_id },
          { type: 'Users', id: 'LIST' },
          { type: 'Users', id: 'ROLE_LIST' }
        ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ msg: string }, number>({ // Backend returns { msg: string }
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
       invalidatesTags: (_, __, id) => [
           { type: "User", id },
           { type: 'Users', id: 'LIST' },
           { type: 'Users', id: 'ROLE_LIST' }
        ],
    }),

    // === NEW Password Reset/Change Endpoints ===

    // Request Password Reset Email (Public)
    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({
        url: `users/request-password-reset`,
        method: "POST",
        body: payload,
      }),
      // No tags invalidated as it doesn't change server state directly visible here
    }),

    // Reset Password using Token (Public)
    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: `users/reset-password`,
        method: "POST",
        body: payload,
      }),
    }),

    // Request Password Change Email (Authenticated)
    requestPasswordChange: builder.mutation<PasswordActionResponse, void>({
        query: () => ({
          url: `users/request-password-change`,
          method: "POST",
          // Body is empty, user identified by auth token in header
        }),
        // Requires authentication - ensure prepareHeaders sends the token
    }),

    // Change Password using Token (Public)
    changePassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: `users/change-password`,
        method: "POST",
        body: payload,
      }),
    }),

  }),
});

// Export hooks for usage in components
export const {
  // Existing hooks
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useFetchUsersQuery,
  useFetchUsersByRoleQuery,
  // useFetchUsersByRoleAndIdQuery, // Uncomment if using
  useUpdateUserMutation,
  useDeleteUserMutation,
  // New hooks
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRequestPasswordChangeMutation,
  useChangePasswordMutation,
} = usersAPI;