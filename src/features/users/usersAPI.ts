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
    // 1️⃣ Register a new user
    registerUser: builder.mutation<UserDataTypes, Omit<UserDataTypes, 'user_id' | 'created_at' | 'updated_at' | 'role'>>({
      query: (newUser) => ({
        url: "auth/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // 2️⃣ Get user by ID
    getUserById: builder.query<UserDataTypes, number>({
      query: (user_id) => `users/${user_id}`,
      providesTags: (_, __, id) => [{ type: "User", id }], // ✅ Replaced result, error with _ and __
    }),

    // 3️⃣ Fetch all users
    fetchUsers: builder.query<UserDataTypes[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    // 4️⃣ Fetch users by role (excluding "client" and "user")
    fetchUsersByRole: builder.query<UserDataTypes[], void>({
      query: () => "users/roles",
      providesTags: ["Users"],
    }),

    // 5️⃣ Fetch users by role and user_id
    fetchUsersByRoleAndId: builder.query<UserDataTypes[], { role: string; user_id: number }>({
      query: ({ role, user_id }) => `users/roles/${role}/${user_id}`,
      providesTags: ["Users"],
    }),

    // 6️⃣ Update a user
    updateUser: builder.mutation<UserDataTypes, Partial<Omit<UserDataTypes, 'created_at' | 'updated_at'>> & { user_id: number }>({
      query: ({ user_id, ...rest }) => ({
        url: `users/${user_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_, __, { user_id }) => [{ type: "User", id: user_id }], // ✅ Replaced result, error with _ and __
    }),

    // 7️⃣ Delete a user
    deleteUser: builder.mutation<{ success: boolean; user_id: number }, number>({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "User", id }], // ✅ Replaced result, error with _ and __
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







