// src/features/documents/caseDocumentAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
// ACTION REQUIRED: Make sure this path points to your Redux store configuration
import type { RootState } from "../../app/store";

// A simple interface for the nested case details returned by the API
export interface CaseDetails {
    case_id: number;
    case_number: string;
    parties: string;
    user_id: number;
    created_at: string;
}

// The main interface for a document, now including the optional nested case object
export interface CaseDocument {
    document_id: number;
    case_id: number | null; 
    document_name: string; 
    document_url: string; 
    mime_type: string; 
    file_size: number; 
    updated_at: string; 
    checksum: string; 
    case?: CaseDetails | null; // The nested case object from the API
}

// API Slice for Case Documents
export const caseDocumentAPI = createApi({
    reducerPath: "caseDocumentAPI",
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
    tagTypes: ["Document"],
    endpoints: (builder) => ({
        // Fetch all case documents
        fetchCaseDocuments: builder.query<CaseDocument[], void>({
            query: () => "documents",
            providesTags: ["Document"],
        }),

        // Fetch case document by ID (returns a Blob for direct download)
        getCaseDocumentById: builder.query<Blob, number>({
            query: (document_id) => ({
                url: `documents/${document_id}`,
                responseHandler: (response) => response.blob(), // Handle as a blob for download
            }),
            providesTags: (_result, _error, document_id) => [{ type: "Document", id: document_id }],
        }),
        
        /**
         * Fetches all documents associated with a specific case ID.
         * @param case_id - The ID of the case.
         */
        fetchCaseDocumentsByCaseId: builder.query<CaseDocument[], number>({
            query: (case_id) => `documents/case/${case_id}`,
            providesTags: ["Document"],
        }),

        // Create a new case document
        createCaseDocument: builder.mutation<CaseDocument, FormData>({
            query: (newDocumentFormData) => ({
                url: "documents",
                method: "POST",
                body: newDocumentFormData, // FormData is sent directly
            }),
            invalidatesTags: ["Document"],
        }),

        // Update an existing case document
        updateCaseDocument: builder.mutation<CaseDocument, { document_id: number; formData: FormData }>({
            query: ({ document_id, formData }) => ({
                url: `documents/${document_id}`,
                method: "PUT",
                body: formData, // Send FormData for updates
            }),
            invalidatesTags: ["Document"],
        }),
        
        // Delete a case document
        deleteCaseDocument: builder.mutation<{ success: boolean; document_id: number }, number>({
            query: (document_id) => ({
                url: `documents/${document_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Document"],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useFetchCaseDocumentsQuery,
    useGetCaseDocumentByIdQuery,
    useFetchCaseDocumentsByCaseIdQuery,
    useCreateCaseDocumentMutation,
    useUpdateCaseDocumentMutation,
    useDeleteCaseDocumentMutation,
} = caseDocumentAPI;