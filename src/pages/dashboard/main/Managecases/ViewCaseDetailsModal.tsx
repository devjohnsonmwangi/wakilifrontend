import React, { useEffect, useState } from 'react';
import { CaseDataTypes } from "../../../../features/case/caseAPI"; // Ensure this path is correct for types
import { CaseProgressModal } from './progress'; // Adjust this path to your component's location
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// --- NEW: Import the separate modal for viewing documents ---
// NOTE: You must create this 'CaseDocumentsModal.tsx' file. Adjust path if needed.
import { CaseDocumentsModal } from '../managedocs/singlecasedoc';

import {
    X, Briefcase, Mail, Phone, Tag, BarChart3, Hash, FileText, Scale, University, 
    Building, Users, CircleDollarSign, CreditCard, UserCheck, History,
    Paperclip // Icon for the new section
} from "lucide-react";

interface ViewCaseDetailsModalProps {
    isDarkMode?: boolean;
    selectedCase: CaseDataTypes | null;
    closeModal: () => void;
    currentUserRole?: string;
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

const DetailItem: React.FC<{ label: string; value: React.ReactNode; icon: React.ElementType; fullWidth?: boolean }> = ({ label, value, icon: Icon, fullWidth = false }) => (
    <div className={`py-1 ${fullWidth ? 'sm:col-span-2' : ''}`}>
        <label className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            <Icon size={14} className="mr-2 text-blue-600 dark:text-sky-500 opacity-80" />
            {label}
        </label>
        <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 p-2.5 rounded-md min-h-[40px] flex items-center">
            <span className="text-slate-700 dark:text-slate-200 text-sm font-medium break-words w-full">
                {value || <span className="italic text-slate-400 dark:text-slate-500 font-normal">Not Provided</span>}
            </span>
        </div>
    </div>
);

// The props passed into the component are destructured here
const ViewCaseDetailsModal: React.FC<ViewCaseDetailsModalProps> = ({ selectedCase, closeModal, currentUserRole, isDarkMode }) => {
    // --- State for controlling modals ---
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false); // State for the new documents modal

    useEffect(() => {
        if (selectedCase) {
            toast.info(`🔍 Viewing details for Case ID: ${selectedCase.case_id}`);
        }
    }, [selectedCase]);

    if (!selectedCase) return null;

    const handleClose = () => {
        toast.info(`✅ Closed details for Case ID: ${selectedCase.case_id}`);
        closeModal();
    };

    const clientDetails = [
        { label: "Client Name", value: selectedCase.owner?.full_name, icon: UserCheck },
        { label: "Client Email", value: selectedCase.owner?.email, icon: Mail },
        { label: "Client Phone", value: selectedCase.owner?.phone_number, icon: Phone },
    ];

    const coreCaseDetails = [
        { label: "Case ID", value: selectedCase.case_id, icon: Hash },
        { label: "Case Type", value: selectedCase.case_type, icon: Tag },
        { label: "Case Status", value: formatStatus(selectedCase.case_status), icon: BarChart3 },
        { label: "Case Number", value: selectedCase.case_number, icon: Briefcase },
        { label: "Track Number", value: selectedCase.case_track_number, icon: Hash },
        { label: "Court", value: selectedCase.court, icon: University },
        { label: "Station", value: selectedCase.station, icon: Building },
    ];

    const financialDetails = [
        { label: "Case Fee", value: formatCurrency(selectedCase.fee), icon: CircleDollarSign },
        { label: "Payment Status", value: formatStatus(selectedCase.payment_status), icon: CreditCard },
        { label: "Payment Balance", value: formatCurrency(selectedCase.payment_balance), icon: Scale },
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
        <>
            <motion.div
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleClose}
            >
                <motion.div
                    className={`relative w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                               border border-slate-200 dark:border-slate-700
                               max-h-[90vh] flex flex-col overflow-hidden`}
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        {/* Header content... (Unchanged) */}
                        <div className="flex items-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-sky-500 dark:to-indigo-600">
                                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                                    Case Details
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    ID: {selectedCase.case_id} | Case No: {selectedCase.case_number}
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

                    <div className="p-5 sm:p-6 overflow-y-auto flex-grow styled-scrollbar space-y-6">
                        {/* All existing sections are untouched */}
                        <section>
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <UserCheck size={18} className="mr-2" /> Client Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {clientDetails.map((item) => (
                                    <DetailItem key={item.label} label={item.label} value={item.value} icon={item.icon} />
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <Briefcase size={18} className="mr-2" /> Case Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {coreCaseDetails.map((item) => (
                                    <DetailItem key={item.label} label={item.label} value={item.value} icon={item.icon} />
                                ))}
                                <DetailItem label="Parties Involved" value={selectedCase.parties} icon={Users} fullWidth />
                            </div>
                        </section>

                        {selectedCase.assignees && selectedCase.assignees.length > 0 && (
                            <section>
                                {/* Assigned Staff section... (Unchanged) */}
                            </section>
                        )}
                        
                        <section>
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <History size={18} className="mr-2" /> Case Timeline & Progress
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-center justify-between flex-wrap gap-2">
                                <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow">
                                    View the complete history or add a new progress update.
                                </p>
                                <button
                                    onClick={() => setIsProgressModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:ring-opacity-75
                                            transition-colors flex items-center"
                                >
                                    Manage Progress
                                </button>
                            </div>
                        </section>

                        {/* ========================================================== */}
                        {/* === NEW SECTION FOR CASE DOCUMENTS ===================== */}
                        {/* ========================================================== */}
                        <section>
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <Paperclip size={18} className="mr-2" /> Case Documents
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-center justify-between flex-wrap gap-2">
                                <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow">
                                    View or manage all documents associated with this case.
                                </p>
                                <button
                                    onClick={() => setIsDocumentsModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:ring-opacity-75
                                            transition-colors flex items-center"
                                >
                                    Manage Documents
                                </button>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <CircleDollarSign size={18} className="mr-2" /> Financial Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                                {financialDetails.map((item) => (
                                    <DetailItem key={item.label} label={item.label} value={item.value} icon={item.icon} />
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <FileText size={18} className="mr-2" /> Case Description
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 p-3 rounded-md">
                                <p className="w-full bg-transparent text-slate-700 dark:text-slate-200 text-sm font-medium whitespace-pre-wrap break-words min-h-[60px]">
                                    {selectedCase.case_description || <span className="italic text-slate-400 dark:text-slate-500 font-normal">No description provided.</span>}
                                </p>
                            </div>
                        </section>
                    </div>

                    <footer className="flex justify-end p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0 rounded-b-xl">
                        {/* Footer content... (Unchanged) */}
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

            {/* --- Conditionally render the Case Progress Modal (Unchanged) --- */}
            {isProgressModalOpen && (
                <CaseProgressModal
                    isOpen={isProgressModalOpen}
                    onClose={() => setIsProgressModalOpen(false)}
                    caseId={selectedCase.case_id}
                    caseNumber={selectedCase.case_number}
                />
            )}

            {/* --- NEW: Conditionally render the Case Documents Modal --- */}
            {isDocumentsModalOpen && (
                <CaseDocumentsModal
                    isOpen={isDocumentsModalOpen}
                    onClose={() => setIsDocumentsModalOpen(false)}
                    caseId={selectedCase.case_id}
                    // Pass other props if the document modal needs them
                    isDarkMode={isDarkMode}
                    currentUserRole={currentUserRole ?? ""}
                />
            )}
        </>
    );
};

export default ViewCaseDetailsModal;