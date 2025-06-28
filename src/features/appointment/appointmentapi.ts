// src/redux/features/appointments/appointmentAPISlice.ts (or your preferred path)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; 
// ACTION REQUIRED: Make sure this path points to your Redux store configuration
import type { RootState } from "../../app/store"; 

// Define User and Branch basic types as returned by the backend
interface BasicUser {
  user_id: number;
  full_name: string | null;
  email?: string | null;
  role?: string | null;
  profile_picture?: string | null;
}

interface Branch {
  branch_id: number;
  name: string;
  address: string;
  contact_phone: string; 
  created_at: string;    // ISO string
  updated_at: string;    // ISO string
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled" | "no_show";

// Define the structure of an Appointment object as returned by the API
export interface AppointmentDataTypes {
  appointment_id: number;
  client_user_id: number;
  branch_id: number;
  party: string;
  reason: string;
  appointment_datetime: string; // Single ISO string from backend
  status: AppointmentStatus;
  notes_by_client?: string | null;
  notes_by_staff?: string | null;
  created_at: string;
  updated_at: string;
  client?: BasicUser;
  branch?: Branch;
  assignees?: Array<{
    assignee_user_id: number;
    assigned_at: string;
    appointment_id: number; 
    assignee?: BasicUser;
  }>;
}

// Define the payload for creating an appointment
export interface CreateAppointmentPayload {
  client_user_id: number;
  branch_id: number;
  party: string;
  reason: string;
  appointmentDateTimeISO: string; // Frontend sends combined ISO string
  status?: AppointmentStatus;
  notes_by_client?: string;
  assigneeIds?: number[];
}

// Define the payload for updating an appointment
export interface UpdateAppointmentPayload {
  appointment_id: number; // Used in URL, not body
  branch_id?: number;
  party?: string;
  reason?: string;
  appointmentDateTimeISO?: string; // Optional for updating date/time
  status?: AppointmentStatus;
  notes_by_client?: string;
  notes_by_staff?: string;
  assigneeIds?: number[];
}

// Arguments for fetching a list of appointments
export interface FetchAppointmentsArgs {
  clientId?: number | string;
  assigneeId?: number | string;
  branchId?: number | string;
  status?: AppointmentStatus;
  dateTimeFrom?: string; // ISO string for start of date range
  dateTimeTo?: string;   // ISO string for end of date range
  limit?: number;
  offset?: number;
}

export const appointmentAPI = createApi({
  reducerPath: "appointmentAPI",
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
  tagTypes: ["Appointments"], // Main tag for invalidation
  endpoints: (builder) => ({
    fetchAppointments: builder.query<AppointmentDataTypes[], FetchAppointmentsArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          if (args.clientId !== undefined) params.append('clientId', String(args.clientId));
          if (args.assigneeId !== undefined) params.append('assigneeId', String(args.assigneeId));
          if (args.branchId !== undefined) params.append('branchId', String(args.branchId));
          if (args.status) params.append('status', args.status);
          if (args.dateTimeFrom) params.append('dateTimeFrom', args.dateTimeFrom);
          if (args.dateTimeTo) params.append('dateTimeTo', args.dateTimeTo);
          if (args.limit !== undefined) params.append('limit', String(args.limit));
          if (args.offset !== undefined) params.append('offset', String(args.offset));
        }
        return `appointments?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ appointment_id }) => ({ type: "Appointments" as const, id: appointment_id })),
              { type: "Appointments", id: 'LIST' },
            ]
          : [{ type: "Appointments", id: 'LIST' }],
    }),

    getAppointmentById: builder.query<AppointmentDataTypes, number>({
      query: (appointment_id) => `appointments/${appointment_id}`,
      providesTags: (_result, _error, appointment_id) =>
        _result ? [{ type: "Appointments", id: appointment_id }] : [],
    }),

    fetchAppointmentsByClient: builder.query<AppointmentDataTypes[], { clientId: number | string; queryParams?: Omit<FetchAppointmentsArgs, 'clientId'> }>({
        query: ({ clientId, queryParams }) => {
            const params = new URLSearchParams();
            if(queryParams){
                if (queryParams.status) params.append('status', queryParams.status);
                if (queryParams.dateTimeFrom) params.append('dateTimeFrom', queryParams.dateTimeFrom);
                if (queryParams.dateTimeTo) params.append('dateTimeTo', queryParams.dateTimeTo);
                if (queryParams.limit !== undefined) params.append('limit', String(queryParams.limit));
                if (queryParams.offset !== undefined) params.append('offset', String(queryParams.offset));
            }
            return `appointments/client/${clientId}?${params.toString()}`;
        },
        providesTags: (result, _error, { clientId }) =>
            result
            ? [
                ...result.map(({ appointment_id }) => ({ type: "Appointments" as const, id: appointment_id })),
                { type: "Appointments", id: `CLIENT-${clientId}` },
                { type: "Appointments", id: 'LIST' },
                ]
            : [{ type: "Appointments", id: `CLIENT-${clientId}` }, { type: "Appointments", id: 'LIST' }],
    }),

    fetchAppointmentsByAssignee: builder.query<AppointmentDataTypes[], { assigneeId: number | string; queryParams?: Omit<FetchAppointmentsArgs, 'assigneeId'> }>({
        query: ({ assigneeId, queryParams }) => {
            const params = new URLSearchParams();
             if(queryParams){
                if (queryParams.status) params.append('status', queryParams.status);
                if (queryParams.dateTimeFrom) params.append('dateTimeFrom', queryParams.dateTimeFrom);
                if (queryParams.dateTimeTo) params.append('dateTimeTo', queryParams.dateTimeTo);
                if (queryParams.limit !== undefined) params.append('limit', String(queryParams.limit));
                if (queryParams.offset !== undefined) params.append('offset', String(queryParams.offset));
            }
            return `appointments/assignee/${assigneeId}?${params.toString()}`;
        },
        providesTags: (result, _error, { assigneeId }) =>
            result
            ? [
                ...result.map(({ appointment_id }) => ({ type: "Appointments"as const, id: appointment_id })),
                { type: "Appointments", id: `ASSIGNEE-${assigneeId}` },
                { type: "Appointments", id: 'LIST' },
                ]
            : [{ type: "Appointments", id: `ASSIGNEE-${assigneeId}` }, { type: "Appointments", id: 'LIST' }],
    }),

    fetchAppointmentsByBranch: builder.query<AppointmentDataTypes[], { branchId: number | string; queryParams?: Omit<FetchAppointmentsArgs, 'branchId'> }>({
        query: ({ branchId, queryParams }) => {
            const params = new URLSearchParams();
             if(queryParams){
                if (queryParams.status) params.append('status', queryParams.status);
                if (queryParams.dateTimeFrom) params.append('dateTimeFrom', queryParams.dateTimeFrom);
                if (queryParams.dateTimeTo) params.append('dateTimeTo', queryParams.dateTimeTo);
                if (queryParams.clientId !== undefined) params.append('clientId', String(queryParams.clientId));
                if (queryParams.assigneeId !== undefined) params.append('assigneeId', String(queryParams.assigneeId));
                if (queryParams.limit !== undefined) params.append('limit', String(queryParams.limit));
                if (queryParams.offset !== undefined) params.append('offset', String(queryParams.offset));
            }
            return `appointments/branch/${branchId}?${params.toString()}`;
        },
        providesTags: (result, _error, { branchId }) =>
            result
            ? [
                ...result.map(({ appointment_id }) => ({ type: "Appointments"as const, id: appointment_id })),
                { type: "Appointments", id: `BRANCH-${branchId}` },
                { type: "Appointments", id: 'LIST' },
                ]
            : [{ type: "Appointments", id: `BRANCH-${branchId}` }, { type: "Appointments", id: 'LIST' }],
    }),

    createAppointment: builder.mutation<AppointmentDataTypes, CreateAppointmentPayload>({
      query: (newAppointmentPayload) => ({
        url: "appointments",
        method: "POST",
        body: newAppointmentPayload,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Appointments", id: 'LIST' },
        { type: "Appointments", id: `CLIENT-${args.client_user_id}` },
      ],
    }),

    updateAppointment: builder.mutation<AppointmentDataTypes, UpdateAppointmentPayload>({
      query: ({ appointment_id, ...payload }) => ({
        url: `appointments/${appointment_id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, _error, { appointment_id }) => [
          { type: "Appointments", id: appointment_id },
          { type: "Appointments", id: 'LIST' },
          ...(result ? [{ type: "Appointments" as const, id: `CLIENT-${result.client_user_id}` }] : []),
        ],
    }),

    deleteAppointment: builder.mutation<{ message: string; success?: boolean }, number>({
      query: (appointment_id) => ({
        url: `appointments/${appointment_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, appointment_id) => [
          { type: "Appointments", id: appointment_id },
          { type: "Appointments", id: 'LIST' },
        ],
    }),
  }),
});

export const {
  useFetchAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useFetchAppointmentsByClientQuery,
  useFetchAppointmentsByAssigneeQuery,
  useFetchAppointmentsByBranchQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentAPI;