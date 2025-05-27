// src/components/StripePaymentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import {
    useFetchCasesQuery,
    CaseDataTypes as Case, // Ensure this type includes your backend balance field
    CaseStatus,
    CaseType
} from '../../../../features/case/caseAPI';
import { useHandleStripePaymentMutation } from '../../../../features/payment/paymentAPI';

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

interface StripePaymentModalProps {
    userId?: number; // Optional userId prop if needed
    isOpen: boolean;
    onClose: () => void;
}

interface StripePaymentRequest {
    case_id: number;
    user_id: number;
    amount: number;
    customer_email?: string; // Added customer_email
}

interface StripeSessionResponse {
    sessionId: string;
}

const BALANCE_FIELD_NAME_FROM_BACKEND = 'payment_balance';
const DEBOUNCE_DELAY = 300;

const stripePromise = loadStripe('pk_test_51PbjmV2KRb5wlrNTEeIUsEuhrnk1wYAmNRO0eqkF3oLwawrZ2VgT824xa3zxkGttW0HS3TqZiSTUwxfqNhGmdTw300tJ0o4DDo');

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [handleStripePayment] = useHandleStripePaymentMutation();
    const [amount, setAmount] = useState('');
    const [customerEmail, setCustomerEmail] = useState(''); // State for customer email
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilterInput, setStationFilterInput] = useState('');
    const [caseNumberFilterInput, setCaseNumberFilterInput] = useState('');
    const [searchTermInput, setSearchTermInput] = useState('');

    const debouncedStationFilter = useDebounce(stationFilterInput, DEBOUNCE_DELAY);
    const debouncedCaseNumberFilter = useDebounce(caseNumberFilterInput, DEBOUNCE_DELAY);
    const debouncedSearchTerm = useDebounce(searchTermInput, DEBOUNCE_DELAY);

    const { data: casesData, isLoading: isLoadingCases, isError: isErrorCases, error: errorCases } = useFetchCasesQuery();
    const cases = useMemo(() => Array.isArray(casesData) ? casesData : [], [casesData]);

    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases) || isLoadingCases) return [];
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
        cases, isLoadingCases, statusFilter, typeFilter,
        debouncedStationFilter, debouncedCaseNumberFilter, debouncedSearchTerm,
    ]);

    useEffect(() => {
        if (selectedCase) {
            const balanceValueFromBackend = (selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
            let currentBalance = 0;
            if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
                const parsed = parseFloat(String(balanceValueFromBackend));
                if (!isNaN(parsed)) currentBalance = parsed;
            }

            if (currentBalance > 0) {
                setAmount(currentBalance.toFixed(2));
            } else {
                const fee = parseFloat(String(selectedCase.fee));
                if (!isNaN(fee) && fee > 0 && currentBalance <= 0) {
                    setAmount(fee.toFixed(2));
                } else {
                    setAmount('0.00');
                }
            }
            // Optionally pre-fill email if available on the selectedCase or associated user
            // setCustomerEmail(selectedCase.client_email || ''); 
        } else {
            setAmount('');
            setCustomerEmail(''); // Reset email when no case is selected
        }
    }, [selectedCase]);

    const handleMakePaymentInternal = async () => {
        if (!selectedCase) {
            toast.error('Please select a case first.');
            return;
        }
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            toast.error('Invalid amount. Please enter a positive number.');
            return;
        }

        const balanceValueFromBackend = (selectedCase as Case)[BALANCE_FIELD_NAME_FROM_BACKEND as keyof Case];
        let maxPayable = 0;
        if (balanceValueFromBackend !== null && balanceValueFromBackend !== undefined) {
            const parsed = parseFloat(String(balanceValueFromBackend));
            if (!isNaN(parsed) && parsed > 0) maxPayable = parsed;
        }
        if (maxPayable <= 0) {
            const fee = parseFloat(String(selectedCase.fee));
            if (!isNaN(fee) && fee > 0) maxPayable = fee;
        }
        if (maxPayable <= 0) {
             toast.error("This case appears to have no outstanding balance. Payment cannot be recorded.");
             return;
        }
        if (amountNumber > maxPayable) {
            toast.error(`Amount (${amountNumber.toFixed(2)}) cannot exceed the outstanding balance of ${maxPayable.toFixed(2)}.`);
            return;
        }

        // Email validation (optional if email is optional, required if email is mandatory for receipt)
        if (!customerEmail) { // If email is mandatory for receipt
             toast.error("Customer email is required for the receipt.");
             return;
        }
        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);
        try {
            const paymentData: StripePaymentRequest = {
                case_id: selectedCase.case_id,
                user_id: selectedCase.user_id,
                amount: amountNumber,
                customer_email: customerEmail || undefined, // Pass email if provided
            };

            const paymentResponse = await handleStripePayment(paymentData).unwrap() as StripeSessionResponse;

            const stripe = await stripePromise;
            if (paymentResponse.sessionId && stripe) {
                localStorage.setItem('redirectAfterStripe', '/dashboard/payments');
                const { error } = await stripe.redirectToCheckout({
                    sessionId: paymentResponse.sessionId,
                });
                if (error) {
                    toast.error(error.message || 'Error redirecting to Stripe checkout.');
                    localStorage.removeItem('redirectAfterStripe');
                }
            } else {
                toast.error("Failed to get Stripe session ID. Please try again.");
            }
        } catch (error: unknown) {
            let errorMessage = 'Payment initiation failed. Please try again.';
            if (typeof error === 'object' && error !== null) {
                type ErrorWithData = { data?: { message?: string }, message?: string };
                const err = error as ErrorWithData;
                if (err.data && typeof err.data.message === 'string') {
                    errorMessage = err.data.message;
                } else if (typeof err.message === 'string') {
                    errorMessage = err.message;
                }
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get('stripe_payment_success');
        const canceled = query.get('stripe_payment_canceled');
        const redirectPath = localStorage.getItem('redirectAfterStripe');

        if (success) {
            toast.success('Payment completed successfully!');
            if (redirectPath) {
                navigate(redirectPath, { replace: true });
                localStorage.removeItem('redirectAfterStripe');
            } else {
                navigate('/dashboard/payments', {replace: true}); // Default success path
            }
        } else if (canceled) {
            toast.warning('Payment was canceled.');
            if (redirectPath) {
                 // Attempt to remove query params before navigating back
                const cleanPath = window.location.pathname;
                navigate(redirectPath.startsWith('/') ? redirectPath : cleanPath, { replace: true });
                localStorage.removeItem('redirectAfterStripe');
            } else {
                 const cleanPath = window.location.pathname;
                 navigate(cleanPath, {replace: true}); // Go back to modal's path
            }
        }
         // Clean up query parameters from URL if they exist, regardless of localStorage item
        if (success || canceled) {
            const cleanURL = window.location.pathname + (redirectPath && redirectPath.includes('?') ? redirectPath.substring(redirectPath.indexOf('?')) : '');
            window.history.replaceState({}, document.title, cleanURL);
        }

    }, [navigate]);

    const handleModalClose = () => {
        setSelectedCase(null);
        setAmount('');
        setCustomerEmail(''); // Reset customer email
        setStatusFilter('');
        setTypeFilter('');
        setStationFilterInput('');
        setCaseNumberFilterInput('');
        setSearchTermInput('');
        setIsSubmitting(false);
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
                         <span role="img" aria-label="stripe" className="h-8 w-8 text-indigo-500 mr-2 text-3xl">💳</span>
                        <h3 className="text-3xl font-extrabold text-blue-600 text-center">Stripe Payment</h3>
                        <button
                            type="button"
                            className="text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleModalClose}
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <h4 className="text-xl font-semibold text-blue-500 mb-3">Select Case For Payment (Outstanding Balance Only):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="stripeStatusFilter" className={labelClassName}>Filter by Status:</label>
                                <select id="stripeStatusFilter" className={inputClassName} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}>
                                    <option value="">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="stripeTypeFilter" className={labelClassName}>Filter by Type:</label>
                                <select id="stripeTypeFilter" className={inputClassName} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as CaseType | '')}>
                                    <option value="">All Types</option>
                                    <option value="criminal">Criminal</option>
                                    <option value="civil">Civil</option>
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
                                <label htmlFor="stripeStationFilter" className={labelClassName}>Filter by Station:</label>
                                <input type="text" id="stripeStationFilter" className={inputClassName} placeholder="Enter Station" value={stationFilterInput} onChange={(e) => setStationFilterInput(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="stripeCaseNumberFilter" className={labelClassName}>Filter by Case Number:</label>
                                <input type="text" id="stripeCaseNumberFilter" className={inputClassName} placeholder="Enter Case Number" value={caseNumberFilterInput} onChange={(e) => setCaseNumberFilterInput(e.target.value)} />
                            </div>
                            <div className="lg:col-span-2">
                                <label htmlFor="stripeSearchTerm" className={labelClassName}>Search (Parties, Track No., etc.):</label>
                                <input type="text" id="stripeSearchTerm" className={inputClassName} placeholder="Search..." value={searchTermInput} onChange={(e) => setSearchTermInput(e.target.value)} />
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

                    <div className="p-6">
                        <h4 className="text-xl font-semibold text-blue-500 mb-3">Payment Details</h4>
                        {selectedCase && (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleMakePaymentInternal(); }}>
                                <div>
                                    <label htmlFor="stripeAmount" className={labelClassName}>Amount to Pay:</label>
                                    <input
                                        type="number"
                                        id="stripeAmount"
                                        className={inputClassName}
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        disabled={!selectedCase}
                                        step="0.01"
                                    />
                                </div>
                                <div> {/* New Customer Email Field */}
                                    <label htmlFor="stripeCustomerEmail" className={labelClassName}>
                                        Customer Email (for receipt):
                                    </label>
                                    <input
                                        type="email"
                                        id="stripeCustomerEmail"
                                        className={inputClassName}
                                        placeholder="customer@example.com"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        disabled={!selectedCase}
                                        required // Make it required if receipts are essential
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
                                                <span className="loading loading-spinner text-white mr-2"></span>
                                                Processing...
                                            </div>
                                        ) : (
                                            "Pay with Stripe"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 ml-2 transition duration-300"
                                        onClick={handleModalClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                        {!selectedCase && (
                            <p className="text-center text-gray-500 dark:text-gray-400">Please select a case to proceed with payment.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StripePaymentModal;