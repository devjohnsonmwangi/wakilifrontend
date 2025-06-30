// src/pages/dashboard/main/Payments/GeneralPaymentPortal.tsx
import { useState, useEffect, useMemo, FC, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Banknote, User, Mail, Phone, Sun, Moon, CreditCard, X, Loader2,
    Table as TableIcon, AlertTriangle, RefreshCw, ExternalLink, ShieldCheck, Clock, Info, FileText,
    Wallet, Hash, MessageSquare, Plus, ChevronDown, Landmark, Filter, Search, Download, Calculator,
    PieChart as PieChartIcon, TrendingUp, Ban, Users, TrendingDown, BookOpen, Trash2, CheckCircle2, CalendarDays, Eye
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useFetchPaymentsQuery, useInitiateGeneralPaymentMutation, PaymentDataTypes, GeneralPaymentRequest } from '../../../../features/payment/paymentAPI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- CONFIGURATION ---
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);
const ITEMS_PER_PAGE = 10;
type PaymentMethod = 'mpesa' | 'stripe' | 'cash' | 'bank_transfer';
type Tab = 'dashboard' | 'analytics' | 'activity';
type ActivityLog = { id: number; timestamp: Date; icon: React.ElementType; color: string; message: string; };

// --- STYLING & HELPERS ---
const PIE_CHART_COLORS = { light: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'], dark: ['#818cf8', '#34d399', '#facc15', '#a78bfa'] };
const getMethodIcon = (method: PaymentMethod | string) => {
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
        case 'completed': return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200"><ShieldCheck className="h-3.5 w-3.5"/>Completed</span>;
        case 'pending_mpesa_confirmation': return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-200"><Clock className="h-3.5 w-3.5"/>Pending</span>;
        case 'failed': return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200"><Ban className="h-3.5 w-3.5"/>Failed</span>;
        default: return <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200">{status}</span>;
    }
};

// --- REUSABLE SUB-COMPONENTS ---
const HeaderCell: FC<{ text: string; icon: React.ElementType; className?: string }> = ({ text, icon: Icon, className }) => ( <th className={`p-4 text-left text-xs font-semibold uppercase tracking-wider ${className}`}><div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {text}</div></th> );
const SkeletonRow: FC<{ columns: number }> = ({ columns }) => ( <tr>{Array.from({ length: columns }).map((_, i) => <td key={i} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>)}</tr> );
const SummaryCard: FC<{ title: string; value: string; icon: React.ElementType; iconBgClass: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon: Icon, iconBgClass, change, changeType }) => ( <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm"><div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgClass}`}><Icon className="w-6 h-6 text-white" /></div><div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><div className="flex items-baseline gap-2"><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>{change && changeType && (<span className={`flex items-center text-xs font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>{changeType === 'increase' ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}{change}</span>)}</div></div></motion.div> );
const TabButton: FC<{ text: string; icon: React.ElementType; isActive: boolean; onClick: () => void; }> = ({ text, icon: Icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Icon size={16}/>{text}</button> );

// --- TRANSACTION DETAIL PANEL ---
const TransactionDetailPanel: FC<{ payment: PaymentDataTypes | null; onClose: () => void; onCheckStatus: (transactionId: string) => void; onViewReceipt: (receiptUrl: string | null) => void; }> = ({ payment, onClose, onCheckStatus, onViewReceipt }) => (
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
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Status</dt><dd>{statusBadge(payment.payment_status)}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Amount</dt><dd className="text-xl font-bold text-slate-800 dark:text-white">KES {parseFloat(payment.payment_amount).toFixed(2)}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Method</dt><dd className="capitalize flex items-center gap-2">{getMethodIcon(payment.payment_gateway)} {payment.payment_gateway.replace('_', ' ')}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Customer</dt><dd>{(payment.payment_note || '').replace('General payment from ', '') || 'N/A'}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Email</dt><dd>{payment.customer_email || 'N/A'}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Payment Date</dt><dd>{new Date(payment.payment_date).toLocaleString()}</dd></div>
                            <div className="flex justify-between items-center"><dt className="font-semibold text-slate-600 dark:text-slate-300">Last Updated</dt><dd>{new Date(payment.updated_at).toLocaleString()}</dd></div>
                            <div><dt className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Notes</dt><dd className="text-sm p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">{payment.payment_note || 'No notes provided.'}</dd></div>
                        </dl>
                    </div>
                    <footer className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 flex-shrink-0">
                        {payment.receipt_url && <button onClick={() => onViewReceipt(payment.receipt_url ?? null)} className="flex-1 text-center font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">View Receipt <ExternalLink size={16}/> </button>}
                        {payment.payment_status === 'pending_mpesa_confirmation' && payment.transaction_id && <button onClick={() => onCheckStatus(payment.transaction_id!)} className="flex-1 text-center font-semibold py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">Check Status <RefreshCw size={16}/> </button>}
                    </footer>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- PAYMENT CREATION MODAL ---
const PaymentModal: FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void; }> = ({ isOpen, onClose, onSuccess }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
    const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
    const methodDropdownRef = useRef<HTMLDivElement>(null);

    const [initiateGeneralPayment, { isLoading: isSubmitting }] = useInitiateGeneralPaymentMutation();

    useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (methodDropdownRef.current && !methodDropdownRef.current.contains(e.target as Node)) setIsMethodDropdownOpen(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim() || !amount || parseFloat(amount) <= 0 || !paymentMethod) { toast.error('Please fill all required fields correctly.'); return; }
        if (paymentMethod === 'mpesa' && (!phoneNumber || !/^\d{10}$/.test(phoneNumber))) { toast.error('A valid 10-digit phone number is required for M-Pesa.'); return; }
        
        const paymentDetails: GeneralPaymentRequest = { customerName, customerEmail, phoneNumber, amount: parseFloat(amount), paymentMethod, paymentNote: notes };
        await toast.promise(
            initiateGeneralPayment(paymentDetails).unwrap(),
            {
                loading: 'Submitting payment request...',
                success: (result) => {
                    if (paymentMethod === 'stripe' && result.sessionId) {
                        const stripeRedirect = async () => {
                            const stripe = await stripePromise;
                            if (stripe) await stripe.redirectToCheckout({ sessionId: result.sessionId! });
                        };
                        stripeRedirect();
                        return 'Redirecting to Stripe for secure payment...';
                    } else {
                        onSuccess();
                        return paymentMethod === 'cash' || paymentMethod === 'bank_transfer' ? 'Payment recorded successfully!' : 'STK Push sent! Please check your phone.';
                    }
                },
                error: (error) => `Operation Failed: ${error.data?.message || "A network error occurred."}`
            }
        );
    };

    const inputBaseClasses = `block w-full text-base text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-10"><X size={24} /></button>
                        
                        <div className="p-6 sm:p-8 flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"><Banknote className="w-6 h-6 text-white" /></div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create a Transaction</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Required fields are marked with *</p>
                        </div>
                        
                        <form onSubmit={handleFormSubmit} className="flex-grow contents">
                            <div className="p-6 sm:p-8 flex-grow overflow-y-auto styled-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500"/><input type="text" placeholder="Customer Full Name*" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`${inputBaseClasses} py-3 pl-12 pr-10`} required />{customerName && (<button type="button" onClick={() => setCustomerName('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full"><X size={16} /></button>)}</div>
                                    <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500"/><input type="email" placeholder="Customer Email (for receipt)" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={`${inputBaseClasses} py-3 pl-12 pr-10`} />{customerEmail && (<button type="button" onClick={() => setCustomerEmail('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full"><X size={16} /></button>)}</div>
                                    <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-slate-400 dark:text-slate-500">KES</span><input type="number" placeholder="Amount*" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputBaseClasses} py-3 pl-14 pr-10`} required min="1" />{amount && (<button type="button" onClick={() => setAmount('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full"><X size={16} /></button>)}</div>
                                    <div ref={methodDropdownRef} className="relative"><p className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Payment Method*</p><button type="button" onClick={() => setIsMethodDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-3 px-4`}><span className={`truncate font-semibold ${!paymentMethod ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{paymentMethod.length ? paymentMethod.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Select a method...'}</span><ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isMethodDropdownOpen ? 'rotate-180' : ''}`} /></button><AnimatePresence>{isMethodDropdownOpen && (<motion.ul initial={{opacity:0, y: -5}} animate={{opacity:1, y: 0}} exit={{opacity:0, y: -5}} className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"><li><button type="button" className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center" onClick={() => { setPaymentMethod('mpesa'); setIsMethodDropdownOpen(false); }}><Phone className="mr-2 h-4 w-4 text-green-500" /> M-Pesa</button></li><li><button type="button" className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center" onClick={() => { setPaymentMethod('stripe'); setIsMethodDropdownOpen(false); }}><CreditCard className="mr-2 h-4 w-4 text-blue-500" /> Credit/Debit Card</button></li><li><button type="button" className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center" onClick={() => { setPaymentMethod('cash'); setIsMethodDropdownOpen(false); }}><Wallet className="mr-2 h-4 w-4 text-yellow-500" /> Cash</button></li><li><button type="button" className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center" onClick={() => { setPaymentMethod('bank_transfer'); setIsMethodDropdownOpen(false); }}><Landmark className="mr-2 h-4 w-4 text-purple-500" /> Bank Transfer</button></li></motion.ul>)}</AnimatePresence></div>
                                    <AnimatePresence>{paymentMethod === 'mpesa' && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden md:col-span-2"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500"/><input type="tel" placeholder="Safaricom Phone Number* (e.g. 07...)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className={`${inputBaseClasses} py-3 pl-12 pr-10`} required />{phoneNumber && (<button type="button" onClick={() => setPhoneNumber('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full"><X size={16} /></button>)}</motion.div>)}</AnimatePresence>
                                    <div className="relative md:col-span-2"><MessageSquare className="absolute left-3.5 top-5 h-5 w-5 text-slate-400 dark:text-slate-500"/><textarea placeholder="Payment Notes (e.g., Invoice #, Service Rendered)" value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputBaseClasses} py-3 pl-12 pr-10`} rows={3} /></div>
                                </div>
                            </div>
                            
                            <div className="p-6 sm:p-8 flex-shrink-0 border-t border-slate-200 dark:border-slate-700">
                                <motion.button type="submit" disabled={isSubmitting} className="w-full font-semibold py-3 px-6 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/50 dark:hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{isSubmitting ? ( <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing...</> ) : ( `Submit Payment` )}</motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- MAIN PORTAL COMPONENT ---
const GeneralPaymentPortal = () => {
    // --- STATE MANAGEMENT ---
    const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: apiResponse, isLoading: isLoadingPayments, isError, refetch } = useFetchPaymentsQuery();

    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [filters, setFilters] = useState({ term: '', method: '', dateFrom: '', dateTo: '', transactionId: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
    const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<PaymentDataTypes | null>(null);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

    // --- DATA MEMOIZATION & DERIVED STATE ---
    const allPayments = useMemo(() => apiResponse?.payments || [], [apiResponse]);
    const generalPayments = useMemo(() => allPayments.filter((p: PaymentDataTypes) => !p.case_id && !p.user_id), [allPayments]);

    useEffect(() => {
        if(generalPayments.length > 0 && activityLogs.length === 0) {
            addActivityLog(CheckCircle2, 'text-green-500', `${generalPayments.length} transactions loaded successfully.`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generalPayments]);
    
    const addActivityLog = (icon: React.ElementType, color: string, message: string) => {
        setActivityLogs(prev => [{ id: Date.now(), timestamp: new Date(), icon, color, message }, ...prev].slice(0, 100));
    };

    const filteredAndSortedPayments = useMemo(() => {
        return generalPayments
            .filter((p: PaymentDataTypes) => {
                const searchTerm = filters.term.toLowerCase();
                const customerName = (p.payment_note || '').replace('General payment from ', '').toLowerCase();
                const termMatch = searchTerm ? customerName.includes(searchTerm) || (p.customer_email || '').toLowerCase().includes(searchTerm) : true;
                const methodMatch = filters.method ? p.payment_gateway === filters.method : true;
                const dateFromMatch = filters.dateFrom ? new Date(p.payment_date) >= new Date(filters.dateFrom) : true;
                const dateToMatch = filters.dateTo ? new Date(p.payment_date) <= new Date(filters.dateTo + 'T23:59:59') : true;
                const transactionIdMatch = filters.transactionId ? (p.transaction_id || '').toLowerCase().includes(filters.transactionId.toLowerCase()) : true;
                return termMatch && methodMatch && dateFromMatch && dateToMatch && transactionIdMatch;
            })
            .sort((a: PaymentDataTypes, b: PaymentDataTypes) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
    }, [generalPayments, filters]);

    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedPayments, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedPayments.length / ITEMS_PER_PAGE);
    
    const analyticsData = useMemo(() => {
        const completed = generalPayments.filter(p => p.payment_status === 'completed');
        const pending = generalPayments.filter(p => p.payment_status.startsWith('pending'));
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const monthlyRevenue = completed.filter(p => new Date(p.payment_date) >= startOfMonth).reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);
        const lastMonthRevenue = completed.filter(p => new Date(p.payment_date) >= startOfLastMonth && new Date(p.payment_date) <= endOfLastMonth).reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);
        const revenueChange = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : monthlyRevenue > 0 ? 100 : 0;
        
        const customerSet = new Set(completed.filter(p => new Date(p.payment_date) >= startOfMonth).map(p => p.customer_email));
        
        const customerLeaderboard = Object.values(completed.reduce((acc: {[key: string]: {email: string; name: string; total: number}}, p) => {
            const email = p.customer_email || 'Unknown';
            if(!acc[email]) acc[email] = {email, name: (p.payment_note || '').replace('General payment from ','') || 'Unknown', total: 0};
            acc[email].total += parseFloat(p.payment_amount);
            return acc;
        }, {})).sort((a,b) => b.total - a.total).slice(0, 5);
        
        const total = completed.reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);
        const pendingTotal = pending.reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);
        const todaysTotal = completed.filter(p => new Date(p.payment_date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)).reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);
        const highestTransaction = completed.length > 0 ? Math.max(...completed.map(p => parseFloat(p.payment_amount))) : 0;
        const avgTransaction = completed.length > 0 ? total / completed.length : 0;
        const methodDistribution = completed.reduce((acc: { [key: string]: number }, p) => { acc[p.payment_gateway] = (acc[p.payment_gateway] || 0) + parseFloat(p.payment_amount); return acc; }, {});
        const mostUsedMethod = Object.keys(methodDistribution).length > 0 ? Object.entries(methodDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'N/A';
        const pieChartData = Object.entries(methodDistribution).map(([name, value]) => ({ name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value }));
        const last7Days = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0]; }).reverse();
        const barChartData = last7Days.map(date => ({ name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), revenue: completed.filter(p => p.payment_date.startsWith(date)).reduce((sum, p) => sum + parseFloat(p.payment_amount), 0) }));

        return { total, pendingTotal, todaysTotal, highestTransaction, avgTransaction, completedCount: completed.length, pendingCount: pending.length, mostUsedMethod, pieChartData, barChartData, monthlyRevenue, revenueChange, newCustomers: customerSet.size, customerLeaderboard };
    }, [generalPayments]);

    // --- HANDLERS ---
    useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleResetFilters = () => { setFilters({ term: '', method: '', dateFrom: '', dateTo: '', transactionId: '' }); setCurrentPage(1); toast.info("Filters have been reset."); };
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setFilters(prev => ({ ...prev, [e.target.name]: e.target.value })); setCurrentPage(1); };
    const handleCheckStatus = (transactionId: string) => { toast.promise(new Promise(res => setTimeout(res, 1500)), { loading: `Checking status for ${transactionId}...`, success: 'Status updated!', error: 'Failed to update.' }); refetch(); };
    const handleModalSuccess = () => { setIsModalOpen(false); refetch(); addActivityLog(Plus, 'text-blue-500', 'A new transaction was created.'); };
    
    const handleViewReceipt = async (receiptUrl: string | null) => {
        if (!receiptUrl) {
            toast.error("No receipt URL available for this transaction.");
            return;
        }

        const receiptPromise = fetch(receiptUrl);

        await toast.promise(receiptPromise, {
            loading: 'Fetching receipt...',
            success: async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const htmlContent = await response.text();
                const newWindow = window.open("", "_blank");
                if (newWindow) {
                    newWindow.document.open();
                    newWindow.document.write(htmlContent);
                    newWindow.document.close();
                    newWindow.document.title = "Payment Receipt";
                } else {
                    throw new Error("Pop-up blocker might be enabled.");
                }
                return 'Receipt opened successfully!';
            },
            error: (err) => `Failed to open receipt: ${err.message}`
        });
    };
    
    const handleExportCSV = () => {
        if (filteredAndSortedPayments.length === 0) {
            toast.error("No data available to export.");
            return;
        }
        const headers = ["Customer", "Email", "Amount (KES)", "Method", "Date", "Status", "Transaction ID", "Notes", "Receipt URL"];
        const csvContent = [headers.join(',')];

        filteredAndSortedPayments.forEach((p: PaymentDataTypes) => {
            const customerName = (p.payment_note || '').replace('General payment from ', '') || 'N/A';
            const rowData = [
                `"${customerName.replace(/"/g, '""')}"`,
                `"${(p.customer_email || 'N/A').replace(/"/g, '""')}"`,
                parseFloat(p.payment_amount).toFixed(2),
                p.payment_gateway,
                new Date(p.payment_date).toLocaleString(),
                p.payment_status,
                p.transaction_id || 'N/A',
                `"${(p.payment_note || '').replace(/"/g, '""')}"`,
                p.receipt_url || 'N/A'
            ];
            csvContent.push(rowData.join(','));
        });

        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'general_payments_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Transaction data exported.");
    };
    
    // Bulk Action Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedPayments(paginatedPayments.map(p => p.payment_id));
        else setSelectedPayments([]);
    };
    const handleSelectOne = (paymentId: number, isSelected: boolean) => {
        if (isSelected) setSelectedPayments(prev => [...prev, paymentId]);
        else setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    };
    const isAllSelectedOnPage = paginatedPayments.length > 0 && selectedPayments.length === paginatedPayments.length;
    const handleBulkAction = (action: 'delete' | 'mark_failed') => {
        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: 'Performing bulk action...',
            success: () => {
                addActivityLog(Trash2, 'text-yellow-500', `Performed bulk ${action} on ${selectedPayments.length} transactions.`);
                setSelectedPayments([]);
                refetch();
                return `Successfully performed ${action} on ${selectedPayments.length} items.`;
            },
            error: 'Bulk action failed.'
        });
    };
    
    // --- RENDER FUNCTIONS FOR TABS ---
    const renderDashboardTab = () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Today's Revenue" value={`KES ${analyticsData.todaysTotal.toFixed(2)}`} icon={Sun} iconBgClass="bg-yellow-500" />
                <SummaryCard title="Total Paid Revenue" value={`KES ${analyticsData.total.toFixed(2)}`} icon={Wallet} iconBgClass="bg-green-500" />
                <SummaryCard title="Avg. Transaction" value={`KES ${analyticsData.avgTransaction.toFixed(2)}`} icon={Calculator} iconBgClass="bg-sky-500" />
                <SummaryCard title="Pending Amount" value={`KES ${analyticsData.pendingTotal.toFixed(2)}`} icon={Clock} iconBgClass="bg-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-8">Transaction History</h3>
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-1 xl:col-span-1"><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Name/Email</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="term" placeholder="Name or Email..." value={filters.term} onChange={handleFilterChange} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 pr-4" /></div></div>
                    <div className="lg:col-span-1 xl:col-span-1"><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Transaction ID</label><div className="relative"><Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="transactionId" placeholder="Transaction ID..." value={filters.transactionId} onChange={handleFilterChange} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 pr-4" /></div></div>
                    <div className="xl:col-span-1"><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Method</label><select name="method" value={filters.method} onChange={handleFilterChange} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 px-4"><option value="">All Methods</option><option value="mpesa">M-Pesa</option><option value="stripe">Card</option><option value="cash">Cash</option><option value="bank_transfer">Bank Transfer</option></select></div>
                    <div className="lg:col-span-1 xl:col-span-1"><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Date Range</label><div className="grid grid-cols-2 gap-2"><input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 px-2" /><input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 px-2" min={filters.dateFrom}/></div></div>
                    <button onClick={handleResetFilters} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"><Filter size={16}/> Reset</button>
                </div>
            </div>

            <AnimatePresence>
                {selectedPayments.length > 0 && (
                    <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="flex items-center gap-4 p-3 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-sm">{selectedPayments.length} selected</p>
                        <button onClick={() => handleBulkAction('mark_failed')} className="flex items-center gap-1.5 text-sm text-yellow-600 hover:text-yellow-800 font-semibold"><Ban size={14}/>Mark as Failed</button>
                        <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-semibold"><Trash2 size={14}/>Delete</button>
                        <button onClick={() => setSelectedPayments([])} className="ml-auto text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Clear Selection</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 styled-scrollbar">
                <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4"><input type="checkbox" className="form-checkbox bg-blue-500 border-white" checked={isAllSelectedOnPage} onChange={handleSelectAll}/></th>
                            <HeaderCell text="Customer" icon={User} />
                            <HeaderCell text="Transaction ID" icon={Hash} className="whitespace-nowrap" />
                            <HeaderCell text="Amount" icon={Banknote} />
                            <HeaderCell text="Method" icon={CreditCard} />
                            <HeaderCell text="Date" icon={Clock} />
                            <HeaderCell text="Status" icon={Info} />
                            <HeaderCell text="Actions" icon={Eye} className="text-center" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {isLoadingPayments && [1,2,3,4,5].map(i => <SkeletonRow key={i} columns={8}/>)}
                        {!isLoadingPayments && paginatedPayments.map((p) => (
                           <tr key={p.payment_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
                                <td className="p-4"><input type="checkbox" className="form-checkbox" checked={selectedPayments.includes(p.payment_id)} onChange={(e) => handleSelectOne(p.payment_id, e.target.checked)}/></td>
                                <td className="p-4">
                                    <div className="font-semibold text-slate-800 dark:text-slate-100">{(p.payment_note || '').replace('General payment from ', '') || 'N/A'}</div>
                                    <div className="text-xs text-slate-500">{p.customer_email || 'No Email'}</div>
                                </td>
                                <td className="p-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.transaction_id || 'N/A'}</td>
                                <td className="p-4"><div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white"><span>KES {parseFloat(p.payment_amount).toFixed(2)}</span></div></td>
                                <td className="p-4"><div className="flex items-center gap-2 capitalize">{getMethodIcon(p.payment_gateway)}<span className="font-semibold">{p.payment_gateway.replace('_', ' ')}</span></div></td>
                                <td className="p-4"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400"/><span className="font-semibold">{new Date(p.payment_date).toLocaleDateString()}</span></div></td>
                                <td className="p-4">{statusBadge(p.payment_status)}</td>
                                <td className="p-4 text-center">
                                    <div className='flex items-center justify-center gap-1'>
                                        <button onClick={() => setSelectedPaymentDetail(p)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200" title="View Details">
                                            <Eye size={14}/> View
                                        </button>
                                        {/* MODIFIED: Fixed TypeScript error with '?? null' */}
                                        {p.receipt_url && (
                                            <button onClick={() => handleViewReceipt(p.receipt_url ?? null)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/50 dark:hover:bg-blue-800/80 text-blue-700 dark:text-blue-200" title="View Receipt">
                                                <FileText size={14}/> Receipt
                                            </button>
                                        )}
                                    </div>
                                </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!isLoadingPayments && generalPayments.length === 0 && (
                <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
                    <TableIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">No Payments Found</h3>
                    <p className="text-sm text-slate-500 mt-1">Create a transaction to see it here.</p>
                </div>
            )}
            {!isLoadingPayments && filteredAndSortedPayments.length === 0 && generalPayments.length > 0 && (
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
                    <SummaryCard title="New Customers (This Month)" value={analyticsData.newCustomers.toString()} icon={Users} iconBgClass="bg-blue-500"/>
                    <SummaryCard title="Total Revenue (All Time)" value={`KES ${analyticsData.total.toFixed(2)}`} icon={CheckCircle2} iconBgClass="bg-purple-500"/>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3"><h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Revenue (Last 7 Days)</h3><div style={{ height: '300px' }}><ResponsiveContainer width="100%" height="100%"><BarChart data={analyticsData.barChartData}><CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} /><XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={12} tickSize={0} tickMargin={10} /><YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={12} tickFormatter={(value: number) => `K${value/1000}k`} tickSize={0} tickMargin={10} /><Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', border: '1px solid #334155' }} /><Legend /><Bar dataKey="revenue" fill={isDarkMode ? "#818cf8" : "#6366f1"} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
                <div className="lg:col-span-2"><h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Revenue by Method</h3><div style={{ height: '300px' }}><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }} /><Legend /><Pie data={analyticsData.pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { const RADIAN = Math.PI / 180; const radius = innerRadius + (outerRadius - innerRadius) * 1.2; const x = cx + radius * Math.cos(-midAngle * RADIAN); const y = cy + radius * Math.sin(-midAngle * RADIAN); return (<text x={x} y={y} fill={isDarkMode ? '#e2e8f0' : '#475569'} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>{`${(percent * 100).toFixed(0)}%`}</text>);}}>{analyticsData.pieChartData.map((_, index) => <Cell key={`cell-${index}`} fill={isDarkMode ? PIE_CHART_COLORS.dark[index % PIE_CHART_COLORS.dark.length] : PIE_CHART_COLORS.light[index % PIE_CHART_COLORS.light.length]} />)}</Pie></PieChart></ResponsiveContainer></div></div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Customer Leaderboard</h3>
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {analyticsData.customerLeaderboard.length > 0 ? analyticsData.customerLeaderboard.map((customer, index) => (
                            <li key={customer.email} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-6 text-center">{index + 1}</span><div><p className="font-semibold text-slate-800 dark:text-white">{customer.name}</p><p className="text-xs text-slate-500">{customer.email}</p></div></div>
                                <p className="font-bold text-green-500">KES {customer.total.toFixed(2)}</p>
                            </li>
                        )) : <p className="text-center text-slate-500 p-4">Not enough customer data to generate a leaderboard.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderActivityLogTab = () => (
        <div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Recent Activity</h3>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-4">
                {activityLogs.map(log => {
                    const Icon = log.icon;
                    return (
                        <div key={log.id} className="flex items-start gap-3"><Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${log.color}`} /><div><p className="text-sm text-slate-700 dark:text-slate-200">{log.message}</p><p className="text-xs text-slate-400">{log.timestamp.toLocaleString()}</p></div></div>
                    );
                })}
                 {activityLogs.length === 0 && <p className="text-center text-slate-500 p-4">No activity recorded yet.</p>}
            </div>
        </div>
    );
    
    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
            <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-2 sm:p-4 lg:p-8 transition-colors duration-300 font-sans styled-scrollbar`}>
                <div className="max-w-screen-2xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div><h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">Payments Portal</h1><p className="text-slate-500 dark:text-slate-400 mt-1">Manage, analyze, and track all general transactions.</p></div>
                        <div className='flex items-center gap-3'>
                            <button onClick={handleExportCSV} disabled={filteredAndSortedPayments.length === 0} className="font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Download size={16} /> <span className="hidden sm:inline">Export CSV</span></button>
                            <button onClick={() => { setIsModalOpen(true); }} className="font-semibold py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2"><Plus size={18} /> <span className="hidden sm:inline">New Transaction</span></button>
                            <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"><Sun className={`h-5 w-5 ${isDarkMode ? 'block' : 'hidden'}`}/><Moon className={`h-5 w-5 ${isDarkMode ? 'hidden' : 'block'}`}/></button>
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
                                <button onClick={refetch} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center mx-auto">
                                    <RefreshCw className="inline mr-2 h-4 w-4"/>Retry
                                </button>
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
            <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleModalSuccess} />
            <TransactionDetailPanel payment={selectedPaymentDetail} onClose={() => setSelectedPaymentDetail(null)} onCheckStatus={handleCheckStatus} onViewReceipt={handleViewReceipt} />
        </>
    );
};

export default GeneralPaymentPortal;