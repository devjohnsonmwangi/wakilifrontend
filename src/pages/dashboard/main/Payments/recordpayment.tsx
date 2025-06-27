// src/pages/dashboard/main/Payments/recordpayment.tsx (or ManualPaymentEntryModal.tsx)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useFetchCasesQuery, CaseDataTypes as Case } from '../../../../features/case/caseAPI';
import { PaymentGateway, ManualPaymentRequest, useAddManualPaymentMutation } from '../../../../features/payment/paymentAPI';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Search, ChevronDown, FileText, Banknote, User, Settings, Filter, Mail, Phone, Edit3, Loader2 } from 'lucide-react';

// --- Custom useDebounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const DEBOUNCE_DELAY = 300;
const MANUAL_ENTRY_LAST_USED_EMAILS_KEY = 'manualPaymentEntry_lastUsedEmails';
const MANUAL_ENTRY_LAST_USED_MPESA_PHONES_KEY = 'manualPaymentEntry_lastUsedMpesaPhones';
const MAX_MANUAL_SUGGESTIONS = 5;

interface ManualPaymentEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ApiError { data?: { message?: string; }; status?: number; message?: string; error?: string; }

const ManualPaymentEntryModal: React.FC<ManualPaymentEntryModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | ''>('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');

    const [createManualPayment, { isLoading: isSubmitting }] = useAddManualPaymentMutation();
    
    const [filters, setFilters] = useState({ status: '', type: '', searchTerm: '' });
    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases } = useFetchCasesQuery();
    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

    const [lastUsedEmails, setLastUsedEmails] = useState<string[]>([]);
    const [lastUsedMpesaPhones, setLastUsedMpesaPhones] = useState<string[]>([]);

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isGatewayDropdownOpen, setIsGatewayDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const gatewayDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const storedEmails = localStorage.getItem(MANUAL_ENTRY_LAST_USED_EMAILS_KEY);
            if (storedEmails) setLastUsedEmails(JSON.parse(storedEmails));
            const storedMpesaPhones = localStorage.getItem(MANUAL_ENTRY_LAST_USED_MPESA_PHONES_KEY);
            if (storedMpesaPhones) setLastUsedMpesaPhones(JSON.parse(storedMpesaPhones));
        } catch (e) { console.error("Failed to load suggestions from localStorage:", e); }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
          if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) setIsTypeDropdownOpen(false);
          if (gatewayDropdownRef.current && !gatewayDropdownRef.current.contains(event.target as Node)) setIsGatewayDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateLastUsedValue = (type: 'email' | 'mpesaPhone', newValue: string) => {
        if (!newValue || !newValue.trim()) return;
        if (type === 'email') {
            setLastUsedEmails(prev => { const updated = [newValue, ...prev.filter(e => e !== newValue)].slice(0, MAX_MANUAL_SUGGESTIONS); try { localStorage.setItem(MANUAL_ENTRY_LAST_USED_EMAILS_KEY, JSON.stringify(updated)); } catch (e) { console.error("LS save error (email):", e); } return updated; });
        } else if (type === 'mpesaPhone') {
            setLastUsedMpesaPhones(prev => { const updated = [newValue, ...prev.filter(p => p !== newValue)].slice(0, MAX_MANUAL_SUGGESTIONS); try { localStorage.setItem(MANUAL_ENTRY_LAST_USED_MPESA_PHONES_KEY, JSON.stringify(updated)); } catch (e) { console.error("LS save error (mpesaPhone):", e); } return updated; });
        }
    };

    const filteredCases = useMemo(() => {
        if (isLoadingCases || !Array.isArray(cases)) return [];
        return cases.filter(c => {
            const balance = parseFloat(String(c.payment_balance ?? c.fee ?? 0));
            if(isNaN(balance) || balance <= 0) return false;
            if (debouncedFilters.status && c.case_status !== debouncedFilters.status) return false;
            if (debouncedFilters.type && c.case_type !== debouncedFilters.type) return false;
            if (debouncedFilters.searchTerm) {
                const term = debouncedFilters.searchTerm.toLowerCase();
                const isInCase = c.case_number.toLowerCase().includes(term) || (c.case_track_number && c.case_track_number.toLowerCase().includes(term)) || (c.parties ?? '').toLowerCase().includes(term) || (c.station ?? '').toLowerCase().includes(term) || (c.owner?.full_name?.toLowerCase().includes(term));
                if (!isInCase) return false;
            }
            return true;
        });
    }, [cases, isLoadingCases, debouncedFilters]);

    useEffect(() => {
        if (selectedCase) {
            const balanceValue = parseFloat(String(selectedCase.payment_balance ?? selectedCase.fee ?? 0));
            setAmount(balanceValue > 0 ? balanceValue.toFixed(2) : '');
        } else { setAmount(''); }
        setTransactionId(''); setMpesaPhoneNumber(''); setPaymentNotes('');
    }, [selectedCase]);
    
    const handleFilterChange = (field: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCase) { toast.error("Please select a case."); return; }
        if (typeof selectedCase.user_id === 'undefined') { toast.error("Selected case is missing user info."); return; }
        if (!selectedGateway) { toast.error("Please select a payment gateway."); return; }
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) { toast.error("Please enter a valid positive amount."); return; }

        const payload: ManualPaymentRequest = {
            case_id: selectedCase.case_id,
            user_id: selectedCase.user_id,
            payment_amount: numericAmount,
            payment_gateway: selectedGateway,
            payment_date: paymentDate,
            customer_email: customerEmail || undefined,
            transaction_id: transactionId || undefined,
            payment_note: paymentNotes || undefined,
            payment_status: 'completed',
        };

        try {
            await createManualPayment(payload).unwrap();
            toast.success(`Manual ${selectedGateway} payment recorded successfully!`);
            if (customerEmail) updateLastUsedValue('email', customerEmail);
            if (selectedGateway === 'mpesa' && mpesaPhoneNumber) updateLastUsedValue('mpesaPhone', mpesaPhoneNumber);
            handleClose();
        } catch (error) {
            const err = error as ApiError;
            const errMsg = err.data?.message || err.message || err.error || "Failed to record payment.";
            toast.error(errMsg);
        }
    };

    const handleClose = () => {
        setSelectedCase(null); setAmount(''); setPaymentDate(new Date().toISOString().split('T')[0]);
        setSelectedGateway(''); setCustomerEmail(''); setTransactionId(''); setMpesaPhoneNumber('');
        setPaymentNotes(''); setFilters({ status: '', type: '', searchTerm: '' });
        onClose();
    };

    if (!isOpen) return null;

    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    const gatewayOptions = [
        { value: 'mpesa', label: 'M-Pesa' },
        { value: 'stripe', label: 'Stripe' },
        { value: 'cash', label: 'Cash' },
        { value: 'bank_transfer', label: 'Bank/Other' }
    ];
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <form onSubmit={handleSubmit} className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b rounded-t dark:border-slate-700 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><Edit3 className="h-6 w-6 text-indigo-500"/>Manually Record Payment</h3>
                    <button type="button" className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" onClick={handleClose} title="Close"><X className="h-5 w-5" /></button>
                </header>

                <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center"><Filter className="mr-2 h-5 w-5 text-indigo-500"/>1. Select Case</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                            <div ref={statusDropdownRef} className="relative"><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status ? filters.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Statuses'}</span><div className="flex items-center">{filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('status', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{['open', 'in_progress', 'closed', 'on_hold', 'resolved'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div ref={typeDropdownRef} className="relative"><button type="button" onClick={() => setIsTypeDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.type ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.type ? filters.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Types'}</span><div className="flex items-center">{filters.type && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('type', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isTypeDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('type', ''); setIsTypeDropdownOpen(false); }}>All Types</button></li>{['criminal', 'civil', 'family', 'corporate', 'property', 'employment', 'intellectual_property', 'immigration', 'elc', 'childrenCase', 'tribunal', 'conveyances'].map(type => (<li key={type}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('type', type); setIsTypeDropdownOpen(false); }}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div className="relative sm:col-span-2 lg:col-span-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="text" placeholder="Search..." value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.searchTerm && (<button type="button" onClick={() => handleFilterChange('searchTerm', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                        </div>
                        <div className="overflow-x-auto max-h-60 border dark:border-slate-600 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gradient-to-r from-blue-600 to-sky-600 text-white dark:from-blue-700 dark:to-sky-700 sticky top-0 z-10"><tr>{[ { icon: FileText, text: 'Case #' }, { icon: Banknote, text: 'Balance' }, { icon: User, text: 'Client' }, { icon: Settings, text: 'Action' } ].map(h => <th key={h.text} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"><div className="flex items-center gap-2"><h.icon className="h-4 w-4" />{h.text}</div></th>)}</tr></thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">{isLoadingCases ? (<tr><td colSpan={4} className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" /></td></tr>) : filteredCases.length > 0 ? (filteredCases.map(c => ( <tr key={c.case_id} className={`hover:bg-slate-100 dark:hover:bg-slate-700/50 ${selectedCase?.case_id === c.case_id ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}><td className="px-3 py-2 whitespace-nowrap text-sm">{c.case_number}</td><td className="px-3 py-2 whitespace-nowrap text-sm font-semibold">KES {parseFloat(String(c.payment_balance ?? c.fee ?? 0)).toFixed(2)}</td><td className="px-3 py-2 whitespace-nowrap text-sm truncate max-w-xs">{c.owner?.full_name || 'N/A'}</td><td className="px-3 py-2"><button type="button" onClick={() => setSelectedCase(c)} className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Select</button></td></tr> ))) : (<tr><td colSpan={4} className="text-center py-4 text-slate-500 italic">No cases match filters or have a balance.</td></tr>)}</tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center"><Banknote className="mr-2 h-5 w-5 text-indigo-500"/>2. Payment Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div ref={gatewayDropdownRef} className="relative"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Gateway *</label><button type="button" onClick={() => setIsGatewayDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!selectedGateway ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{selectedGateway ? gatewayOptions.find(o => o.value === selectedGateway)?.label : 'Select Gateway'}</span><div className="flex items-center">{selectedGateway && (<button type="button" onClick={(e) => { e.stopPropagation(); setSelectedGateway(''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 ${isGatewayDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isGatewayDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">{gatewayOptions.map(opt => (<li key={opt.value}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setSelectedGateway(opt.value as PaymentGateway); setIsGatewayDropdownOpen(false); }}>{opt.label}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div><label htmlFor="manualAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount Paid (KES) *</label><input type="number" id="manualAmount" value={amount} onChange={e => setAmount(e.target.value)} className={inputBaseClasses} placeholder="Amount" step="0.01" required disabled={!selectedCase} /></div>
                            <div><label htmlFor="manualPaymentDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Date *</label><input type="date" id="manualPaymentDate" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className={inputBaseClasses} required /></div>
                            <div className="relative"><label htmlFor="manualCustomerEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Email</label><Mail className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="email" id="manualCustomerEmail" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={`${inputBaseClasses} pl-9`} placeholder="customer@example.com" list="manualEntryLastUsedEmails"/><datalist id="manualEntryLastUsedEmails">{lastUsedEmails.map((e,i) => <option key={`email-sug-${i}`} value={e} />)}</datalist></div>
                            {(selectedGateway === 'mpesa' || selectedGateway === 'stripe' || selectedGateway === 'bank_transfer') && ( <div className="relative"><label htmlFor="manualTransactionId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction/Ref ID</label><Search className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="text" id="manualTransactionId" value={transactionId} onChange={e => setTransactionId(e.target.value)} className={`${inputBaseClasses} pl-9`} placeholder={selectedGateway === 'mpesa' ? "e.g. RG830P81AA" : "Transaction ID"}/></div> )}
                            {selectedGateway === 'mpesa' && ( <div className="relative"><label htmlFor="manualMpesaPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paid From Phone</label><Phone className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="tel" id="manualMpesaPhone" value={mpesaPhoneNumber} onChange={e => setMpesaPhoneNumber(e.target.value)} className={`${inputBaseClasses} pl-9`} placeholder="07XX XXX XXX" list="manualEntryLastUsedMpesaPhones"/><datalist id="manualEntryLastUsedMpesaPhones">{lastUsedMpesaPhones.map((p,i) => <option key={`mpesa-phone-sug-${i}`} value={p} />)}</datalist></div> )}
                            {(selectedGateway === 'cash' || selectedGateway === 'bank_transfer') && ( <div className="md:col-span-2"><label htmlFor="manualPaymentNotes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Notes</label><textarea id="manualPaymentNotes" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} className={inputBaseClasses} rows={2} placeholder="e.g., Received by John Doe"/></div> )}
                        </div>
                    </div>
                </div>

                <footer className="flex items-center justify-end p-4 space-x-2 border-t rounded-b dark:border-slate-700 flex-shrink-0">
                    <button type="button" onClick={handleClose} className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                    <button type="submit" disabled={isSubmitting || !selectedGateway || !selectedCase || !amount} className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">{isSubmitting && <Loader2 className="animate-spin h-5 w-5 mr-2" />}{isSubmitting ? 'Recording...' : 'Record Payment'}</button>
                </footer>
            </form>
        </div>
    );
};

export default ManualPaymentEntryModal;