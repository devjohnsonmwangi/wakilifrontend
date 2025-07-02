// 📁 services/teamApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIDomain } from '../../utils/APIDomain';
import { RootState } from '../../app/store'; // <-- 1. IMPORT THE ROOTSTATE TYPE

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: APIDomain,
    // v-- 2. ADD THE prepareHeaders FUNCTION HERE --v
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the Redux store using the RootState type
      const token = (getState() as RootState).user.token;

      // If a token exists, add it to the Authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Return the modified headers
      return headers;
    },
    // ^-------------------------------------------^
  }), 
  endpoints: (builder) => ({
    // This endpoint will now automatically include the Authorization header if the user is logged in
    getTeamByRoles: builder.query({
      query: () => 'users/roles', 
    }),
    // You can add other endpoints here, and they will also benefit from prepareHeaders
  }),
});

export const { useGetTeamByRolesQuery } = teamApi;