// src/features/appointments/appointmentsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";

// --- Data Type Definitions (Matching the Backend) ---

// A summary of a user, used for clients and assignees
export interface UserSummary {
  user_id: number;
  full_name: string;
  email: string;
}

// The related branch location data
export interface BranchLocation {
  branch_id: number;
  name: string;
  address: string;
  contact_phone: string;
  // Add other fields from your locationBranchTable schema if they exist
}

// A single assignee's details
export interface AppointmentAssignee {
  assignee_user_id: number;
  assigned_at: string; // Dates are serialized as strings in JSON
  appointment_id: number;
  assignee?: UserSummary;
}

// The main appointment status enum
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// The full Appointment object, matching the backend's `AppointmentWithDetails`
export interface Appointment {
  appointment_id: number;
  client_user_id: number;
  location_branch_id: number;
  appointment_datetime: string; // Dates are serialized as strings in JSON
  reason: string;
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // For soft deletes

  // Relational data
  client?: UserSummary;
  branch?: BranchLocation;
  assignees?: AppointmentAssignee[];
}

// --- ACTION: Update the arguments interface to include assigneeId ---
export interface ListAppointmentsArgs {
  status?: AppointmentStatus;
  branchId?: number;
  clientId?: number;
  assigneeId?: number; // <-- ADD THIS PROPERTY
  dateTimeFrom?: string;
  dateTimeTo?: string;
}

// --- API Slice Definition ---

export const appointmentAPI = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Appointment"], 
  endpoints: (builder) => ({
    
    // --- ACTION: Update the query function to handle the new assigneeId property ---
    listAppointments: builder.query<Appointment[], ListAppointmentsArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();

        if (args?.status) {
          params.append('status', args.status);
        }
        if (args?.branchId) {
          params.append('branchId', args.branchId.toString());
        }
        if (args?.clientId) {
          params.append('clientId', args.clientId.toString());
        }
        // This is the new logic that enables filtering by assignee
        if (args?.assigneeId) {
          params.append('assigneeId', args.assigneeId.toString());
        }
        if (args?.dateTimeFrom) {
          params.append('dateTimeFrom', args.dateTimeFrom);
        }
        if (args?.dateTimeTo) {
          params.append('dateTimeTo', args.dateTimeTo);
        }
        
        const queryString = params.toString();
        return `appointments${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ appointment_id }) => ({ type: 'Appointment' as const, id: appointment_id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),

    // Corresponds to `appointmentService.getAppointmentById`
    getAppointmentById: builder.query<Appointment, number>({
      query: (id) => `appointments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Appointment", id }],
    }),

    // Corresponds to `appointmentService.createAppointment`
    createAppointment: builder.mutation<
      Appointment,
      {
        appointmentData: Omit<Appointment, 'appointment_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'client' | 'branch' | 'assignees'>;
        assigneeIds: number[];
      }
    >({
      query: (newAppointment) => ({
        url: "appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: [{ type: "Appointment", id: "LIST" }],
    }),

    // Corresponds to `appointmentService.updateAppointment`
    updateAppointment: builder.mutation<
      Appointment,
      {
        appointment_id: number;
        updates: Partial<Omit<Appointment, 'appointment_id' | 'created_at' | 'client_user_id' | 'deleted_at'>>;
        newAssigneeIds?: number[];
      }
    >({
      query: ({ appointment_id, ...body }) => ({
        url: `appointments/${appointment_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { appointment_id }) => [
        { type: "Appointment", id: appointment_id },
        { type: "Appointment", id: "LIST" },
      ],
    }),

    // Corresponds to `appointmentService.softDeleteAppointment`
    deleteAppointment: builder.mutation<
      { success: boolean; id: number },
      number
    >({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { success: boolean }, _meta, arg: number) => ({
          ...response,
          id: arg,
      }),
      invalidatesTags: (_result, _error, id) => [
          { type: "Appointment", id },
          { type: "Appointment", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useListAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentAPI;