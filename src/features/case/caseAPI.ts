import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this path is correct

// --- Enums ---

// Case Enums
export type CaseType = 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment' | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'tribunal' | 'conveyances';
export type CaseStatus = "open" | "in_progress" | "closed" | "on_hold" | "resolved";

// Payment Enums (from backend paymentTable.payment_status and caseTable.payment_status)
// These might be slightly different depending on your exact backend schema.
// This `PaymentStatusOnCase` is for the caseTable's payment_status field.
export type PaymentStatusOnCase = "pending" | "partially_paid" | "paid" | "failed" | "refunded" | "overdue"; // Matches caseTable.payment_status
// This `PaymentTransactionStatus` is for the paymentTable's payment_status field.
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"; // Example for paymentTable.payment_status

// --- Data Types ---

export interface UserDataType {
    user_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    role: string; // Consider an enum if roles are fixed
    profile_picture: string | null;
    location: string; // Consider if this needs more structure
    is_active: boolean;
    created_at: string; // ISO date string
    // updated_at: string; // Usually present
}

// Case Data Types - Updated
export interface CaseDataTypes {
  case_id: number;
  user_id: number;
  user?: UserDataType; // Optional if not always populated, or make it mandatory if your backend always sends it
  case_type: CaseType;
  case_status: CaseStatus;
  case_description: string | null;
  case_number: string;
  case_track_number: string;
  court: string | null; // Allow null if optional
  station: string | null; // Allow null if optional
  parties: string | null; // Allow null if optional
  fee: number; // Assuming backend sends as number or RTK parses string to number
  payment_status: PaymentStatusOnCase; // Status of payment for the case (e.g., pending, partially_paid, paid)
  payment_balance: number; // <<-- NEW FIELD -- Assuming backend sends as number or RTK parses string to number
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Payment Data Types - Updated for clarity
export interface PaymentDataTypes {
  payment_id: number;
  case_id: number;
  user_id: number;
  payment_amount: string; // Backend stores as decimal (string), frontend might treat as number after parsing
  payment_status: PaymentStatus; // Status of this specific payment transaction (e.g., pending, completed, failed)
  payment_gateway: string; // Consider an enum: 'mpesa' | 'stripe' | 'cash' etc.
  session_id?: string | null; // For Stripe
  checkout_request_id?: string | null; // For M-Pesa
  transaction_id?: string | null; // Actual transaction reference
  payment_note?: string | null;
  receipt_url?: string | null;
  customer_email?: string | null;
  payment_date: string; // ISO date string (from paymentTable.payment_date)
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}


// Combined API Slice
export const caseAndPaymentAPI = createApi({
  reducerPath: "caseAndPaymentAPI",
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Cases", "Payments"],
  endpoints: (builder) => ({
    // ** Case Endpoints **
    fetchCases: builder.query<CaseDataTypes[], void>({
      query: () => "cases",
      providesTags: ["Cases"],
    }),
    getCaseById: builder.query<CaseDataTypes, number>({
      query: (case_id) => `cases/${case_id}`,
      providesTags: ["Cases"],
    }),
    getUserCasesByUserId: builder.query<CaseDataTypes[], number>({
      query: (id) => `/cases/user/${id}`,
      providesTags: ['Cases'],
  }),
    createCase: builder.mutation<CaseDataTypes, Partial<CaseDataTypes>>({
      query: (newCase) => ({
        url: "cases",
        method: "POST",
        body: newCase,
      }),
      invalidatesTags: ["Cases"],
    }),
    updateCase: builder.mutation<CaseDataTypes, Partial<CaseDataTypes & { case_id: number }>>({
      query: ({ case_id, ...rest }) => ({
        url: `cases/${case_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Cases"],
    }),
    deleteCase: builder.mutation<{ success: boolean; case_id: number }, number>({
      query: (case_id) => ({
        url: `cases/${case_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cases"],
    }),


    // ** Payment Endpoints **
    fetchPayments: builder.query<PaymentDataTypes[], void>({
      query: () => "payments",
      providesTags: ["Payments"],
    }),
    getPaymentById: builder.query<PaymentDataTypes, number>({
      query: (payment_id) => `payments/${payment_id}`,
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes>>({
      query: (newPayment) => ({
        url: "payments",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payments"],
    }),
    updatePayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes & { payment_id: number }>>({
      query: ({ payment_id, ...rest }) => ({
        url: `payments/${payment_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Payments"],
    }),
    deletePayment: builder.mutation<{ success: boolean; payment_id: number }, number>({
      query: (payment_id) => ({
        url: `payments/${payment_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Case Hooks
  useGetUserCasesByUserIdQuery,
  useFetchCasesQuery,
  useGetCaseByIdQuery,
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  
  // Payment Hooks
  useFetchPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = caseAndPaymentAPI;
