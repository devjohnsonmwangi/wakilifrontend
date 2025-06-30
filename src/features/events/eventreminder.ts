import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";

// Define Event Reminder Types
export interface EventReminderDataTypes {
  reminder_id: number;
  event_id: number;
  reminder_time: string;
  reminder_message?: string;
  created_at: string;
  updated_at: string;
}

// API Slice for Event Reminders
export const eventReminderAPI = createApi({
  reducerPath: "eventReminderAPI",
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
    }
  }),
  refetchOnReconnect: true,
  tagTypes: ["EventReminder"],
  endpoints: (builder) => ({
    fetchReminders: builder.query<EventReminderDataTypes[], void>({
      query: () => "eventReminders",
      providesTags: ["EventReminder"],
    }),
    getReminderById: builder.query<EventReminderDataTypes, number>({
      query: (reminder_id) => `eventReminders/${reminder_id}`,
      providesTags: ["EventReminder"],
    }),
    createReminder: builder.mutation<
      EventReminderDataTypes,
      Partial<EventReminderDataTypes>
    >({
      query: (newReminder) => ({
        url: "eventReminders",
        method: "POST",
        body: newReminder,
      }),
      invalidatesTags: ["EventReminder"],
    }),
    updateReminder: builder.mutation<
      EventReminderDataTypes,
      Partial<EventReminderDataTypes & { reminder_id: number }>
    >({
      query: ({ reminder_id, ...rest }) => ({
        url: `eventReminders/${reminder_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["EventReminder"],
    }),
    deleteReminder: builder.mutation<
      { success: boolean; reminder_id: number },
      number
    >({
      query: (reminder_id) => ({
        url: `eventReminders/${reminder_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EventReminder"],
    }),
  }),
});

export const {
  useFetchRemindersQuery,
  useGetReminderByIdQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
} = eventReminderAPI;
