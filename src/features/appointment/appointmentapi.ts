// src/redux/features/appointments/appointmentAPISlice.ts (or your preferred path)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; 
// import { RootState } from "../../../app/store"; 

// Define User and Branch basic types as returned by the backend (JSON representation)
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
  
  appointment_datetime: string; // Single ISO string (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ") from backend
  // appointment_date: string; // REMOVED
  // appointment_time: string; // REMOVED
  status: AppointmentStatus;
  notes_by_client?: string | null;
  notes_by_staff?: string | null;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format

  // Populated relations from the backend (JSON representation)
  client?: BasicUser;
  branch?: Branch;
  assignees?: Array<{
    assignee_user_id: number;
    assigned_at: string; // Date becomes ISO string in JSON
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

  appointmentDateTimeISO: string; // Frontend sends combined ISO string (e.g., UTC)
  // appointment_date: string; // REMOVED
  // appointment_time: string; // REMOVED
  status?: AppointmentStatus; // Optional: backend might default it
  notes_by_client?: string;
  assigneeIds?: number[]; // Optional: can be empty or not present
}

// Define the payload for updating an appointment
export interface UpdateAppointmentPayload {
  appointment_id: number; // Used in URL, not body
  // client_user_id?: number; // Usually not updatable, or handled with care
  branch_id?: number;
  party?: string;
  reason?: string;
  // === MODIFIED PART ===
  appointmentDateTimeISO?: string; // Optional: only if updating the date/time
  // appointment_date?: string; // REMOVED
  // appointment_time?: string; // REMOVED
  status?: AppointmentStatus;
  notes_by_client?: string;
  notes_by_staff?: string;
  assigneeIds?: number[]; // Optional: if undefined, backend will not change assignees
}

// Arguments for fetching a list of appointments
export interface FetchAppointmentsArgs {
  clientId?: number | string;
  assigneeId?: number | string;
  branchId?: number | string;
  status?: AppointmentStatus;
  // === MODIFIED PART ===
  dateTimeFrom?: string; // ISO string for start of date range
  dateTimeTo?: string;   // ISO string for end of date range
  // dateFrom?: string; // REMOVED
  // dateTo?: string;   // REMOVED
  limit?: number;
  offset?: number;
}

export const appointmentAPI = createApi({
  reducerPath: "appointmentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers) => { // Added { getState } 
      // Example: Get token from Redux store
      // const token = (getState() as RootState).auth.token; //  RootState is defined
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
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
          // if (args.dateFrom) params.append('dateFrom', args.dateFrom); 
          // if (args.dateTo) params.append('dateTo', args.dateTo);       
          if (args.limit !== undefined) params.append('limit', String(args.limit));
          if (args.offset !== undefined) params.append('offset', String(args.offset));
        }
        return `appointments?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ appointment_id }) => ({ type: "Appointments" as const, id: appointment_id })),
              { type: "Appointments", id: 'LIST' }, // General list tag
            ]
          : [{ type: "Appointments", id: 'LIST' }],
    }),

    getAppointmentById: builder.query<AppointmentDataTypes, number>({
      query: (appointment_id) => `appointments/${appointment_id}`,
      providesTags: (_result, _error, appointment_id) =>
        _result ? [{ type: "Appointments", id: appointment_id }] : [],
    }),

    // Specific fetch endpoints 
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
                { type: "Appointments", id: `CLIENT-${clientId}` }, // Specific list tag for this client
                { type: "Appointments", id: 'LIST' }, // Also invalidate general list
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
        body: newAppointmentPayload, // This now contains `appointmentDateTimeISO`
      }),
      // Invalidates the general list and any specific lists that might be affected
      invalidatesTags: (_result, _error, args) => [
        { type: "Appointments", id: 'LIST' },
        { type: "Appointments", id: `CLIENT-${args.client_user_id}` },
        // Could also invalidate assignee lists if args.assigneeIds is used to determine tags
      ],
    }),

    updateAppointment: builder.mutation<AppointmentDataTypes, UpdateAppointmentPayload>({
      query: ({ appointment_id, ...payload }) => ({
        url: `appointments/${appointment_id}`,
        method: "PUT",
        body: payload, // This now  contain `appointmentDateTimeISO`
      }),
      invalidatesTags: (result, _error, { appointment_id }) => [
          { type: "Appointments", id: appointment_id }, // Specific appointment
          { type: "Appointments", id: 'LIST' },      // General list
          // Potentially invalidate client/assignee/branch specific lists if relevant data changed
          // For example, if the client_user_id could change (though usually not part of update):
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