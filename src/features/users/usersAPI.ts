// src/features/users/usersAPI.ts (or your file path)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this points to your backend base URL

// Type for user data returned by API (Password typically excluded in responses)
// ✅ Already exported - good!
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
// ✅ Already exported - good!
export interface UserDataTypes extends UserApiResponse {
    // This type might be used less often now if API consistently omits password
    password?: string; // Password might be present in some specific internal scenarios or older types
}


// Type for the payload when requesting password reset
// 👇 *** ADD export HERE ***
export interface PasswordResetRequestPayload {
  email: string;
}

// Type for the payload when resetting/changing password with a token
// 👇 *** ADD export HERE ***
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// Type for the generic success response from password endpoints
// 👇 *** ADD export HERE ***
export interface PasswordActionResponse {
  msg: string;
}


export const usersAPI = createApi({
  reducerPath: "usersAPI", // Changed from userAPI to usersAPI for consistency
  // Ensure your baseQuery is configured to add the Authorization header if needed
  // See RTK Query docs for prepareHeaders: https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
  baseQuery: fetchBaseQuery({
      baseUrl: APIDomain, // Assuming your user routes are under /api
      prepareHeaders: (headers) => { // Added { getState } for potential token access from Redux state
        // Example 1: Get token from localStorage
        const token = localStorage.getItem('authToken');

        // Example 2: Get token from Redux state (adjust 'auth.token' to your actual path)
        // const token = (getState() as RootState).auth.token;

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
    // 1️⃣ Register a new user
    registerUser: builder.mutation<UserApiResponse, Omit<UserDataTypes, 'user_id' | 'created_at' | 'updated_at' | 'role'>>({ // Using UserApiResponse as return type
      query: (newUser) => ({
        url: "auth/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // 2️⃣ Get user by ID
    getUserById: builder.query<UserApiResponse, number>({ // Using UserApiResponse
      query: (user_id) => `users/${user_id}`,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    // 3️⃣ Fetch all users
    fetchUsers: builder.query<UserApiResponse[], void>({ // Using UserApiResponse array
      query: () => "users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // 4️⃣ Fetch users by role (excluding "client" and "user")
    fetchUsersByRole: builder.query<UserApiResponse[], void>({ // Using UserApiResponse array
      query: () => "users/roles",
       providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
              { type: 'Users', id: 'LIST' }, // Potentially add a specific tag for this list?
            ]
          : [{ type: 'Users', id: 'LIST' }], // Tagging strategy might need refinement
    }),

    // 5️⃣ Fetch users by role and user_id (Consider if this endpoint is truly needed or if filtering client-side is better)
    // fetchUsersByRoleAndId: builder.query<UserApiResponse[], { role: string; user_id: number }>({
    //   query: ({ role, user_id }) => `users/roles/${role}/${user_id}`,
    //   providesTags: ["Users"], // Adjust tagging if kept
    // }),

    // 6️⃣ Update a user
    updateUser: builder.mutation<UserApiResponse, Partial<Omit<UserDataTypes, 'created_at' | 'updated_at'>> & { user_id: number }>({ // Using UserApiResponse
      query: ({ user_id, ...rest }) => ({
        url: `users/${user_id}`,
        method: "PUT",
        body: rest,
      }),
      // Invalidate specific user and the general list
      invalidatesTags: (_, __, { user_id }) => [{ type: "User", id: user_id }, { type: 'Users', id: 'LIST' }],
    }),

    // 7️⃣ Delete a user
    deleteUser: builder.mutation<{ success: boolean; user_id: number }, number>({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      // Invalidate specific user and the general list
       invalidatesTags: (_, __, id) => [{ type: "User", id }, { type: 'Users', id: 'LIST' }],
    }),

    // === NEW Password Reset/Change Endpoints ===

    // Request Password Reset Email (Public)
    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({
        url: `users/request-password-reset`, // Adjusted URL to likely auth path
        method: "POST",
        body: payload,
      }),
      // No tags invalidated as it doesn't change server state directly visible here
    }),

    // Reset Password using Token (Public)
    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: `users/reset-password`, // Adjusted URL to likely auth path
        method: "POST",
        body: payload,
      }),
    }),

    // Request Password Change Email (Authenticated - Endpoint likely not needed if changePassword handles it)
    // requestPasswordChange: builder.mutation<PasswordActionResponse, void>({
    //     query: () => ({
    //       url: `users/request-password-change`,
    //       method: "POST",
    //     }),
    // }),

    // Change Password using Token (Authenticated - User identified by token in header)
    // The backend needs to handle verification of the user via JWT + potentially old password
    changePassword: builder.mutation<PasswordActionResponse, { oldPassword?: string; newPassword: string }>({ // Payload might need old password depending on backend
      query: (payload) => ({
        url: `users/change-password`, // Adjusted URL to likely auth path
        method: "POST",
        body: payload, // Send new (and maybe old) password
      }),
      // Requires authentication - ensure prepareHeaders sends the token
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
  // useRequestPasswordChangeMutation, // Remove if endpoint removed
  useChangePasswordMutation,
} = usersAPI;


// Helper type for RootState if needed in prepareHeaders
// import type { RootState } from '../../app/store'; // Adjust path as needed