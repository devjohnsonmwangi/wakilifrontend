// src/features/payment/paymentAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
// ACTION REQUIRED: Make sure this path points to your Redux store configuration
import type { RootState } from "../../app/store";

// Enums for Payment Table
export type PaymentStatus = "pending" | "paid" | "failed" | "completed" | "pending_mpesa_confirmation";
export type PaymentGateway = "stripe" | "mpesa" | "cash" | "bank_transfer" | "manual";

// --- API Response Type for fetching all payments ---
export interface FetchPaymentsResponse {
  payments: PaymentDataTypes[];
  message?: string; // Optional message
}

// Payment Data Types
export interface PaymentDataTypes {
  payment_id: number;
  case_id: number;
  user_id: number;
  payment_amount: string;
  payment_status: PaymentStatus;
  payment_gateway: string;
  session_id?: string | null;
  checkout_request_id?: string | null;
  transaction_id?: string | null;
  payment_note?: string | null;
  receipt_url?: string | null;
  customer_email?: string | null;
  mpesa_message?: string | null;
  payment_date: string;
  created_at: string;
  updated_at: string;
}

// M-Pesa Callback
export interface MpesaCallbackData {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            CallbackMetadata?: { Item: { Name: string; Value: string }[] };
        };
    };
}

// Stripe Webhook Data Type
export interface StripeWebhookData {
    id: string;
    type: string;
    data: { object: { id: string; amount: number; status: string; } };
}

// Interface for Mpesa STK Request (Case-specific)
export interface MpesaStkRequest {
    phoneNumber: string;
    amount: number;
    user_id: number;
    case_id: number;
    customer_email?: string;
}

// Interface for Stripe Payment (Case-specific)
export interface StripePaymentRequest {
    amount: number;
    user_id: number;
    case_id: number;
}

// Interface for Cash Payment (Case-specific)
export interface CashPaymentRequest {
    amount: number;
    user_id: number;
    case_id: number;
    customer_email?: string;
    payment_notes?: string;
}

// Interface for Manual Payment (Case-specific)
export interface ManualPaymentRequest {
  case_id: number;
  user_id: number;
  payment_amount: number;
  payment_status: PaymentStatus;
  payment_gateway: string;
  payment_date: string;
  transaction_id?: string | null;
  payment_note?: string | null;
  customer_email?: string | null;
}

// Interface for the General Payment Portal Request
export interface GeneralPaymentRequest {
    customerName: string;
    customerEmail?: string;
    phoneNumber?: string;
    amount: number;
    paymentMethod: PaymentGateway; // Uses the main gateway type
    paymentNote?: string;
}

// Payment API Slice
export const paymentAPI = createApi({
    reducerPath: "paymentAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: APIDomain,
        prepareHeaders: (headers, { getState }) => {
            // Get the token from the Redux store, aligning with userSlice.ts
            // ✨ CORRECTION: Changed `state.auth.token` to `state.user.token`
            const token = (getState() as RootState).user.token;

            // If we have a token, set the Authorization header
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    refetchOnReconnect: true,
    tagTypes: ["Payments"],
    endpoints: (builder) => ({
        // Fetch all payments
        fetchPayments: builder.query<FetchPaymentsResponse, void>({
            query: () => "payments",
            providesTags: ["Payments"],
        }),

        // Get a payment by ID
        getPaymentById: builder.query<PaymentDataTypes, number>({
            query: (paymentId) => `payments/${paymentId}`,
            providesTags: (_result, _error, arg) => [{ type: "Payments", id: arg }],
        }),

        // Get payments by case ID
        getPaymentsByCaseId: builder.query<PaymentDataTypes[], number>({
            query: (caseId) => `payments/case/${caseId}`,
            providesTags: (_result, _error, arg) => [{ type: "Payments", caseId: arg }],
        }),
        
        // Endpoint for initiating a general payment
        initiateGeneralPayment: builder.mutation<{ success: boolean; sessionId?: string; message?: string }, GeneralPaymentRequest>({
            query: (body) => ({
                url: 'payments/general',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Initiate M-Pesa STK Push (Case-specific)
        initiateMpesaStkPush: builder.mutation<{ success: boolean; message: string; MerchantRequestID: string, CheckoutRequestID: string }, MpesaStkRequest>({
            query: (body) => ({
                url: 'payments/mpesa',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Create cash payment (Case-specific)
        createCashPayment: builder.mutation<PaymentDataTypes, CashPaymentRequest>({
            query: (body) => ({
                url: 'payments/cash',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Add Manual Payment (Case-specific)
        addManualPayment: builder.mutation<PaymentDataTypes, ManualPaymentRequest>({
            query: (body) => ({
                url: 'payments/manual',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Handle Stripe Payment (Case-specific)
        handleStripePayment: builder.mutation<{ success: boolean; sessionId: string }, StripePaymentRequest>({
            query: (body) => ({
                url: 'payments/stripe',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Update an existing payment
        updatePayment: builder.mutation<PaymentDataTypes, { paymentId: number } & Partial<PaymentDataTypes>>({
            query: ({ paymentId, ...patch }) => ({
                url: `payments/${paymentId}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Payments', id: arg.paymentId }],
        }),

        // Delete a payment by ID
        deletePayment: builder.mutation<{ success: boolean; paymentId: number }, number>({
            query: (paymentId) => ({
                url: `payments/${paymentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Payments"],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useFetchPaymentsQuery,
    useGetPaymentByIdQuery,
    useGetPaymentsByCaseIdQuery,
    useInitiateGeneralPaymentMutation,
    useInitiateMpesaStkPushMutation,
    useCreateCashPaymentMutation,
    useAddManualPaymentMutation,
    useHandleStripePaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentAPI;