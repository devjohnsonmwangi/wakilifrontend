// src/features/payment/paymentAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";

// Enums for Payment Table
export type PaymentStatus = "pending" | "paid" | "failed" | "completed";
export type PaymentGateway = "stripe" | "mpesa" | "cash" | "other";

// Payment Data Types (Minimal)
export interface PaymentDataTypes {
    payment_id?: number;
    case_id: number;
    user_id: number;
    payment_amount: number;
    payment_status?: PaymentStatus;
    payment_gateway?: PaymentGateway;
    payment_notes?: string | null;
    transaction_id?: string | null;
    payment_date?:string;
}

//M-Pesa callback
export interface MpesaCallbackData {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            CallbackMetadata?: {
                Item: { Name: string; Value: string }[];
            };
        };
    };
}

// Stripe Webhook Data Type
export interface StripeWebhookData {
    id: string; // Event ID
    type: string; // Event type
    data: {
        object: {
            id: string;
            amount: number;
            status: string; // e.g., "succeeded", "failed"
        };
    };
}

// Interface for Mpesa STK Request
export interface MpesaStkRequest {
    phoneNumber: string;
    amount: number;     
    user_id: number;
    case_id: number;
}

// Interface for Stripe Payment
export interface StripePaymentRequest {
    amount: number;
    user_id: number;
    case_id: number;
}

//Interface for Cash Payment
export interface CashPaymentRequest {
    amount: number;
    user_id: number;
    case_id: number;
    payment_notes?: string;
}

// Payment API Slice
export const paymentAPI = createApi({
    reducerPath: "paymentAPI",
    baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
    refetchOnReconnect: true,
    tagTypes: ["Payments"],
    endpoints: (builder) => ({
        // Fetch all payments
        fetchPayments: builder.query<PaymentDataTypes[], void>({
            query: () => "payments",
            providesTags: ["Payments"],
        }),

        // Get a payment by ID
        getPaymentById: builder.query<PaymentDataTypes, number>({
            query: (paymentId) => `payments/${paymentId}`,
            providesTags: ["Payments"],
        }),

        // Get payments by case ID
        getPaymentsByCaseId: builder.query<PaymentDataTypes[], number>({
            query: (caseId) => `payments/case/${caseId}`,
            providesTags: ["Payments"],
        }),

        // Get payments by case parties
        getPaymentsByCaseParties: builder.query<PaymentDataTypes[], string>({
            query: (parties) => `payments/parties/${parties}`,
            providesTags: ["Payments"],
        }),

        // Initiate M-Pesa STK Push
        initiateMpesaStkPush: builder.mutation<{ success: boolean; message: string; MerchantRequestID: string, CheckoutRequestID: string }, MpesaStkRequest>({
            query: (body) => ({
                url: 'payments/mpesa',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Handle M-Pesa callback
        mpesaCallback: builder.mutation<{ success: boolean; message: string }, MpesaCallbackData>({
            query: (callbackData) => ({
                url: 'payments/mpesa/callback',
                method: 'POST',
                body: callbackData,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Create cash payment
        createCashPayment: builder.mutation<PaymentDataTypes, CashPaymentRequest>({
            query: (body) => ({
                url: 'payments/cash',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Handle Stripe Payment
        handleStripePayment: builder.mutation<{ success: boolean; sessionId: string }, StripePaymentRequest>({
            query: (body) => ({
                url: 'payments/stripe',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Stripe Webhook handling
        stripeWebhook: builder.mutation<{ received: boolean }, StripeWebhookData>({
            query: (webhookData) => ({
                url: 'payments/stripe/webhook',
                method: 'POST',
                body: webhookData,
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
            invalidatesTags: ["Payments"],
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
    useGetPaymentsByCasePartiesQuery,
    useInitiateMpesaStkPushMutation,
    useMpesaCallbackMutation,
    useCreateCashPaymentMutation,
    useHandleStripePaymentMutation,
    useStripeWebhookMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentAPI;