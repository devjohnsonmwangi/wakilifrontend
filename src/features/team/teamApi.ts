// 📁 services/teamApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIDomain } from '../../utils/APIDomain'; 

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }), 
  endpoints: (builder) => ({
    getTeamByRoles: builder.query({
      query: () => 'users/roles', 
    }),
  }),
});

export const { useGetTeamByRolesQuery } = teamApi;
