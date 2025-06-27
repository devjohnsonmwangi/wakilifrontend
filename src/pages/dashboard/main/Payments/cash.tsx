// src/components/CashPaymentModal.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCreateCashPaymentMutation } from '../../../../features/payment/paymentAPI';
import { toast } from 'sonner';
import { useFetchCasesQuery, CaseDataTypes as Case, CaseStatus, CaseType } from '../../../../features/case/caseAPI';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Banknote, X, Loader2, Search, Filter, Info, ChevronDown, ListFilter, Tag, Wallet, FileDigit, Hash, Settings } from 'lucide-react';

// --- Custom useDebounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => { clearTimeout(handler); }; }, [value, delay]);
    return debouncedValue;
}

const LAST_USED_CASH_EMAILS_KEY = 'cashPayment_lastUsedEmails';
const MAX_CASH_EMAIL_SUGGESTIONS = 5;

interface CashPaymentModalProps { isOpen: boolean; onClose: () => void; }

const BALANCE_FIELD_NAME_FROM_BACKEND = 'payment_balance';
const DEBOUNCE_DELAY = 300;

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createCashPayment] = useCreateCashPaymentMutation();

    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilterInput, setStationFilterInput] = useState('');
    const [caseNumberFilterInput, setCaseNumberFilterInput] = useState('');
    const [searchTermInput, setSearchTermInput] = useState('');

    const debouncedStationFilter = useDebounce(stationFilterInput, DEBOUNCE_DELAY);
    const debouncedCaseNumberFilter = useDebounce(caseNumberFilterInput, DEBOUNCE_DELAY);
    const debouncedSearchTerm = useDebounce(searchTermInput, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases, isError: isErrorCases } = useFetchCasesQuery();
    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);
    const [lastUsedCashEmails, setLastUsedCashEmails] = useState<string[]>([]);
    
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => { try { const storedEmails = localStorage.getItem(LAST_USED_CASH_EMAILS_KEY); if (storedEmails) setLastUsedCashEmails(JSON.parse(storedEmails)); } catch (e) { console.error("Failed to load last used emails:", e); } }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) setIsTypeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateLastUsedCashEmail = (newEmail: string) => {
        if (!newEmail?.trim()) return;
        setLastUsedCashEmails(prev => {
            const updated = [newEmail, ...prev.filter(e => e !== newEmail)].slice(0, MAX_CASH_EMAIL_SUGGESTIONS);
            try { localStorage.setItem(LAST_USED_CASH_EMAILS_KEY, JSON.stringify(updated)); } catch (e) { console.error("Failed to save email:", e); }
            return updated;
        });
    };

    const filteredCases = useMemo(() => {
        if (isLoadingCases || !cases.length) return [];
        let tempCases = cases.filter(c => { const balance = parseFloat(String((c as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0)); return !isNaN(balance) && balance > 0; });

        if (statusFilter) tempCases = tempCases.filter(c => c.case_status === statusFilter);
        if (typeFilter) tempCases = tempCases.filter(c => c.case_type === typeFilter);
        if (debouncedStationFilter) tempCases = tempCases.filter(c => (c.station ?? '').toLowerCase().includes(debouncedStationFilter.toLowerCase()));
        if (debouncedCaseNumberFilter) tempCases = tempCases.filter(c => c.case_number.toLowerCase().includes(debouncedCaseNumberFilter.toLowerCase()));
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            tempCases = tempCases.filter(c => c.case_number.toLowerCase().includes(term) || c.case_track_number?.toLowerCase().includes(term) || c.parties?.toLowerCase().includes(term) || c.station?.toLowerCase().includes(term));
        }
        return tempCases;
    }, [cases, isLoadingCases, statusFilter, typeFilter, debouncedStationFilter, debouncedCaseNumberFilter, debouncedSearchTerm]);

    useEffect(() => {
        if (selectedCase) {
            const balance = parseFloat(String((selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0));
            setAmount(balance > 0 ? balance.toFixed(2) : '0.00');
        } else {
            setAmount(''); setPaymentNotes(''); setCustomerEmail('');
        }
    }, [selectedCase]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCase) { toast.error("Please select a case."); return; }
        const enteredAmount = Number(amount);
        if (isNaN(enteredAmount) || enteredAmount <= 0) { toast.error('Please enter a valid positive amount.'); return; }
        
        const maxPayable = parseFloat(String((selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0));
        if (maxPayable <= 0) { toast.error("This case has no outstanding balance."); return; }
        if (enteredAmount > maxPayable) { toast.error(`Amount cannot exceed the balance of ${maxPayable.toFixed(2)}.`); return; }
        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) { toast.error("Please enter a valid email address."); return; }

        setIsSubmitting(true);
        try {
            await createCashPayment({ case_id: selectedCase.case_id, user_id: selectedCase.user_id, amount: enteredAmount, payment_notes: paymentNotes || undefined, customer_email: customerEmail || undefined }).unwrap();
            toast.success("Cash payment recorded successfully!");
            if (customerEmail) updateLastUsedCashEmail(customerEmail);
            handleClose();
        } catch (err: unknown) {
            const apiErr = err as { data?: { message?: string }, error?: string };
            toast.error(apiErr.data?.message || apiErr.error || 'Failed to record payment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedCase(null); setAmount(''); setPaymentNotes(''); setCustomerEmail('');
        setStatusFilter(''); setTypeFilter(''); setStationFilterInput(''); setCaseNumberFilterInput(''); setSearchTermInput('');
        onClose();
    };

    if (!isOpen) return null;
    
    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };
    const caseTypes: CaseType[] = ['criminal', 'civil', 'family', 'corporate', 'property', 'employment', 'intellectual_property', 'immigration', 'elc', 'childrenCase', 'Tribunal', 'conveyances'];
    const caseStatuses: CaseStatus[] = ['open', 'in_progress', 'closed', 'on_hold', 'resolved'];
    const tableHeaders = [{ text: 'ID', icon: Hash }, { text: 'Fee', icon: Banknote }, { text: 'Balance', icon: Wallet }, { text: 'Status', icon: Info }, { text: 'Type', icon: Tag }, { text: 'Number', icon: FileDigit }, { text: 'Action', icon: Settings }];

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3"><Banknote className="h-8 w-8 text-green-500" /><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Record Cash Payment</h3></div>
                    <button type="button" onClick={handleClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5" /></button>
                </header>

                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
                    <section>
                        <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center"><Filter className="h-5 w-5 mr-2"/>Select Case (Balance greater 0)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div ref={statusDropdownRef} className="relative"><label className="text-xs font-semibold mb-1 block flex items-center gap-1.5"><Info size={14}/>Status</label><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!statusFilter ? 'text-slate-400 font-normal' : ''}`}>{statusFilter ? statusFilter.replace(/_/g, ' ') : 'All Statuses'}</span><ChevronDown size={20} /></button><AnimatePresence>{isStatusDropdownOpen && <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button className="w-full text-left p-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" onClick={() => { setStatusFilter(''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{caseStatuses.map(s => <li key={s}><button className="w-full text-left p-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" onClick={() => { setStatusFilter(s); setIsStatusDropdownOpen(false); }}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>)}</motion.ul>}</AnimatePresence></div>
                            <div ref={typeDropdownRef} className="relative"><label className="text-xs font-semibold mb-1 block flex items-center gap-1.5"><Tag size={14}/>Case Type</label><button type="button" onClick={() => setIsTypeDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!typeFilter ? 'text-slate-400 font-normal' : ''}`}>{typeFilter ? typeFilter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Types'}</span><ChevronDown size={20} /></button><AnimatePresence>{isTypeDropdownOpen && <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button className="w-full text-left p-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" onClick={() => { setTypeFilter(''); setIsTypeDropdownOpen(false); }}>All Types</button></li>{caseTypes.map(t => <li key={t}><button className="w-full text-left p-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" onClick={() => { setTypeFilter(t); setIsTypeDropdownOpen(false); }}>{t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>)}</motion.ul>}</AnimatePresence></div>
                            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="relative"><label className="text-xs font-semibold mb-1 block">Station</label><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="text" className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} placeholder="Filter by Station" value={stationFilterInput} onChange={(e) => setStationFilterInput(e.target.value)} />{stationFilterInput && <button onClick={() => setStationFilterInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16}/></button>}</div>
                                <div className="relative"><label className="text-xs font-semibold mb-1 block">Case Number</label><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="text" className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} placeholder="Filter by Case Number" value={caseNumberFilterInput} onChange={(e) => setCaseNumberFilterInput(e.target.value)} />{caseNumberFilterInput && <button onClick={() => setCaseNumberFilterInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16}/></button>}</div>
                                <div className="relative"><label className="text-xs font-semibold mb-1 block">General Search</label><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="text" className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} placeholder="Parties, Track No..." value={searchTermInput} onChange={(e) => setSearchTermInput(e.target.value)} />{searchTermInput && <button onClick={() => setSearchTermInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 rounded-full"><X size={16}/></button>}</div>
                            </div>
                        </div>
                        {isLoadingCases ? <div className="text-center p-6"><Loader2 className="animate-spin h-8 w-8 text-indigo-500 mx-auto"/></div> : isErrorCases ? <p className="text-center text-red-500">Error loading cases.</p> : <div className="overflow-x-auto rounded-lg shadow-md max-h-72 border border-slate-200 dark:border-slate-700"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-blue-600 dark:bg-blue-700 text-white sticky top-0 z-10"><tr>{tableHeaders.map(({text, icon: Icon}) => <th key={text} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"><div className="flex items-center gap-2"><Icon className="h-4 w-4" />{text}</div></th>)}</tr></thead>
                            <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">{filteredCases.map(c => <tr key={c.case_id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${selectedCase?.case_id === c.case_id ? "bg-indigo-100 dark:bg-indigo-900/50" : ""}`}><td className="px-4 py-2 text-sm">{c.case_id}</td><td className="px-4 py-2 text-sm">{parseFloat(String(c.fee)).toFixed(2)}</td><td className="px-4 py-2 text-sm font-bold text-green-600 dark:text-green-400">{parseFloat(String(c[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case])).toFixed(2)}</td><td className="px-4 py-2 text-sm">{c.case_status}</td><td className="px-4 py-2 text-sm">{c.case_type}</td><td className="px-4 py-2 text-sm">{c.case_number}</td><td className="px-4 py-2 text-right text-sm"><button onClick={() => setSelectedCase(c)} className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Select</button></td></tr>)}{filteredCases.length === 0 && <tr><td colSpan={tableHeaders.length} className="text-center py-4 text-slate-500">No cases with a balance match your filters.</td></tr>}</tbody>
                        </table></div>}
                    </section>

                    <section className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center"><ListFilter className="h-5 w-5 mr-2"/>Payment Details</h4>
                        <form id="cash-payment-form" className="space-y-4" onSubmit={handleSubmit}>
                            <div><label htmlFor="cashAmount" className="block text-sm font-medium mb-1.5">Amount to Pay</label><input type="number" id="cashAmount" className={`${inputBaseClasses} py-2.5 px-4`} placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={!selectedCase} step="0.01"/></div>
                            <div><label htmlFor="cashCustomerEmail" className="block text-sm font-medium mb-1.5">Customer Email (Optional)</label><input type="email" id="cashCustomerEmail" className={`${inputBaseClasses} py-2.5 px-4`} placeholder="customer@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} disabled={!selectedCase} list="lastUsedCashEmailsDatalist"/><datalist id="lastUsedCashEmailsDatalist">{lastUsedCashEmails.map((email, i) => <option key={i} value={email} />)}</datalist></div>
                            <div><label htmlFor="cashPaymentNotes" className="block text-sm font-medium mb-1.5">Payment Notes (Optional)</label><textarea id="cashPaymentNotes" rows={3} className={`${inputBaseClasses} py-2.5 px-4`} placeholder="Add notes for this payment..." value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} disabled={!selectedCase} /></div>
                        </form>
                    </section>
                </div>

                <footer className="flex justify-end p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 gap-3">
                    <button type="button" onClick={handleClose} className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">Cancel</button>
                    <button type="submit" form="cash-payment-form" className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 disabled:opacity-50" disabled={isSubmitting || !selectedCase}>
                        {isSubmitting ? <><Loader2 className="animate-spin h-5 w-5"/>Processing...</> : <><Banknote className="h-5 w-5"/>Record Payment</>}
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};

export default CashPaymentModal;