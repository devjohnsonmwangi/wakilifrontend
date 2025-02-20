import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";

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
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    // Fetch all appointments
    fetchAppointments: builder.query<AppointmentDataTypes[], void>({
      query: () => "appointments",
      providesTags: ["Appointments"],
    }),
    // Fetch appointment by ID
    getAppointmentById: builder.query<AppointmentDataTypes, number>({
      query: (appointment_id) => `appointments/${appointment_id}`,
      providesTags: ["Appointments"],
    }),
    // Create new appointment
    createAppointment: builder.mutation<AppointmentDataTypes, Omit<AppointmentDataTypes, "appointment_id">>({
      query: (newAppointment) => ({
        url: "appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["Appointments"],
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
      invalidatesTags: ["Appointments"],
    }),
    // Delete an appointment
    deleteAppointment: builder.mutation<{ success: boolean }, number>({
      query: (appointment_id) => ({
        url: `appointments/${appointment_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentAPI;
