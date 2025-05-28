import { toast } from 'sonner';
import { caseAndPaymentAPI, CaseDataTypes } from '../../../../features/case/caseAPI';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa'; // Import icons

interface DeleteCaseFormProps {
    caseItem: CaseDataTypes | null;
    isOpen: boolean;
    isDarkMode?: boolean; // Optional prop for dark mode awareness, styling handled by Tailwind dark: variants
    onClose: () => void;
    refetch: () => void;
}

const DeleteCaseForm = ({ caseItem, isOpen, onClose, refetch }: DeleteCaseFormProps) => {
    const [deleteCase] = caseAndPaymentAPI.useDeleteCaseMutation();

    const handleDelete = async () => {
        if (caseItem) {
            try {
                await deleteCase(caseItem.case_id).unwrap();
                toast.success('Case deleted successfully!', { duration: 3000 });
                onClose(); // Close the modal
                refetch();

            } catch (err) {
                console.error(err);
                toast.error('Failed to delete case. Please check your network and try again.', { duration: 5000 });
            }
        } else {
            toast.error('No case selected for deletion. Please select a case and try again.', { duration: 5000 });
        }
    };

    const handleCloseModal = () => {
        onClose(); // Close the modal
        toast.warning('Deletion cancelled.', { duration: 2000 });
    };

    if (!isOpen) return null;  // Don't render if not open

    return (
        // Overlay container
        <div className="fixed inset-0 z-50 overflow-auto bg-black/60 dark:bg-black/70 flex items-center justify-center p-4 sm:p-6">
            {/* Modal Content Box */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl dark:shadow-slate-900/50 p-6 w-full max-w-md">
                
                {/* Toaster comment remains as is */}
                {/* 
                <Toaster
                    toastOptions={{
                        // ...
                    }}
                /> 
                */}

                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">
                        <span className="text-red-600 dark:text-red-400">Warning!</span> Deleting Case?
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 mb-4 text-sm sm:text-base">
                        You are about to delete the following case. This action cannot be undone.
                        Please confirm that you want to proceed.
                    </p>
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-3 rounded-md mb-4">
                        <p className="text-red-700 dark:text-red-300 font-bold mb-1 text-sm sm:text-base">
                            <FaExclamationTriangle className="inline-block mr-1" />
                            All associated data will be permanently lost!
                        </p>
                        <p className="text-orange-700 dark:text-orange-400 font-semibold text-sm sm:text-base">
                            <FaExclamationTriangle className="inline-block mr-1" />
                            Are you absolutely sure? Take Caution!
                        </p>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 italic text-xs sm:text-sm mb-4">
                        This process is irreversible. There is no going back!
                    </p>
                </div>

                {caseItem && (
                    <div className="mb-4 border border-gray-200 dark:border-slate-700 rounded-md p-3 bg-slate-50 dark:bg-slate-700/40">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2 text-center">Case to be Deleted:</h4>
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr className="border-b border-gray-200 dark:border-slate-600">
                                    <td className="px-2 py-2 font-medium text-gray-600 dark:text-slate-300">ID:</td>
                                    <td className="px-2 py-2 text-gray-800 dark:text-slate-100">{caseItem.case_id}</td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-slate-600">
                                    <td className="px-2 py-2 font-medium text-gray-600 dark:text-slate-300">Case No:</td>
                                    <td className="px-2 py-2 text-gray-800 dark:text-slate-100">{caseItem.case_number}</td>
                                </tr>
                                <tr className="border-gray-200 dark:border-transparent"> {/* Last row, no bottom border or transparent for dark if preferred */}
                                    <td className="px-2 py-2 font-medium text-gray-600 dark:text-slate-300">Track No:</td>
                                    <td className="px-2 py-2 text-gray-800 dark:text-slate-100">{caseItem.case_track_number}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-around gap-3 mt-6">
                    <button
                        className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-md shadow transition-colors duration-150"
                        onClick={handleCloseModal}
                    >
                        No, Cancel
                    </button>
                    <button
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white font-semibold py-2.5 px-4 rounded-md shadow flex items-center justify-center transition-colors duration-150"
                        onClick={handleDelete}
                    >
                        <FaTrashAlt className="mr-2" /> Yes, I Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCaseForm;