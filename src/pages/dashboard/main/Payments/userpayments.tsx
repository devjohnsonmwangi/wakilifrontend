// src/components/UserPaymentRecords.tsx
import React, { useState, useEffect, useCallback } from 'react';
// No modal imports needed

import {
    useFetchPaymentsQuery,
} from '../../../../features/payment/paymentAPI'; // Adjust path
import { toast } from "sonner";
import { format } from 'date-fns';
import {
    ListFilter, RotateCcw, Search, CalendarDays,
    DollarSign, Fingerprint, Briefcase, Clock, CheckCircle, XCircle, AlertTriangle,
    CreditCard, Activity, Eye, Download, UserX,
} from 'lucide-react';

// Import Redux hooks and selectors (from your simpler slice)
import { useSelector } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    // selectCurrentUserId, // We'll derive it
} from '../../../../features/users/userSlice'; // <<--- Path to YOUR userSlice.ts

// Re-using interfaces from UserPaymentPortal (or a shared types file)
export interface PaymentDataTypes {
    payment_id?: number;
    user_id?: number | string;
    case_id?: number;
    payment_amount?: number | string;
    payment_status?: 'pending' | 'completed' | 'failed' | string;
    payment_gateway?: 'stripe' | 'mpesa' | 'cash' | 'other' |'bank_transfer'| string;
    payment_date?: string;
    transaction_id?: string | null;
    mpesa_message?: string | null;
    receipt_url?: string | null;
}

interface PaymentAPIResponse {
    success: boolean;
    payments: PaymentDataTypes[];
}

interface FetchPaymentsQueryResult {
    data?: PaymentAPIResponse;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void; // Still useful for manual refresh if needed, though no button for it here yet
}

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
        case 'completed': case 'paid':
            return { badgeClass: 'bg-green-100 dark:bg-green-700/30', textClass: 'text-green-700 dark:text-green-300', icon: <CheckCircle size={16} className="mr-1.5" />, text: 'Completed' };
        case 'failed':
            return { badgeClass: 'bg-red-100 dark:bg-red-700/30', textClass: 'text-red-700 dark:text-red-300', icon: <XCircle size={16} className="mr-1.5" />, text: 'Failed' };
        default:
            return { badgeClass: 'bg-gray-100 dark:bg-gray-700/30', textClass: 'text-gray-700 dark:text-gray-400', icon: <AlertTriangle size={16} className="mr-1.5" />, text: 'Unknown' };
    }
};

const UserPaymentRecords: React.FC = () => {
    const loggedInUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUserId = loggedInUser?.user_id;

    // Filters remain useful for viewing specific records
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterGateway, setFilterGateway] = useState<string>('');
    const [filterAmount, setFilterAmount] = useState<string>('');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [filterCaseId, setFilterCaseId] = useState<string>('');
    const [filterTransactionId, setFilterTransactionId] = useState<string>('');

    const { data, isLoading: paymentsLoading, isError, error, } = useFetchPaymentsQuery(undefined, {
        skip: !isAuthenticated || !currentUserId,
    }) as FetchPaymentsQueryResult;
    
    const [baseUserPayments, setBaseUserPayments] = useState<PaymentDataTypes[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[]>([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId) {
            setBaseUserPayments([]);
            setFilteredPayments([]);
            return;
        }

        if (data?.success && Array.isArray(data.payments)) {
            const userSpecificPayments = data.payments.filter(p => String(p.user_id) === String(currentUserId));
            setBaseUserPayments(userSpecificPayments);
            setFilteredPayments(userSpecificPayments);
        } else {
            setBaseUserPayments([]);
            setFilteredPayments([]);
            if (isError && !paymentsLoading) {
                toast.error("Error fetching your payment records.");
                console.error("Error fetching payments:", error);
            } else if (data && !data.success && !paymentsLoading) {
                toast.warning("Could not fetch your payment records successfully.");
                console.error("API returned unsuccessful response for payments:", data);
            }
        }
    }, [data, error, isError, paymentsLoading, currentUserId, isAuthenticated]);

    const handleFilter = useCallback(() => {
        if (!isAuthenticated || !currentUserId) return;
        let tempPayments = [...baseUserPayments]; 
        if (filterStatus) tempPayments = tempPayments.filter(p => p.payment_status?.toLowerCase() === filterStatus.toLowerCase());
        if (filterGateway) tempPayments = tempPayments.filter(p => p.payment_gateway?.toLowerCase() === filterGateway.toLowerCase());
        if (filterAmount) {
            const amount = parseFloat(filterAmount);
            if (!isNaN(amount)) tempPayments = tempPayments.filter(p => Number(p.payment_amount) === amount);
        }
        if (filterDateFrom) tempPayments = tempPayments.filter(p => new Date(p.payment_date || '') >= new Date(filterDateFrom));
        if (filterDateTo) tempPayments = tempPayments.filter(p => new Date(p.payment_date || '') <= new Date(filterDateTo));
        if (filterCaseId) tempPayments = tempPayments.filter(p => String(p.case_id).includes(filterCaseId));
        if (filterTransactionId) {
            const txId = filterTransactionId.trim().toLowerCase();
            tempPayments = tempPayments.filter(p =>
                (p.transaction_id && p.transaction_id.toLowerCase().includes(txId)) ||
                (p.payment_gateway === 'mpesa' && (p.mpesa_message || '').toLowerCase().includes(txId))
            );
        }
        setFilteredPayments(tempPayments);
    }, [
        filterStatus, filterGateway, filterAmount, filterDateFrom, filterDateTo, 
        filterCaseId, filterTransactionId, baseUserPayments, currentUserId, isAuthenticated
    ]);

    useEffect(() => {
        handleFilter();
    }, [handleFilter]);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try { return format(new Date(dateString), 'MMM dd, yyyy HH:mm'); }
        catch (e) { return "Invalid Date"; }
    };

    const resetFilters = () => {
        setFilterStatus(''); setFilterGateway(''); setFilterAmount('');
        setFilterDateFrom(''); setFilterDateTo(''); setFilterCaseId('');
        setFilterTransactionId('');
        if (isAuthenticated && currentUserId) {
            setFilteredPayments([...baseUserPayments]);
            toast.info("Filters have been reset.");
            // Optionally, call refetch() if you want to refresh data from server on filter reset
            // refetch();
        }
    };

    // handleDownloadReceipt and handleViewReceipt remain the same
    const handleDownloadReceipt = async (payment: PaymentDataTypes) => {
        if (!payment.receipt_url || !payment.payment_id) {
            toast.error("Receipt URL is not available for download.");
            return;
        }
        setIsDownloading(payment.payment_id);
        toast.promise(
            (async () => {
                try {
                    const response = await fetch(payment.receipt_url!);
                    if (!response.ok) throw new Error(`Failed to fetch receipt: ${response.statusText}`);
                    const blob = await response.blob();
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    let fileName = `receipt_payment_${payment.payment_id}`;
                    const contentDisposition = response.headers.get('content-disposition');
                    if (contentDisposition) {
                        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                        if (fileNameMatch?.[1]) fileName = fileNameMatch[1];
                    } else {
                        const urlParts = payment.receipt_url!.split('/');
                        const lastPart = urlParts.pop();
                        if (lastPart) fileName = lastPart.split('?')[0] || fileName;
                    }
                    if (blob.type.includes('html') && !fileName.match(/\.[0-9a-z]+$/i)) fileName += '.html';
                    else if (!fileName.match(/\.[0-9a-z]+$/i)) {
                        if (blob.type.includes('pdf')) fileName += '.pdf';
                        else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) fileName += '.jpg';
                        else if (blob.type.includes('png')) fileName += '.png';
                    }
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    return { fileName };
                } finally {
                    setIsDownloading(null);
                }
            })(),
            {
                loading: 'Downloading receipt...',
                success: (data) => `Receipt "${data.fileName}" downloaded.`,
                error: (err) => { console.error("Download failed:", err); return "Failed to download receipt."; },
            }
        );
    };

    const handleViewReceipt = async (receiptUrl: string) => {
        if (!receiptUrl) {
            toast.warning("Receipt URL is not available.");
            return;
        }
        toast.promise(
            (async () => {
                const response = await fetch(receiptUrl);
                if (!response.ok) {
                    const errorText = `Failed to fetch receipt: ${response.statusText} (${response.status})`;
                    try { await response.text(); } catch (e) {/* ignore */}
                    throw new Error(errorText);
                }
                const htmlString = await response.text();
                const blob = new Blob([htmlString], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);
                const newWindow = window.open(blobUrl, '_blank');
                if (newWindow) newWindow.focus();
                else { URL.revokeObjectURL(blobUrl); throw new Error("popup_blocked"); }
                return "Receipt opened.";
            })(),
            {
                loading: 'Loading receipt...',
                success: (message) => message,
                error: (err: Error) => {
                    console.error("Error viewing receipt:", err);
                    if (err.message === "popup_blocked") return "Please allow pop-ups.";
                    return `Could not display receipt: ${err.message}`;
                },
            }
        );
    };

    const renderFilterInput = (
        id: string, label: string, value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
        type = "text", placeholder = "", options?: { value: string; label: string }[], icon?: JSX.Element
    ) => (
        <div className="flex-1 min-w-[180px]">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{React.cloneElement(icon, { size: 18 })}</div>}
                {type === "select" ? (
                    <select id={id} className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-8 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-gray-100`} value={value} onChange={onChange}>
                        {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                ) : (
                    <input type={type} id={id} className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-gray-100`} placeholder={placeholder} value={value} onChange={onChange} />
                )}
            </div>
        </div>
    );

    if (!isAuthenticated || !currentUserId) {
        return (
            <div className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans flex justify-center items-center">
                <div className="text-center">
                    <UserX size={64} className="mx-auto mb-4 text-red-500 dark:text-red-400" />
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view your payment records.</p>
                </div>
            </div>
        );
    }
    
    const pageTitle = loggedInUser?.full_name 
        ? `Payment Records for ${loggedInUser.full_name}` 
        : `Your Payment Records`;

    return (
        <div className="w-full p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Header: Only title, no "Initiate Payment" button */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-green-800 dark:text-gray-100 mb-4 sm:mb-0">
                    {pageTitle}
                </h1>
                {/* No payment initiation button or dropdown */}
            </div>

            {/* Filter Section - Kept as it's useful for viewing */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center"> <ListFilter size={20} className="mr-2 text-indigo-500" /> Filters </h3>
                    <button onClick={resetFilters} className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                        <RotateCcw size={16} className="mr-1.5" /> Reset Filters
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {renderFilterInput("statusFilter", "Status", filterStatus, (e) => setFilterStatus(e.target.value), "select", "", [{ value: "", label: "All Statuses" }, { value: "pending", label: "Pending" }, { value: "completed", label: "Completed" }, { value: "paid", label: "Paid" },{ value: "failed", label: "Failed" }], <ListFilter />)}
                    {renderFilterInput("gatewayFilter", "Gateway", filterGateway, (e) => setFilterGateway(e.target.value), "select", "", [{ value: "", label: "All Gateways" }, { value: "stripe", label: "Stripe" }, { value: "mpesa", label: "M-Pesa" }, { value: "cash", label: "Cash" },{value: "bank_transfer", label: "Bank Transfer"}, {value: "other", label: "Other"}], <CreditCard />)}
                    {renderFilterInput("amountFilter", "Amount", filterAmount, (e) => setFilterAmount(e.target.value), "number", "Enter amount", undefined, <DollarSign />)}
                    {renderFilterInput("dateFromFilter", "Date From", filterDateFrom, (e) => setFilterDateFrom(e.target.value), "date", "", undefined, <CalendarDays />)}
                    {renderFilterInput("dateToFilter", "Date To", filterDateTo, (e) => setFilterDateTo(e.target.value), "date", "", undefined, <CalendarDays />)}
                    {renderFilterInput("caseIdFilter", "Case ID", filterCaseId, (e) => setFilterCaseId(e.target.value), "text", "Enter Case ID", undefined, <Briefcase />)}
                    {renderFilterInput("transactionIdFilter", "Transaction ID / M-Pesa", filterTransactionId, (e) => setFilterTransactionId(e.target.value), "text", "ID or M-Pesa message", undefined, <Activity />)}
                </div>
            </div>

            {/* Payment Table - Same as before */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                             <tr className="bg-gray-100 dark:bg-gray-700/50 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                <th className="px-4 py-3.5">Payment ID</th> <th className="px-4 py-3.5">Case ID</th>
                                <th className="px-4 py-3.5">Amount</th> <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5">Gateway</th> <th className="px-4 py-3.5">Date</th>
                                <th className="px-4 py-3.5">Transaction ID</th> <th className="px-4 py-3.5 text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300 text-sm">
                            {paymentsLoading && baseUserPayments.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-10"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div><span className="ml-3">Loading payment records...</span></div></td></tr>
                            ) : isError && baseUserPayments.length === 0 && !paymentsLoading ? (
                                <tr><td colSpan={8} className="text-center py-10 text-red-500 dark:text-red-400"><div className="flex flex-col items-center"><AlertTriangle size={40} className="mb-2" /> Error loading payment records.</div></td></tr>
                            ) : !paymentsLoading && baseUserPayments.length === 0 && isAuthenticated ? (
                                <tr><td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400"><div className="flex flex-col items-center"><Search size={40} className="mb-2 text-gray-400 dark:text-gray-500" />You have no payment records.</div></td></tr>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => {
                                    const statusInfo = getStatusDisplayInfo(payment.payment_status);
                                    const currentIsDownloading = isDownloading === payment.payment_id;
                                    return (
                                        <tr key={payment.payment_id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className="px-4 py-3.5 whitespace-nowrap"><div className="flex items-center"><Fingerprint size={16} className="mr-2 text-gray-400 dark:text-gray-500" /><span className="font-medium text-gray-900 dark:text-gray-100">{payment.payment_id}</span></div></td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">{payment.case_id || 'N/A'}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap"><span className="font-medium text-gray-900 dark:text-gray-100">ksh{Number(payment.payment_amount).toFixed(2)}</span></td>
                                            <td className="px-4 py-3.5 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} ${statusInfo.textClass}`}>{statusInfo.icon}{statusInfo.text}</span></td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">{payment.payment_gateway}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">{formatDate(payment.payment_date)}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap"><span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[150px] block" title={payment.transaction_id || payment.mpesa_message || 'N/A'}>{payment.transaction_id || payment.mpesa_message || 'N/A'}</span></td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                {payment.receipt_url ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button onClick={() => handleViewReceipt(payment.receipt_url!)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-1 px-2 rounded-md inline-flex items-center text-sm hover:bg-blue-50 dark:hover:bg-blue-700/20" title="View Receipt"><Eye size={16} className="mr-1" /> View</button>
                                                        <button onClick={() => handleDownloadReceipt(payment)} disabled={currentIsDownloading} className={`text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium py-1 px-2 rounded-md inline-flex items-center text-sm hover:bg-green-50 dark:hover:bg-green-700/20 ${currentIsDownloading ? 'opacity-50 cursor-not-allowed' : ''}`} title="Download Receipt">
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
                               !paymentsLoading && baseUserPayments.length > 0 && filteredPayments.length === 0 && isAuthenticated && (
                                <tr><td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400"><div className="flex flex-col items-center"><Search size={40} className="mb-2 text-gray-400 dark:text-gray-500" />No payment records found matching your current filters.</div></td></tr>
                               )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* No Modals Rendered Here */}
        </div>
    );
};

export default UserPaymentRecords;