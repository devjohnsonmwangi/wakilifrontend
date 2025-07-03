import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";

// --- Data Type Definitions (Matching the Backend) ---

export interface UserSummary {
  user_id: number;
  full_name: string;
  email: string;
}

export interface BranchLocation {
  branch_id: number;
  name: string;
  address: string;
  contact_phone: string;
}

export interface AppointmentAssignee {
  assignee_user_id: number;
  assigned_at: string;
  appointment_id: number;
  assignee?: UserSummary;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// <<< CORRECTED: The full Appointment object, now matching the backend's Zod schemas and return types
export interface Appointment {
  appointment_id: number;
  client_user_id: number;
  location_branch_id: number; // This is what the DB table has and what is returned
  appointment_datetime: string;
  party: string; // Added missing field
  reason: string;
  status: AppointmentStatus;
  notes_by_client?: string | null; // Made specific
  notes_by_staff?: string | null;  // Made specific
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  client?: UserSummary;
  branch?: BranchLocation;
  assignees?: AppointmentAssignee[];
}

// <<< CORRECTED: A dedicated type for the CREATE payload to match the backend controller's Zod schema
export interface CreateAppointmentPayload {
  client_user_id: number;
  branch_id: number; // The schema expects 'branch_id', not 'location_branch_id'
  party: string;
  reason: string;
  appointment_datetime: string;
  status?: AppointmentStatus;
  notes_by_client?: string | null;
  assigneeIds?: number[];
}

// <<< CORRECTED: A dedicated type for the UPDATE payload
export interface UpdateAppointmentPayload {
  branch_id?: number;
  party?: string;
  reason?: string;
  appointment_datetime?: string;
  status?: AppointmentStatus;
  notes_by_client?: string | null;
  notes_by_staff?: string | null;
  newAssigneeIds?: number[];
}

export interface ListAppointmentsArgs {
  status?: AppointmentStatus;
  branchId?: number;
  clientId?: number;
  assigneeId?: number;
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
    
    listAppointments: builder.query<Appointment[], ListAppointmentsArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.status) params.append('status', args.status);
        if (args?.branchId) params.append('branchId', args.branchId.toString());
        if (args?.clientId) params.append('clientId', args.clientId.toString());
        if (args?.assigneeId) params.append('assigneeId', args.assigneeId.toString());
        if (args?.dateTimeFrom) params.append('dateTimeFrom', args.dateTimeFrom);
        if (args?.dateTimeTo) params.append('dateTimeTo', args.dateTimeTo);
        
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

    getAppointmentById: builder.query<Appointment, number>({
      query: (id) => `appointments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Appointment", id }],
    }),

    // <<< CORRECTED: createAppointment mutation now uses the flat payload type
    createAppointment: builder.mutation<Appointment, CreateAppointmentPayload>({
      query: (newAppointmentPayload) => ({
        url: "appointments",
        method: "POST",
        // The body is now the flat payload, which matches the backend controller
        body: newAppointmentPayload, 
      }),
      invalidatesTags: [{ type: "Appointment", id: "LIST" }],
    }),

    // <<< CORRECTED: updateAppointment mutation now constructs the flat body correctly
    updateAppointment: builder.mutation<
      Appointment,
      {
        id: number;
        payload: UpdateAppointmentPayload;
      }
    >({
      query: ({ id, payload }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        // The body is the flat payload containing updates and newAssigneeIds
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
      ],
    }),

    deleteAppointment: builder.mutation<{ success: boolean; id: number }, number>({
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