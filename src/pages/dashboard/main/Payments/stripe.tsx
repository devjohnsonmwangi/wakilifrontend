// src/components/StripePaymentModal.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { useFetchCasesQuery, CaseDataTypes as Case } from '../../../../features/case/caseAPI';
import { useHandleStripePaymentMutation } from '../../../../features/payment/paymentAPI';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    X, Search, ChevronDown, FileText, User, Settings, Filter, Mail, CreditCard, Loader2, Banknote // CORRECTED: Removed BadgeInfo, Added Banknote
} from 'lucide-react';

// --- Custom useDebounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface StripePaymentModalProps {
    userId?: number; // Prop to receive user ID
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean; // Optional prop for dark mode
}

interface StripePaymentRequest {
    case_id: number;
    user_id: number;
    amount: number;
    customer_email?: string;
}

interface StripeSessionResponse { sessionId: string; }

const BALANCE_FIELD_NAME_FROM_BACKEND = 'payment_balance';
const DEBOUNCE_DELAY = 300;

const stripePromise = loadStripe('pk_test_51PbjmV2KRb5wlrNTEeIUsEuhrnk1wYAmNRO0eqkF3oLwawrZ2VgT824xa3zxkGttW0HS3TqZiSTUwxfqNhGmdTw300tJ0o4DDo');

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ isOpen, onClose, userId }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [handleStripePayment] = useHandleStripePaymentMutation();
    const [amount, setAmount] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const navigate = useNavigate();

    const [filters, setFilters] = useState({ status: '', type: '', searchTerm: '' });
    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases, isError: isErrorCases } = useFetchCasesQuery();
    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const typeDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
          if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) setIsTypeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases) || isLoadingCases) return [];
        return cases.filter(caseItem => {
            const balance = parseFloat(String((caseItem as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0));
            if (isNaN(balance) || balance <= 0) return false;
            
            if (debouncedFilters.status && caseItem.case_status !== debouncedFilters.status) return false;
            if (debouncedFilters.type && caseItem.case_type !== debouncedFilters.type) return false;
            if (debouncedFilters.searchTerm) {
                const term = debouncedFilters.searchTerm.toLowerCase();
                const isInCase = caseItem.case_number.toLowerCase().includes(term) || (caseItem.case_track_number && caseItem.case_track_number.toLowerCase().includes(term)) || (caseItem.parties ?? '').toLowerCase().includes(term) || (caseItem.station ?? '').toLowerCase().includes(term) || (caseItem.owner?.full_name?.toLowerCase().includes(term));
                if (!isInCase) return false;
            }
            return true;
        });
    }, [cases, isLoadingCases, debouncedFilters]);

    useEffect(() => {
        if (selectedCase) {
            const balanceValue = parseFloat(String(selectedCase.payment_balance ?? selectedCase.fee ?? 0));
            setAmount(balanceValue > 0 ? balanceValue.toFixed(2) : '0.00');
            setCustomerEmail(selectedCase.owner?.email || '');
        } else {
            setAmount('');
            setCustomerEmail('');
        }
    }, [selectedCase]);
    
    const handleFilterChange = (field: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [field]: value }));

    const handleMakePaymentInternal = async () => {
        if (!selectedCase) { toast.error('Please select a case first.'); return; }
        const caseUserId = userId || selectedCase.user_id;
        if (!caseUserId) { toast.error('User information is missing for this transaction.'); return; }
        
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) { toast.error('Invalid amount. Please enter a positive number.'); return; }
        const balance = parseFloat(String(selectedCase.payment_balance ?? 0));
        if (amountNumber > balance) { toast.error(`Amount cannot exceed the outstanding balance of ${balance.toFixed(2)}.`); return; }
        if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) { toast.error("A valid customer email is required for the receipt."); return; }

        setIsSubmitting(true);
        try {
            const paymentData: StripePaymentRequest = { case_id: selectedCase.case_id, user_id: caseUserId, amount: amountNumber, customer_email: customerEmail };
            const paymentResponse = await handleStripePayment(paymentData).unwrap() as StripeSessionResponse;
            const stripe = await stripePromise;
            if (paymentResponse.sessionId && stripe) {
                localStorage.setItem('redirectAfterStripe', '/dashboard/payments');
                const { error } = await stripe.redirectToCheckout({ sessionId: paymentResponse.sessionId });
                if (error) { toast.error(error.message || 'Error redirecting to Stripe checkout.'); localStorage.removeItem('redirectAfterStripe'); }
            } else { toast.error("Failed to get Stripe session ID. Please try again."); }
        } catch (error: unknown) {
            const err = error as { data?: { message?: string }, message?: string };
            const errorMessage = err.data?.message || err.message || 'Payment initiation failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get('stripe_payment_success');
        const canceled = query.get('stripe_payment_canceled');
        if (success) { toast.success('Payment completed successfully!'); navigate('/dashboard/payments', { replace: true }); }
        if (canceled) { toast.warning('Payment was canceled.'); navigate('/dashboard/payments', { replace: true }); }
        if (success || canceled) window.history.replaceState({}, document.title, window.location.pathname);
    }, [navigate]);

    const handleModalClose = () => {
        setSelectedCase(null); setAmount(''); setCustomerEmail('');
        setFilters({ status: '', type: '', searchTerm: '' });
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;
    
    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b rounded-t dark:border-slate-700 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><CreditCard className="h-6 w-6 text-indigo-500"/>Stripe Payment</h3>
                    <button type="button" className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" onClick={handleModalClose} title="Close"><X className="h-5 w-5" /></button>
                </header>

                <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center"><Filter className="mr-2 h-5 w-5 text-indigo-500"/>Select Case</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                            <div ref={statusDropdownRef} className="relative"><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status ? filters.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Statuses'}</span><div className="flex items-center">{filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('status', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{['open', 'in_progress', 'closed', 'on_hold', 'resolved'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div ref={typeDropdownRef} className="relative"><button type="button" onClick={() => setIsTypeDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.type ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.type ? filters.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Types'}</span><div className="flex items-center">{filters.type && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('type', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isTypeDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('type', ''); setIsTypeDropdownOpen(false); }}>All Types</button></li>{['criminal', 'civil', 'family', 'corporate', 'property', 'employment', 'intellectual_property', 'immigration', 'elc', 'childrenCase', 'tribunal', 'conveyances'].map(type => (<li key={type}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('type', type); setIsTypeDropdownOpen(false); }}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div className="relative sm:col-span-2 lg:col-span-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="text" placeholder="Search..." value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.searchTerm && (<button type="button" onClick={() => handleFilterChange('searchTerm', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                        </div>
                        <div className="overflow-x-auto max-h-60 border dark:border-slate-600 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gradient-to-r from-blue-600 to-sky-600 text-white dark:from-blue-700 dark:to-sky-700 sticky top-0 z-10"><tr>{[ { icon: FileText, text: 'Case #' }, { icon: Banknote, text: 'Balance' }, { icon: User, text: 'Client' }, { icon: Settings, text: 'Action' } ].map(h => <th key={h.text} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"><div className="flex items-center gap-2"><h.icon className="h-4 w-4" />{h.text}</div></th>)}</tr></thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">{isLoadingCases ? (<tr><td colSpan={4} className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" /></td></tr>) : isErrorCases ? (<tr><td colSpan={4} className="text-center py-4 text-red-500">Error loading cases.</td></tr>) : filteredCases.length > 0 ? (filteredCases.map(c => ( <tr key={c.case_id} className={`hover:bg-slate-100 dark:hover:bg-slate-700/50 ${selectedCase?.case_id === c.case_id ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}><td className="px-3 py-2 whitespace-nowrap text-sm">{c.case_number}</td><td className="px-3 py-2 whitespace-nowrap text-sm font-semibold">KES {parseFloat(String(c.payment_balance ?? c.fee ?? 0)).toFixed(2)}</td><td className="px-3 py-2 whitespace-nowrap text-sm truncate max-w-xs">{c.owner?.full_name || 'N/A'}</td><td className="px-3 py-2"><button type="button" onClick={() => setSelectedCase(c)} className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Select</button></td></tr> ))) : (<tr><td colSpan={4} className="text-center py-4 text-slate-500 italic">No cases match filters or have a balance.</td></tr>)}</tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center"><CreditCard className="mr-2 h-5 w-5 text-indigo-500"/>Payment Details</h4>
                        {selectedCase ? (
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleMakePaymentInternal(); }}>
                                <div><label htmlFor="stripeAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount to Pay (KES) *</label><input type="number" id="stripeAmount" value={amount} onChange={e => setAmount(e.target.value)} className={inputBaseClasses} placeholder="Amount" step="0.01" required/></div>
                                <div className="relative"><label htmlFor="stripeCustomerEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Email (for receipt) *</label><Mail className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="email" id="stripeCustomerEmail" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={`${inputBaseClasses} pl-9`} placeholder="customer@example.com" required/></div>
                            </form>
                        ) : ( <p className="text-center text-slate-500 dark:text-slate-400 py-4">Please select a case to proceed with payment.</p> )}
                    </div>
                </div>

                <footer className="flex items-center justify-end p-4 space-x-2 border-t rounded-b dark:border-slate-700 flex-shrink-0">
                    <button type="button" onClick={handleModalClose} className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                    <button onClick={handleMakePaymentInternal} disabled={isSubmitting || !selectedCase} className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">{isSubmitting && <Loader2 className="animate-spin h-5 w-5 mr-2" />}Pay with Stripe</button>
                </footer>
            </div>
        </div>
    );
};

export default StripePaymentModal;