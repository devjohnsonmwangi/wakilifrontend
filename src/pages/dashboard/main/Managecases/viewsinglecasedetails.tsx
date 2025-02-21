import { 
    FaTimes,  FaTag, 
    FaMoneyBill, FaReceipt, FaHashtag, FaFileAlt, 
    FaBalanceScale, FaUniversity, FaBuilding, FaUsers
} from "react-icons/fa";
import { CaseDataTypes } from "../../../../features/case/caseAPI";
import { Toaster, toast } from 'sonner';

interface ViewCaseDetailsModalProps {
    selectedCase: CaseDataTypes | null;
    closeModal: () => void;
}

const ViewCaseDetailsModal: React.FC<ViewCaseDetailsModalProps> = ({ selectedCase, closeModal }) => {
    if (!selectedCase) return null;

    // Handle close with toaster
    const handleClose = () => {
        toast.success("Case details modal closed.");
        closeModal();
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-30 bg-black bg-opacity-40 backdrop-blur-sm">
                <div className="relative bg-white shadow-xl rounded-xl p-6 w-full md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-auto">

                    {/* Close Button */}
                    <button 
                        title="close modal"
                        className="absolute top-3 right-3 p-2 rounded-full bg-gray-300 hover:bg-red-500 hover:text-white transition-all"
                        onClick={handleClose}
                    >
                        <FaTimes className="text-lg" />
                    </button>

                    {/* Modal Header */}
                    <h2 className="text-2xl font-bold text-white bg-blue-600 p-4 rounded-t-xl text-center shadow-md transition-all duration-300 hover:opacity-90">
                        Case Details
                    </h2>

                    {/* Case Details - Floating Inputs with Icons in Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {[
                            { label: "Case ID", value: selectedCase.case_id, icon: FaHashtag },
                            
                       
                            
                            { label: "Case Type", value: selectedCase.case_type, icon: FaTag },
                            { label: "Case Status", value: selectedCase.case_status, icon: FaBalanceScale },
                            { label: "Case Number", value: selectedCase.case_number, icon: FaReceipt },
                            { label: "Track Number", value: selectedCase.case_track_number, icon: FaHashtag },
                            { label: "Court", value: selectedCase.court, icon: FaUniversity },
                            { label: "Station", value: selectedCase.station, icon: FaBuilding },
                            { label: "Parties Involved", value: selectedCase.parties, icon: FaUsers },
                            { label: "Fee", value: `Ksh ${selectedCase.fee}`, icon: FaMoneyBill},
                            { label: "Payment Status", value: selectedCase.payment_status, icon: FaTag },
                        ].map((item, index) => (
                            <div key={index}>
                                {/* Title with Icon */}
                                <label className="flex items-center text-blue-600 font-semibold mb-1">
                                    <item.icon className="mr-2" />
                                    {item.label}
                                </label>
                                {/* Floating Field */}
                                <div className="bg-gray-100 p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-200 hover:shadow-lg hover:font-semibold">
                                    <span className="text-gray-800">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Description Field - No Border */}
                    <div className="mt-6">
                        <label className="flex items-center text-blue-600 font-semibold mb-1">
                            <FaFileAlt className="mr-2" />
                            Case Description
                        </label>
                        <div className="relative bg-gray-100 p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-200 hover:shadow-lg">
                            <textarea
                               title="description"
                                value={selectedCase.case_description || "No description provided"}
                                readOnly
                                className="w-full p-3 h-28 bg-transparent resize-none text-gray-800 outline-none"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center mt-6">
                        <button 
                            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg hover:opacity-80 transition-all"
                            onClick={handleClose}
                        >
                            <FaTimes className="inline mr-2" /> Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewCaseDetailsModal;
