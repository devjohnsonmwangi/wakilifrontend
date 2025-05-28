import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this path is correct

// Define Appointment Data Types
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface AppointmentDataTypes {
  appointment_id: number;
  user_id: number;
  branch_id: number;
  party: string;
  reason: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
}

// API Slice for Appointments
export const appointmentAPI = createApi({
  reducerPath: "appointmentAPI",
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Appointments"], // Sticking to the single tag type as per your preference
  endpoints: (builder) => ({
    // Fetch all appointments
    fetchAppointments: builder.query<AppointmentDataTypes[], void>({
      query: () => "appointments",
      providesTags: ["Appointments"],
    }),
    // Fetch appointment by ID
    getAppointmentById: builder.query<AppointmentDataTypes, number>({
      query: (appointment_id) => `appointments/${appointment_id}`,
      providesTags: (_result, _error, appointment_id) =>
        _result ? [{ type: "Appointments", id: appointment_id }] : ["Appointments"],
    }),

    // Fetch appointments by User ID - NEW
    fetchUserAppointments: builder.query<AppointmentDataTypes[], string | number>({
      query: (userId) => `appointments/user/${userId}`, // Matches Hono route
      // With a single tag type, all these queries are linked.
      // A more granular approach would use specific tags like ['UserAppointments', userId].
      providesTags: ["Appointments"],
    }),

    // Fetch appointments by Branch ID - NEW
    fetchBranchAppointments: builder.query<AppointmentDataTypes[], string | number>({
      query: (branchId) => `appointments/branch/${branchId}`, // Matches Hono route
      providesTags: ["Appointments"],
    }),

    // Create new appointment
    createAppointment: builder.mutation<AppointmentDataTypes, Omit<AppointmentDataTypes, "appointment_id">>({
      query: (newAppointment) => ({
        url: "appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["Appointments"], // Invalidates all queries that provide "Appointments"
    }),
    // Update existing appointment
    updateAppointment: builder.mutation<
      AppointmentDataTypes,
      Partial<Omit<AppointmentDataTypes, "appointment_id">> & { appointment_id: number }
    >({
      query: ({ appointment_id, ...rest }) => ({
        url: `appointments/${appointment_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_result, _error, { appointment_id }) => [
        { type: "Appointments", id: appointment_id }, // Invalidate specific item if tagged
        "Appointments", // Invalidate the general list
      ],
    }),
    // Delete an appointment
    deleteAppointment: builder.mutation<{ success: boolean }, number>({
      query: (appointment_id) => ({
        url: `appointments/${appointment_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, appointment_id) => [
        { type: "Appointments", id: appointment_id }, // Invalidate specific item if tagged
        "Appointments", // Invalidate the general list
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useFetchUserAppointmentsQuery,    // New hook
  useFetchBranchAppointmentsQuery, // New hook
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentAPI;