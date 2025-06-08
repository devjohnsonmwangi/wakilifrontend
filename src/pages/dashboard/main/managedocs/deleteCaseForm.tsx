import { Toaster, toast } from 'sonner';

import { caseDocumentAPI, CaseDocumentDataTypes } from '../../../../features/casedocument/casedocmentapi';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';

interface DeleteCaseFormProps {
    caseItem: CaseDocumentDataTypes | null; 
    onClose: () => void;
    refetch: () => void;
    isDarkMode?: boolean;
    isLibraryItem?: boolean; 
}

export const DeleteCaseForm = ({
    caseItem,
    onClose,
    refetch,
    isDarkMode = false,
    isLibraryItem = false // Default to false if not provided
}: DeleteCaseFormProps) => {
    
    const [deleteDocument, { isLoading: isDeleting }] = caseDocumentAPI.useDeleteCaseDocumentMutation();

    const handleDelete = async () => {
        if (caseItem) {
            try {
                await deleteDocument(caseItem.document_id).unwrap();
                toast.success('Document deleted successfully!', { duration: 3000 });
                onClose();
                refetch();
            } catch (err) {
                console.error("Error deleting document:", err);
                
                type APIError = {
                    data?: {
                        detail?: string;
                        message?: string;
                    };
                    message?: string;
                };
                const errorObj = err as APIError;
                const errorMessage =
                    errorObj?.data?.detail ||
                    errorObj?.data?.message ||
                    errorObj?.message ||
                    'Failed to delete document.';
                toast.error(`${errorMessage} Please check your network and try again.`, { duration: 5000 });
            }
        } else {
            toast.error('No document selected for deletion. Please select a document and try again.', { duration: 5000 });
        }
    };

    // Toast styles can be defined globally 
    // const toastStyles = {
    //     error: 'bg-red-500 text-white',
    //     success: 'bg-green-500 text-white',
    // };

    const displayCaseId = caseItem?.case_id !== null && caseItem?.case_id !== undefined;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[80vh] sm:max-h-[70vh] flex flex-col">
            
            <Toaster
                position="top-center" 
                richColors
                theme={isDarkMode ? 'dark' : 'light'}
                // toastOptions={{ classNames: toastStyles }} 
            />

            <div className="flex-grow overflow-y-auto p-6">
                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        <span className="text-red-600 dark:text-red-400">Confirm Deletion</span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        You are about to permanently delete the document:
                        <br />
                        <strong className="text-gray-700 dark:text-gray-200">
                            {caseItem?.document_name || 'N/A'}
                        </strong>.
                        <br />
                        This action cannot be undone.
                    </p>
                    {isLibraryItem && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
                            This document is part of the general library.
                        </p>
                    )}
                    <p className="text-red-700 dark:text-red-400 font-bold mb-2">
                        <FaExclamationTriangle className="inline-block mr-1" />
                        All associated data for this document entry will be lost!
                    </p>
                </div>

                {caseItem && (
                    <div className="mb-4 mt-4 border-t border-b border-gray-200 dark:border-gray-700 py-4">
                        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">Document Details:</h4>
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="px-2 py-1 font-medium text-gray-600 dark:text-gray-400 text-right">Document ID:</td>
                                    <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{caseItem.document_id}</td>
                                </tr>
                                {displayCaseId && !isLibraryItem && ( // Show Case ID only if it exists and it's not explicitly a library item
                                    <tr>
                                        <td className="px-2 py-1 font-medium text-gray-600 dark:text-gray-400 text-right">Case ID:</td>
                                        <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{caseItem.case_id}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="px-2 py-1 font-medium text-gray-600 dark:text-gray-400 text-right">Name:</td>
                                    <td className="px-2 py-1 text-gray-800 dark:text-gray-100 break-all">{caseItem.document_name}</td>
                                </tr>
                                {caseItem.file_size !== undefined && (
                                    <tr>
                                        <td className="px-2 py-1 font-medium text-gray-600 dark:text-gray-400 text-right">Size:</td>
                                        <td className="px-2 py-1 text-gray-800 dark:text-gray-100">
                                            {(caseItem.file_size / 1024 / 1024).toFixed(2)} MB
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="px-2 py-1 font-medium text-gray-600 dark:text-gray-400 text-right">Last Updated:</td>
                                    <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{new Date(caseItem.updated_at).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                 <p className="text-orange-700 dark:text-orange-400 font-semibold mb-4 text-center">
                    <FaExclamationTriangle className="inline-block mr-1" />
                    Are you absolutely sure? This is irreversible.
                </p>
            </div>

            <div className="shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
                <button
                    type="button"
                    className="w-full sm:w-auto order-2 sm:order-1 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100 font-semibold py-2 px-4 rounded shadow transition-colors duration-150"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold py-2 px-4 rounded shadow flex items-center justify-center transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                    disabled={isDeleting || !caseItem}
                >
                    {isDeleting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                        </>
                    ) : (
                        <>
                            <FaTrashAlt className="mr-2" /> Confirm Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DeleteCaseForm;