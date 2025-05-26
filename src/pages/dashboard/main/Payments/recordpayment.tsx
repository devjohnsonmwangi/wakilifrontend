// src/pages/dashboard/main/Payments/recordpayment.tsx (or ManualPaymentEntryModal.tsx)
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
    useFetchCasesQuery,
    CaseDataTypes as Case, // Ensure this Case type includes 'payment_balance' and 'user_id'
    CaseStatus,
    CaseType,
} from '../../../../features/case/caseAPI';
import {
    PaymentGateway,
    ManualPaymentRequest, // Correctly imported
    useAddManualPaymentMutation, // Correctly imported
} from '../../../../features/payment/paymentAPI';

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

// Define ApiError interface if not globally available
interface ApiError {
    data?: {
        message?: string;
        // other potential error fields
    };
    status?: number;
    message?: string; // Fallback message
    error?: string;
}


const ManualPaymentEntryModal: React.FC<ManualPaymentEntryModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | ''>('');
    const [customerEmail, setCustomerEmail] = useState('');

    const [transactionId, setTransactionId] = useState(''); // This state already exists for the transaction ID
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');

    const [createManualPayment, { isLoading: isSubmitting }] = useAddManualPaymentMutation();

    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilterInput, setStationFilterInput] = useState('');
    const [caseNumberFilterInput, setCaseNumberFilterInput] = useState('');
    const [searchTermInput, setSearchTermInput] = useState('');

    const debouncedStationFilter = useDebounce(stationFilterInput, DEBOUNCE_DELAY);
    const debouncedCaseNumberFilter = useDebounce(caseNumberFilterInput, DEBOUNCE_DELAY);
    const debouncedSearchTerm = useDebounce(searchTermInput, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases } = useFetchCasesQuery();
    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

    const [lastUsedEmails, setLastUsedEmails] = useState<string[]>([]);
    const [lastUsedMpesaPhones, setLastUsedMpesaPhones] = useState<string[]>([]);

    useEffect(() => {
        try {
            const storedEmails = localStorage.getItem(MANUAL_ENTRY_LAST_USED_EMAILS_KEY);
            if (storedEmails) setLastUsedEmails(JSON.parse(storedEmails));
            const storedMpesaPhones = localStorage.getItem(MANUAL_ENTRY_LAST_USED_MPESA_PHONES_KEY);
            if (storedMpesaPhones) setLastUsedMpesaPhones(JSON.parse(storedMpesaPhones));
        } catch (e) { console.error("Failed to load suggestions from localStorage:", e); }
    }, []);

    const updateLastUsedValue = (type: 'email' | 'mpesaPhone', newValue: string) => {
        if (!newValue || !newValue.trim()) return;
        if (type === 'email') {
            setLastUsedEmails(prev => {
                const updated = [newValue, ...prev.filter(e => e !== newValue)].slice(0, MAX_MANUAL_SUGGESTIONS);
                try { localStorage.setItem(MANUAL_ENTRY_LAST_USED_EMAILS_KEY, JSON.stringify(updated)); } catch (e) { console.error("LS save error (email):", e); }
                return updated;
            });
        } else if (type === 'mpesaPhone') {
            setLastUsedMpesaPhones(prev => {
                const updated = [newValue, ...prev.filter(p => p !== newValue)].slice(0, MAX_MANUAL_SUGGESTIONS);
                try { localStorage.setItem(MANUAL_ENTRY_LAST_USED_MPESA_PHONES_KEY, JSON.stringify(updated)); } catch (e) { console.error("LS save error (mpesaPhone):", e); }
                return updated;
            });
        }
    };

    const filteredCases = useMemo(() => {
        if (isLoadingCases || !Array.isArray(cases)) return [];
        let tempFilteredCases = [...cases];

        if (statusFilter) {
            tempFilteredCases = tempFilteredCases.filter(c => c.case_status === statusFilter);
        }
        if (typeFilter) {
            tempFilteredCases = tempFilteredCases.filter(c => c.case_type === typeFilter);
        }
        if (debouncedStationFilter) {
            tempFilteredCases = tempFilteredCases.filter(c =>
                (c.station ?? '').toLowerCase().includes(debouncedStationFilter.toLowerCase())
            );
        }
        if (debouncedCaseNumberFilter) {
            tempFilteredCases = tempFilteredCases.filter(c =>
                c.case_number.toLowerCase().includes(debouncedCaseNumberFilter.toLowerCase())
            );
        }
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            tempFilteredCases = tempFilteredCases.filter(c =>
                c.case_number.toLowerCase().includes(term) ||
                (c.case_track_number && c.case_track_number.toLowerCase().includes(term)) ||
                (c.parties ?? '').toLowerCase().includes(term) ||
                (c.station ?? '').toLowerCase().includes(term)
            );
        }
        return tempFilteredCases;
    }, [
        cases,
        isLoadingCases,
        statusFilter,
        typeFilter,
        debouncedStationFilter,
        debouncedCaseNumberFilter,
        debouncedSearchTerm
    ]);

    useEffect(() => {
        if (selectedCase) {
            const balanceValue = selectedCase.payment_balance;
            let currentBalance = 0;
            if (balanceValue !== null && balanceValue !== undefined) {
                const parsed = parseFloat(String(balanceValue));
                if (!isNaN(parsed)) currentBalance = parsed;
            }
            setAmount(currentBalance > 0 ? currentBalance.toFixed(2) : '');
        } else {
            setAmount('');
        }
        setTransactionId('');
        setMpesaPhoneNumber('');
        setPaymentNotes('');
    }, [selectedCase]);

    const handleGatewayChange = (gateway: PaymentGateway | '') => {
        setSelectedGateway(gateway);
        setTransactionId(''); // Reset transaction ID when gateway changes
        setMpesaPhoneNumber(''); // Reset Mpesa phone if it was Mpesa
        setPaymentNotes(gateway === 'cash' ? paymentNotes : ''); // Keep notes if switching to cash, otherwise clear
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCase) {
            toast.error("Please select a case.");
            return;
        }
        if (typeof selectedCase.user_id === 'undefined') {
            toast.error("Selected case is missing user information. Cannot proceed.");
            console.error("Error: selectedCase.user_id is undefined", selectedCase);
            return;
        }
        if (!selectedGateway) {
            toast.error("Please select a payment gateway.");
            return;
        }
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error("Please enter a valid positive amount.");
            return;
        }

        const payload: ManualPaymentRequest = {
            case_id: selectedCase.case_id,
            user_id: selectedCase.user_id,
            payment_amount: numericAmount,
            payment_gateway: selectedGateway,
            payment_date: paymentDate,
            customer_email: customerEmail || undefined,
            transaction_id: transactionId || undefined, // transactionId is included here, optional
            payment_note: paymentNotes || undefined,
            payment_status: 'completed', // Assuming manual entries are completed
        };

        // // If Mpesa, include mpesa_phone_number if provided
        // if (selectedGateway === 'mpesa' && mpesaPhoneNumber) {
        //     payload.mpesa_phone_number = mpesaPhoneNumber;
        // }


        try {
            await createManualPayment(payload).unwrap();
            toast.success(`Manual ${selectedGateway} payment recorded successfully!`);
            if (customerEmail) updateLastUsedValue('email', customerEmail);
            if (selectedGateway === 'mpesa' && mpesaPhoneNumber) updateLastUsedValue('mpesaPhone', mpesaPhoneNumber);
            handleClose();
        } catch (error) {
            const err = error as ApiError;
            console.error("Manual Payment Creation Error:", err);
            const errMsg = err.data?.message || err.message || err.error || "Failed to record payment.";
            toast.error(errMsg);
        }
    };

    const handleClose = () => {
        setSelectedCase(null);
        setAmount('');
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setSelectedGateway('');
        setCustomerEmail('');
        setTransactionId('');
        setMpesaPhoneNumber('');
        setPaymentNotes('');
        setStatusFilter(''); setTypeFilter(''); setStationFilterInput(''); setCaseNumberFilterInput(''); setSearchTermInput('');
        onClose();
    };

    if (!isOpen) return null;

    const inputClassName = "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
    const labelClassName = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 z-50 overflow-auto p-4">
            <form onSubmit={handleSubmit} className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Manually Record Payment</h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleClose}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Case Selection Section */}
                    <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">1. Select Case</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                            <div>
                                <label htmlFor="manStatusFilter" className={labelClassName}>Status:</label>
                                <select id="manStatusFilter" className={inputClassName} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}>
                                    <option value="">All</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="closed">Closed</option><option value="on_hold">On Hold</option><option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="manTypeFilter" className={labelClassName}>Type:</label>
                                <select id="manTypeFilter" className={inputClassName} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as CaseType | '')}>
                                    <option value="">All</option><option value="criminal">Criminal</option><option value="civil">Civil</option><option value="family">Family</option><option value="corporate">Corporate</option><option value="property">Property</option><option value="employment">Employment</option><option value="intellectual_property">Intellectual Property</option><option value="immigration">Immigration</option><option value="elc">ELC</option><option value="childrenCase">Children Case</option><option value="tribunal">Tribunal</option><option value="conveyances">Conveyances</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="manStationFilter" className={labelClassName}>Station:</label>
                                <input type="text" id="manStationFilter" className={inputClassName} placeholder="Station" value={stationFilterInput} onChange={(e) => setStationFilterInput(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="manCaseNumFilter" className={labelClassName}>Case No.:</label>
                                <input type="text" id="manCaseNumFilter" className={inputClassName} placeholder="Case Number" value={caseNumberFilterInput} onChange={(e) => setCaseNumberFilterInput(e.target.value)} />
                            </div>
                            <div className="sm:col-span-2 lg:col-span-2">
                                <label htmlFor="manSearchTerm" className={labelClassName}>Global Search:</label>
                                <input type="text" id="manSearchTerm" className={inputClassName} placeholder="Parties, Track No., etc." value={searchTermInput} onChange={(e) => setSearchTermInput(e.target.value)} />
                            </div>
                        </div>
                        {isLoadingCases ? <p className="text-center text-gray-500 dark:text-gray-400">Loading cases...</p> : (
                            <div className="overflow-x-auto max-h-60 border dark:border-gray-600 rounded-md">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Case #</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Balance</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Parties</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredCases.map(c => (
                                            <tr key={c.case_id} className={`hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCase?.case_id === c.case_id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{c.case_number}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                                    {parseFloat(String(c.payment_balance ?? c.fee ?? 0)).toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{c.parties}</td>
                                                <td className="px-3 py-2"><button type="button" onClick={() => setSelectedCase(c)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Select</button></td>
                                            </tr>
                                        ))}
                                        {filteredCases.length === 0 && !isLoadingCases && (
                                            <tr><td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">No cases match filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Payment Gateway and Details */}
                    <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">2. Payment Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="manualGateway" className={labelClassName}>Payment Gateway:</label>
                                <select id="manualGateway" value={selectedGateway} onChange={e => handleGatewayChange(e.target.value as PaymentGateway | '')} className={inputClassName} required>
                                    <option value="" disabled>Select Gateway</option>
                                    <option value="mpesa">M-Pesa</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="cash">Cash</option>
                                    <option value="other">Other (Bank, etc.)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="manualAmount" className={labelClassName}>Amount Paid (KES):</label>
                                <input type="number" id="manualAmount" value={amount} onChange={e => setAmount(e.target.value)} className={inputClassName} placeholder="Amount" step="0.01" required disabled={!selectedCase} />
                            </div>
                            <div>
                                <label htmlFor="manualPaymentDate" className={labelClassName}>Payment Date:</label>
                                <input type="date" id="manualPaymentDate" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className={inputClassName} required />
                            </div>
                             <div>
                                <label htmlFor="manualCustomerEmail" className={labelClassName}>Customer Email (Optional):</label>
                                <input type="email" id="manualCustomerEmail" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={inputClassName} placeholder="customer@example.com" list="manualEntryLastUsedEmails"/>
                                <datalist id="manualEntryLastUsedEmails">
                                    {lastUsedEmails.map((e,i) => <option key={`email-sug-${i}`} value={e} />)}
                                </datalist>
                            </div>

                            {/* Transaction ID Field - THIS IS THE FIELD IN QUESTION */}
                            {(selectedGateway === 'mpesa' || selectedGateway === 'stripe' || selectedGateway === 'other') && (
                                <div className="md:col-span-1">
                                    <label htmlFor="manualTransactionId" className={labelClassName}>
                                        {selectedGateway === 'mpesa' ? 'M-Pesa Conf. Code:' :
                                         selectedGateway === 'stripe' ? 'Stripe Txn ID:' :
                                         'Transaction/Ref ID:'} {/* Label for Bank Ref No. when 'other' */}
                                    </label>
                                    <input
                                        type="text"
                                        id="manualTransactionId"
                                        value={transactionId}
                                        onChange={e => setTransactionId(e.target.value)}
                                        className={inputClassName}
                                        // MODIFIED PLACEHOLDER
                                        placeholder={
                                            selectedGateway === 'mpesa' ? "e.g. RG830P81AA" :
                                            selectedGateway === 'stripe' ? "e.g. pi_... or ch_..." :
                                            selectedGateway === 'other' ? "Bank Ref No. / Cheque No. / etc." : // Specific for 'other' (banks)
                                            "Transaction ID" // Generic fallback
                                        }
                                    />
                                </div>
                            )}

                             {selectedGateway === 'mpesa' && (
                                <div className="md:col-span-1">
                                    <label htmlFor="manualMpesaPhone" className={labelClassName}>Paid From Phone (Optional):</label>
                                    <input type="tel" id="manualMpesaPhone" value={mpesaPhoneNumber} onChange={e => setMpesaPhoneNumber(e.target.value)} className={inputClassName} placeholder="07XX XXX XXX" list="manualEntryLastUsedMpesaPhones"/>
                                    <datalist id="manualEntryLastUsedMpesaPhones">
                                        {lastUsedMpesaPhones.map((p,i) => <option key={`mpesa-phone-sug-${i}`} value={p} />)}
                                    </datalist>
                                </div>
                            )}
                            {(selectedGateway === 'cash' || selectedGateway === 'other') && (
                                 <div className="md:col-span-2">
                                    <label htmlFor="manualPaymentNotes" className={labelClassName}>Payment Notes (Optional):</label>
                                    <textarea
                                        id="manualPaymentNotes"
                                        value={paymentNotes}
                                        onChange={e => setPaymentNotes(e.target.value)}
                                        className={inputClassName}
                                        rows={2}
                                        placeholder={
                                            selectedGateway === 'cash' ? "Details about cash payment (e.g., received by)" :
                                            selectedGateway === 'other' ? "Notes for this payment (e.g., Bank Name, Cheque details)" :
                                            "Payment notes"
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button type="button" onClick={handleClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || !selectedGateway || !selectedCase || !amount} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 flex items-center">
                        {isSubmitting && <span className="loading loading-spinner loading-xs mr-2"></span>}
                        {isSubmitting ? 'Recording...' : 'Record Payment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManualPaymentEntryModal;