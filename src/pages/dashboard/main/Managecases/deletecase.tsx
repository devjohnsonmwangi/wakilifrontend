import { Toaster, toast } from 'sonner';
import { caseAndPaymentAPI, CaseDataTypes } from '../../../../features/case/caseAPI';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa'; // Import icons

interface DeleteCaseFormProps {
    caseItem: CaseDataTypes | null;
    isOpen: boolean;
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
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                <Toaster
                    toastOptions={{
                        classNames: {
                            error: 'bg-red-500 text-white',
                            success: 'bg-green-500 text-white',
                            warning: 'bg-yellow-500 text-gray-800',
                            info: 'bg-blue-500 text-white',
                        },
                        style: {
                            border: '1px solid #717171',
                            padding: '16px',
                            color: '#fff',
                        },
                    }}
                />

                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        <span className="text-red-600">Warning!</span> Deleting Case?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        You are about to delete the following case. This action cannot be undone.
                        Please confirm that you want to proceed.
                    </p>
                    <p className="text-red-700 font-bold mb-2">
                        <FaExclamationTriangle className="inline-block mr-1" />
                        All associated data will be permanently lost!
                    </p>
                    <p className="text-orange-700 font-semibold mb-4">
                        <FaExclamationTriangle className="inline-block mr-1" />
                        Are you absolutely sure you want to continue? Take Caution!
                    </p>
                    <p className="text-gray-600 italic mb-4">
                        This process is irreversible. There is no going back!
                    </p>

                </div>

                {caseItem && (
                    <div className="mb-4">
                        <table className="table-auto m-auto w-full">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 font-medium text-gray-700">ID</td>
                                    <td className="border px-4 py-2 text-gray-800">{caseItem.case_id}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-medium text-gray-700">Title</td>
                                    <td className="border px-4 py-2 text-gray-800">{caseItem.case_number}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-medium text-gray-700">Status</td>
                                    <td className="border px-4 py-2 text-gray-800">{caseItem.case_track_number}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-around mt-6">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow"
                        onClick={handleCloseModal}
                    >
                        No, cancel
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow flex items-center"
                        onClick={handleDelete}
                    >
                        <FaTrashAlt className="mr-2" /> Yes, I confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCaseForm;