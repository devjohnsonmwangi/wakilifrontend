import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this path is correct
// ACTION REQUIRED: Make sure this path points to your Redux store configuration
import type { RootState } from '../../app/store';

// --- Enums
export type CaseType = 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment' | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'Tribunal' | 'conveyances'|'succession';
export type CaseStatus = "open" | "in_progress" | "closed" | "on_hold" | "resolved";
export type PaymentStatusOnCase = "pending" | "partially_paid" | "paid" | "failed" | "refunded" | "overdue";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

// --- Data Types ---
export interface UserDataType {
    user_id: number;
    full_name: string | null;
    email: string;
    phone_number: string | null;
    role: string;
    profile_picture?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CaseAssigneeData {
    case_id: number;
    assignee_user_id: number;
    assigned_at: string;
    assignee: UserDataType | null;
}

export interface CaseDataTypes {
  case_id: number;
  user_id: number;
  owner?: Partial<UserDataType> | null;
  assignees?: CaseAssigneeData[];
  case_type: CaseType;
  case_status: CaseStatus;
  case_description: string | null;
  case_number: string;
  case_track_number: string;
  court: string | null;
  station: string | null;
  parties: string | null;
  fee: string;
  payment_status: PaymentStatusOnCase;
  payment_balance: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCasePayload {
    user_id: number;
    case_type: CaseType;
    fee: number;
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

export interface CaseProgressData {
    progress_id: number;
    case_id: number;
    updated_by_user_id: number | null;
    title: string;
    details: string | null;
    created_at: string;
    updater?: Partial<UserDataType> | null;
}

export interface CreateCaseProgressPayload {
    caseId: number;
    title: string;
    details?: string;
    updated_by_user_id?: number;
}

export interface UpdateCaseProgressPayload {
    progressId: number;
    caseId: number;
    title?: string;
    details?: string;
}

// --- API Response Types for Mutations ---
export interface BackendCaseResponse {
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
  tagTypes: ["Cases", "Payments", "CaseAssignments", "CaseProgress"], 
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
    getCasesByClientOwner: builder.query<CaseDataTypes[], { userId: number, includeAssignees?: boolean }>({
      query: ({ userId, includeAssignees }) =>
        `cases/client/${userId}${includeAssignees !== undefined ? `?includeAssignees=${includeAssignees}` : ''}`,
      providesTags: (result, _error, { userId }) =>
        result
          ? [
              ...result.map(({ case_id }) => ({ type: 'Cases' as const, id: case_id })),
              { type: 'Cases', id: `CLIENT_LIST_${userId}` }, 
              { type: 'Cases', id: 'LIST' },
            ]
          : [{ type: 'Cases', id: `CLIENT_LIST_${userId}` }, { type: 'Cases', id: 'LIST' }],
    }),
    getCasesByAssignedStaff: builder.query<CaseDataTypes[], number>({
        query: (staffId) => `cases/staff/${staffId}`,
        providesTags: (result, _error, staffId) =>
        result
            ? [
                ...result.map(({ case_id }) => ({ type: 'Cases' as const, id: case_id })),
                { type: 'Cases', id: `STAFF_LIST_${staffId}` },
                { type: 'Cases', id: 'LIST' }, 
            ]
            : [{ type: 'Cases', id: `STAFF_LIST_${staffId}` }, { type: 'Cases', id: 'LIST' }],
    }),
    getCaseByPayment: builder.query<CaseDataTypes, number>({
        query: (paymentId) => `cases/payment/${paymentId}`,
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
      invalidatesTags: (result) => result ? [{ type: 'Cases', id: result.case_id }, { type: 'Cases', id: 'LIST' }] : [],
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
          { type: 'CaseAssignments', id: `CASE_${case_id}` } 
        ],
    }),
    triggerCaseBalanceUpdate: builder.mutation<CaseDataTypes, number>({
        query: (case_id) => ({
            url: `cases/${case_id}/recalculate-balance`, 
            method: 'POST', 
        }),
        transformResponse: (response: BackendCaseResponse) => response.case,
        invalidatesTags: (result) => result ? [{ type: 'Cases', id: result.case_id }, { type: 'Cases', id: 'LIST' }] : [],
    }),

    // ** Case Assignment Endpoints **
    getAssignedStaffForCase: builder.query<(UserDataType & { assigned_at: string })[], number>({
        query: (caseId) => `cases/${caseId}/assigned-staff`,
        providesTags: (_result, _error, caseId) => [{ type: 'CaseAssignments', id: `CASE_${caseId}` }],
    }),
    assignStaffToCase: builder.mutation<CaseAssigneeData, { caseId: number, staffUserId: number }>({
        query: ({ caseId, staffUserId }) => ({
            url: `cases/${caseId}/assign-staff`,
            method: 'POST',
            body: { staff_user_id: staffUserId }, 
        }),
        transformResponse: (response: BackendAssignmentResponse) => response.assignment,
        invalidatesTags: (_result, _error, { caseId }) => [
            { type: 'Cases', id: caseId }, 
            { type: 'CaseAssignments', id: `CASE_${caseId}` }, 
            { type: 'Cases', id: 'LIST' }
        ],
    }),
    unassignStaffFromCase: builder.mutation<BackendSuccessMessage, { caseId: number, staffId: number }>({
        query: ({ caseId, staffId }) => ({
            url: `cases/${caseId}/assign-staff/${staffId}`, 
            method: 'DELETE',
        }),
        invalidatesTags: (_result, _error, { caseId }) => [
            { type: 'Cases', id: caseId },
            { type: 'CaseAssignments', id: `CASE_${caseId}` },
            { type: 'Cases', id: 'LIST' }
        ],
    }),

    // ** Case Progress Endpoints **
    getCaseProgressForCase: builder.query<CaseProgressData[], number>({
        query: (caseId) => `cases/${caseId}/progress`,
        providesTags: (result, _error, caseId) =>
            result
            ? [
                ...result.map(({ progress_id }) => ({ type: 'CaseProgress' as const, id: progress_id })),
                { type: 'CaseProgress', id: `LIST_FOR_CASE_${caseId}` },
              ]
            : [{ type: 'CaseProgress', id: `LIST_FOR_CASE_${caseId}` }],
    }),
    createCaseProgressRecord: builder.mutation<CaseProgressData, CreateCaseProgressPayload>({
        query: ({ caseId, ...body }) => ({
            url: `cases/${caseId}/progress`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: (_result, _error, { caseId }) => [{ type: 'CaseProgress', id: `LIST_FOR_CASE_${caseId}` }],
    }),
    updateCaseProgressRecord: builder.mutation<CaseProgressData, UpdateCaseProgressPayload>({
        query: ({ progressId, ...body }) => ({
            url: `progress/${progressId}`,
            method: 'PUT',
            body: { title: body.title, details: body.details },
        }),
        invalidatesTags: (_result, _error, { progressId, caseId }) => [
            { type: 'CaseProgress', id: progressId },
            { type: 'CaseProgress', id: `LIST_FOR_CASE_${caseId}` }
        ],
    }),
    deleteCaseProgressRecord: builder.mutation<{ success: boolean; progressId: number }, { progressId: number, caseId: number }>({
        query: ({ progressId }) => ({
            url: `progress/${progressId}`,
            method: 'DELETE',
        }),
        transformResponse: (_response, _meta, arg) => ({
            success: true,
            progressId: arg.progressId
        }),
        invalidatesTags: (_result, _error, { progressId, caseId }) => [
            { type: 'CaseProgress', id: progressId },
            { type: 'CaseProgress', id: `LIST_FOR_CASE_${caseId}` }
        ],
    }),
 
    // ** Payment Endpoints ** 
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
      invalidatesTags: (_result, _error, {case_id}) => [
        {type: 'Payments', id: 'LIST'}, 
        {type: 'Cases', id: case_id},
        {type: 'Cases', id: 'LIST'}
      ],
    }),
    updatePayment: builder.mutation<PaymentDataTypes, Partial<PaymentDataTypes & { payment_id: number }>>({
      query: ({ payment_id, ...rest }) => ({
        url: `payments/${payment_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_r, _e, {payment_id, case_id}) => [
        {type: 'Payments', id: payment_id}, 
        {type: 'Payments', id: 'LIST'}, 
        {type: 'Cases', id: case_id},
        {type: 'Cases', id: 'LIST'}
      ],
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
      invalidatesTags: [{type: 'Payments', id: 'LIST'}, {type: 'Cases', id: 'LIST'}],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchCasesQuery,
  useGetCaseByIdQuery,
  useGetCasesByClientOwnerQuery,    
  useGetCasesByAssignedStaffQuery, 
  useGetCaseByPaymentQuery,        
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  useTriggerCaseBalanceUpdateMutation,
  useGetAssignedStaffForCaseQuery, 
  useAssignStaffToCaseMutation,    
  useUnassignStaffFromCaseMutation,
  useGetCaseProgressForCaseQuery,
  useCreateCaseProgressRecordMutation,
  useUpdateCaseProgressRecordMutation,
  useDeleteCaseProgressRecordMutation,
  useFetchPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = caseAndPaymentAPI;