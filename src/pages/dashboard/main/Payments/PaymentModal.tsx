// src/pages/dashboard/main/Payments/PaymentHistory.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../features/users/userSlice';
import CashPaymentModal from './cash';
import MpesaPayment from './mpesa';
import StripePaymentModal from './stripe';
import ManualPaymentEntryModal from './recordpayment';
import { useFetchPaymentsQuery, PaymentDataTypes } from '../../../../features/payment/paymentAPI';
import { useFetchUsersQuery, UserDataTypes } from '../../../../features/users/usersAPI';
import { useFetchCasesQuery, CaseDataTypes } from '../../../../features/case/caseAPI';
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, ChevronDown, X, Search, CalendarDays, DollarSign,
    Info, Clock, CheckCircle, XCircle, AlertTriangle, CreditCard,
    Eye, Edit3, Sun, Moon, User, Briefcase, Table as TableIcon,
    Wallet, Calculator, Landmark, FileText, ExternalLink, RefreshCw,
    Hash, Phone, Banknote, Filter, PieChart as PieChartIcon, BookOpen,
    TrendingUp, TrendingDown, Users as UsersIcon, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- CONFIGURATION & TYPES ---
const ITEMS_PER_PAGE = 10;
type PaymentMode = 'cash' | 'mpesa' | 'stripe' | 'manual_entry';
type Tab = 'dashboard' | 'analytics' | 'activity';
type ActivityLog = { id: number; timestamp: Date; icon: React.ElementType; color: string; message: string; };

// --- STYLING & HELPERS ---
const PIE_CHART_COLORS = { light: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'], dark: ['#818cf8', '#34d399', '#facc15', '#a78bfa'] };
const getMethodIcon = (method: string) => {
    switch (method) {
        case 'mpesa': return <Phone className="h-4 w-4 text-green-500" />;
        case 'stripe': return <CreditCard className="h-4 w-4 text-blue-500" />;
        case 'cash': return <Wallet className="h-4 w-4 text-yellow-500" />;
        case 'bank_transfer': return <Landmark className="h-4 w-4 text-purple-500" />;
        default: return <Banknote className="h-4 w-4 text-slate-500" />;
    }
};

const statusBadge = (status: string) => {
    switch (status) {
        case 'completed': case 'paid': return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200"><CheckCircle className="h-3.5 w-3.5"/>Completed</span>;
        case 'pending': return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-200"><Clock className="h-3.5 w-3.5"/>Pending</span>;
        case 'failed': return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200"><XCircle className="h-3.5 w-3.5"/>Failed</span>;
        default: return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200">{status}</span>;
    }
};

// --- REUSABLE SUB-COMPONENTS ---
const HeaderCell: React.FC<{ text: string; icon: React.ElementType; className?: string }> = ({ text, icon: Icon, className }) => ( <th className={`p-4 text-left text-xs font-semibold uppercase tracking-wider ${className}`}><div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {text}</div></th> );
const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => ( <tr>{Array.from({ length: columns }).map((_, i) => <td key={i} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>)}</tr> );
const SummaryCard: React.FC<{ title: string; value: string; icon: React.ElementType; iconBgClass: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon: Icon, iconBgClass, change, changeType }) => ( <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm"><div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgClass}`}><Icon className="w-6 h-6 text-white" /></div><div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><div className="flex items-baseline gap-2"><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>{change && changeType && (<span className={`flex items-center text-xs font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>{changeType === 'increase' ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}{change}</span>)}</div></div></motion.div> );
const TabButton: React.FC<{ text: string; icon: React.ElementType; isActive: boolean; onClick: () => void; }> = ({ text, icon: Icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Icon size={16}/>{text}</button> );

// --- TRANSACTION DETAIL PANEL ---
const TransactionDetailPanel: React.FC<{ payment: PaymentDataTypes | null; user: UserDataTypes | null; caseData: CaseDataTypes | null; onClose: () => void; onViewReceipt: (receiptUrl: string | null) => void; }> = ({ payment, user, caseData, onClose, onViewReceipt }) => (
    <AnimatePresence>
        {payment && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50">
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col max-h-screen">
                    <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">Transaction Details</h3>
                        <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><X size={20}/></button>
                    </header>
                    <div className="flex-grow p-6 overflow-y-auto styled-scrollbar">
                        <dl className="space-y-4">
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Transaction ID</dt><dd className="font-mono text-sm text-slate-500">{payment.transaction_id || 'N/A'}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Case Number</dt><dd className="font-mono text-sm text-slate-500">{caseData?.case_number || 'N/A'}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Status</dt><dd>{statusBadge(payment.payment_status || '')}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Amount</dt><dd className="text-xl font-bold text-slate-800 dark:text-white">KES {Number(payment.payment_amount).toFixed(2)}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Method</dt><dd className="capitalize flex items-center gap-2">{getMethodIcon(payment.payment_gateway || '')} {payment.payment_gateway?.replace('_', ' ')}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">User</dt><dd>{user?.full_name || 'N/A'}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Email</dt><dd>{user?.email || 'N/A'}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Payment Date</dt><dd>{payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'N/A'}</dd></div>
                            <div><dt className="font-semibold text-slate-600 dark:text-slate-300 mb-1">M-Pesa Message</dt><dd className="text-sm p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">{payment.mpesa_message || 'No message provided.'}</dd></div>
                        </dl>
                    </div>
                    <footer className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 flex-shrink-0">
                        {payment.receipt_url && <button onClick={() => onViewReceipt(payment.receipt_url ?? null)} className="flex-1 text-center font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">View Receipt <ExternalLink size={16}/> </button>}
                    </footer>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const PaymentHistory: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const { data: apiResponse, isLoading: isLoadingPayments, isError, refetch } = useFetchPaymentsQuery();
    const { data: usersData } = useFetchUsersQuery();
    const { data: casesData } = useFetchCasesQuery();
    const loggedInUser = useSelector(selectCurrentUser);
    
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [filters, setFilters] = useState({ term: '', method: '', dateFrom: '', dateTo: '', transactionId: '', caseNumber: '', status: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<PaymentDataTypes | null>(null);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    const [isPaymentModeSelectionOpen, setIsPaymentModeSelectionOpen] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [isManualEntryModalOpen, setIsManualEntryModalOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [, setIsGatewayDropdownOpen] = useState(false);

    const paymentModeDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const gatewayDropdownRef = useRef<HTMLDivElement>(null);

    // --- DATA & DERIVED STATE ---
    const userMap = useMemo(() => {
        if (!usersData) return new Map<number, UserDataTypes>();
        return new Map(usersData.map((user: UserDataTypes) => [user.user_id, user]));
    }, [usersData]);

    const caseMap = useMemo(() => {
        if (!casesData) return new Map<number, CaseDataTypes>();
        return new Map(casesData.map((c: CaseDataTypes) => [c.case_id, c]));
    }, [casesData]);

    const allPayments = useMemo(() => apiResponse?.payments || [], [apiResponse]);
    const casePayments = useMemo(() => allPayments.filter((p: PaymentDataTypes) => p.case_id && p.user_id), [allPayments]);

    useEffect(() => {
        if (casePayments.length > 0 && activityLogs.length === 0) {
            addActivityLog(CheckCircle, 'text-green-500', `${casePayments.length} case payments loaded successfully.`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [casePayments]);
    
    const addActivityLog = (icon: React.ElementType, color: string, message: string) => {
        setActivityLogs(prev => [{ id: Date.now(), timestamp: new Date(), icon, color, message }, ...prev].slice(0, 100));
    };

    const filteredAndSortedPayments = useMemo(() => {
        return casePayments
            .filter((p: PaymentDataTypes) => {
                const user = p.user_id ? userMap.get(p.user_id) : null;
                const caseInfo = p.case_id ? caseMap.get(p.case_id) : null;
                const searchTerm = filters.term.toLowerCase();

                const termMatch = filters.term ? (user?.full_name?.toLowerCase().includes(searchTerm) || user?.email?.toLowerCase().includes(searchTerm)) : true;
                const caseNumberMatch = filters.caseNumber ? (caseInfo?.case_number?.toLowerCase().includes(filters.caseNumber.toLowerCase())) : true;
                const methodMatch = filters.method ? p.payment_gateway === filters.method : true;
                const dateFromMatch = filters.dateFrom ? new Date(p.payment_date || 0) >= new Date(filters.dateFrom) : true;
                const dateToMatch = filters.dateTo ? new Date(p.payment_date || 0) <= new Date(filters.dateTo + 'T23:59:59') : true;
                const transactionIdMatch = filters.transactionId ? (p.transaction_id || '').toLowerCase().includes(filters.transactionId.toLowerCase()) : true;
                const statusMatch = filters.status ? p.payment_status === filters.status : true;
                
                return termMatch && methodMatch && dateFromMatch && dateToMatch && transactionIdMatch && caseNumberMatch && statusMatch;
            })
            .sort((a: PaymentDataTypes, b: PaymentDataTypes) => new Date(b.payment_date || 0).getTime() - new Date(a.payment_date || 0).getTime());
    }, [casePayments, filters, userMap, caseMap]);

    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedPayments, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedPayments.length / ITEMS_PER_PAGE);
    
    const analyticsData = useMemo(() => {
        const completed = casePayments.filter(p => p.payment_status === 'completed' || p.payment_status === 'paid');
        const pending = casePayments.filter(p => p.payment_status === 'pending');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyRevenue = completed.filter(p => new Date(p.payment_date || 0) >= startOfMonth).reduce((sum, p) => sum + Number(p.payment_amount), 0);
        const lastMonthRevenue = completed.filter(p => {
            const date = new Date(p.payment_date || 0);
            return date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();
        }).reduce((sum, p) => sum + Number(p.payment_amount), 0);
        const revenueChange = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : monthlyRevenue > 0 ? 100 : 0;
        
        const customerSet = new Set(completed.filter(p => new Date(p.payment_date || 0) >= startOfMonth).map(p => p.user_id));
        
        const customerLeaderboard = Object.values(completed.reduce((acc: {[key: string]: {user: UserDataTypes; total: number}}, p) => {
            const user = p.user_id ? userMap.get(p.user_id) : null;
            if (user) {
                if(!acc[user.user_id]) acc[user.user_id] = {user, total: 0};
                acc[user.user_id].total += Number(p.payment_amount);
            }
            return acc;
        }, {})).sort((a,b) => b.total - a.total).slice(0, 5);
        
        const total = completed.reduce((sum, p) => sum + Number(p.payment_amount), 0);
        const avgTransaction = completed.length > 0 ? total / completed.length : 0;
        const methodDistribution = completed.reduce((acc: { [key: string]: number }, p) => { const gateway = p.payment_gateway || 'other'; acc[gateway] = (acc[gateway] || 0) + Number(p.payment_amount); return acc; }, {});
        const pieChartData = Object.entries(methodDistribution).map(([name, value]) => ({ name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value }));
        const last7Days = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0]; }).reverse();
        const barChartData = last7Days.map(date => ({ name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), revenue: completed.filter(p => p.payment_date?.startsWith(date)).reduce((sum, p) => sum + Number(p.payment_amount), 0) }));

        return { total, avgTransaction, completedCount: completed.length, pendingCount: pending.length, monthlyRevenue, revenueChange, newCustomers: customerSet.size, customerLeaderboard, pieChartData, barChartData };
    }, [casePayments, userMap]);

    // --- HANDLERS ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
            if (gatewayDropdownRef.current && !gatewayDropdownRef.current.contains(event.target as Node)) setIsGatewayDropdownOpen(false);
            if (paymentModeDropdownRef.current && !paymentModeDropdownRef.current.contains(event.target as Node)) setIsPaymentModeSelectionOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };
    const handleResetFilters = () => { setFilters({ term: '', method: '', dateFrom: '', dateTo: '', transactionId: '', caseNumber: '', status: '' }); setCurrentPage(1); toast.info("Filters have been reset."); };
    const handleFilterChange = (field: keyof typeof filters, value: string) => setFilters(prev => ({...prev, [field]: value}));
    
    const handleViewReceipt = async (receiptUrl: string | null) => {
        if (!receiptUrl) { toast.error("No receipt URL available for this transaction."); return; }
        const receiptPromise = fetch(receiptUrl);
        await toast.promise(receiptPromise, {
            loading: 'Fetching receipt...',
            success: async (response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const htmlContent = await response.text();
                const newWindow = window.open("", "_blank");
                if (newWindow) {
                    newWindow.document.open();
                    newWindow.document.write(htmlContent);
                    newWindow.document.close();
                    newWindow.document.title = "Payment Receipt";
                } else throw new Error("Pop-up blocker might be enabled.");
                return 'Receipt opened successfully!';
            },
            error: (err: Error) => `Failed to open receipt: ${err.message}`
        });
    };

    const handleDownloadReceipt = async (payment: PaymentDataTypes) => {
        if (!payment.receipt_url || !payment.payment_id) { toast.error("Receipt URL not available for download."); return; }
        setIsDownloading(payment.payment_id);
        await toast.promise(
            async () => {
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
            }, { 
                loading: 'Downloading receipt...', 
                success: (data: { fileName: string }) => `Receipt "${data.fileName}" downloaded.`, 
                error: (err: Error) => err.message || "Download failed.",
                finally: () => setIsDownloading(null)
            }
        );
    };

    const handleExportCSV = () => {
        if (filteredAndSortedPayments.length === 0) { toast.error("No data to export."); return; }
        const headers = ["User", "Email", "Case Number", "Amount (KES)", "Method", "Date", "Status", "Transaction ID", "Receipt URL"];
        const csvContent = [headers.join(',')];

        filteredAndSortedPayments.forEach((p) => {
            const user = p.user_id ? userMap.get(p.user_id) : null;
            const caseInfo = p.case_id ? caseMap.get(p.case_id) : null;
            const rowData = [
                `"${user?.full_name || 'N/A'}"`,
                `"${user?.email || 'N/A'}"`,
                `"${caseInfo?.case_number || 'N/A'}"`,
                Number(p.payment_amount).toFixed(2),
                p.payment_gateway,
                p.payment_date ? new Date(p.payment_date).toLocaleString() : 'N/A',
                p.payment_status,
                p.transaction_id || 'N/A',
                p.receipt_url || 'N/A'
            ];
            csvContent.push(rowData.join(','));
        });

        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'case_payments_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Payment data exported to CSV.");
    };

    const handleClosePaymentModals = () => {
        setIsCashModalOpen(false);
        setIsMpesaModalOpen(false);
        setIsStripeModalOpen(false);
        setIsManualEntryModalOpen(false);
        refetch();
    };

    const handlePaymentModeSelect = (mode: PaymentMode) => {
        setIsPaymentModeSelectionOpen(false);
        switch (mode) {
            case 'cash': setIsCashModalOpen(true); break;
            case 'mpesa': setIsMpesaModalOpen(true); break;
            case 'stripe': setIsStripeModalOpen(true); break;
            case 'manual_entry': setIsManualEntryModalOpen(true); break;
        }
    };

    const paymentModes: { mode: PaymentMode; label: string; icon: JSX.Element }[] = [ { mode: 'mpesa', label: 'M-Pesa (STK)', icon: <CreditCard size={16} /> }, { mode: 'stripe', label: 'Stripe (Card)', icon: <CreditCard size={16} /> }, { mode: 'cash', label: 'Cash (Automated)', icon: <DollarSign size={16} /> }, { mode: 'manual_entry', label: 'Manual Entry', icon: <Edit3 size={16} /> }, ];

    const renderDashboardTab = () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Total Paid Revenue" value={`KES ${analyticsData.total.toFixed(2)}`} icon={Wallet} iconBgClass="bg-green-500" />
                <SummaryCard title="Completed Payments" value={String(analyticsData.completedCount)} icon={CheckCircle} iconBgClass="bg-blue-500" />
                <SummaryCard title="Avg. Transaction" value={`KES ${analyticsData.avgTransaction.toFixed(2)}`} icon={Calculator} iconBgClass="bg-sky-500" />
                <SummaryCard title="Pending Payments" value={String(analyticsData.pendingCount)} icon={Clock} iconBgClass="bg-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-8">Case Payment History</h3>
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
                    <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search User</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="term" placeholder="Name or Email..." value={filters.term} onChange={(e) => handleFilterChange('term', e.target.value)} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 pr-4" /></div></div>
                    <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Case Number</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="caseNumber" placeholder="Case Number..." value={filters.caseNumber} onChange={(e) => handleFilterChange('caseNumber', e.target.value)} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 pr-4" /></div></div>
                    <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Transaction ID</label><div className="relative"><Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="transactionId" placeholder="Transaction ID..." value={filters.transactionId} onChange={(e) => handleFilterChange('transactionId', e.target.value)} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 pr-4" /></div></div>
                    <div ref={statusDropdownRef} className="relative">
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Status</label>
                        <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 px-4 text-left flex justify-between items-center`}>
                            <span className={`truncate ${!filters.status ? 'text-slate-400 dark:text-slate-500' : 'font-semibold'}`}>{filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'All Statuses'}</span>
                            <div className="flex items-center">
                                {filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('status', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        <AnimatePresence>
                            {isStatusDropdownOpen && (
                                <motion.ul initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {['completed', 'pending', 'failed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.charAt(0).toUpperCase() + status.slice(1)}</button></li>))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    <button onClick={handleResetFilters} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"><Filter size={16}/> Reset All</button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 styled-scrollbar">
                <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <HeaderCell text="User" icon={User} />
                            <HeaderCell text="Case Number" icon={Briefcase} className="whitespace-nowrap"/>
                            <HeaderCell text="Transaction ID" icon={Hash} className="whitespace-nowrap" />
                            <HeaderCell text="Amount" icon={DollarSign} />
                            <HeaderCell text="Method" icon={CreditCard} />
                            <HeaderCell text="Date" icon={CalendarDays} className="whitespace-nowrap"/>
                            <HeaderCell text="Status" icon={Info} />
                            <HeaderCell text="Actions" icon={Eye} className="text-center" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {isLoadingPayments && [1,2,3,4,5].map(i => <SkeletonRow key={i} columns={8}/>)}
                        {!isLoadingPayments && paginatedPayments.map((p) => {
                            const user = p.user_id ? userMap.get(p.user_id) : null;
                            const caseInfo = p.case_id ? caseMap.get(p.case_id) : null;
                            const currentIsDownloading = isDownloading === p.payment_id;
                            return (
                               <tr key={p.payment_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-800 dark:text-slate-100">{user?.full_name || 'N/A'}</div>
                                        <div className="text-xs text-slate-500">{user?.email || 'No Email'}</div>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{caseInfo?.case_number || p.case_id}</td>
                                    <td className="p-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.transaction_id || 'N/A'}</td>
                                    <td className="p-4"><div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white"><span>KES {Number(p.payment_amount).toFixed(2)}</span></div></td>
                                    <td className="p-4"><div className="flex items-center gap-2 capitalize">{getMethodIcon(p.payment_gateway || '')}<span className="font-semibold">{p.payment_gateway?.replace('_', ' ')}</span></div></td>
                                    <td className="p-4 whitespace-nowrap"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400"/><span className="font-semibold">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'}</span></div></td>
                                    <td className="p-4">{statusBadge(p.payment_status || '')}</td>
                                    <td className="p-4 text-center">
                                        <div className='flex items-center justify-center gap-1'>
                                            <button onClick={() => setSelectedPaymentDetail(p)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200" title="View Details">
                                                <Eye size={14}/> Details
                                            </button>
                                            {p.receipt_url && (
                                                <>
                                                    <button onClick={() => handleViewReceipt(p.receipt_url ?? null)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/50 dark:hover:bg-blue-800/80 text-blue-700 dark:text-blue-200" title="View Receipt">
                                                        <FileText size={14}/> ViewReceipt
                                                    </button>
                                                    <button onClick={() => handleDownloadReceipt(p)} disabled={currentIsDownloading} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold bg-green-100 hover:bg-green-200 dark:bg-green-800/50 dark:hover:bg-green-800/80 text-green-700 dark:text-green-200 ${currentIsDownloading ? 'opacity-50 cursor-not-allowed' : ''}`} title="Save Receipt">
                                                        {currentIsDownloading ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-green-600"></div> : <Download size={14}/>}
                                                        SaveReceipt
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                               </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {!isLoadingPayments && casePayments.length === 0 && (
                <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
                    <TableIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">No Case Payments Found</h3>
                    <p className="text-sm text-slate-500 mt-1">Payments linked to a case will appear here.</p>
                </div>
            )}
            {!isLoadingPayments && filteredAndSortedPayments.length === 0 && casePayments.length > 0 && (
                 <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
                    <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">No Payments Match Filters</h3>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria.</p>
                </div>
            )}
            {totalPages > 1 && <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4"><p className="text-sm text-slate-500">Showing <strong>{paginatedPayments.length}</strong> of <strong>{filteredAndSortedPayments.length}</strong> results</p><div className="flex items-center gap-2"><button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Prev</button><span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Next</button></div></div>}
        </>
    );

     const renderAnalyticsTab = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryCard title="This Month's Revenue" value={`KES ${analyticsData.monthlyRevenue.toFixed(2)}`} icon={Wallet} iconBgClass="bg-green-500" change={`${analyticsData.revenueChange.toFixed(1)}%`} changeType={analyticsData.revenueChange >= 0 ? 'increase' : 'decrease'}/>
                    <SummaryCard title="New Paying Users (This Month)" value={analyticsData.newCustomers.toString()} icon={UsersIcon} iconBgClass="bg-blue-500"/>
                    <SummaryCard title="Total Revenue (All Time)" value={`KES ${analyticsData.total.toFixed(2)}`} icon={CheckCircle} iconBgClass="bg-purple-500"/>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3"><h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Revenue (Last 7 Days)</h3><div style={{ height: '300px' }}><ResponsiveContainer width="100%" height="100%"><BarChart data={analyticsData.barChartData}><CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} /><XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={12} tickSize={0} tickMargin={10} /><YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={12} tickFormatter={(value: number) => `K${value/1000}k`} tickSize={0} tickMargin={10} /><Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', border: '1px solid #334155' }} /><Legend /><Bar dataKey="revenue" fill={isDarkMode ? "#818cf8" : "#6366f1"} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
                <div className="lg:col-span-2"><h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Revenue by Method</h3><div style={{ height: '300px' }}><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }} /><Legend /><Pie data={analyticsData.pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { const RADIAN = Math.PI / 180; const radius = innerRadius + (outerRadius - innerRadius) * 1.2; const x = cx + radius * Math.cos(-midAngle * RADIAN); const y = cy + radius * Math.sin(-midAngle * RADIAN); return (<text x={x} y={y} fill={isDarkMode ? '#e2e8f0' : '#475569'} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>{`${(percent * 100).toFixed(0)}%`}</text>);}}>{analyticsData.pieChartData.map((_, index) => <Cell key={`cell-${index}`} fill={isDarkMode ? PIE_CHART_COLORS.dark[index % PIE_CHART_COLORS.dark.length] : PIE_CHART_COLORS.light[index % PIE_CHART_COLORS.light.length]} />)}</Pie></PieChart></ResponsiveContainer></div></div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Top Paying Users</h3>
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {analyticsData.customerLeaderboard.length > 0 ? analyticsData.customerLeaderboard.map((c, index) => (
                            <li key={c.user.user_id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-6 text-center">{index + 1}</span><div><p className="font-semibold text-slate-800 dark:text-white">{c.user.full_name}</p><p className="text-xs text-slate-500">{c.user.email}</p></div></div>
                                <p className="font-bold text-green-500">KES {c.total.toFixed(2)}</p>
                            </li>
                        )) : <p className="text-center text-slate-500 p-4">Not enough user data to generate a leaderboard.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderActivityLogTab = () => (
        <div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Recent Activity</h3>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-4">
                {activityLogs.map(log => { const Icon = log.icon; return (<div key={log.id} className="flex items-start gap-3"><Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${log.color}`} /><div><p className="text-sm text-slate-700 dark:text-slate-200">{log.message}</p><p className="text-xs text-slate-400">{log.timestamp.toLocaleString()}</p></div></div>);})}
                 {activityLogs.length === 0 && <p className="text-center text-slate-500 p-4">No activity recorded yet.</p>}
            </div>
        </div>
    );
    
    // --- RENDER ---
    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
            <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-2 sm:p-4 lg:p-8 transition-colors duration-300 font-sans`}>
                <div className="max-w-screen-2xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div><h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">Case Payments</h1><p className="text-slate-500 dark:text-slate-400 mt-1">Manage payments linked to specific cases and users.</p></div>
                        <div className='flex items-center gap-3'>
                             <button onClick={handleExportCSV} disabled={filteredAndSortedPayments.length === 0} className="font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Download size={16} /> <span className="hidden sm:inline">Export CSV</span></button>
                            <div ref={paymentModeDropdownRef} className="relative">
                                <button type="button" className="font-semibold py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2" onClick={() => setIsPaymentModeSelectionOpen(p => !p)}>
                                    <PlusCircle size={18} /> <span className="hidden sm:inline">Initiate Payment</span> <ChevronDown size={20} className={`ml-1 transition-transform ${isPaymentModeSelectionOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>{isPaymentModeSelectionOpen && ( <motion.div initial={{opacity: 0, y: -5}} animate={{opacity:1, y: 0}} exit={{opacity:0, y: -5}} className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-20"><div className="py-1">{paymentModes.map(({ mode, label, icon }) => ( <button key={mode} onClick={() => handlePaymentModeSelect(mode)} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">{icon} {label}</button>))}</div></motion.div>)}</AnimatePresence>
                            </div>
                            <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Toggle theme"><Sun className={`h-5 w-5 ${isDarkMode ? 'block' : 'hidden'}`}/><Moon className={`h-5 w-5 ${isDarkMode ? 'hidden' : 'block'}`}/></button>
                            <button onClick={refetch} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Refresh Data"><RefreshCw className={`h-5 w-5 ${isLoadingPayments ? 'animate-spin' : ''}`} /></button>
                        </div>
                    </header>
                    
                    <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                        <TabButton text="Dashboard" icon={TableIcon} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <TabButton text="Advanced Analytics" icon={PieChartIcon} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                        <TabButton text="Activity Log" icon={BookOpen} isActive={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                    </div>

                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 rounded-2xl shadow-xl p-6 sm:p-8 h-full">
                        {isError ? (
                            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
                                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Failed to Load Data</h3>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">A network error occurred. Please try again.</p>
                                <button onClick={refetch} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center mx-auto"><RefreshCw className="inline mr-2 h-4 w-4"/>Retry</button>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'dashboard' && renderDashboardTab()}
                                {activeTab === 'analytics' && renderAnalyticsTab()}
                                {activeTab === 'activity' && renderActivityLogTab()}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* --- PAYMENT MODALS --- */}
            {isCashModalOpen && <CashPaymentModal isOpen={isCashModalOpen} onClose={handleClosePaymentModals} isDarkMode={isDarkMode} userId={loggedInUser?.user_id ?? ''} />}
            {isMpesaModalOpen && <MpesaPayment isOpen={isMpesaModalOpen} onClose={handleClosePaymentModals} />}
            {isStripeModalOpen && <StripePaymentModal isOpen={isStripeModalOpen} onClose={handleClosePaymentModals} />}
            {isManualEntryModalOpen && <ManualPaymentEntryModal isOpen={isManualEntryModalOpen} onClose={handleClosePaymentModals} />}

            <TransactionDetailPanel 
                payment={selectedPaymentDetail} 
                user={selectedPaymentDetail?.user_id ? userMap.get(selectedPaymentDetail.user_id) ?? null : null} 
                caseData={selectedPaymentDetail?.case_id ? caseMap.get(selectedPaymentDetail.case_id) ?? null : null}
                onClose={() => setSelectedPaymentDetail(null)} 
                onViewReceipt={handleViewReceipt} 
            />
        </>
    );
};

export default PaymentHistory;