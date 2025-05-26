// src/components/PaymentHistory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import CashPaymentModal from './cash'; // Assuming this is for automated cash recording or a different flow
import MpesaPayment from './mpesa';   // Assuming this is for automated M-Pesa STK push
import StripePaymentModal from './stripe'; // Assuming this is for automated Stripe checkout
import ManualPaymentEntryModal from './recordpayment'; // Import the new modal

import {
    useFetchPaymentsQuery,
    // useDeletePaymentMutation
} from '../../../../features/payment/paymentAPI';
// import { toast } from "sonner";
import { format } from 'date-fns';
import {
    PlusCircle,
    ListFilter,
    RotateCcw,
    ChevronDown,
    X,
    Search,
    CalendarDays,
    DollarSign,
    Fingerprint,
    User,
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    CreditCard,
    Activity,
    Eye,
    Download,
    Edit3, // Icon for Manual Entry
} from 'lucide-react';

// Define the PaymentDataTypes interface - ENSURE THIS MATCHES YOUR ACTUAL DATA
export interface PaymentDataTypes {
    payment_id?: number;
    user_id?: number;
    case_id?: number;
    payment_amount?: number | string;
    payment_status?: 'pending' | 'completed' | 'failed' | string;
    payment_gateway?: 'stripe' | 'mpesa' | 'cash' | 'other' | string; // Added 'other'
    payment_date?: string;
    transaction_id?: string | null;
    mpesa_message?: string | null;
    receipt_url?: string | null;
}

// Define the PaymentAPIResponse interface
interface PaymentAPIResponse {
    success: boolean;
    payments: PaymentDataTypes[];
}

// Define the type for the useFetchPaymentsQuery hook result
interface FetchPaymentsQueryResult {
    data?: PaymentAPIResponse;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
}

type PaymentMode = 'cash' | 'mpesa' | 'stripe' | 'manual_entry' | ''; // Added 'manual_entry'

// Enhanced Status Display
interface StatusDisplayInfo {
    badgeClass: string;
    textClass: string;
    icon: JSX.Element;
    text: string;
}

const getStatusDisplayInfo = (status: string | undefined): StatusDisplayInfo => {
    const safeStatus = (status || 'unknown').toLowerCase();
    switch (safeStatus) {
        case 'pending':
            return { badgeClass: 'bg-yellow-100 dark:bg-yellow-700/30', textClass: 'text-yellow-700 dark:text-yellow-300', icon: <Clock size={16} className="mr-1.5" />, text: 'Pending' };
        case 'completed': // 'paid' could also map here
        case 'paid':
            return { badgeClass: 'bg-green-100 dark:bg-green-700/30', textClass: 'text-green-700 dark:text-green-300', icon: <CheckCircle size={16} className="mr-1.5" />, text: 'Completed' };
        case 'failed':
            return { badgeClass: 'bg-red-100 dark:bg-red-700/30', textClass: 'text-red-700 dark:text-red-300', icon: <XCircle size={16} className="mr-1.5" />, text: 'Failed' };
        default:
            return { badgeClass: 'bg-gray-100 dark:bg-gray-700/30', textClass: 'text-gray-700 dark:text-gray-400', icon: <AlertTriangle size={16} className="mr-1.5" />, text: 'Unknown' };
    }
};


const PaymentHistory: React.FC = () => {
    const [isPaymentModeSelectionOpen, setIsPaymentModeSelectionOpen] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false); // For automated cash
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false); // For STK push
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false); // For Stripe Checkout
    const [isManualEntryModalOpen, setIsManualEntryModalOpen] = useState(false); // New state for manual entry modal

    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterGateway, setFilterGateway] = useState<string>('');
    const [filterAmount, setFilterAmount] = useState<string>('');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [filterCaseId, setFilterCaseId] = useState<string>('');
    const [filterUser, setFilterUser] = useState<string>('');
    const [filterTransactionId, setFilterTransactionId] = useState<string>('');

    const { data, isLoading, isError, error, refetch } = useFetchPaymentsQuery() as FetchPaymentsQueryResult;
    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[]>([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    useEffect(() => {
        if (data?.success && Array.isArray(data.payments)) {
            setFilteredPayments(data.payments);
        } else {
            setFilteredPayments([]);
            if (error) console.error("Error fetching payments:", error);
            else if (data && !data.success) console.error("API returned unsuccessful response:", data);
        }
    }, [data, error]);

    const handleFilter = useCallback(() => {
        if (!data?.success || !Array.isArray(data.payments)) {
            setFilteredPayments([]);
            return;
        }
        let tempPayments = [...data.payments];
        if (filterStatus) tempPayments = tempPayments.filter(p => p.payment_status?.toLowerCase() === filterStatus.toLowerCase());
        if (filterGateway) tempPayments = tempPayments.filter(p => p.payment_gateway?.toLowerCase() === filterGateway.toLowerCase());
        if (filterAmount) {
            const amount = parseFloat(filterAmount);
            if (!isNaN(amount)) tempPayments = tempPayments.filter(p => Number(p.payment_amount) === amount);
        }
        if (filterDateFrom) tempPayments = tempPayments.filter(p => new Date(p.payment_date || '') >= new Date(filterDateFrom));
        if (filterDateTo) tempPayments = tempPayments.filter(p => new Date(p.payment_date || '') <= new Date(filterDateTo));
        if (filterCaseId) tempPayments = tempPayments.filter(p => String(p.case_id).includes(filterCaseId));
        if (filterUser) tempPayments = tempPayments.filter(p => String(p.user_id).includes(filterUser));
        if (filterTransactionId) {
            const txId = filterTransactionId.trim().toLowerCase();
            tempPayments = tempPayments.filter(p =>
                (p.transaction_id && p.transaction_id.toLowerCase().includes(txId)) ||
                (p.payment_gateway === 'mpesa' && (p.mpesa_message || '').toLowerCase().includes(txId))
            );
        }
        setFilteredPayments(tempPayments);
    }, [filterStatus, filterGateway, filterAmount, filterDateFrom, filterDateTo, filterCaseId, filterUser, filterTransactionId, data]);

    useEffect(() => {
        handleFilter();
    }, [handleFilter]);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (e) {
            return "Invalid Date";
        }
    };

    const resetFilters = () => {
        setFilterStatus('');
        setFilterGateway('');
        setFilterAmount('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterCaseId('');
        setFilterUser('');
        setFilterTransactionId('');
        // No need to call setFilteredPayments here, useEffect with handleFilter will do it
        refetch(); // Refetch original data, then filter effect will apply
    };

    const handlePaymentModeSelect = (mode: PaymentMode) => {
        setIsPaymentModeSelectionOpen(false);
        switch (mode) {
            case 'cash': setIsCashModalOpen(true); break;
            case 'mpesa': setIsMpesaModalOpen(true); break;
            case 'stripe': setIsStripeModalOpen(true); break;
            case 'manual_entry': setIsManualEntryModalOpen(true); break; // Open manual entry modal
            default: break;
        }
    };

    const handleClosePaymentModals = () => {
        setIsCashModalOpen(false);
        setIsMpesaModalOpen(false);
        setIsStripeModalOpen(false);
        setIsManualEntryModalOpen(false); // Close manual entry modal
        refetch();
    };

    const handleDownloadReceipt = async (payment: PaymentDataTypes) => {
        if (!payment.receipt_url || !payment.payment_id) {
            alert("Receipt URL is not available.");
            return;
        }
        setIsDownloading(payment.payment_id);
        try {
            const response = await fetch(payment.receipt_url);
            if (!response.ok) throw new Error(`Failed to fetch receipt: ${response.statusText}`);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            let fileName = `receipt_payment_${payment.payment_id}`;
            const contentDisposition = response.headers.get('content-disposition');
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
            } else {
                const urlParts = payment.receipt_url.split('/');
                const lastPart = urlParts[urlParts.length - 1];
                fileName = lastPart.split('?')[0] || fileName;
            }
            if (!fileName.match(/\.[0-9a-z]+$/i)) {
                if (blob.type.includes('pdf')) fileName += '.pdf';
                else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) fileName += '.jpg';
                else if (blob.type.includes('png')) fileName += '.png';
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download receipt.");
        } finally {
            setIsDownloading(null);
        }
    };

    const renderFilterInput = (
        id: string,
        label: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
        type = "text",
        placeholder = "",
        options?: { value: string; label: string }[],
        icon?: JSX.Element
    ) => (
        <div className="flex-1 min-w-[180px]">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{React.cloneElement(icon, { size: 18 })}</div>}
                {type === "select" ? (
                    <select id={id} className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-8 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-gray-100 transition duration-150 ease-in-out`} value={value} onChange={onChange}>
                        {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                ) : (
                    <input type={type} id={id} className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-gray-100 transition duration-150 ease-in-out`} placeholder={placeholder} value={value} onChange={onChange} />
                )}
            </div>
        </div>
    );

    // Define payment modes for the dropdown
    const paymentModes: { mode: PaymentMode; label: string; icon: JSX.Element }[] = [
        { mode: 'mpesa', label: 'M-Pesa (STK)', icon: <CreditCard size={16} className="mr-2 opacity-70" /> },
        { mode: 'stripe', label: 'Stripe (Card)', icon: <CreditCard size={16} className="mr-2 opacity-70" /> },
        { mode: 'cash', label: 'Cash (Automated)', icon: <DollarSign size={16} className="mr-2 opacity-70" /> },
        { mode: 'manual_entry', label: 'Manual Entry', icon: <Edit3 size={16} className="mr-2 opacity-70" /> },
    ];

    return (
        <div className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
                    Payment History
                </h1>
                <div className="relative">
                    <button type="button" className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out" onClick={() => setIsPaymentModeSelectionOpen(prev => !prev)} aria-expanded={isPaymentModeSelectionOpen} aria-haspopup="true">
                        <PlusCircle size={20} className="mr-2" /> Initiate Payment <ChevronDown size={20} className={`ml-2 transform transition-transform duration-200 ${isPaymentModeSelectionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPaymentModeSelectionOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                            <div className="py-1">
                                {paymentModes.map(({ mode, label, icon }) => (
                                    <button key={mode} onClick={() => handlePaymentModeSelect(mode)} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition duration-150 ease-in-out">
                                        {icon} {label}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700"></div>
                            <div className="py-1">
                                <button onClick={() => setIsPaymentModeSelectionOpen(false)} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700/30 hover:text-red-700 dark:hover:text-red-300 transition duration-150 ease-in-out">
                                    <X size={16} className="mr-2 opacity-70" /> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center"> <ListFilter size={20} className="mr-2 text-indigo-500" /> Filters </h3>
                    <button onClick={resetFilters} className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out">
                        <RotateCcw size={16} className="mr-1.5" /> Reset Filters
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {renderFilterInput("statusFilter", "Status", filterStatus, (e) => setFilterStatus(e.target.value), "select", "", [{ value: "", label: "All Statuses" }, { value: "pending", label: "Pending" }, { value: "completed", label: "Completed" }, { value: "paid", label: "Paid" },{ value: "failed", label: "Failed" }], <ListFilter />)}
                    {renderFilterInput("gatewayFilter", "Gateway", filterGateway, (e) => setFilterGateway(e.target.value), "select", "", [{ value: "", label: "All Gateways" }, { value: "stripe", label: "Stripe" }, { value: "mpesa", label: "M-Pesa" }, { value: "cash", label: "Cash" }, {value: "other", label: "Other"}], <CreditCard />)}
                    {renderFilterInput("amountFilter", "Amount", filterAmount, (e) => setFilterAmount(e.target.value), "number", "Enter amount", undefined, <DollarSign />)}
                    {renderFilterInput("dateFromFilter", "Date From", filterDateFrom, (e) => setFilterDateFrom(e.target.value), "date", "", undefined, <CalendarDays />)}
                    {renderFilterInput("dateToFilter", "Date To", filterDateTo, (e) => setFilterDateTo(e.target.value), "date", "", undefined, <CalendarDays />)}
                    {renderFilterInput("caseIdFilter", "Case ID", filterCaseId, (e) => setFilterCaseId(e.target.value), "text", "Enter Case ID", undefined, <Briefcase />)}
                    {renderFilterInput("userFilter", "User ID", filterUser, (e) => setFilterUser(e.target.value), "text", "Enter User ID", undefined, <User />)}
                    {renderFilterInput("transactionIdFilter", "Transaction ID / M-Pesa", filterTransactionId, (e) => setFilterTransactionId(e.target.value), "text", "ID or M-Pesa message", undefined, <Activity />)}
                </div>
            </div>

            {/* Payment Table */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                <th className="px-4 py-3.5">ID</th>
                                <th className="px-4 py-3.5">Amount</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5">Gateway</th>
                                <th className="px-4 py-3.5">Date</th>
                                <th className="px-4 py-3.5">Transaction ID</th>
                                <th className="px-4 py-3.5 text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-10"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div><span className="ml-3">Loading payments...</span></div></td></tr>
                            ) : isError ? (
                                <tr><td colSpan={7} className="text-center py-10 text-red-500 dark:text-red-400"><div className="flex flex-col items-center"><AlertTriangle size={40} className="mb-2" /> Error loading payments. Please check connection and reload. Contact support if persistent.</div></td></tr>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => {
                                    const statusInfo = getStatusDisplayInfo(payment.payment_status);
                                    const currentIsDownloading = isDownloading === payment.payment_id;
                                    return (
                                        <tr key={payment.payment_id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150 ease-in-out">
                                            <td className="px-4 py-3.5 whitespace-nowrap"><div className="flex items-center"><Fingerprint size={16} className="mr-2 text-gray-400 dark:text-gray-500" /><span className="font-medium text-gray-900 dark:text-gray-100">{payment.payment_id}</span></div></td>
                                            <td className="px-4 py-3.5 whitespace-nowrap"><span className="font-medium text-gray-900 dark:text-gray-100">ksh{Number(payment.payment_amount).toFixed(2)}</span></td>
                                            <td className="px-4 py-3.5 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} ${statusInfo.textClass}`}>{statusInfo.icon}{statusInfo.text}</span></td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">{payment.payment_gateway}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">{formatDate(payment.payment_date)}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap"><span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[150px] block" title={payment.transaction_id || payment.mpesa_message || 'N/A'}>{payment.transaction_id || payment.mpesa_message || 'N/A'}</span></td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                {payment.receipt_url ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-1 px-2 rounded-md inline-flex items-center text-sm hover:bg-blue-50 dark:hover:bg-blue-700/20 transition-colors duration-150" title="View Receipt">
                                                            <Eye size={16} className="mr-1" /> View
                                                        </a>
                                                        <button onClick={() => handleDownloadReceipt(payment)} disabled={currentIsDownloading} className={`text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium py-1 px-2 rounded-md inline-flex items-center text-sm hover:bg-green-50 dark:hover:bg-green-700/20 transition-colors duration-150 ${currentIsDownloading ? 'opacity-50 cursor-not-allowed' : ''}`} title="Download Receipt">
                                                            {currentIsDownloading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500 mr-1"></div> : <Download size={16} className="mr-1" />}
                                                            {currentIsDownloading ? 'Downloading...' : 'Download'}
                                                        </button>
                                                    </div>
                                                ) : (<span className="text-gray-400 dark:text-gray-500">N/A</span>)}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400"><div className="flex flex-col items-center"><Search size={40} className="mb-2 text-gray-400 dark:text-gray-500" />No payments found matching your criteria.</div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {isCashModalOpen && <CashPaymentModal isOpen={isCashModalOpen} onClose={handleClosePaymentModals} />}
            {isMpesaModalOpen && <MpesaPayment isOpen={isMpesaModalOpen} onClose={handleClosePaymentModals} />}
            {isStripeModalOpen && <StripePaymentModal isOpen={isStripeModalOpen} onClose={handleClosePaymentModals} />}
            {isManualEntryModalOpen && <ManualPaymentEntryModal isOpen={isManualEntryModalOpen} onClose={handleClosePaymentModals} />}
        </div>
    );
};

export default PaymentHistory;