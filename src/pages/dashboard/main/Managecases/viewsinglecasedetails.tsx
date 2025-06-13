import React, { useEffect, useState } from 'react';
import { CaseDataTypes } from "../../../../features/case/caseAPI";
import { CaseProgressModal } from './progress'; // Adjust this path to your component
import { toast } from 'sonner';
import {
    FaTimes, FaTag,
    FaMoneyBill, FaBriefcase, FaHashtag, FaFileAlt,
    FaBalanceScale, FaUniversity, FaBuilding, FaUsers,
    FaCreditCard, FaDollarSign, FaHistory
} from "react-icons/fa";

interface ViewCaseDetailsModalProps {
    isDarkMode?: boolean; 
    selectedCase: CaseDataTypes | null;
    closeModal: () => void;
    currentUserRole?: string; // Prop to receive the role of the logged-in user
}

// Helper function to format currency
const formatCurrency = (value: string | number | null | undefined, currency: string = 'KES'): string => {
    if (value == null) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return `${currency} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper to format case status and payment status
const formatStatus = (status: string | null | undefined): string => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ViewCaseDetailsModal: React.FC<ViewCaseDetailsModalProps> = ({ selectedCase, closeModal, currentUserRole }) => {
    
    // State to manage the visibility of the CaseProgressModal
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

    useEffect(() => {
        if (selectedCase) {
            toast.info(`🔍 Viewing details for Case ID: ${selectedCase.case_id}`);
        }
    }, [selectedCase]);

    if (!selectedCase) return null;

    // Determine if the user has a read-only role for progress management
    const isReadOnlyUser = currentUserRole === 'client' || currentUserRole === 'user';

    const handleClose = () => {
        toast.info(`✅ Closed details for Case ID: ${selectedCase.case_id}`);
        closeModal();
    };

    const caseDetailsList = [
        { label: "Case ID", value: selectedCase.case_id ?? 'N/A', icon: FaHashtag },
        { label: "Case Type", value: selectedCase.case_type ?? 'N/A', icon: FaTag },
        { label: "Case Status", value: formatStatus(selectedCase.case_status), icon: FaBalanceScale },
        { label: "Case Number", value: selectedCase.case_number ?? 'N/A', icon: FaBriefcase },
        { label: "Track Number", value: selectedCase.case_track_number ?? 'N/A', icon: FaHashtag }, 
        { label: "Court", value: selectedCase.court ?? 'N/A', icon: FaUniversity },
        { label: "Station", value: selectedCase.station ?? 'N/A', icon: FaBuilding },
        { label: "Parties Involved", value: selectedCase.parties ?? 'N/A', icon: FaUsers },
        { label: "Case Fee", value: formatCurrency(selectedCase.fee), icon: FaDollarSign },
        { label: "Payment Status", value: formatStatus(selectedCase.payment_status), icon: FaCreditCard },
        { label: "Payment Balance", value: formatCurrency(selectedCase.payment_balance), icon: FaMoneyBill },
    ];

    return (
        <>
            {/* Modal Overlay */}
            <div 
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Modal Content Box */}
                <div 
                    className={`relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                               border border-slate-200 dark:border-slate-700
                               max-h-[90vh] flex flex-col overflow-hidden`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <div className="flex items-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
                                <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
                                    Case Details
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    ID: {selectedCase.case_id}
                                </p>
                            </div>
                        </div>
                        <button 
                            title="Close modal"
                            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                            onClick={handleClose}
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    </header>

                    {/* Scrollable Content Area */}
                    <div className="p-5 sm:p-6 overflow-y-auto flex-grow styled-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            {caseDetailsList.map((item, index) => (
                                <div key={index} className="py-1">
                                    <label className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                        <item.icon size={14} className="mr-2 text-indigo-600 dark:text-indigo-400 opacity-90" />
                                        {item.label}
                                    </label>
                                    <div className="bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/70 p-3 rounded-lg min-h-[44px] flex items-center shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-slate-700 dark:text-slate-200 text-sm font-medium break-words w-full">
                                            {item.value || <span className="italic text-slate-400 dark:text-slate-500 font-normal">Not Provided</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Case Progress Section */}
                        <div className="mt-6 pt-1">
                            <label className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                <FaHistory size={14} className="mr-2 text-indigo-600 dark:text-indigo-400 opacity-90" />
                                Case Timeline
                            </label>
                            <div className="bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/70 p-4 rounded-lg shadow-sm flex items-center justify-between flex-wrap gap-2">
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {isReadOnlyUser ? 'View the history and progress of your case.' : 'View history or add a new progress update.'}
                                </p>
                                <button
                                    onClick={() => setIsProgressModalOpen(true)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md transition-colors"
                                >
                                    {isReadOnlyUser ? 'View Progress' : 'Manage Progress'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 pt-1">
                            <label className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                <FaFileAlt size={14} className="mr-2 text-indigo-600 dark:text-indigo-400 opacity-90" />
                                Case Description
                            </label>
                            <div className="bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/70 p-3 rounded-lg shadow-sm">
                                <p className="w-full bg-transparent text-slate-700 dark:text-slate-200 text-sm font-medium whitespace-pre-wrap break-words min-h-[60px]">
                                    {selectedCase.case_description || <span className="italic text-slate-400 dark:text-slate-500 font-normal">No description provided.</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <footer className="flex justify-end p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0 rounded-b-xl">
                        <button 
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:ring-opacity-75 
                                       transition-colors flex items-center"
                            onClick={handleClose}
                        >
                            <FaTimes size={16} className="inline mr-2" /> Close
                        </button>
                    </footer>
                </div>
            </div>

            {/* Render the CaseProgressModal conditionally, passing the read-only flag */}
            {isProgressModalOpen && (
                <CaseProgressModal
                    isOpen={isProgressModalOpen}
                    onClose={() => setIsProgressModalOpen(false)}
                    caseId={selectedCase.case_id}
                    caseNumber={selectedCase.case_number}
                    isReadOnly={isReadOnlyUser}
                />
            )}
        </>
    );
};

export default ViewCaseDetailsModal;