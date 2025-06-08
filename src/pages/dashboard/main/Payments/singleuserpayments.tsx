// src/components/UserPaymentPortal.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import CashPaymentModal from './cash'; 
import MpesaPayment from './mpesa';  
import StripePaymentModal from './stripe'; 
import ManualPaymentEntryModal from './recordpayment'; 

import {
    useFetchPaymentsQuery,
} from '../../../../features/payment/paymentAPI'; 
import { toast } from "sonner";
import { format, parseISO } from 'date-fns'; 
import {
    PlusCircle, ListFilter, RotateCcw, ChevronDown, X, Search, CalendarDays,
    DollarSign, Fingerprint, Briefcase, Clock, CheckCircle, XCircle, AlertTriangle,
    CreditCard, Activity, Eye, Download,  UserX, LogOut, Settings, Loader2, Edit3
} from 'lucide-react';

// Import Redux hooks and selectors
import { useSelector, } from 'react-redux'; 
import {
    selectCurrentUser,
    selectIsAuthenticated,
    // logoutUserAction, 
} from '../../../../features/users/userSlice'; 

// --- SVG Icons (Define or Import) ---
const SunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const UserCircleIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
// --- End SVG Icons ---

export interface PaymentDataTypes {
    payment_id?: number;
    user_id?: number | string;
    case_id?: number;
    payment_amount?: number | string;
    payment_status?: 'pending' | 'completed' | 'failed' | string;
    payment_gateway?: 'stripe' | 'mpesa' | 'cash' | 'other' |'bank_transfer'| string;
    payment_date?: string; // Should be ISO string from backend
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
            return { badgeClass: 'bg-amber-100 dark:bg-amber-500/20', textClass: 'text-amber-700 dark:text-amber-300', icon: <Clock size={14} className="mr-1" />, text: 'Pending' };
        case 'completed': case 'paid':
            return { badgeClass: 'bg-green-100 dark:bg-green-500/20', textClass: 'text-green-700 dark:text-green-300', icon: <CheckCircle size={14} className="mr-1" />, text: 'Completed' };
        case 'failed':
            return { badgeClass: 'bg-red-100 dark:bg-red-500/20', textClass: 'text-red-700 dark:text-red-300', icon: <XCircle size={14} className="mr-1" />, text: 'Failed' };
        default:
            return { badgeClass: 'bg-slate-100 dark:bg-slate-700/30', textClass: 'text-slate-600 dark:text-slate-400', icon: <AlertTriangle size={14} className="mr-1" />, text: 'Unknown' };
    }
};

const UserPaymentPortal: React.FC = () => {
  //  const dispatch = useDispatch(); // For potential logout action

    // --- Theme State ---
    const getInitialTheme = (): boolean => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('appTheme');
            if (storedTheme) return storedTheme === 'dark';
        }
        return false; // Default to light mode
    };
    const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            if (typeof window !== 'undefined') localStorage.setItem('appTheme', 'dark');
        } else {
            root.classList.remove('dark');
            if (typeof window !== 'undefined') localStorage.setItem('appTheme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    // --- End Theme State ---

    // --- User Menu State & Ref ---
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const userMenuButtonRef = useRef<HTMLButtonElement>(null); // Ref for the button

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node) &&
                userMenuButtonRef.current && !userMenuButtonRef.current.contains(event.target as Node)) {
                 setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // --- End User Menu State ---


    const loggedInUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUserId = loggedInUser?.user_id;

    const [isPaymentModeSelectionOpen, setIsPaymentModeSelectionOpen] = useState(false);
    const paymentModeButtonRef = useRef<HTMLButtonElement>(null); // Ref for payment mode button
    const paymentModeDropdownRef = useRef<HTMLDivElement>(null);  // Ref for payment mode dropdown

     useEffect(() => {
        const handleClickOutsidePaymentDropdown = (event: MouseEvent) => {
            if (paymentModeDropdownRef.current && !paymentModeDropdownRef.current.contains(event.target as Node) &&
                paymentModeButtonRef.current && !paymentModeButtonRef.current.contains(event.target as Node)) {
                 setIsPaymentModeSelectionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsidePaymentDropdown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsidePaymentDropdown);
        };
    }, []);


    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [isManualEntryModalOpen, setIsManualEntryModalOpen] = useState(false);

    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterGateway, setFilterGateway] = useState<string>('');
    const [filterAmount, setFilterAmount] = useState<string>('');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [filterCaseId, setFilterCaseId] = useState<string>('');
    const [filterTransactionId, setFilterTransactionId] = useState<string>('');

    const { data, isLoading: paymentsLoading, isError, error, refetch } = useFetchPaymentsQuery(undefined, {
        skip: !isAuthenticated || !currentUserId,
    }) as FetchPaymentsQueryResult;
    
    const [baseUserPayments, setBaseUserPayments] = useState<PaymentDataTypes[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[]>([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId) {
            setBaseUserPayments([]); setFilteredPayments([]); return;
        }
        if (data?.success && Array.isArray(data.payments)) {
            const userSpecificPayments = data.payments.filter(p => String(p.user_id) === String(currentUserId));
            setBaseUserPayments(userSpecificPayments);
        } else {
            setBaseUserPayments([]); setFilteredPayments([]);
            if (isError && !paymentsLoading) {
                toast.error("Error fetching your payment data.");
                console.error("Error fetching payments:", error);
            } else if (data && !data.success && !paymentsLoading) {
                toast.warning("Could not fetch your payment data successfully.");
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
        if (filterDateFrom && filterDateFrom.length > 0) { // Ensure date string is not empty
             try { tempPayments = tempPayments.filter(p => p.payment_date && new Date(p.payment_date) >= new Date(filterDateFrom)); } catch(e) { console.warn("Invalid from date")}
        }
        if (filterDateTo && filterDateTo.length > 0) { // Ensure date string is not empty
            try { tempPayments = tempPayments.filter(p => p.payment_date && new Date(p.payment_date) <= new Date(new Date(filterDateTo).setHours(23,59,59,999))); } catch(e) { console.warn("Invalid to date")}
        }
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
        try { return format(parseISO(dateString), 'MMM d, yyyy, h:mm a'); } // Use parseISO for robust parsing
        catch (e) { console.warn("Invalid date string for formatting:", dateString); return "Invalid Date"; }
    };

    const resetFilters = () => {
        setFilterStatus(''); setFilterGateway(''); setFilterAmount('');
        setFilterDateFrom(''); setFilterDateTo(''); setFilterCaseId('');
        setFilterTransactionId('');
        toast.info("Filters have been reset.");
    };

    const handlePaymentModeSelect = (mode: PaymentMode) => {
        if (!isAuthenticated || !currentUserId) {
            toast.error("You must be logged in to initiate a payment.");
            return;
        }
        setIsPaymentModeSelectionOpen(false);
        switch (mode) {
            case 'cash': setIsCashModalOpen(true); break;
            case 'mpesa': setIsMpesaModalOpen(true); break;
            case 'stripe': setIsStripeModalOpen(true); break;
            case 'manual_entry': setIsManualEntryModalOpen(true); break;
            default: break;
        }
    };

    const handleClosePaymentModals = () => {
        setIsCashModalOpen(false); setIsMpesaModalOpen(false);
        setIsStripeModalOpen(false); setIsManualEntryModalOpen(false);
        if (isAuthenticated && currentUserId) {
            refetch(); // Refetch payments after a modal is closed
        }
    };
    
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
        // For non-HTML receipts, just open in new tab
        if (!receiptUrl.toLowerCase().endsWith('.html') && !receiptUrl.toLowerCase().endsWith('.htm')) {
            window.open(receiptUrl, '_blank');
            return;
        }
        // For HTML, fetch and display as blob to handle potential CORS or rendering issues
        toast.promise(
            (async () => {
                const response = await fetch(receiptUrl);
                if (!response.ok) {
                    const errorText = `Failed to fetch receipt: ${response.statusText} (${response.status})`;
                    throw new Error(errorText);
                }
                const htmlString = await response.text();
                const blob = new Blob([htmlString], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);
                const newWindow = window.open(blobUrl, '_blank');
                if (newWindow) newWindow.focus();
                else { URL.revokeObjectURL(blobUrl); throw new Error("popup_blocked"); }
                // Don't revoke immediately if it's an HTML blob URL being viewed
                // URL.revokeObjectURL(blobUrl); // Let browser handle this
                return "Receipt opened.";
            })(),
            {
                loading: 'Loading receipt...',
                success: (message) => message,
                error: (err: Error) => {
                    console.error("Error viewing receipt:", err);
                    if (err.message === "popup_blocked") return "Please allow pop-ups for this site.";
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
        <div className="flex-1 min-w-[180px] sm:min-w-[200px]">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">{React.cloneElement(icon, { size: 16 })}</div>}
                {type === "select" ? (
                    <select id={id} className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-10 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-slate-900 dark:text-slate-100 appearance-none`} value={value} onChange={onChange}>
                        {options?.map(opt => <option key={opt.value} value={opt.value} className="dark:bg-slate-700 dark:text-slate-100">{opt.label}</option>)}
                    </select>
                ) : (
                    <input type={type} id={id} className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`} placeholder={placeholder} value={value} onChange={onChange} />
                )}
                {type === "select" && <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" />}
            </div>
        </div>
    );

    const paymentModes: { mode: PaymentMode; label: string; icon: JSX.Element }[] = [
        { mode: 'mpesa', label: 'M-Pesa (STK Push)', icon: <CreditCard size={16} className="mr-2.5 opacity-70" /> },
        { mode: 'stripe', label: 'Stripe (Card/Wallet)', icon: <CreditCard size={16} className="mr-2.5 opacity-70" /> },
        { mode: 'cash', label: 'Cash (Record)', icon: <DollarSign size={16} className="mr-2.5 opacity-70" /> },
         { mode: 'manual_entry', label: 'Manual Entry (Admin)', icon: <Edit3 size={16} className="mr-2.5 opacity-70" /> }, // Usually for admins
    ];

    if (!isAuthenticated || !currentUserId) {
        return (
            <div className="w-full p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen font-sans flex justify-center items-center transition-colors duration-300">
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
                    <UserX size={56} className="mx-auto mb-5 text-red-500 dark:text-red-400" />
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-400">Please log in to view your payment portal.</p>
                    {/* Add a login button/link if applicable */}
                    {/* <button onClick={() => navigate('/login')} className="mt-6 ...">Login</button> */}
                </div>
            </div>
        );
    }
    
    const portalTitle = loggedInUser?.full_name ? `${loggedInUser.full_name}'s Payment Portal` : `Your Payment Portal`;

    return (
        <div className="w-full p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
            {/* Header Section */}
            <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">
                    {portalTitle}
                </h1>
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all"
                        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                    <div className="relative">
                        <button 
                            ref={userMenuButtonRef}
                            onClick={() => setIsUserMenuOpen(prev => !prev)}
                            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900"
                            id="user-menu-button" aria-expanded={isUserMenuOpen} aria-haspopup="true"
                        >
                            <span className="sr-only">Open user menu</span>
                            {loggedInUser?.profile_picture ? (
                                <img className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors" src={loggedInUser.profile_picture} alt="User profile" />
                            ) : (
                                <UserCircleIcon className="h-9 w-9 text-slate-500 dark:text-slate-400" />
                            )}
                        </button>
                        {isUserMenuOpen && (
                             <div ref={userMenuRef} className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl py-1 bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none z-30">
                                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Signed in as</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate" title={loggedInUser?.email}>{loggedInUser?.email}</p>
                                </div>
                                {/* Replace # with actual links or onClick handlers */}
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); /* navigate to account settings */}} className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center" role="menuitem">
                                    <Settings size={16} className="mr-2.5 opacity-70"/> Account Settings
                                </a>
                                <button onClick={() => { setIsUserMenuOpen(false); /* dispatch(logoutUserAction()); */ toast.info("Logout initiated (placeholder)"); }} className="w-full text-left block px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700/30 flex items-center" role="menuitem">
                                   <LogOut size={16} className="mr-2.5 opacity-70"/> Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Initiate Payment Button */}
             <div className="mb-6 text-right">
                <div className="relative inline-block">
                    <button ref={paymentModeButtonRef} type="button" className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900 transition-colors" onClick={() => setIsPaymentModeSelectionOpen(prev => !prev)} aria-expanded={isPaymentModeSelectionOpen} aria-haspopup="true">
                        <PlusCircle size={18} className="mr-2" /> Initiate New Payment <ChevronDown size={18} className={`ml-2 transform transition-transform duration-200 ${isPaymentModeSelectionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPaymentModeSelectionOpen && (
                        <div ref={paymentModeDropdownRef} className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none z-20 py-1.5">
                            {paymentModes.map(({ mode, label, icon }) => (
                                <button key={mode} onClick={() => handlePaymentModeSelect(mode)} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100">
                                    {icon} {label}
                                </button>
                            ))}
                            <div className="border-t border-slate-200 dark:border-slate-700 my-1.5"></div>
                            <button onClick={() => setIsPaymentModeSelectionOpen(false)} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700/30 hover:text-red-700 dark:hover:text-red-300">
                                <X size={16} className="mr-2.5 opacity-70" /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Section */}
            <div className="mb-8 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center mb-3 sm:mb-0"> <ListFilter size={18} className="mr-2.5 text-indigo-500 dark:text-indigo-400" /> Filter Payments </h3>
                    <button onClick={resetFilters} className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-800 transition-colors">
                        <RotateCcw size={15} className="mr-1.5" /> Reset Filters
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
                    {renderFilterInput("statusFilter", "Status", filterStatus, (e) => setFilterStatus(e.target.value), "select", "", [{ value: "", label: "All Statuses" }, { value: "pending", label: "Pending" }, { value: "completed", label: "Completed" }, { value: "paid", label: "Paid" },{ value: "failed", label: "Failed" }], <ListFilter />)}
                    {renderFilterInput("gatewayFilter", "Gateway", filterGateway, (e) => setFilterGateway(e.target.value), "select", "", [{ value: "", label: "All Gateways" }, { value: "stripe", label: "Stripe" }, { value: "mpesa", label: "M-Pesa" }, { value: "cash", label: "Cash" },{value: "bank_transfer", label: "Bank Transfer"}, {value: "other", label: "Other"}], <CreditCard />)}
                    {renderFilterInput("amountFilter", "Amount (KES)", filterAmount, (e) => setFilterAmount(e.target.value), "number", "e.g., 1500", undefined, <DollarSign />)}
                    {renderFilterInput("dateFromFilter", "Date From", filterDateFrom, (e) => setFilterDateFrom(e.target.value), "date", "", undefined, <CalendarDays />)}
                    {renderFilterInput("dateToFilter", "Date To", filterDateTo, (e) => setFilterDateTo(e.target.value), "date", "", undefined, <CalendarDays />)}
                    {renderFilterInput("caseIdFilter", "Case ID", filterCaseId, (e) => setFilterCaseId(e.target.value), "text", "Enter Case ID", undefined, <Briefcase />)}
                    {renderFilterInput("transactionIdFilter", "Reference / Txn ID", filterTransactionId, (e) => setFilterTransactionId(e.target.value), "text", "Txn ID or M-Pesa Code", undefined, <Activity />)}
                </div>
            </div>

            {/* Payment Table */}
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-100 dark:bg-slate-700/60">
                             <tr className="text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                <th className="px-5 py-3.5 whitespace-nowrap">Payment ID</th> <th className="px-5 py-3.5 whitespace-nowrap">Case ID</th>
                                <th className="px-5 py-3.5 whitespace-nowrap">Amount</th> <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
                                <th className="px-5 py-3.5 whitespace-nowrap">Gateway</th> <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
                                <th className="px-5 py-3.5 whitespace-nowrap">Reference / Txn ID</th> <th className="px-5 py-3.5 text-center whitespace-nowrap">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300 text-sm divide-y divide-slate-200 dark:divide-slate-700">
                            {paymentsLoading && baseUserPayments.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12"><div className="flex justify-center items-center text-slate-500 dark:text-slate-400"><Loader2 size={24} className="animate-spin mr-3" />Loading your payments...</div></td></tr>
                            ) : isError && baseUserPayments.length === 0 && !paymentsLoading ? (
                                <tr><td colSpan={8} className="text-center py-12"><div className="flex flex-col items-center text-red-500 dark:text-red-400"><AlertTriangle size={40} className="mb-3" /> Error loading payments. Please try again.</div></td></tr>
                            ) : !paymentsLoading && baseUserPayments.length === 0 && isAuthenticated ? (
                                <tr><td colSpan={8} className="text-center py-16 text-slate-500 dark:text-slate-400"><div className="flex flex-col items-center"><Search size={48} className="mb-4 text-slate-400 dark:text-slate-500" />You have no payment records yet.</div></td></tr>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => {
                                    const statusInfo = getStatusDisplayInfo(payment.payment_status);
                                    const currentIsDownloading = isDownloading === payment.payment_id;
                                    return (
                                        <tr key={payment.payment_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150">
                                            <td className="px-5 py-4 whitespace-nowrap"><div className="flex items-center"><Fingerprint size={15} className="mr-2 text-slate-400 dark:text-slate-500 flex-shrink-0" /><span className="font-medium text-slate-900 dark:text-slate-100">{payment.payment_id}</span></div></td>
                                            <td className="px-5 py-4 whitespace-nowrap">{payment.case_id || <span className="italic text-slate-400 dark:text-slate-500">N/A</span>}</td>
                                            <td className="px-5 py-4 whitespace-nowrap"><span className="font-semibold text-slate-800 dark:text-slate-100">KES {Number(payment.payment_amount).toFixed(2)}</span></td>
                                            <td className="px-5 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold leading-tight ${statusInfo.badgeClass} ${statusInfo.textClass}`}>{statusInfo.icon}{statusInfo.text}</span></td>
                                            <td className="px-5 py-4 whitespace-nowrap capitalize">{payment.payment_gateway?.replace('_', ' ')}</td>
                                            <td className="px-5 py-4 whitespace-nowrap">{formatDate(payment.payment_date)}</td>
                                            <td className="px-5 py-4 whitespace-nowrap"><span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[180px] block" title={String(payment.transaction_id || payment.mpesa_message || 'N/A')}>{payment.transaction_id || payment.mpesa_message || <span className="italic text-slate-400 dark:text-slate-500">N/A</span>}</span></td>
                                            <td className="px-5 py-4 text-center whitespace-nowrap">
                                                {payment.receipt_url ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button onClick={() => handleViewReceipt(payment.receipt_url!)} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 font-medium py-1 px-2.5 rounded-md inline-flex items-center text-sm hover:bg-sky-100 dark:hover:bg-sky-700/30 transition-colors" title="View Receipt"><Eye size={16} className="mr-1" /> View</button>
                                                        <button onClick={() => handleDownloadReceipt(payment)} disabled={currentIsDownloading} className={`text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium py-1 px-2.5 rounded-md inline-flex items-center text-sm hover:bg-green-100 dark:hover:bg-green-700/30 transition-colors ${currentIsDownloading ? 'opacity-60 cursor-not-allowed' : ''}`} title="Download Receipt">
                                                            {currentIsDownloading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Download size={16} className="mr-1" />}
                                                            {currentIsDownloading ? 'Wait...' : 'Download'}
                                                        </button>
                                                    </div>
                                                ) : (<span className="text-xs italic text-slate-400 dark:text-slate-500">No Receipt</span>)}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : ( 
                               !paymentsLoading && baseUserPayments.length > 0 && filteredPayments.length === 0 && isAuthenticated && (
                                <tr><td colSpan={8} className="text-center py-16 text-slate-500 dark:text-slate-400"><div className="flex flex-col items-center"><Search size={48} className="mb-4 text-slate-400 dark:text-slate-500" />No payments found matching your filters.</div></td></tr>
                               )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals - Pass isDarkMode prop */}
            {currentUserId && isCashModalOpen && <CashPaymentModal isOpen={isCashModalOpen} onClose={handleClosePaymentModals} userId={currentUserId} isDarkMode={isDarkMode} />}
            {currentUserId && isMpesaModalOpen && <MpesaPayment isOpen={isMpesaModalOpen} onClose={handleClosePaymentModals} userId={currentUserId} isDarkMode={isDarkMode} />}
            {currentUserId && isStripeModalOpen && <StripePaymentModal isOpen={isStripeModalOpen} onClose={handleClosePaymentModals} userId={currentUserId} isDarkMode={isDarkMode} />}
            {currentUserId && isManualEntryModalOpen && <ManualPaymentEntryModal isOpen={isManualEntryModalOpen} onClose={handleClosePaymentModals} userId={currentUserId} isDarkMode={isDarkMode} />}
        </div>
    );
};

export default UserPaymentPortal;