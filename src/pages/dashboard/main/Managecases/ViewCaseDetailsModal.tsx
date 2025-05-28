import React, { useEffect } from 'react';
import { CaseDataTypes } from "../../../../features/case/caseAPI";
import { toast } from 'sonner'; // Global Toaster assumed
import { motion } from 'framer-motion';
import { 
    X, Briefcase, User, Mail, Phone, Tag, BarChart3, Hash, FileText, Scale, University, Building, Users, CircleDollarSign, CreditCard 
} from "lucide-react"; // Using Lucide icons

interface ViewCaseDetailsModalProps {
    isDarkMode?: boolean; // Prop from parent
    selectedCase: CaseDataTypes | null;
    closeModal: () => void;
}

// Helper function to format currency
const formatCurrency = (value: string | number | null | undefined, currency: string = 'KES'): string => {
    if (value == null) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return String(value); // Return original value if not a number (e.g. "Pending")
    return `${currency} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper to format case status and payment status
const formatStatus = (status: string | null | undefined): string => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ViewCaseDetailsModal: React.FC<ViewCaseDetailsModalProps> = ({ selectedCase, closeModal, }) => {
    
    useEffect(() => {
        if (selectedCase) {
            // Optional: Toast notification when modal opens
            toast.info(`🔍 Viewing details for Case ID: ${selectedCase.case_id}`);
        }
    }, [selectedCase]);

    if (!selectedCase) return null;

    const handleClose = () => {
        // Optional: Toast notification when modal closes
        toast.info(`✅ Closed details for Case ID: ${selectedCase.case_id}`);
        closeModal();
    };

    const caseDetailsList = [
        { label: "Case ID", value: selectedCase.case_id ?? 'N/A', icon: Hash },
        { label: "Client Name", value: selectedCase.user?.full_name ?? 'N/A', icon: User },
        { label: "Client Email", value: selectedCase.user?.email ?? 'N/A', icon: Mail },
        { label: "Client Phone", value: selectedCase.user?.phone_number ?? 'N/A', icon: Phone },
        { label: "Case Type", value: selectedCase.case_type ?? 'N/A', icon: Tag },
        { label: "Case Status", value: formatStatus(selectedCase.case_status), icon: BarChart3 },
        { label: "Case Number", value: selectedCase.case_number ?? 'N/A', icon: Briefcase }, // Changed icon
        { label: "Track Number", value: selectedCase.case_track_number ?? 'N/A', icon: Hash },
        { label: "Court", value: selectedCase.court ?? 'N/A', icon: University },
        { label: "Station", value: selectedCase.station ?? 'N/A', icon: Building },
        { label: "Parties Involved", value: selectedCase.parties ?? 'N/A', icon: Users },
        { label: "Case Fee", value: formatCurrency(selectedCase.fee), icon: CircleDollarSign },
        { label: "Payment Status", value: formatStatus(selectedCase.payment_status), icon: CreditCard },
        { label: "Payment Balance", value: formatCurrency(selectedCase.payment_balance), icon: Scale }, // Changed icon
    ];

    const modalVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose} // Close on backdrop click
        >
            <motion.div
                className={`relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                           border border-slate-200 dark:border-slate-700
                           max-h-[90vh] flex flex-col overflow-hidden`}
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            >
                {/* Modal Header */}
                <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-sky-500 dark:to-indigo-600">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                                Case Details
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                ID: {selectedCase.case_id}
                            </p>
                        </div>
                    </div>
                    <button 
                        title="Close modal"
                        className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500"
                        onClick={handleClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                {/* Scrollable Content Area */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-grow styled-scrollbar"> {/* Add styled-scrollbar if you have custom scrollbar styles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        {caseDetailsList.map((item, index) => (
                            <div key={index} className="py-1">
                                <label className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    <item.icon size={14} className="mr-2 text-blue-600 dark:text-sky-500 opacity-80" />
                                    {item.label}
                                </label>
                                <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 p-2.5 rounded-md min-h-[40px] flex items-center">
                                    <span className="text-slate-700 dark:text-slate-200 text-sm font-medium break-words w-full">
                                        {item.value || <span className="italic text-slate-400 dark:text-slate-500 font-normal">Not Provided</span>}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-1">
                        <label className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            <FileText size={14} className="mr-2 text-blue-600 dark:text-sky-500 opacity-80" />
                            Case Description
                        </label>
                        <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 p-3 rounded-md">
                            <p className="w-full bg-transparent text-slate-700 dark:text-slate-200 text-sm font-medium whitespace-pre-wrap break-words min-h-[60px]"> {/* Use <p> for better text flow */}
                                {selectedCase.case_description || <span className="italic text-slate-400 dark:text-slate-500 font-normal">No description provided.</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <footer className="flex justify-end p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0 rounded-b-xl">
                    <motion.button 
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-md 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:ring-opacity-75 
                                   transition-colors flex items-center"
                        onClick={handleClose}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <X size={18} className="inline mr-1.5" /> Close
                    </motion.button>
                </footer>
            </motion.div>
        </motion.div>
    );
};

export default ViewCaseDetailsModal;