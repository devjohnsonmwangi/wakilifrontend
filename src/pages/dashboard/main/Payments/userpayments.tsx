// src/components/UserPaymentRecords.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
} from '../../../../features/users/userSlice';
import { useFetchPaymentsQuery } from '../../../../features/payment/paymentAPI';
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    ListFilter, RotateCcw, Search, CalendarDays, ChevronDown, X,
    DollarSign, Fingerprint, Briefcase, Clock, CheckCircle, XCircle, AlertTriangle,
    CreditCard, Activity, Eye, Download, UserX, LogOut, Settings, Loader2, Sun, Moon, User, Info
} from 'lucide-react';

export interface PaymentDataTypes {
    payment_id?: number;
    user_id?: number | string;
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

interface StatusDisplayInfo {
    badgeClass: string;
    textClass: string;
    icon: JSX.Element;
    text: string;
}

const getStatusDisplayInfo = (status: string | undefined): StatusDisplayInfo => {
    const safeStatus = (status || 'unknown').toLowerCase();
    switch (safeStatus) {
        case 'pending': return { badgeClass: 'bg-amber-100 dark:bg-amber-500/20', textClass: 'text-amber-700 dark:text-amber-300', icon: <Clock size={14} className="mr-1" />, text: 'Pending' };
        case 'completed': case 'paid': return { badgeClass: 'bg-green-100 dark:bg-green-500/20', textClass: 'text-green-700 dark:text-green-300', icon: <CheckCircle size={14} className="mr-1" />, text: 'Completed' };
        case 'failed': return { badgeClass: 'bg-red-100 dark:bg-red-500/20', textClass: 'text-red-700 dark:text-red-300', icon: <XCircle size={14} className="mr-1" />, text: 'Failed' };
        default: return { badgeClass: 'bg-slate-100 dark:bg-slate-700/30', textClass: 'text-slate-600 dark:text-slate-400', icon: <AlertTriangle size={14} className="mr-1" />, text: 'Unknown' };
    }
};

const getInitialTheme = (): boolean => (typeof window !== 'undefined' ? localStorage.getItem('appTheme') === 'dark' : false);

const UserPaymentRecords: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const userMenuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const root = window.document.documentElement;
        isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
        if (typeof window !== 'undefined') localStorage.setItem('appTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    const [filters, setFilters] = useState({ status: '', gateway: '', caseId: '', transactionId: '' });
    
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isGatewayDropdownOpen, setIsGatewayDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const gatewayDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node) && userMenuButtonRef.current && !userMenuButtonRef.current.contains(event.target as Node)) { setIsUserMenuOpen(false); }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) { setIsStatusDropdownOpen(false); }
            if (gatewayDropdownRef.current && !gatewayDropdownRef.current.contains(event.target as Node)) { setIsGatewayDropdownOpen(false); }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loggedInUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUserId = loggedInUser?.user_id;

    const { data, isLoading: paymentsLoading, isError, error } = useFetchPaymentsQuery(undefined, { skip: !isAuthenticated || !currentUserId }) as FetchPaymentsQueryResult;
    
    const [baseUserPayments, setBaseUserPayments] = useState<PaymentDataTypes[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[]>([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId) { setBaseUserPayments([]); setFilteredPayments([]); return; }
        if (data?.success && Array.isArray(data.payments)) {
            const userSpecificPayments = data.payments.filter(p => String(p.user_id) === String(currentUserId));
            setBaseUserPayments(userSpecificPayments);
        } else {
            setBaseUserPayments([]); setFilteredPayments([]);
            if (isError && !paymentsLoading) toast.error("Error fetching your payment data.");
            else if (data && !data.success && !paymentsLoading) toast.warning("Could not fetch your payment data successfully.");
        }
    }, [data, error, isError, paymentsLoading, currentUserId, isAuthenticated]);

    const handleFilter = useCallback(() => {
        if (!isAuthenticated || !currentUserId) return;
        let tempPayments = [...baseUserPayments];
        if (filters.status) tempPayments = tempPayments.filter(p => p.payment_status?.toLowerCase() === filters.status.toLowerCase());
        if (filters.gateway) tempPayments = tempPayments.filter(p => p.payment_gateway?.toLowerCase() === filters.gateway.toLowerCase());
        if (filters.caseId) tempPayments = tempPayments.filter(p => String(p.case_id).includes(filters.caseId));
        if (filters.transactionId) {
            const txId = filters.transactionId.trim().toLowerCase();
            tempPayments = tempPayments.filter(p => (p.transaction_id && p.transaction_id.toLowerCase().includes(txId)) || (p.payment_gateway === 'mpesa' && (p.mpesa_message || '').toLowerCase().includes(txId)));
        }
        setFilteredPayments(tempPayments);
    }, [filters, baseUserPayments, currentUserId, isAuthenticated]);

    useEffect(() => { handleFilter(); }, [handleFilter]);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try { return format(parseISO(dateString), 'MMM d, yyyy, h:mm a'); }
        catch (e) { console.warn("Invalid date string for formatting:", dateString); return "Invalid Date"; }
    };

    const handleFilterChange = (field: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [field]: value }));
    const resetFilters = () => { setFilters({ status: '', gateway: '', caseId: '', transactionId: '' }); toast.info("Filters have been reset."); };

    const handleDownloadReceipt = async (payment: PaymentDataTypes) => {
        if (!payment.receipt_url || !payment.payment_id) { toast.error("Receipt URL not available for download."); return; }
        setIsDownloading(payment.payment_id);
        toast.promise(
            (async () => {
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
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    return { fileName };
                } finally { setIsDownloading(null); }
            })(), { loading: 'Downloading receipt...', success: (data) => `Receipt "${data.fileName}" downloaded.`, error: (err) => `Failed to download: ${err.message}` }
        );
    };

    const handleViewReceipt = async (receiptUrl: string) => {
        if (!receiptUrl) { toast.warning("Receipt URL is not available."); return; }
        window.open(receiptUrl, '_blank');
    };
    
    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    if (!isAuthenticated || !currentUserId) {
        return ( <div className="w-full p-4 bg-slate-100 dark:bg-slate-900 min-h-screen flex justify-center items-center"><div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full"><UserX size={56} className="mx-auto mb-5 text-red-500" /><h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Access Denied</h2><p className="text-slate-600 dark:text-slate-400">Please log in to view your payment records.</p></div></div> );
    }
    
    const pageTitle = loggedInUser?.full_name ? `Payment Records for ${loggedInUser.full_name}` : `Your Payment Records`;

    return (
        <div className="w-full p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen font-sans">
            <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">{pageTitle}</h1>
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Toggle theme">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                    <div className="relative"><button ref={userMenuButtonRef} onClick={() => setIsUserMenuOpen(p => !p)} className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900">{loggedInUser?.profile_picture ? <img className="h-9 w-9 rounded-full object-cover" src={loggedInUser.profile_picture} alt="User profile" /> : <User size={24} className="h-9 w-9 text-slate-500" />}</button>
                    <AnimatePresence>{isUserMenuOpen && ( <motion.div ref={userMenuRef} variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl py-1 bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 z-30"><div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700"><p className="text-xs text-slate-600 dark:text-slate-400">Signed in as</p><p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{loggedInUser?.email}</p></div><a href="#" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); }} className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"><Settings size={16} className="mr-2.5 opacity-70"/> Account Settings</a><button onClick={() => { setIsUserMenuOpen(false); toast.info("Logout initiated (placeholder)"); }} className="w-full text-left block px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700/30 flex items-center"><LogOut size={16} className="mr-2.5 opacity-70"/> Sign out</button></motion.div> )}</AnimatePresence></div>
                </div>
            </header>
            
            <div className="mb-8 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5"><h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center mb-3 sm:mb-0"> <ListFilter size={18} className="mr-2.5 text-indigo-500" /> Filter Records </h3><button onClick={resetFilters} className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"><RotateCcw size={15} className="mr-1.5" /> Reset Filters</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div ref={statusDropdownRef} className="relative"><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'All Statuses'}</span><div className="flex items-center">{filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('status', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{['pending', 'completed', 'paid', 'failed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.charAt(0).toUpperCase() + status.slice(1)}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                    <div ref={gatewayDropdownRef} className="relative"><button type="button" onClick={() => setIsGatewayDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.gateway ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.gateway ? filters.gateway.charAt(0).toUpperCase() + filters.gateway.slice(1).replace('_', ' ') : 'All Gateways'}</span><div className="flex items-center">{filters.gateway && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('gateway', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isGatewayDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isGatewayDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('gateway', ''); setIsGatewayDropdownOpen(false); }}>All Gateways</button></li>{['stripe', 'mpesa', 'cash', 'bank_transfer', 'other'].map(gw => (<li key={gw}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('gateway', gw); setIsGatewayDropdownOpen(false); }}>{gw.charAt(0).toUpperCase() + gw.slice(1).replace('_', ' ')}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                    <div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="text" placeholder="Reference / Txn ID" value={filters.transactionId} onChange={(e) => handleFilterChange('transactionId', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.transactionId && (<button type="button" onClick={() => handleFilterChange('transactionId', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                    <div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="number" placeholder="Case ID" value={filters.caseId} onChange={(e) => handleFilterChange('caseId', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.caseId && (<button type="button" onClick={() => handleFilterChange('caseId', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full"><thead className="bg-gradient-to-r from-blue-600 to-sky-600 text-white dark:from-blue-700 dark:to-sky-700"><tr>{[ { icon: Fingerprint, text: 'ID' }, { icon: Briefcase, text: 'Case ID' }, { icon: DollarSign, text: 'Amount' }, { icon: Info, text: 'Status' }, { icon: CreditCard, text: 'Gateway' }, { icon: CalendarDays, text: 'Date' }, { icon: Activity, text: 'Reference' }, { icon: Eye, text: 'Receipt' } ].map(h => <th key={h.text} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"><div className="flex items-center gap-2"><h.icon className="h-4 w-4" />{h.text}</div></th>)}</tr></thead><tbody className="text-slate-700 dark:text-slate-300 text-sm divide-y divide-slate-200 dark:divide-slate-700">{paymentsLoading && baseUserPayments.length === 0 ? (<tr><td colSpan={8} className="text-center py-12"><div className="flex justify-center items-center text-slate-500"><Loader2 size={24} className="animate-spin mr-3" />Loading...</div></td></tr>) : isError && baseUserPayments.length === 0 ? (<tr><td colSpan={8} className="text-center py-12"><div className="flex flex-col items-center text-red-500"><AlertTriangle size={40} className="mb-3" />Error loading records.</div></td></tr>) : !paymentsLoading && baseUserPayments.length === 0 && isAuthenticated ? (<tr><td colSpan={8} className="text-center py-16 text-slate-500"><div className="flex flex-col items-center"><Search size={48} className="mb-4" />You have no payment records.</div></td></tr>) : filteredPayments.length > 0 ? (filteredPayments.map((p) => { const statusInfo = getStatusDisplayInfo(p.payment_status); const currentIsDownloading = isDownloading === p.payment_id; return ( <tr key={p.payment_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40"><td className="px-5 py-4"><div className="flex items-center"><Fingerprint size={15} className="mr-2 text-slate-400" /><span className="font-medium">{p.payment_id}</span></div></td><td className="px-5 py-4">{p.case_id || 'N/A'}</td><td className="px-5 py-4"><span className="font-semibold">KES {Number(p.payment_amount).toFixed(2)}</span></td><td className="px-5 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} ${statusInfo.textClass}`}>{statusInfo.icon}{statusInfo.text}</span></td><td className="px-5 py-4 capitalize">{p.payment_gateway?.replace('_', ' ')}</td><td className="px-5 py-4">{formatDate(p.payment_date)}</td><td className="px-5 py-4"><span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[180px] block" title={String(p.transaction_id || p.mpesa_message || 'N/A')}>{p.transaction_id || p.mpesa_message || 'N/A'}</span></td><td className="px-5 py-4 text-center">{p.receipt_url ? ( <div className="flex items-center justify-center space-x-2"><button onClick={() => handleViewReceipt(p.receipt_url!)} className="font-medium py-1 px-2.5 rounded-md text-sm text-sky-600 hover:bg-sky-100" title="View"><Eye size={16} /></button><button onClick={() => handleDownloadReceipt(p)} disabled={currentIsDownloading} className={`font-medium py-1 px-2.5 rounded-md text-sm text-green-600 hover:bg-green-100 ${currentIsDownloading ? 'opacity-60' : ''}`} title="Download">{currentIsDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}</button></div> ) : (<span className="text-xs italic text-slate-400">N/A</span>)}</td></tr> ); })) : ( <tr><td colSpan={8} className="text-center py-16 text-slate-500"><div className="flex flex-col items-center"><Search size={48} className="mb-4" />No records found for your filters.</div></td></tr> )}</tbody></table></div>
            </div>
        </div>
    );
};

export default UserPaymentRecords;