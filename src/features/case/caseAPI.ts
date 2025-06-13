import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Ensure this path is correct

// --- Enums
export type CaseType = 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment' | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'Tribunal' | 'conveyances'|'succession';
export type CaseStatus = "open" | "in_progress" | "closed" | "on_hold" | "resolved";
export type PaymentStatusOnCase = "pending" | "partially_paid" | "paid" | "failed" | "refunded" | "overdue"; //  'partially_paid' is valid in backend schema
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"; // For paymentTable

// --- Data Types ---
export interface UserDataType { // Basic user details for owner/assignee
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

// ============================================
//         START: NEW TYPES FOR CASE PROGRESS
// ============================================

export interface CaseProgressData {
    progress_id: number;
    case_id: number;
    updated_by_user_id: number | null;
    title: string;
    details: string | null;
    created_at: string;
    updater?: Partial<UserDataType> | null; // User details if fetched
}

export interface CreateCaseProgressPayload {
    caseId: number; // Used for the URL
    title: string;
    details?: string;
    updated_by_user_id?: number; // The user recording the progress
}

export interface UpdateCaseProgressPayload {
    progressId: number; // Used for the URL
    caseId: number;     // Needed to invalidate the correct list cache
    title?: string;
    details?: string;
}

// ============================================
//         END: NEW TYPES FOR CASE PROGRESS
// ============================================

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
  // ADDED 'CaseProgress' to tagTypes
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

    // ============================================
    //         START: NEW CASE PROGRESS ENDPOINTS
    // ============================================
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
            body: { title: body.title, details: body.details }, // Only send updatable fields
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
        {type: 'Cases', id: case_id}, // Invalidate the specific case
        {type: 'Cases', id: 'LIST'} // And the list
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
  // Case Hooks
  useFetchCasesQuery,
  useGetCaseByIdQuery,
  useGetCasesByClientOwnerQuery,    
  useGetCasesByAssignedStaffQuery, 
  useGetCaseByPaymentQuery,        
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  useTriggerCaseBalanceUpdateMutation,

  // Case Assignment Hooks
  useGetAssignedStaffForCaseQuery, 
  useAssignStaffToCaseMutation,    
  useUnassignStaffFromCaseMutation,

  // === NEW CASE PROGRESS HOOKS ===
  useGetCaseProgressForCaseQuery,
  useCreateCaseProgressRecordMutation,
  useUpdateCaseProgressRecordMutation,
  useDeleteCaseProgressRecordMutation,
  // ==================================

  // Payment Hooks
  useFetchPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = caseAndPaymentAPI;