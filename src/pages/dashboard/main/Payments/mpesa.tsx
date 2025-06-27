// src/components/MpesaPayment.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    useFetchCasesQuery,
    CaseDataTypes as Case,
} from '../../../../features/case/caseAPI';
import { useInitiateMpesaStkPushMutation } from '../../../../features/payment/paymentAPI';
import {
    X, Search, Filter, FileText, Banknote, Info, Settings, ChevronDown,
    Loader2, PartyPopper, XCircle, Mail, Phone, BadgeInfo, User // CORRECTED: Added BadgeInfo and User
} from 'lucide-react';

// --- Custom useDebounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

const MPESA_ICON_URL = "https://stagepass.co.ke/theme/images/clients/WEB-LOGOS-14.jpg";
const DEBOUNCE_DELAY = 300;
const BALANCE_FIELD_NAME_FROM_BACKEND = 'payment_balance';
const LAST_USED_PHONE_NUMBERS_KEY = 'mpesaPayment_lastUsedPhoneNumbers';
const LAST_USED_EMAILS_KEY = 'mpesaPayment_lastUsedEmails';
const MAX_SUGGESTIONS = 5;

interface MpesaPaymentProps {
  userId?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface MpesaTransactionDetails { success: boolean; message: string; }
interface ApiError { response?: { data?: { success: boolean; message?: string; status?: string; }; status?: number; }; message?: string; }

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [initiateMpesaStkPush, { isLoading: isMutationLoading }] = useInitiateMpesaStkPushMutation();
    const navigate = useNavigate();
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isFailModalOpen, setIsFailModalOpen] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

    const [filters, setFilters] = useState({ status: '', type: '', searchTerm: '' });
    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases, isError: isErrorCases } = useFetchCasesQuery();
    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

    const [lastUsedPhoneNumbers, setLastUsedPhoneNumbers] = useState<string[]>([]);
    const [lastUsedEmails, setLastUsedEmails] = useState<string[]>([]);

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const typeDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const storedPhones = localStorage.getItem(LAST_USED_PHONE_NUMBERS_KEY);
            if (storedPhones) setLastUsedPhoneNumbers(JSON.parse(storedPhones));
            const storedEmails = localStorage.getItem(LAST_USED_EMAILS_KEY);
            if (storedEmails) setLastUsedEmails(JSON.parse(storedEmails));
        } catch (e) { console.error("Failed to load suggestions from localStorage:", e); }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
          if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) setIsTypeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateLastUsedValues = (type: 'phone' | 'email', newValue: string) => {
        if (!newValue || !newValue.trim()) return;
        const key = type === 'phone' ? LAST_USED_PHONE_NUMBERS_KEY : LAST_USED_EMAILS_KEY;
        const setFunction = type === 'phone' ? setLastUsedPhoneNumbers : setLastUsedEmails;
        setFunction(prev => {
            const updated = [newValue, ...prev.filter(v => v !== newValue)].slice(0, MAX_SUGGESTIONS);
            try { localStorage.setItem(key, JSON.stringify(updated)); } catch (e) { console.error(`Failed to save last used ${type}s to localStorage:`, e); }
            return updated;
        });
    };
    
    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases) || isLoadingCases) return [];
        return cases.filter(caseItem => {
            const balance = parseFloat(String((caseItem as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0));
            if (isNaN(balance) || balance <= 0) return false;
            
            if (debouncedFilters.status && caseItem.case_status !== debouncedFilters.status) return false;
            if (debouncedFilters.type && caseItem.case_type !== debouncedFilters.type) return false;
            if (debouncedFilters.searchTerm) {
                const term = debouncedFilters.searchTerm.toLowerCase();
                const isInCase = caseItem.case_number.toLowerCase().includes(term) || (caseItem.case_track_number && caseItem.case_track_number.toLowerCase().includes(term)) || (caseItem.parties ?? '').toLowerCase().includes(term) || (caseItem.station ?? '').toLowerCase().includes(term);
                if (!isInCase) return false;
            }
            return true;
        });
    }, [cases, isLoadingCases, debouncedFilters]);

    useEffect(() => {
        if (selectedCase) {
            const balance = parseFloat(String((selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0));
            setAmount(balance > 0 ? balance.toFixed(2) : '0.00');
        } else { setAmount(''); }
    }, [selectedCase]);

    const handleFilterChange = (field: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [field]: value }));

    const handlePayment = async () => {
        if (!selectedCase) { toast.error("Please select a case first."); return; }
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) { toast.error('Please enter a valid positive amount.'); return; }
        const balance = parseFloat(String((selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case] ?? 0));
        if (numericAmount > balance) { toast.error(`Amount cannot exceed the outstanding balance of ${balance.toFixed(2)}.`); return; }
        if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) { toast.error("Please enter a valid email address for the receipt."); return; }
        const isValid = /^(01[0-9]{8}|07[0-9]{8})$/.test(phoneNumber);
        if (!isValid) { toast.error("Please enter a valid 10-digit Kenyan phone number (07... or 01...)."); setPhoneNumberError("Invalid phone number format."); return; }
        
        setPaymentError(null); setPhoneNumberError(null);
        try {
            const response = await initiateMpesaStkPush({ case_id: selectedCase.case_id, user_id: selectedCase.user_id, amount: numericAmount, phoneNumber, customer_email: customerEmail }).unwrap() as MpesaTransactionDetails;
            if (response.success) {
                toast.success(response.message);
                setIsSuccessModalOpen(true);
                updateLastUsedValues('phone', phoneNumber);
                updateLastUsedValues('email', customerEmail);
            } else {
                setPaymentError(response.message || "Payment Failed");
                setIsFailModalOpen(true);
            }
        } catch (error) {
            const err = error as ApiError;
            const message = err.response?.data?.message || err.message || "Failed to initiate payment. Please try again.";
            toast.error(message);
            setPaymentError(message);
            setIsFailModalOpen(true);
        }
    };

    const handleClose = () => {
        setSelectedCase(null); setPhoneNumber(''); setAmount(''); setCustomerEmail(''); setPaymentError(null);
        setPhoneNumberError(null); setIsSuccessModalOpen(false); setIsFailModalOpen(false);
        setFilters({ status: '', type: '', searchTerm: '' });
        onClose();
    };

    const SuccessModal = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"><div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center"><div className="flex justify-center text-green-500 mb-4"><PartyPopper size={48} strokeWidth={1.5} /></div><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payment Initiated!</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please check your phone to enter your M-Pesa PIN and complete the transaction.</p><div className="mt-6 flex justify-center"><button onClick={() => { setIsSuccessModalOpen(false); handleClose(); navigate('/dashboard/my-cases') }} className="px-6 py-2.5 text-sm font-semibold bg-green-600 text-white hover:bg-green-700 rounded-lg">Okay</button></div></div></div>
    );
    const FailModal = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"><div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center"><div className="flex justify-center text-red-500 mb-4"><XCircle size={48} strokeWidth={1.5} /></div><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payment Failed</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{paymentError || "An unknown error occurred."}</p><div className="mt-6 flex justify-center"><button onClick={() => setIsFailModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 rounded-lg">Try Again</button></div></div></div>
    );

    if (!isOpen) return null;
    
    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-5xl h-full md:h-auto max-h-[95vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b rounded-t dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3"><img src={MPESA_ICON_URL} alt="Mpesa Icon" className="h-8 w-auto rounded" /><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">M-Pesa Payment Portal</h3></div>
                    <button type="button" className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" onClick={handleClose} title="Close"><X className="h-5 w-5" /></button>
                </header>

                <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center"><Filter className="mr-2 h-5 w-5 text-indigo-500" /> Filter Cases</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div ref={statusDropdownRef} className="relative"><button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status ? filters.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Statuses'}</span><div className="flex items-center">{filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('status', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{['open', 'in_progress', 'closed', 'on_hold', 'resolved'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div ref={typeDropdownRef} className="relative"><button type="button" onClick={() => setIsTypeDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}><span className={`truncate font-semibold ${!filters.type ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.type ? filters.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Types'}</span><div className="flex items-center">{filters.type && (<button type="button" onClick={(e) => { e.stopPropagation(); handleFilterChange('type', ''); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}<ChevronDown size={20} className={`text-slate-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} /></div></button><AnimatePresence>{isTypeDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('type', ''); setIsTypeDropdownOpen(false); }}>All Types</button></li>{['criminal', 'civil', 'family', 'corporate', 'property', 'employment', 'intellectual_property', 'immigration', 'elc', 'childrenCase', 'tribunal', 'conveyances'].map(type => (<li key={type}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('type', type); setIsTypeDropdownOpen(false); }}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}</motion.ul>)}</AnimatePresence></div>
                            <div className="relative md:col-span-2 lg:col-span-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="text" placeholder="Search All Fields..." value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filters.searchTerm && (<button type="button" onClick={() => handleFilterChange('searchTerm', '')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg shadow-md max-h-72 border border-slate-200 dark:border-slate-700">
                        <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                            <thead className="bg-gradient-to-r from-blue-600 to-sky-600 text-white dark:from-blue-700 dark:to-sky-700 sticky top-0 z-10"><tr>{[ { icon: BadgeInfo, text: 'Case ID' }, { icon: User, text: 'Client' }, { icon: FileText, text: 'Case Number' }, { icon: Banknote, text: 'Balance' }, { icon: Info, text: 'Status' }, { icon: Settings, text: 'Action' } ].map(h => <th key={h.text} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"><div className="flex items-center gap-2"><h.icon className="h-4 w-4" />{h.text}</div></th>)}</tr></thead>
                            <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">{isLoadingCases ? (<tr><td colSpan={6} className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" /></td></tr>) : isErrorCases ? (<tr><td colSpan={6} className="text-center py-4 text-red-500">Error loading cases...</td></tr>) : filteredCases.length > 0 ? (filteredCases.map(caseItem => ( <tr key={caseItem.case_id} className={`hover:bg-slate-100 dark:hover:bg-slate-700/50 ${selectedCase?.case_id === caseItem.case_id ? "bg-blue-100 dark:bg-blue-900/50" : ""}`}><td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{caseItem.case_id}</td><td className="px-4 py-3 whitespace-nowrap text-sm">{caseItem.owner?.full_name || 'N/A'}</td><td className="px-4 py-3 whitespace-nowrap text-sm">{caseItem.case_number}</td><td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">KES {parseFloat(String(caseItem.payment_balance)).toFixed(2)}</td><td className="px-4 py-3 whitespace-nowrap text-sm">{caseItem.case_status}</td><td className="px-4 py-3 whitespace-nowrap text-sm font-medium"><button onClick={() => setSelectedCase(caseItem)} className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Select</button></td></tr> ))) : (<tr><td colSpan={6} className="text-center py-4 text-slate-500 italic">No cases with outstanding payments match your filters.</td></tr>)}</tbody>
                        </table>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center"><Banknote className="mr-2 h-5 w-5 text-indigo-500"/> Payment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="mpesaAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount to Pay (KES)</label><input type="number" id="mpesaAmount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputBaseClasses} placeholder="Enter amount" disabled={!selectedCase} step="0.01"/></div>
                            <div className="relative"><label htmlFor="mpesaCustomerEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Email (for receipt)</label><Mail className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="email" id="mpesaCustomerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={`${inputBaseClasses} pl-9`} placeholder="Enter customer's email" list="lastUsedEmailsDatalist"/><datalist id="lastUsedEmailsDatalist">{lastUsedEmails.map((email, i) => <option key={i} value={email} />)}</datalist></div>
                            <div className="md:col-span-2 relative"><label htmlFor="mpesaPhoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number (Safaricom)</label><Phone className="absolute left-3 top-10 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/><input type="tel" id="mpesaPhoneNumber" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); setPhoneNumberError(null); }} className={`${inputBaseClasses} pl-9 ${phoneNumberError ? 'border-red-500 ring-red-500' : ''}`} placeholder="e.g., 0712345678" list="lastUsedPhoneNumbersDatalist"/><datalist id="lastUsedPhoneNumbersDatalist">{lastUsedPhoneNumbers.map((phone, i) => <option key={i} value={phone} />)}</datalist>{phoneNumberError && <p className="mt-1 text-xs text-red-500">{phoneNumberError}</p>}</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center p-4 border-t dark:border-slate-700 gap-3 flex-shrink-0">
                    <button type="button" className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500" onClick={handleClose}>Cancel</button>
                    <button onClick={handlePayment} className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={isMutationLoading || !selectedCase || !!phoneNumberError} >{isMutationLoading ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing...</> : 'Make Payment'}</button>
                </div>
            </div>
            {isSuccessModalOpen && <SuccessModal />}
            {isFailModalOpen && <FailModal />}
        </div>
    );
};

export default MpesaPayment;