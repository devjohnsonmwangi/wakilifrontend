// src/pages/dashboard/main/Managecases/ViewCaseDetailsModal.tsx

import React, { useEffect } from 'react';
// UserDataType and CaseAssigneeData are part of CaseDataTypes from caseAPI
// If CaseDataTypes is properly defined in caseAPI.ts to include these,
// direct imports here might not be strictly necessary for this file's direct use,
// but they help in understanding the structure of CaseDataTypes.
// For now, let's assume CaseDataTypes from caseAPI implicitly uses them.
import { CaseDataTypes /*, UserDataType, CaseAssigneeData */ } from "../../../../features/case/caseAPI";
// import { toast } from 'sonner'; // Removed if not used, or uncomment if you add toast calls
import { motion } from 'framer-motion';
import {
    X, Briefcase, /* User, // Removed as UserCheck is used */ Mail, Phone, Tag, BarChart3, Hash, FileText, Scale, University, Building, Users, CircleDollarSign, CreditCard, UserCheck
} from "lucide-react";

interface ViewCaseDetailsModalProps {
    isDarkMode?: boolean;
    selectedCase: CaseDataTypes | null;
    closeModal: () => void;
    currentUserRole?: string; // Kept for potential future use or if sub-components need it
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

const ViewCaseDetailsModal: React.FC<ViewCaseDetailsModalProps> = ({ selectedCase, closeModal, currentUserRole }) => {
    // 'currentUserRole' is passed but not directly used in this component's rendering logic yet.
    // It's kept in case you want to add role-specific views or actions within this modal later.
    // If not, you can remove it from props and its passing point.

    useEffect(() => {
        if (selectedCase) {
            // console.log(`Viewing details for Case ID: ${selectedCase.case_id}, Role: ${currentUserRole}`); // Example use of currentUserRole
            // toast.info(`🔍 Viewing details for Case ID: ${selectedCase.case_id}`); // Re-enable if needed
        }
    }, [selectedCase, currentUserRole]); // Added currentUserRole to dependency array if used in useEffect

    if (!selectedCase) return null;

    const handleClose = () => {
        // toast.info(`✅ Closed details for Case ID: ${selectedCase.case_id}`); // Re-enable if needed
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
                            <h3 className="text-md font-semibold text-blue-700 dark:text-sky-400 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700 flex items-center">
                                <Users size={18} className="mr-2" /> Assigned Staff
                            </h3>
                            <div className="space-y-2">
                                {selectedCase.assignees.map((assignment, index) => (
                                    <div key={assignment.assignee_user_id || index} className="bg-slate-100 dark:bg-slate-700/60 p-2.5 rounded-md text-sm">
                                        <p className="font-medium text-slate-700 dark:text-slate-200">
                                            {assignment.assignee?.full_name || 'Unknown Staff'}
                                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({assignment.assignee?.role || 'N/A'})</span>
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Assigned on: {new Date(assignment.assigned_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

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