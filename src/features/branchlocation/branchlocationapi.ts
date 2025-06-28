import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
// ACTION REQUIRED: Make sure this path points to your Redux store configuration
import type { RootState } from "../../app/store";

// Define Branch Location Types
export interface BranchLocationDataTypes {
  branch_id: number; // Unique identifier for the branch
  name: string; // Name of the branch
  address: string; // Address of the branch
  contact_phone: string; // Contact phone number
}

// API Slice for Branch Locations
export const locationBranchAPI = createApi({
  reducerPath: "locationBranchAPI",
  // ✨ MODIFICATION: Updated baseQuery to automatically add the auth token
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers, { getState }) => {
        // Get the token from the user slice in the Redux store
        const token = (getState() as RootState).user.token;

        // If the token exists, add it to the authorization header
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["BranchLocation"],
  endpoints: (builder) => ({
    // Fetch all branch locations
    fetchBranchLocations: builder.query<BranchLocationDataTypes[], void>({
      query: () => "branchLocations",
      providesTags: ["BranchLocation"],
    }),
    // Fetch branch location by ID
    getBranchLocationById: builder.query<BranchLocationDataTypes, number>({
      query: (branch_id) => `branchLocations/${branch_id}`,
      providesTags: (_result, _error, branch_id) => [{ type: "BranchLocation", id: branch_id }],
    }),
    // Create a new branch location
    createBranchLocation: builder.mutation<BranchLocationDataTypes, Partial<BranchLocationDataTypes>>({
      query: (newBranch) => ({
        url: "branchLocations",
        method: "POST",
        body: newBranch,
      }),
      invalidatesTags: ["BranchLocation"],
    }),
    // Update an existing branch location
    updateBranchLocation: builder.mutation<BranchLocationDataTypes, Partial<BranchLocationDataTypes & { branch_id: number }>>({
      query: ({ branch_id, ...rest }) => ({
        url: `branchLocations/${branch_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_result, _error, { branch_id }) => [{ type: "BranchLocation", id: branch_id }, "BranchLocation"],
    }),
    // Delete a branch location
     deleteBranchLocation: builder.mutation<{ success?: boolean; branch_id?: number }, number>({
      query: (branch_id) => ({
        url: `branchLocations/${branch_id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => {
                // Check the original status code.
                if (response.status === 403) {
                    // If its a Forbidden response, construct the message:
                    return { message: "You do not have permission to delete this branch." };
                }
                // Otherwise return the existing error:
                return response;
            },
      invalidatesTags: ["BranchLocation"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchBranchLocationsQuery,
  useGetBranchLocationByIdQuery,
  useCreateBranchLocationMutation,
  useUpdateBranchLocationMutation,
  useDeleteBranchLocationMutation,
} = locationBranchAPI;