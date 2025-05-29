import { Toaster, toast } from 'sonner';
import { caseDocumentAPI, CaseDocumentDataTypes } from '../../../../features/casedocument/casedocmentapi';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';

interface DeleteCaseFormProps {
    caseItem: CaseDocumentDataTypes | null;
    onClose: () => void;
    refetch: () => void;
    isDarkMode?: boolean;
}

const DeleteCaseForm = ({ caseItem, onClose, refetch, isDarkMode = false }: DeleteCaseFormProps) => {
    const [deleteCase] = caseDocumentAPI.useDeleteCaseDocumentMutation();

    const handleDelete = async () => {
        if (caseItem) {
            try {
                await deleteCase(caseItem.document_id).unwrap();
                toast.success('Document deleted successfully!', { duration: 3000 });
                onClose();
                refetch();
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete document. Please check your network and try again.', { duration: 5000 });
            }
        } else {
            toast.error('No document selected for deletion. Please select a document and try again.', { duration: 5000 });
        }
    };

    const toastStyles = {
        error: 'bg-red-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    return (
        // Main modal container:
        // - max-h-[70vh]: Limits height to 70% of viewport height.
        // - flex flex-col: Allows separation of content and footer.
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[70vh] flex flex-col">
            {/* Toaster is generally portalled, so its position here is mostly for component organization */}
            <Toaster
                theme={isDarkMode ? 'dark' : 'light'}
                toastOptions={{ classNames: toastStyles }}
            />

            {/* Scrollable Content Area:
                - flex-grow: Takes available vertical space.
                - overflow-y-auto: Enables vertical scroll if content exceeds space.
                - p-6: Padding for the content.
            */}
            <div className="flex-grow overflow-y-auto p-6">
                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        <span className="text-red-600 dark:text-red-400">Warning!</span> Deleting Document?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        You are about to delete the following document. This action cannot be undone.
                        Please confirm that you want to proceed.
                    </p>
                    <p className="text-red-700 dark:text-red-400 font-bold mb-2">
                        <FaExclamationTriangle className="inline-block mr-1" />
                        All associated data will be permanently lost!
                    </p>
                    <p className="text-orange-700 dark:text-orange-400 font-semibold mb-4">
                        <FaExclamationTriangle className="inline-block mr-1" />
                        Are you absolutely sure you want to continue? Take Caution!
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                        This process is irreversible. There is no going back!
                    </p>
                </div>

                {caseItem && (
                    // mb-4 remains to give space below the table within the scrollable content
                    <div className="mb-4">
                        <table className="table-auto m-auto w-full">
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Document ID</td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">{caseItem.document_id}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Case ID</td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">{caseItem.case_id}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Name</td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">{caseItem.document_name}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Size</td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">{caseItem.file_size} bytes</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Updated At</td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">{new Date(caseItem.updated_at).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Fixed Footer with Buttons:
                - shrink-0: Prevents this section from shrinking.
                - p-6: Padding for the button area.
                - border-t: Adds a separator line.
            */}
            <div className="shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-around">
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100 font-semibold py-2 px-4 rounded shadow"
                    onClick={onClose}
                >
                    No, cancel
                </button>
                <button
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold py-2 px-4 rounded shadow flex items-center"
                    onClick={handleDelete}
                >
                    <FaTrashAlt className="mr-2" /> Yes, I confirm
                </button>
            </div>
        </div>
    );
};

export default DeleteCaseForm;