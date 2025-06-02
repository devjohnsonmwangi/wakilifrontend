import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this path is correct

// --- Enums ---
export type CaseType = 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment' | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'tribunal' | 'conveyances';
export type CaseStatus = "open" | "in_progress" | "closed" | "on_hold" | "resolved";
export type PaymentStatusOnCase = "pending" | "partially_paid" | "paid" | "failed" | "refunded" | "overdue";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

// --- Data Types ---
export interface UserDataType {
    user_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
    profile_picture: string | null;
    location: string;
    is_active: boolean;
    created_at: string;
    // updated_at: string;
}

export interface CaseDataTypes {
  case_id: number;
  user_id: number;
  user?: UserDataType;
  case_type: CaseType;
  case_status: CaseStatus;
  case_description: string | null;
  case_number: string;
  case_track_number: string;
  court: string | null;
  station: string | null;
  parties: string | null;
  fee: number; // Backend handles parsing, frontend sends as number
  payment_status: PaymentStatusOnCase;
  payment_balance: number;
  created_at: string;
  updated_at: string;
}

// Payload for creating a case, based on backend expectations
export interface CreateCasePayload {
    user_id: number;
    case_type: CaseType;
    fee: number; // Backend requires and parses this
    case_number: string;
    case_track_number: string;
    case_description?: string | null;
    court?: string | null;
    station?: string | null;
    parties?: string | null;
    // Fields like payment_balance, payment_status, created_at, updated_at are set by backend
}

// Payload for updating a case
// We can send any of the TCaseInsert fields, so Partial<CaseDataTypes> is mostly fine
// The backend will ignore fields it doesn't allow updates for (like created_at) or handles itself.
export type UpdateCasePayload = Partial<Omit<CaseDataTypes, 'case_id' | 'user' | 'created_at' | 'updated_at' | 'payment_status' | 'payment_balance'>> & {
    // We can still allow updating fee, description, status, type, etc.
    // payment_status and payment_balance are typically updated by specific payment actions or recalculations.
    // The backend's updateCaseService might recalculate balance if `fee` is changed.
};


export interface PaymentDataTypes {
  payment_id: number;
  case_id: number;
  user_id: number;
  payment_amount: string; // Assuming backend expects string for decimal precision
  payment_status: PaymentStatus;
  payment_gateway: string;
  session_id?: string | null;
  checkout_request_id?: string | null;
  transaction_id?: string | null;
  payment_note?: string | null;
  receipt_url?: string | null;
  customer_email?: string | null;
  payment_date: string;
  created_at: string;
  updated_at: string;
}

// --- API Response Types for Mutations ---
interface BackendCaseResponse {
    msg: string;
    case: CaseDataTypes;
}
interface BackendDeleteResponse {
    msg: string;
}


// Combined API Slice
export const caseAndPaymentAPI = createApi({
  reducerPath: "caseAndPaymentAPI",
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Cases", "Payments"], // "CaseDetail" could be added for more granular updates
  endpoints: (builder) => ({
    // ** Case Endpoints **
    fetchCases: builder.query<CaseDataTypes[], void>({
      query: () => "cases",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ case_id }) => ({ type: 'Cases' as const, id: case_id })),
              { type: 'Cases', id: 'LIST' },
            ]
          : [{ type: 'Cases', id: 'LIST' }],
    }),
    getCaseById: builder.query<CaseDataTypes, number>({
      query: (case_id) => `cases/${case_id}`,
      providesTags: (_result,_error, case_id) => [{ type: 'Cases', id: case_id }],
    }),
    getUserCasesByUserId: builder.query<CaseDataTypes[], number>({
      query: (id) => `/cases/user/${id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ case_id }) => ({ type: 'Cases' as const, id: case_id })),
              { type: 'Cases', id: 'LIST' }, // Potentially also invalidate general list if user cases change
            ]
          : [{ type: 'Cases', id: 'LIST' }],
    }),
    createCase: builder.mutation<CaseDataTypes, CreateCasePayload>({
      query: (newCase) => ({
        url: "cases",
        method: "POST",
        body: newCase, // newCase should conform to CreateCasePayload
      }),
      transformResponse: (response: BackendCaseResponse) => response.case, // Extract case from {msg, case}
      invalidatesTags: [{ type: 'Cases', id: 'LIST' }],
    }),
    updateCase: builder.mutation<CaseDataTypes, { case_id: number } & UpdateCasePayload>({
      query: ({ case_id, ...rest }) => ({
        url: `cases/${case_id}`,
        method: "PUT",
        body: rest, // `rest` will be UpdateCasePayload
      }),
      transformResponse: (response: BackendCaseResponse) => response.case, // Extract case
      // invalidatesTags: (result, error, { case_id }) => [{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }],
      // More robust invalidation:
      async onQueryStarted({ case_id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          caseAndPaymentAPI.util.updateQueryData('getCaseById', case_id, (draft) => {
            Object.assign(draft, patch);
          })
        );
        // Also update in any list queries
        // This requires more complex logic if you want to update lists without full refetch
        dispatch(
            caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: 'LIST' }])
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
           /**
           * Optimistic update failed, dispatch invalidateTags to refetch
           * list and the specific item.
           */
          dispatch(
            caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }])
          );
        }
      }
    }),
    deleteCase: builder.mutation<{ success: boolean; case_id: number; msg: string }, number>({
      query: (case_id) => ({
        url: `cases/${case_id}`,
        method: "DELETE",
      }),
      transformResponse: (response: BackendDeleteResponse, _meta, arg_case_id) => ({
        success: response.msg.toLowerCase().includes("successfully"), // Or a more robust check
        case_id: arg_case_id,
        msg: response.msg,
      }),
      invalidatesTags: (_result, _error, case_id) => [{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }],
    }),

    // New endpoint for triggering balance update
    triggerCaseBalanceUpdate: builder.mutation<CaseDataTypes, number>({
        query: (case_id) => ({
            url: `cases/${case_id}/update-balance`, // Define this route in your Hono backend
            method: 'PUT', // Or POST, ensure backend route matches
        }),
        transformResponse: (response: BackendCaseResponse) => response.case,
        // invalidatesTags: (result, error, case_id) => [{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }],
        // Optimistic update for balance
        async onQueryStarted(case_id, { dispatch, queryFulfilled }) {
            // Potentially update optimistically if you know what the balance *should* become,
            // or just refetch. For now, let's refetch.
            try {
                const { data: updatedCase } = await queryFulfilled;
                // Update the specific case in cache
                dispatch(
                    caseAndPaymentAPI.util.updateQueryData('getCaseById', case_id, (draft) => {
                        Object.assign(draft, updatedCase);
                    })
                );
                // Update in lists if needed (can be complex, simpler to invalidate LIST)
                dispatch(
                    caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: 'LIST' }])
                );
            } catch {
                dispatch(
                    caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }])
                );
            }
        }
    }),


    // ** Payment Endpoints ** (Assuming these are largely okay, but apply similar scrutiny if issues arise)
    fetchPayments: builder.query<PaymentDataTypes[], void>({
      query: () => "payments",
      providesTags: ["Payments"],
    }),
    getPaymentById: builder.query<PaymentDataTypes, number>({
      query: (payment_id) => `payments/${payment_id}`,
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes>>({ // Ensure payload matches backend
      query: (newPayment) => ({
        url: "payments",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payments", "Cases"], // Creating a payment might affect case balance/status
    }),
    updatePayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes & { payment_id: number }>>({
      query: ({ payment_id, ...rest }) => ({
        url: `payments/${payment_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Payments", "Cases"], // Updating a payment might affect case balance/status
    }),
    deletePayment: builder.mutation<{ success: boolean; payment_id: number }, number>({
      query: (payment_id) => ({
        url: `payments/${payment_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments", "Cases"], // Deleting a payment might affect case balance/status
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
  useTriggerCaseBalanceUpdateMutation, // Export new hook

  // Payment Hooks
  useFetchPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = caseAndPaymentAPI;