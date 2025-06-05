import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this path is correct

// --- Enums (Assuming these are unchanged) ---
export type CaseType = 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment' | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'tribunal' | 'conveyances';
export type CaseStatus = "open" | "in_progress" | "closed" | "on_hold" | "resolved";
export type PaymentStatusOnCase = "pending" | "partially_paid" | "paid" | "failed" | "refunded" | "overdue"; // Make sure 'partially_paid' is valid in backend schema
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"; // For paymentTable

// --- Data Types ---
export interface UserDataType { // Basic user details for owner/assignee
    user_id: number;
    full_name: string | null;
    email: string;
    phone_number: string | null;
    role: string;
    profile_picture?: string | null;
    // Add other relevant fields returned by the backend for user context
    created_at?: string;
    updated_at?: string;
}

export interface CaseAssigneeData {
    case_id: number;
    assignee_user_id: number;
    assigned_at: string;
    assignee: UserDataType | null; // The staff member details
}

export interface CaseDataTypes {
  case_id: number;
  user_id: number; // Client owner's ID
  owner?: Partial<UserDataType> | null; // Client owner details
  assignees?: CaseAssigneeData[]; // Staff assigned to the case
  case_type: CaseType;
  case_status: CaseStatus;
  case_description: string | null;
  case_number: string;
  case_track_number: string;
  court: string | null;
  station: string | null;
  parties: string | null;
  fee: string; // Backend schema uses decimal, often string in transit
  payment_status: PaymentStatusOnCase; // Ensure this matches backend logic, including 'partially_paid'
  payment_balance: string; // Backend schema uses decimal
  created_at: string;
  updated_at: string;
}

export interface CreateCasePayload {
    user_id: number;
    case_type: CaseType;
    fee: number; // Frontend sends number, backend service handles string conversion if needed
    case_number: string;
    case_track_number: string;
    case_description?: string | null;
    court?: string | null;
    station?: string | null;
    parties?: string | null;
}

export type UpdateCasePayload = Partial<Omit<CaseDataTypes, 'case_id' | 'owner' | 'assignees' | 'created_at' | 'updated_at' | 'payment_status' | 'payment_balance' | 'user_id'>>;

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
  payment_date: string;
  created_at: string;
  updated_at: string;
}

// --- API Response Types for Mutations ---
export interface BackendCaseResponse { // For single case responses
    msg?: string;
    case: CaseDataTypes;
}

export interface BackendAssignmentResponse {
    msg: string;
    assignment: CaseAssigneeData;
}


export interface BackendSuccessMessage {
    msg: string;
}

// Combined API Slice
export const caseAndPaymentAPI = createApi({
  reducerPath: "caseAndPaymentAPI",
  baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Cases", "Payments", "CaseAssignments"],
  endpoints: (builder) => ({
    // ** Case Endpoints **
    fetchCases: builder.query<CaseDataTypes[], { includeDetails?: boolean } | void>({
      query: (params) => `cases${params && params.includeDetails !== undefined ? `?includeDetails=${params.includeDetails}` : ''}`,
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
    // Renamed and updated to match new backend route and params
    getCasesByClientOwner: builder.query<CaseDataTypes[], { userId: number, includeAssignees?: boolean }>({
      query: ({ userId, includeAssignees }) =>
        `cases/client/${userId}${includeAssignees !== undefined ? `?includeAssignees=${includeAssignees}` : ''}`,
      providesTags: (result, _error, { userId }) =>
        result
          ? [
              ...result.map(({ case_id }) => ({ type: 'Cases' as const, id: case_id })),
              { type: 'Cases', id: `CLIENT_LIST_${userId}` }, // Specific tag for this client's list
              { type: 'Cases', id: 'LIST' },
            ]
          : [{ type: 'Cases', id: `CLIENT_LIST_${userId}` }, { type: 'Cases', id: 'LIST' }],
    }),
    // New: Get cases assigned to a specific staff member
    getCasesByAssignedStaff: builder.query<CaseDataTypes[], number>({
        query: (staffId) => `cases/staff/${staffId}`,
        providesTags: (result, _error, staffId) =>
        result
            ? [
                ...result.map(({ case_id }) => ({ type: 'Cases' as const, id: case_id })),
                { type: 'Cases', id: `STAFF_LIST_${staffId}` },
                { type: 'Cases', id: 'LIST' }, // Also invalidates general list
            ]
            : [{ type: 'Cases', id: `STAFF_LIST_${staffId}` }, { type: 'Cases', id: 'LIST' }],
    }),
    // New: Get case by payment ID
    getCaseByPayment: builder.query<CaseDataTypes, number>({
        query: (paymentId) => `cases/payment/${paymentId}`,
        // This might provide the case tag, or a more specific tag if needed
        providesTags: (result) => result ? [{ type: 'Cases', id: result.case_id }] : [],
    }),
    createCase: builder.mutation<CaseDataTypes, CreateCasePayload>({
      query: (newCase) => ({
        url: "cases",
        method: "POST",
        body: newCase,
      }),
      transformResponse: (response: BackendCaseResponse) => response.case,
      invalidatesTags: [{ type: 'Cases', id: 'LIST' }],
    }),
    updateCase: builder.mutation<CaseDataTypes, { case_id: number } & UpdateCasePayload>({
      query: ({ case_id, ...rest }) => ({
        url: `cases/${case_id}`,
        method: "PUT",
        body: rest,
      }),
      transformResponse: (response: BackendCaseResponse) => response.case,
      async onQueryStarted({ case_id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          caseAndPaymentAPI.util.updateQueryData('getCaseById', case_id, (draft) => {
            Object.assign(draft, patch); // Optimistically apply non-nested updates
            // If fee changes, balance/status might change on backend, so optimistic update is harder
          })
        );
        try {
          await queryFulfilled;
          // If successful, the cache is already updated by queryFulfilled if transformResponse returns the case
          // But LIST still needs invalidation for any sorting/filtering changes
          dispatch(caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: 'LIST' }, { type: 'Cases', id: case_id }]));
        } catch {
          patchResult.undo();
          dispatch(caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }]));
        }
      }
    }),
    deleteCase: builder.mutation<{ success: boolean; case_id: number; msg: string }, number>({
      query: (case_id) => ({
        url: `cases/${case_id}`,
        method: "DELETE",
      }),
      transformResponse: (response: BackendSuccessMessage, _meta, arg_case_id) => ({
        success: response.msg.toLowerCase().includes("successfully"),
        case_id: arg_case_id,
        msg: response.msg,
      }),
      invalidatesTags: (_result, _error, case_id) => [
          { type: 'Cases', id: case_id },
          { type: 'Cases', id: 'LIST' },
          { type: 'CaseAssignments', id: `CASE_${case_id}` } // Invalidate assignments for this case
        ],
    }),
    triggerCaseBalanceUpdate: builder.mutation<CaseDataTypes, number>({
        query: (case_id) => ({
            url: `cases/${case_id}/recalculate-balance`, // Corrected Hono route
            method: 'POST', // As per Hono router
        }),
        transformResponse: (response: BackendCaseResponse) => response.case,
        async onQueryStarted(case_id, { dispatch, queryFulfilled }) {
            try {
                const { data: updatedCase } = await queryFulfilled;
                dispatch(
                    caseAndPaymentAPI.util.updateQueryData('getCaseById', case_id, (draft) => {
                        Object.assign(draft, updatedCase);
                    })
                );
                // Potentially invalidate lists if balance/status affects sorting/filtering
                dispatch(caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: 'LIST' }]));
            } catch {
                dispatch(caseAndPaymentAPI.util.invalidateTags([{ type: 'Cases', id: case_id }, { type: 'Cases', id: 'LIST' }]));
            }
        }
    }),

    // ** Case Assignment Endpoints **
    getAssignedStaffForCase: builder.query<(UserDataType & { assigned_at: string })[], number>({
        query: (caseId) => `cases/${caseId}/assigned-staff`,
        providesTags: (_result, _error, caseId) => [{ type: 'CaseAssignments', id: `CASE_${caseId}` }],
        // transformResponse might be needed if backend wraps in 'staff':
        // transformResponse: (response: BackendStaffListResponse) => response.staff,
    }),
    assignStaffToCase: builder.mutation<CaseAssigneeData, { caseId: number, staffUserId: number }>({
        query: ({ caseId, staffUserId }) => ({
            url: `cases/${caseId}/assign-staff`,
            method: 'POST',
            body: { staff_user_id: staffUserId }, // Backend expects staff_user_id in body
        }),
        transformResponse: (response: BackendAssignmentResponse) => response.assignment,
        invalidatesTags: (_result, _error, { caseId }) => [
            { type: 'Cases', id: caseId }, // To update the case's assignee list
            { type: 'CaseAssignments', id: `CASE_${caseId}` }, // Specific tag for this case's assignments
            { type: 'Cases', id: 'LIST' } // General list if assignees shown there
        ],
    }),
    unassignStaffFromCase: builder.mutation<BackendSuccessMessage, { caseId: number, staffId: number }>({
        query: ({ caseId, staffId }) => ({
            url: `cases/${caseId}/assign-staff/${staffId}`, // staffId in URL
            method: 'DELETE',
        }),
        invalidatesTags: (_result, _error, { caseId }) => [
            { type: 'Cases', id: caseId },
            { type: 'CaseAssignments', id: `CASE_${caseId}` },
            { type: 'Cases', id: 'LIST' }
        ],
    }),

    // ** Payment Endpoints ** (Assuming structure is mostly fine)
    fetchPayments: builder.query<PaymentDataTypes[], void>({
      query: () => "payments",
      providesTags: (result) => result ? [...result.map(({ payment_id }) => ({type: 'Payments' as const, id: payment_id})), {type: 'Payments', id: 'LIST'}] : [{type: 'Payments', id: 'LIST'}],
    }),
    getPaymentById: builder.query<PaymentDataTypes, number>({
      query: (payment_id) => `payments/${payment_id}`,
      providesTags: (_r, _e, id) => [{type: 'Payments', id}],
    }),
    createPayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes>>({
      query: (newPayment) => ({
        url: "payments",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: [{type: 'Payments', id: 'LIST'}, {type: 'Cases', id: 'LIST'}], // Payment affects cases
    }),
    updatePayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes & { payment_id: number }>>({
      query: ({ payment_id, ...rest }) => ({
        url: `payments/${payment_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_r, _e, {payment_id}) => [{type: 'Payments', id: payment_id}, {type: 'Payments', id: 'LIST'}, {type: 'Cases', id: 'LIST'}],
    }),
    deletePayment: builder.mutation<{ success: boolean; payment_id: number, msg: string }, number>({
      query: (payment_id) => ({
        url: `payments/${payment_id}`,
        method: "DELETE",
      }),
      transformResponse: (response: BackendSuccessMessage, _meta, arg_payment_id) => ({
        success: response.msg.toLowerCase().includes("successfully"),
        payment_id: arg_payment_id,
        msg: response.msg,
      }),
      invalidatesTags: (_r, _e, id) => [{type: 'Payments', id}, {type: 'Payments', id: 'LIST'}, {type: 'Cases', id: 'LIST'}],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Case Hooks
  useFetchCasesQuery,
  useGetCaseByIdQuery,
  useGetCasesByClientOwnerQuery,    // Updated
  useGetCasesByAssignedStaffQuery, // New
  useGetCaseByPaymentQuery,        // New
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  useTriggerCaseBalanceUpdateMutation,

  // Case Assignment Hooks
  useGetAssignedStaffForCaseQuery, // New
  useAssignStaffToCaseMutation,    // New
  useUnassignStaffFromCaseMutation,// New

  // Payment Hooks
  useFetchPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = caseAndPaymentAPI;