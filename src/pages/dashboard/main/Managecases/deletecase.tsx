import {  toast } from 'sonner';
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
        // Overlay container:
        // - `p-4` or `px-4` adds padding on all sides or just horizontally.
        //   This padding will create the "margin" effect for the modal content on small screens.
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-60 flex items-center justify-center p-4 sm:p-6"> {/* Added p-4 for padding, sm:p-6 for larger screens */}
            {/* Modal Content Box */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"> {/* mx-auto is good for centering if not using flex on parent */}
                
                {/* 
                    Toaster Placement:
                    It's generally recommended to have ONE <Toaster /> instance at the root of your application 
                    (e.g., in App.tsx or your main layout component) rather than inside each modal.
                    If you must have it here, ensure it doesn't conflict with a global Toaster.
                */}
                {/* 
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
                */}


                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        <span className="text-red-600">Warning!</span> Deleting Case?
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base"> {/* Responsive text size */}
                        You are about to delete the following case. This action cannot be undone.
                        Please confirm that you want to proceed.
                    </p>
                    <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
                        <p className="text-red-700 font-bold mb-1 text-sm sm:text-base">
                            <FaExclamationTriangle className="inline-block mr-1" />
                            All associated data will be permanently lost!
                        </p>
                        <p className="text-orange-700 font-semibold text-sm sm:text-base">
                            <FaExclamationTriangle className="inline-block mr-1" />
                            Are you absolutely sure? Take Caution!
                        </p>
                    </div>
                    <p className="text-gray-500 italic text-xs sm:text-sm mb-4">
                        This process is irreversible. There is no going back!
                    </p>

                </div>

                {caseItem && (
                    <div className="mb-4 border border-gray-200 rounded-md p-3 bg-slate-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">Case to be Deleted:</h4>
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-2 py-2 font-medium text-gray-600">ID:</td>
                                    <td className="px-2 py-2 text-gray-800">{caseItem.case_id}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-2 py-2 font-medium text-gray-600">Case No:</td> {/* Assuming case_number is more like a title/identifier */}
                                    <td className="px-2 py-2 text-gray-800">{caseItem.case_number}</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 font-medium text-gray-600">Track No:</td> {/* Assuming case_track_number is the status-like field */}
                                    <td className="px-2 py-2 text-gray-800">{caseItem.case_track_number}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Button container with flex-col for mobile and flex-row for sm and up */}
                <div className="flex flex-col sm:flex-row sm:justify-around gap-3 mt-6">
                    <button
                        className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-md shadow transition-colors duration-150"
                        onClick={handleCloseModal}
                    >
                        No, Cancel
                    </button>
                    <button
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md shadow flex items-center justify-center transition-colors duration-150"
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