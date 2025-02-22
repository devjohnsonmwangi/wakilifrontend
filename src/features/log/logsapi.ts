import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";

// Log Data Types
export interface LogDataTypes {
  log_id: number;
  user_id: number;
  action: string | null;
}

// Log API Slice
export const logAPI = createApi({
  reducerPath: "logAPI",
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Logs"],
  endpoints: (builder) => ({
    // Fetch all logs
    fetchLogs: builder.query<LogDataTypes[], void>({
      query: () => "logs",
      providesTags: ["Logs"],
    }),
    // Get a log by ID
    getLogById: builder.query<LogDataTypes, number>({
      query: (log_id) => `log/${log_id}`,
      providesTags: ["Logs"],
    }),
    // Create a new log
    createLog: builder.mutation<LogDataTypes, Partial<LogDataTypes>>({
      query: (newLog) => ({
        url: "log",
        method: "POST",
        body: newLog,
      }),
      invalidatesTags: ["Logs"],
    }),
    // Update an existing log
    updateLog: builder.mutation<LogDataTypes, Partial<LogDataTypes & { log_id: number }>>({
      query: ({ log_id, ...rest }) => ({
        url: `log/${log_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Logs"],
    }),
    // Delete a log by ID
    deleteLog: builder.mutation<{ success: boolean; log_id: number }, number>({
      query: (log_id) => ({
        url: `log/${log_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Logs"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchLogsQuery,
  useGetLogByIdQuery,
  useCreateLogMutation,
  useUpdateLogMutation,
  useDeleteLogMutation,
} = logAPI;
