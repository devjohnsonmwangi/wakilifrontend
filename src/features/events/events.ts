// src/features/events/events.ts (or your RTK Query file)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Adjust path if needed

// Define Event Types
export type EventType = "meeting" | "hearing" | "consultation" | "reminder" | "court_date";

export interface EventDataTypes {
  event_id: number;
  user_id: number;
  case_id: number;
  event_type: EventType;
  event_title: string;
  event_description?: string;
  start_time: string;    // Expected as ISO 8601 string from backend
  // event_date?: string | null; // REMOVED
  created_at: string;
  updated_at: string;
}

export interface EventReminderDataTypes { // Assuming this remains the same
  reminder_id: number;
  event_id: number;
  reminder_time: string;
  reminder_message?: string;
  created_at: string;
  updated_at: string;
}

// Define the types for the mutation payloads more precisely
interface CreateEventPayload {
    event_title: string;
    event_type: EventType;
    start_time: string; // ISO String
    event_description?: string;
    case_id: number;
    user_id: number;
    // event_date is removed
}

interface UpdateEventPayload extends Partial<CreateEventPayload> {
    // No event_date here either
}


export const eventAndReminderAPI = createApi({
  reducerPath: "eventAndReminderAPI",
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Event", "EventReminder"],
  endpoints: (builder) => ({
    fetchEvents: builder.query<EventDataTypes[], void>({
      query: () => "events",
      providesTags: ["Event"],
    }),
    getEventById: builder.query<EventDataTypes, number>({
      query: (event_id) => `events/${event_id}`,
      providesTags: ["Event"],
    }),
    createEvent: builder.mutation<EventDataTypes, CreateEventPayload>({
      query: (newEvent) => ({
        url: "events",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Event"],
    }),
    updateEvent: builder.mutation<EventDataTypes, { event_id: number } & UpdateEventPayload>({
      query: ({ event_id, ...rest }) => ({
        url: `events/${event_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation<{ success: boolean; event_id: number }, number>({
      query: (event_id) => ({
        url: `events/${event_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),

    // Event Reminder Endpoints
    fetchReminders: builder.query<EventReminderDataTypes[], void>({
      query: () => "eventReminders",
      providesTags: ["EventReminder"],
    }),
    getReminderById: builder.query<EventReminderDataTypes, number>({
      query: (reminder_id) => `eventReminders/${reminder_id}`,
      providesTags: ["EventReminder"],
    }),
    createReminder: builder.mutation<EventReminderDataTypes, Partial<EventReminderDataTypes>>({
      query: (newReminder) => ({
        url: "eventReminders",
        method: "POST",
        body: newReminder,
      }),
      invalidatesTags: ["EventReminder"],
    }),
    updateReminder: builder.mutation<EventReminderDataTypes, Partial<EventReminderDataTypes & { reminder_id: number }>>({
      query: ({ reminder_id, ...rest }) => ({
        url: `eventReminders/${reminder_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["EventReminder"],
    }),
    deleteReminder: builder.mutation<{ success: boolean; reminder_id: number }, number>({
      query: (reminder_id) => ({
        url: `eventReminders/${reminder_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EventReminder"],
    }),
  }),
});

export const {
  useFetchEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useFetchRemindersQuery,
  useGetReminderByIdQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
} = eventAndReminderAPI;