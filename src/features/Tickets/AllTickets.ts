// src/features/ticket/TicketAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from './../../utils/APIDomain';
// ACTION REQUIRED: Make sure this path points to your Redux store configuration
import type { RootState } from "../../app/store";

export interface UserTicketData {
    tickets: TypeTickets[]; // Array of tickets
}

export interface TypeTickets {
    ticket_id: number;
    user_id: number;
    subject: string;
    description: string;
    status: string;
    updated_at: string;
    created_at: string;
    creator: {
        full_name: string;
        email: string;
        phone_number: string;
    };
}

export const TicketAPI = createApi({
    reducerPath: 'TicketAPI',
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
    tagTypes: ['ticket'],
    endpoints: (builder) => ({
        getTickets: builder.query<TypeTickets[], void>({
            query: () => '/ticket',
            providesTags: ['ticket'],
        }),
        createTicket: builder.mutation<TypeTickets, Partial<TypeTickets>>({
            query: (newTicket) => ({
                url: 'ticket',
                method: 'POST',
                body: newTicket,
            }),
            invalidatesTags: ['ticket'],
        }),
        updateTicket: builder.mutation<TypeTickets, { ticket_id: number } & Partial<TypeTickets>>({
            query: ({ ticket_id, ...rest }) => ({
                url: `ticket/${ticket_id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: ['ticket'],
        }),
        deleteTicket: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `ticket/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ticket'],
        }),
        getTicketById: builder.query<TypeTickets, number>({
            query: (id) => `ticket/${id}`,
            providesTags: (_result, _error, arg) => [{ type: 'ticket', id: arg }],
        }),
        getUserTickets: builder.query<TypeTickets[], number>({
            query: (id) => `/ticket/user/${id}`,
            providesTags: ['ticket'],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetTicketsQuery,
    useCreateTicketMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation,
    useGetTicketByIdQuery,
    useGetUserTicketsQuery,
} = TicketAPI;