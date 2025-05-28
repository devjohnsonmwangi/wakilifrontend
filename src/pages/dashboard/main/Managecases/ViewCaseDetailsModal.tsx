import {
    FaTimes, FaUser, FaEnvelope, FaPhone, FaTag,
    FaMoneyBill, FaReceipt, FaHashtag, FaFileAlt,
    FaBalanceScale, FaUniversity, FaBuilding, FaUsers,
    FaMoneyCheckAlt
} from "react-icons/fa";
import { CaseDataTypes } from "../../../../features/case/caseAPI";
import {  toast } from 'sonner'; // Ensure toast is imported
import { useEffect } from "react"; // Import useEffect for on-open toast

interface ViewCaseDetailsModalProps {
    isDarkMode?: boolean; // Optional prop for dark mode
    selectedCase: CaseDataTypes | null;
    closeModal: () => void;
}

// Helper function to format currency
const formatCurrency = (value: string | number | null | undefined, currency: string = 'KES'): string => {
    if (value == null) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return `${currency} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper to format case status
const formatCaseStatus = (status: string | null | undefined): string => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ViewCaseDetailsModal: React.FC<ViewCaseDetailsModalProps> = ({ selectedCase, closeModal }) => {
    
    useEffect(() => {
        if (selectedCase) {
            toast.success(`🔍 Viewing details for Case ID: ${selectedCase.case_id}`);
        }
    }, [selectedCase]); // Dependency array ensures this runs when selectedCase changes (i.e., modal opens with new data)

    if (!selectedCase) return null; // Guard clause: if no selected case, render nothing

    const handleClose = () => {
        toast.success(`✅ Closed details for Case ID: ${selectedCase.case_id}`);
        closeModal();
    };

    const caseDetailsList = [
        { label: "Case ID", value: selectedCase.case_id ?? 'N/A', icon: FaHashtag },
        { label: "Full Name", value: selectedCase.user?.full_name ?? 'N/A', icon: FaUser },
        { label: "Email", value: selectedCase.user?.email ?? 'N/A', icon: FaEnvelope },
        { label: "Phone", value: selectedCase.user?.phone_number ?? 'N/A', icon: FaPhone },
        { label: "Case Type", value: selectedCase.case_type ?? 'N/A', icon: FaTag },
        { label: "Case Status", value: formatCaseStatus(selectedCase.case_status), icon: FaBalanceScale },
        { label: "Case Number", value: selectedCase.case_number ?? 'N/A', icon: FaReceipt },
        { label: "Track Number", value: selectedCase.case_track_number ?? 'N/A', icon: FaHashtag },
        { label: "Court", value: selectedCase.court ?? 'N/A', icon: FaUniversity },
        { label: "Station", value: selectedCase.station ?? 'N/A', icon: FaBuilding },
        { label: "Parties Involved", value: selectedCase.parties ?? 'N/A', icon: FaUsers },
        { label: "Fee", value: formatCurrency(selectedCase.fee), icon: FaMoneyBill},
        { label: "Payment Status", value: formatCaseStatus(selectedCase.payment_status), icon: FaTag },
        { label: "Payment Balance", value: formatCurrency(selectedCase.payment_balance), icon: FaMoneyCheckAlt },
    ];

    return (
        <>
            {/* Ensure Toaster is rendered at a higher level in your app, e.g., App.tsx or layout component. 
                If it's only for this modal, placing it here is fine, but it might conflict if other Toasters exist.
                Typically, you have one <Toaster /> instance in your app.
            */}
            {/* <Toaster position="top-right" richColors /> */} 
            
            {/* Modal Overlay */}
            <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
                
                {/* Modal Content Box */}
                <div 
                    className="relative bg-slate-100 shadow-2xl rounded-lg 
                               w-11/12 sm:w-5/6 md:w-3/5 lg:w-[550px] xl:w-[600px]  
                               max-h-[90vh] flex flex-col"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-300">
                        <h2 className="text-xl md:text-2xl font-bold text-indigo-800">
                            Case Details
                        </h2>
                        <button 
                            title="Close modal"
                            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-300 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={handleClose}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="p-5 md:p-6 overflow-y-auto flex-grow bg-slate-50">
                        {/* Case Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            {caseDetailsList.map((item, index) => (
                                <div key={index} className="group">
                                    <label className="flex items-center text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                        <item.icon className="mr-2 text-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                                        {item.label}
                                    </label>
                                    <div 
                                        className="bg-white border border-slate-300 p-3 rounded-md shadow 
                                                   min-h-[44px] flex items-center group-hover:border-indigo-400 
                                                   group-hover:shadow-lg transition-all duration-200"
                                    >
                                        <span className="text-slate-800 text-sm font-medium break-words w-full">
                                            {item.value || <span className="italic text-slate-500 font-normal">Not Provided</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description Field */}
                        <div className="mt-6 group">
                            <label className="flex items-center text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                <FaFileAlt className="mr-2 text-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                                Case Description
                            </label>
                            <div 
                                className="bg-white border border-slate-300 p-3 rounded-md shadow 
                                           group-hover:border-indigo-400 group-hover:shadow-lg transition-all duration-200"
                            >
                                <textarea
                                   title="Case Description"
                                   value={selectedCase.case_description || ""}
                                   readOnly
                                   rows={4}
                                   className="w-full bg-transparent resize-none text-slate-800 text-sm font-medium outline-none placeholder-slate-500"
                                   placeholder="No description provided."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end p-5 md:p-6 border-t border-slate-300 bg-slate-200 rounded-b-lg">
                        <button 
                            className="px-5 py-2.5 bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-md 
                                       hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 
                                       focus:ring-opacity-75 transition-colors flex items-center"
                            onClick={handleClose}
                        >
                            <FaTimes className="inline mr-1.5 text-base" /> Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewCaseDetailsModal;