// src/components/CashPaymentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    useCreateCashPaymentMutation,
} from '../../../../features/payment/paymentAPI';
import { toast } from 'sonner';
import {
    useFetchCasesQuery,
    CaseDataTypes as Case,
    CaseStatus,
    CaseType,
} from '../../../../features/case/caseAPI';

// --- Custom useDebounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
// --- End Custom useDebounce Hook ---

// --- Constants for localStorage suggestions for Cash Payments ---
const LAST_USED_CASH_EMAILS_KEY = 'cashPayment_lastUsedEmails';
const MAX_CASH_EMAIL_SUGGESTIONS = 5; // Max number of email suggestions for cash payments
// --- End Constants ---


interface CashPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CreateCashPaymentPayload {
    case_id: number;
    user_id: number;
    amount: number;
    payment_notes?: string;
    customer_email?: string;
}

const BALANCE_FIELD_NAME_FROM_BACKEND = 'payment_balance';
const DEBOUNCE_DELAY = 300; // milliseconds

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createCashPayment] = useCreateCashPaymentMutation();

    // States for immediate input values
    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilterInput, setStationFilterInput] = useState('');
    const [caseNumberFilterInput, setCaseNumberFilterInput] = useState('');
    const [searchTermInput, setSearchTermInput] = useState('');

    // Debounced values for filtering
    const debouncedStationFilter = useDebounce(stationFilterInput, DEBOUNCE_DELAY);
    const debouncedCaseNumberFilter = useDebounce(caseNumberFilterInput, DEBOUNCE_DELAY);
    const debouncedSearchTerm = useDebounce(searchTermInput, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases, isError: isErrorCases, error: errorCases } = useFetchCasesQuery();

    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

    // --- State for email input suggestions ---
    const [lastUsedCashEmails, setLastUsedCashEmails] = useState<string[]>([]);
    // --- End State for email input suggestions ---

    // --- Effect to load email suggestions from localStorage ---
    useEffect(() => {
        try {
            const storedEmails = localStorage.getItem(LAST_USED_CASH_EMAILS_KEY);
            if (storedEmails) {
                setLastUsedCashEmails(JSON.parse(storedEmails));
            }
        } catch (e) {
            console.error("Failed to load last used cash emails from localStorage:", e);
            // Optionally clear corrupted data: localStorage.removeItem(LAST_USED_CASH_EMAILS_KEY);
        }
    }, []); // Empty dependency array ensures it runs only on mount
    // --- End Effect to load email suggestions ---

    // --- Function to update and save last used email ---
    const updateLastUsedCashEmail = (newEmail: string) => {
        if (!newEmail || !newEmail.trim()) return; // Don't save empty or whitespace-only values

        setLastUsedCashEmails(prev => {
            const updated = [newEmail, ...prev.filter(e => e !== newEmail)].slice(0, MAX_CASH_EMAIL_SUGGESTIONS);
            try {
                localStorage.setItem(LAST_USED_CASH_EMAILS_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save last used cash email to localStorage:", e);
            }
            return updated;
        });
    };
    // --- End Function to update and save last used email ---

    const filteredCases = useMemo(() => {
        if (isLoadingCases) return [];
        if (!cases.length) return [];

        let tempFilteredCases = [...cases];

        if (statusFilter) {
            tempFilteredCases = tempFilteredCases.filter(caseItem => caseItem.case_status === statusFilter);
        }
        if (typeFilter) {
            tempFilteredCases = tempFilteredCases.filter(caseItem => caseItem.case_type === typeFilter);
        }
        if (debouncedStationFilter) {
            tempFilteredCases = tempFilteredCases.filter(caseItem =>
                (caseItem.station ?? '').toLowerCase().includes(debouncedStationFilter.toLowerCase())
            );
        }
        if (debouncedCaseNumberFilter) {
            tempFilteredCases = tempFilteredCases.filter(caseItem =>
                caseItem.case_number.toLowerCase().includes(debouncedCaseNumberFilter.toLowerCase())
            );
        }
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            tempFilteredCases = tempFilteredCases.filter(caseItem =>
                caseItem.case_number.toLowerCase().includes(term) ||
                (caseItem.case_track_number && caseItem.case_track_number.toLowerCase().includes(term)) ||
                (caseItem.parties ?? '').toLowerCase().includes(term) ||
                (caseItem.station ?? '').toLowerCase().includes(term)
            );
        }

        return tempFilteredCases.filter(caseItem => {
            const balanceValueFromBackend = (caseItem as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
            let numericBalance = 0;

            if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
                const parsed = parseFloat(String(balanceValueFromBackend));
                if (!isNaN(parsed)) {
                    numericBalance = parsed;
                }
            }
            return numericBalance > 0;
        });
    }, [
        cases,
        isLoadingCases,
        statusFilter,
        typeFilter,
        debouncedStationFilter,
        debouncedCaseNumberFilter,
        debouncedSearchTerm,
    ]);

    useEffect(() => {
        if (selectedCase) {
            const balanceValueFromBackend = (selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
            let currentBalance = 0;

            if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
                const parsed = parseFloat(String(balanceValueFromBackend));
                if (!isNaN(parsed)) {
                    currentBalance = parsed;
                }
            }

            if (currentBalance > 0) {
                setAmount(currentBalance.toFixed(2));
            } else {
                const fee = parseFloat(String(selectedCase.fee));
                if (!isNaN(fee) && fee > 0 && currentBalance <= 0) {
                    console.warn(
                        `CashPaymentModal: Case ID ${selectedCase.case_id} was selected, but its backend balance ('${BALANCE_FIELD_NAME_FROM_BACKEND}': ${balanceValueFromBackend}) is not positive. ` +
                        `Falling back to the full case fee for the amount field.`
                    );
                    setAmount(fee.toFixed(2));
                } else {
                    setAmount('0.00');
                }
            }
        } else {
            setAmount('');
            setPaymentNotes('');
            setCustomerEmail('');
        }
    }, [selectedCase]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCase) {
            toast.error("Please select a case to record payment.");
            return;
        }

        const enteredAmount = Number(amount);
        if (isNaN(enteredAmount) || enteredAmount <= 0) {
            toast.error('Please enter a valid positive amount.');
            return;
        }

        const balanceValueFromBackend = (selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
        let maxPayable = 0;

        if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
            const parsed = parseFloat(String(balanceValueFromBackend));
            if (!isNaN(parsed) && parsed > 0) {
                maxPayable = parsed;
            }
        }
        
        if (maxPayable <= 0) {
            const fee = parseFloat(String(selectedCase.fee));
             if (!isNaN(fee) && fee > 0) {
                maxPayable = fee;
                console.warn(`CashPaymentModal: Submitting payment for Case ID ${selectedCase.case_id}: Backend balance ('${BALANCE_FIELD_NAME_FROM_BACKEND}') was not positive or available. Using full case fee as max payable.`);
            }
        }

        if (maxPayable <= 0) {
            toast.error("This case appears to have no outstanding balance, or balance information is unavailable. Payment cannot be recorded.");
            return;
        }

        if (enteredAmount > maxPayable) {
            toast.error(`Amount (${enteredAmount.toFixed(2)}) cannot exceed the outstanding balance of ${maxPayable.toFixed(2)}.`);
            return;
        }

        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            toast.error("Please enter a valid email address or leave it blank.");
            return;
        }

        setIsSubmitting(true);
        const paymentData: CreateCashPaymentPayload = {
            case_id: selectedCase.case_id,
            user_id: selectedCase.user_id,
            amount: enteredAmount,
            payment_notes: paymentNotes || undefined,
            customer_email: customerEmail || undefined,
        };

        try {
            await createCashPayment(paymentData).unwrap();
            toast.success("Cash payment recorded successfully!");
            // Update last used email on successful payment if email was provided
            if (customerEmail) {
                updateLastUsedCashEmail(customerEmail);
            }
            handleClose();
        } catch (err: unknown) {
            console.error("API Payment Creation Error", err);
            let errorMessage = 'Failed to record cash payment.';
            if (typeof err === 'object' && err !== null) {
                const apiErr = err as { data?: { message?: string }, error?: string };
                if (apiErr.data && typeof apiErr.data.message === 'string') {
                    errorMessage = apiErr.data.message;
                } else if (typeof apiErr.error === 'string') {
                    errorMessage = apiErr.error;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedCase(null);
        setAmount('');
        setPaymentNotes('');
        setCustomerEmail('');
        setStatusFilter('');
        setTypeFilter('');
        setStationFilterInput('');
        setCaseNumberFilterInput('');
        setSearchTermInput('');
        onClose();
    };

    if (!isOpen) return null;

    const inputClassName = "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
    const labelClassName = "block text-sm font-bold text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50 overflow-auto">
            <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <span role="img" aria-label="cash" className="h-8 w-8 text-green-500 mr-2 text-3xl">💰</span>
                        <h3 className="text-3xl font-extrabold text-blue-600 text-center">Record Cash Payment</h3>
                        <button
                            type="button"
                            className="text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleClose}
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <h4 className="text-xl font-semibold text-blue-500 mb-3">Select Case To Make Payment (only cases with outstanding balance):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {/* Filter inputs remain the same */}
                            <div>
                                <label htmlFor="cashStatusFilter" className={labelClassName}>Filter by Status:</label>
                                <select id="cashStatusFilter" className={inputClassName} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}>
                                    <option value="">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="cashTypeFilter" className={labelClassName}>Filter by Type:</label>
                                <select id="cashTypeFilter" className={inputClassName} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as CaseType | '')}>
                                    <option value="">All Types</option>
                                    <option value="criminal">Criminal</option>
                                    <option value="civil">Civil</option>
                                    {/* ... other types ... */}
                                    <option value="family">Family</option>
                                    <option value="corporate">Corporate</option>
                                    <option value="property">Property</option>
                                    <option value="employment">Employment</option>
                                    <option value="intellectual_property">Intellectual Property</option>
                                    <option value="immigration">Immigration</option>
                                    <option value="elc">ELC</option>
                                    <option value="childrenCase">Children Case</option>
                                    <option value="tribunal">Tribunal</option>
                                    <option value="conveyances">Conveyances</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="cashStationFilter" className={labelClassName}>Filter by Station:</label>
                                <input type="text" id="cashStationFilter" className={inputClassName} placeholder="Enter Station" value={stationFilterInput} onChange={(e) => setStationFilterInput(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="cashCaseNumberFilter" className={labelClassName}>Filter by Case Number:</label>
                                <input type="text" id="cashCaseNumberFilter" className={inputClassName} placeholder="Enter Case Number" value={caseNumberFilterInput} onChange={(e) => setCaseNumberFilterInput(e.target.value)} />
                            </div>
                            <div className="lg:col-span-2">
                                <label htmlFor="cashSearchTerm" className={labelClassName}>Search (Parties, Track No., etc.):</label>
                                <input type="text" id="cashSearchTerm" className={inputClassName} placeholder="Search..." value={searchTermInput} onChange={(e) => setSearchTermInput(e.target.value)} />
                            </div>
                        </div>

                        {isLoadingCases ? (
                            <p className="text-center text-gray-500 dark:text-gray-400">Loading cases...</p>
                        ) : isErrorCases ? (
                            <p className="text-center text-red-500 dark:text-red-400">Error loading cases: {errorCases instanceof Error ? errorCases.message : 'Unknown error'}</p>
                        ) : (
                            <div className="overflow-x-auto rounded-lg shadow-md max-h-72">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                    <thead className="bg-blue-50 dark:bg-blue-900 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Case ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">User ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Case Fee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Payment Balance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Station</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Case Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-300 dark:bg-gray-700 dark:divide-gray-600">
                                        {filteredCases.map((caseItem) => {
                                            const balanceValueFromBackend = (caseItem as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
                                            let displayBalance = "0.00"; 

                                            if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
                                                const parsed = parseFloat(String(balanceValueFromBackend));
                                                if (!isNaN(parsed) && parsed > 0) {
                                                    displayBalance = parsed.toFixed(2);
                                                }
                                            }
                                            return (
                                                <tr key={caseItem.case_id} className={`hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCase?.case_id === caseItem.case_id ? "bg-blue-100 dark:bg-blue-900" : ""}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{caseItem.case_id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.user_id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parseFloat(String(caseItem.fee)).toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{displayBalance}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.case_status}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.case_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.station}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.case_number}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => setSelectedCase(caseItem)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-200"
                                                            title="Select Case"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {filteredCases.length === 0 && !isLoadingCases && (
                                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No cases with outstanding payments match your filters.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Payment Form */}
                    <div className="p-6">
                        <h4 className="text-xl font-semibold text-blue-500 mb-3">Payment Details</h4>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="cashAmount" className={labelClassName}>Amount to Pay:</label>
                                <input
                                    type="number"
                                    id="cashAmount"
                                    className={inputClassName}
                                    placeholder="Enter Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    disabled={!selectedCase}
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label htmlFor="cashCustomerEmail" className={labelClassName}>Customer Email (Optional):</label>
                                <input
                                    type="email"
                                    id="cashCustomerEmail"
                                    className={inputClassName}
                                    placeholder="customer@example.com"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    disabled={!selectedCase}
                                    list="lastUsedCashEmailsDatalist"
                                />
                                <datalist id="lastUsedCashEmailsDatalist"> {/* Added datalist element */}
                                    {lastUsedCashEmails.map((email, index) => (
                                        <option key={`cash-email-suggestion-${index}`} value={email} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label htmlFor="cashPaymentNotes" className={labelClassName}>Payment Notes (Optional):</label>
                                <textarea
                                    id="cashPaymentNotes"
                                    rows={3}
                                    className={inputClassName}
                                    placeholder="Add any notes for this cash payment..."
                                    value={paymentNotes}
                                    onChange={(e) => setPaymentNotes(e.target.value)}
                                    disabled={!selectedCase}
                                />
                            </div>
                            <div className="flex justify-between pt-2">
                                <button
                                    type="submit"
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 transition duration-300 ${isSubmitting || !selectedCase ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting || !selectedCase}
                                >
                                    {isSubmitting ? (
                                        <div className='flex items-center justify-center'>
                                            <span className="loading loading-spinner text-white mr-2"></span>Processing...
                                        </div>
                                    ) : "Record Payment"}
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 ml-2 transition duration-300"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashPaymentModal;