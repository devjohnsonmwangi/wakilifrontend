import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../features/users/userSlice';
import CashPaymentModal from './cash';
import MpesaPayment from './mpesa';
import StripePaymentModal from './stripe';
import ManualPaymentEntryModal from './recordpayment';
import { useFetchPaymentsQuery } from '../../../../features/payment/paymentAPI';
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';
import { toast } from "sonner";
import { format } from 'date-fns';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    PlusCircle, ListFilter, RotateCcw, ChevronDown, X, Search, CalendarDays,
    DollarSign, Fingerprint, Info, Clock, CheckCircle, XCircle,
    AlertTriangle, CreditCard, Activity, Eye, Download, Edit3, Sun, Moon,
    User, Briefcase
} from 'lucide-react';

// --- INTERFACES AND TYPES ---
export interface PaymentDataTypes {
    payment_id?: number;
    user_id?: number;
    case_id?: number;
    payment_amount?: number | string;
    payment_status?: 'pending' | 'completed' | 'failed' | string;
    payment_gateway?: 'stripe' | 'mpesa' | 'cash' | 'other' | 'bank_transfer' | string;
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
    refetch: () => void;
}

type PaymentMode = 'cash' | 'mpesa' | 'stripe' | 'manual_entry' | '';
interface StatusDisplayInfo { badgeClass: string; textClass: string; icon: JSX.Element; text: string; }

// --- HELPER FUNCTIONS ---
const getStatusDisplayInfo = (status: string | undefined): StatusDisplayInfo => {
    const safeStatus = (status || 'unknown').toLowerCase();
    switch (safeStatus) {
        case 'pending': return { badgeClass: 'bg-yellow-100 dark:bg-yellow-700/30', textClass: 'text-yellow-700 dark:text-yellow-300', icon: <Clock size={16} className="mr-1.5" />, text: 'Pending' };
        case 'completed': case 'paid': return { badgeClass: 'bg-green-100 dark:bg-green-700/30', textClass: 'text-green-700 dark:text-green-300', icon: <CheckCircle size={16} className="mr-1.5" />, text: 'Completed' };
        case 'failed': return { badgeClass: 'bg-red-100 dark:bg-red-700/30', textClass: 'text-red-700 dark:text-red-300', icon: <XCircle size={16} className="mr-1.5" />, text: 'Failed' };
        default: return { badgeClass: 'bg-gray-100 dark:bg-gray-700/30', textClass: 'text-gray-700 dark:text-gray-400', icon: <AlertTriangle size={16} className="mr-1.5" />, text: 'Unknown' };
    }
};

const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
};

const PaymentHistory: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
    const [isPaymentModeSelectionOpen, setIsPaymentModeSelectionOpen] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [isManualEntryModalOpen, setIsManualEntryModalOpen] = useState(false);
    const loggedInUser = useSelector(selectCurrentUser);
    const currentUserId = loggedInUser?.user_id;

    const [filters, setFilters] = useState({ status: '', gateway: '', transactionId: '', userSearch: '', caseId: '' });
    
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isGatewayDropdownOpen, setIsGatewayDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const gatewayDropdownRef = useRef<HTMLDivElement>(null);
    const paymentModeDropdownRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError, error, refetch } = useFetchPaymentsQuery() as FetchPaymentsQueryResult;
    const { data: usersData } = useFetchUsersQuery();
    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[]>([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    const userMap = useMemo(() => {
        if (!usersData) return new Map<number, UserDataTypes>();
        return new Map(usersData.map((user: UserDataTypes) => [user.user_id, user]));
    }, [usersData]);

    const toggleTheme = () => setTheme(prev => { const newTheme = prev === 'light' ? 'dark' : 'light'; if (typeof window !== 'undefined') localStorage.setItem('theme', newTheme); return newTheme; });

    useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [theme]);
    useEffect(() => {
        if (data?.success && Array.isArray(data.payments)) setFilteredPayments(data.payments);
        else { setFilteredPayments([]); if (isError) toast.error("Error fetching payments."); else if (data && !data.success) toast.warning("Could not fetch payments."); }
    }, [data, error, isError]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
            if (gatewayDropdownRef.current && !gatewayDropdownRef.current.contains(event.target as Node)) setIsGatewayDropdownOpen(false);
            if (paymentModeDropdownRef.current && !paymentModeDropdownRef.current.contains(event.target as Node)) setIsPaymentModeSelectionOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilter = useCallback(() => {
        if (!data?.success || !Array.isArray(data.payments)) { setFilteredPayments([]); return; }
        let tempPayments = [...data.payments];
        if (filters.status) tempPayments = tempPayments.filter(p => p.payment_status?.toLowerCase() === filters.status.toLowerCase());
        if (filters.gateway) tempPayments = tempPayments.filter(p => p.payment_gateway?.toLowerCase() === filters.gateway.toLowerCase());
        if (filters.userSearch) { const term = filters.userSearch.toLowerCase(); tempPayments = tempPayments.filter(p => { const user = p.user_id ? userMap.get(p.user_id) : null; return user ? user.full_name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term) : false; }); }
        if (filters.caseId) { tempPayments = tempPayments.filter(p => p.case_id ? String(p.case_id).includes(filters.caseId) : false); }
        if (filters.transactionId) { const txId = filters.transactionId.trim().toLowerCase(); tempPayments = tempPayments.filter(p => (p.transaction_id || '').toLowerCase().includes(txId) || (p.mpesa_message || '').toLowerCase().includes(txId)); }
        setFilteredPayments(tempPayments);
    }, [filters, data, userMap]);

    useEffect(() => { handleFilter(); }, [handleFilter]);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try { return format(new Date(dateString), 'MMM dd, yyyy HH:mm'); }
        catch (e) { console.warn("Invalid date format encountered:", dateString, e); return "Invalid Date"; }
    };
    
    const handleFilterChange = (field: keyof typeof filters, value: string) => setFilters(prev => ({...prev, [field]: value}));
    const resetFilters = () => { setFilters({ status: '', gateway: '', transactionId: '', userSearch: '', caseId: '' }); refetch(); toast.info("Filters reset."); };
    const handlePaymentModeSelect = (mode: PaymentMode) => { setIsPaymentModeSelectionOpen(false); switch (mode) { case 'cash': setIsCashModalOpen(true); break; case 'mpesa': setIsMpesaModalOpen(true); break; case 'stripe': setIsStripeModalOpen(true); break; case 'manual_entry': setIsManualEntryModalOpen(true); break; } };
    const handleClosePaymentModals = () => { setIsCashModalOpen(false); setIsMpesaModalOpen(false); setIsStripeModalOpen(false); setIsManualEntryModalOpen(false); refetch(); };

    const handleViewReceipt = (receiptUrl: string) => {
        if (!receiptUrl) { toast.warning("Receipt URL is not available."); return; }
        toast.promise(
            async () => {
                const response = await fetch(receiptUrl);
                if (!response.ok) throw new Error(`Failed to fetch receipt: ${response.statusText}`);
                const receiptHtml = await response.text();
                const newWindow = window.open("", "_blank");
                if (newWindow) {
                    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
                    const styleLinks = stylesheets.map(sheet => sheet.outerHTML).join('');
                    const themeClass = document.documentElement.classList.contains('dark') ? 'dark' : '';
                    newWindow.document.write(`<!DOCTYPE html><html lang="en" class="${themeClass}"><head><meta charset="UTF-8"><title>Payment Receipt</title>${styleLinks}</head><body class="bg-gray-50 dark:bg-gray-900 font-sans"><div class="container mx-auto p-4">${receiptHtml}</div></body></html>`);
                    newWindow.document.close();
                } else throw new Error("popup_blocked");
            }, { loading: 'Loading receipt...', success: 'Receipt opened successfully!', error: (err: Error) => err.message === "popup_blocked" ? "Please allow pop-ups to view the receipt." : "Could not load receipt." }
        );
    };

    const handleDownloadReceipt = async (payment: PaymentDataTypes) => {
        if (!payment.receipt_url || !payment.payment_id) { toast.error("Receipt URL not available for download."); return; }
        setIsDownloading(payment.payment_id);
        toast.promise(
            async () => {
                try {
                    const response = await fetch(payment.receipt_url!);
                    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
                    const blob = await response.blob();
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    const fileName = `receipt_payment_${payment.payment_id}.html`;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(link.href);
                    return { fileName };
                } finally { setIsDownloading(null); }
            }, { loading: 'Downloading receipt...', success: (data: { fileName: string }) => `Receipt "${data.fileName}" downloaded.`, error: (err: Error) => err.message || "Download failed." }
        );
    };

    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };
    const paymentModes: { mode: PaymentMode; label: string; icon: JSX.Element }[] = [ { mode: 'mpesa', label: 'M-Pesa (STK)', icon: <CreditCard size={16} /> }, { mode: 'stripe', label: 'Stripe (Card)', icon: <CreditCard size={16} /> }, { mode: 'cash', label: 'Cash (Automated)', icon: <DollarSign size={16} /> }, { mode: 'manual_entry', label: 'Manual Entry', icon: <Edit3 size={16} /> }, ];
    
    return (
        <div className="w-full p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen font-sans">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-4 sm:mb-0">Payment History</h1>
                <div className="flex items-center space-x-3">
                    <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Toggle theme">{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button>
                    <div ref={paymentModeDropdownRef} className="relative">
                        <button type="button" className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md text-sm" onClick={() => setIsPaymentModeSelectionOpen(p => !p)}>
                            <PlusCircle size={18} className="mr-2" /> Initiate Payment <ChevronDown size={20} className={`ml-2 transition-transform ${isPaymentModeSelectionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>{isPaymentModeSelectionOpen && ( <motion.div variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-20"><div className="py-1">{paymentModes.map(({ mode, label, icon }) => ( <button key={mode} onClick={() => handlePaymentModeSelect(mode)} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">{icon} {label}</button>))}</div></motion.div>)}</AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 flex items-center"><ListFilter size={20} className="mr-2 text-indigo-500" />Filters</h3><button onClick={resetFilters} className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"><RotateCcw size={16} className="mr-1.5" /> Reset</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="relative xl:col-span-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="text" placeholder="Filter by User..." value={filters.userSearch} onChange={(e) => handleFilterChange('userSearch', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.userSearch && (<button type="button" onClick={() => handleFilterChange('userSearch', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                    <div className="relative xl:col-span-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="number" placeholder="Filter by Case ID..." value={filters.caseId} onChange={(e) => handleFilterChange('caseId', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.caseId && (<button type="button" onClick={() => handleFilterChange('caseId', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                    <div ref={statusDropdownRef} className="relative xl:col-span-1"><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'All Statuses'}</span><div className="flex items-center">{filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('status', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{['pending', 'completed', 'paid', 'failed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.charAt(0).toUpperCase() + status.slice(1)}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                    <div ref={gatewayDropdownRef} className="relative xl:col-span-1"><button type="button" onClick={() => setIsGatewayDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.gateway ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.gateway ? filters.gateway.charAt(0).toUpperCase() + filters.gateway.slice(1).replace('_', ' ') : 'All Gateways'}</span><div className="flex items-center">{filters.gateway && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('gateway', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isGatewayDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isGatewayDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('gateway', ''); setIsGatewayDropdownOpen(false); }}>All Gateways</button></li>{['stripe', 'mpesa', 'cash', 'bank_transfer', 'other'].map(gw => (<li key={gw}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('gateway', gw); setIsGatewayDropdownOpen(false); }}>{gw.charAt(0).toUpperCase() + gw.slice(1).replace('_', ' ')}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                    <div className="relative xl:col-span-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="text" placeholder="Transaction ID or M-Pesa Msg" value={filters.transactionId} onChange={(e) => handleFilterChange('transactionId', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.transactionId && (<button type="button" onClick={() => handleFilterChange('transactionId', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-gradient-to-r from-blue-600 to-sky-600 text-white dark:from-blue-700 dark:to-sky-700">
                            <tr>
                                {/* --- MODIFIED: Added whitespace-nowrap to prevent line breaks --- */}
                                {[
                                    { icon: Fingerprint, text: 'Payment ID' },
                                    { icon: User, text: 'User' },
                                    { icon: Briefcase, text: 'Case ID' },
                                    { icon: DollarSign, text: 'Amount' },
                                    { icon: Info, text: 'Status' },
                                    { icon: CreditCard, text: 'Gateway' },
                                    { icon: CalendarDays, text: 'Date' },
                                    { icon: Activity, text: 'Transaction ID' },
                                    { icon: Eye, text: 'Receipt' }
                                ].map(h => 
                                    <th key={h.text} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                                        <div className="flex items-center gap-2"><h.icon className="h-4 w-4" />{h.text}</div>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300 text-sm">
                            {isLoading ? (<tr><td colSpan={9} className="text-center py-10"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div><span className="ml-3">Loading...</span></div></td></tr>)
                            : isError && !data?.payments?.length ? (<tr><td colSpan={9} className="text-center py-10 text-red-500"><AlertTriangle size={40} className="mx-auto mb-2" />Error loading payments.</td></tr>)
                            : filteredPayments.length > 0 ? (filteredPayments.map((payment) => {
                                const statusInfo = getStatusDisplayInfo(payment.payment_status);
                                const currentIsDownloading = isDownloading === payment.payment_id;
                                const user = payment.user_id ? userMap.get(payment.user_id) : null;
                                return (
                                    <tr key={payment.payment_id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3.5 whitespace-nowrap"><div className="flex items-center"><Fingerprint size={16} className="mr-2 text-gray-400" /><span className="font-medium">{payment.payment_id}</span></div></td>
                                        
                                        {/* --- MODIFIED: Added truncate and title for long names/emails --- */}
                                        <td className="px-4 py-3.5 whitespace-nowrap max-w-48">
                                            {user ? (
                                                <div>
                                                    <div className="font-medium text-slate-800 dark:text-slate-100 truncate" title={user.full_name}>{user.full_name}</div>
                                                    <div className="text-xs text-slate-500 truncate" title={user.email}>{user.email}</div>
                                                </div>
                                            ) : (<span className="text-gray-400 italic">N/A</span>)}
                                        </td>
                                        
                                        <td className="px-4 py-3.5 whitespace-nowrap"><span className="font-medium">{payment.case_id || 'N/A'}</span></td>
                                        <td className="px-4 py-3.5 whitespace-nowrap"><span className="font-medium">ksh{Number(payment.payment_amount).toFixed(2)}</span></td>
                                        <td className="px-4 py-3.5 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} ${statusInfo.textClass}`}>{statusInfo.icon}{statusInfo.text}</span></td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{payment.payment_gateway}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{formatDate(payment.payment_date)}</td>
                                        
                                        {/* --- MODIFIED: Added truncate and title for long transaction IDs --- */}
                                        <td className="px-4 py-3.5 whitespace-nowrap max-w-48">
                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium truncate block" title={payment.transaction_id || payment.mpesa_message || 'N/A'}>
                                                {payment.transaction_id || payment.mpesa_message || 'N/A'}
                                            </span>
                                        </td>
                                        
                                        <td className="px-4 py-3.5 text-center whitespace-nowrap">{payment.receipt_url ? ( <div className="flex items-center justify-center space-x-2"><button onClick={() => handleViewReceipt(payment.receipt_url!)} className="font-semibold text-blue-600 hover:text-blue-800 p-1 rounded-md inline-flex items-center hover:bg-blue-50 dark:hover:bg-blue-700/20" title="View Receipt"><Eye size={16} className="mr-1" /> View</button><button onClick={() => handleDownloadReceipt(payment)} disabled={currentIsDownloading} className={`font-semibold text-green-600 hover:text-green-800 p-1 rounded-md inline-flex items-center hover:bg-green-50 dark:hover:bg-green-700/20 ${currentIsDownloading ? 'opacity-50' : ''}`} title="Download Receipt">{currentIsDownloading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-green-500 mr-1"></div> : <Download size={16} className="mr-1" />}{currentIsDownloading ? 'downloading...' : 'Download'}</button></div> ) : (<span className="text-gray-400">N/A</span>)}</td>
                                    </tr>
                                );
                            })) : (<tr><td colSpan={9} className="text-center py-10 text-gray-500"><Search size={40} className="mx-auto mb-2" />No payments found for the selected filters.</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCashModalOpen && <CashPaymentModal isOpen={isCashModalOpen} onClose={handleClosePaymentModals} isDarkMode={theme === 'dark'}  userId={currentUserId ?? ''} />}
            {isMpesaModalOpen && <MpesaPayment isOpen={isMpesaModalOpen} onClose={handleClosePaymentModals} />}
            {isStripeModalOpen && <StripePaymentModal isOpen={isStripeModalOpen} onClose={handleClosePaymentModals} />}
            {isManualEntryModalOpen && <ManualPaymentEntryModal isOpen={isManualEntryModalOpen} onClose={handleClosePaymentModals} />}
        </div>
    );
};

export default PaymentHistory;