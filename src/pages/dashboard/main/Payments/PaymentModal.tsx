// src/components/PaymentHistory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import CashPaymentModal from './cash';
import MpesaPayment from './mpesa';
import StripePaymentModal from './stripe';
import {
    useFetchPaymentsQuery,
    PaymentDataTypes,
    // useDeletePaymentMutation
} from '../../../../features/payment/paymentAPI';
// import { toast } from "sonner";
import { format } from 'date-fns';

// Define the PaymentAPIResponse interface
interface PaymentAPIResponse {
    success: boolean;
    payments: PaymentDataTypes[];
}

// Define the type for the useFetchPaymentsQuery hook result
interface FetchPaymentsQueryResult {
    data?: PaymentAPIResponse;
    isLoading: boolean;
    isError: boolean;
    error: unknown; // Or a more specific error type if you have one
    refetch: () => void;
}

type PaymentMode = 'cash' | 'mpesa' | 'stripe' | '';

const PaymentHistory: React.FC = () => {
    const [isPaymentModeSelectionOpen, setIsPaymentModeSelectionOpen] = useState(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>('');
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterGateway, setFilterGateway] = useState<string>('');
    const [filterAmount, setFilterAmount] = useState<string>('');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [filterCaseId, setFilterCaseId] = useState<string>('');
    const [filterUser, setFilterUser] = useState<string>('');
    const [filterTransactionId, setFilterTransactionId] = useState<string>(''); // New state for transaction ID filter

    const { data, isLoading, isError, error, refetch } = useFetchPaymentsQuery() as FetchPaymentsQueryResult;
    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[]>([]);
    // const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

    useEffect(() => {
        if (data?.success && Array.isArray(data.payments)) {
            setFilteredPayments(data.payments);
        } else {
            setFilteredPayments([]);
            if (error) {
                console.error("Error fetching payments:", error);
            } else if (data && !data.success) {
                console.error("API returned unsuccessful response:", data);
            }
        }
    }, [data, error]);

    const handleFilter = useCallback(() => {
        if (!data?.success || !Array.isArray(data.payments)) {
            setFilteredPayments([]);
            return;
        }

        let tempPayments = [...data.payments];

        if (filterStatus) {
            tempPayments = tempPayments.filter(payment => payment.payment_status === filterStatus);
        }

        if (filterGateway) {
            tempPayments = tempPayments.filter(payment => payment.payment_gateway === filterGateway);
        }

        if (filterAmount) {
            const amount = parseFloat(filterAmount);
            if (!isNaN(amount)) {
                tempPayments = tempPayments.filter(payment => Number(payment.payment_amount) === amount);
            }
        }

        if (filterDateFrom) {
            const fromDate = new Date(filterDateFrom);
            tempPayments = tempPayments.filter(payment => new Date(payment.payment_date || '') >= fromDate);
        }

        if (filterDateTo) {
            const toDate = new Date(filterDateTo);
            tempPayments = tempPayments.filter(payment => new Date(payment.payment_date || '') <= toDate);
        }

        if (filterCaseId) {
            tempPayments = tempPayments.filter(payment => String(payment.case_id) === filterCaseId);
        }

        if (filterUser) {
            tempPayments = tempPayments.filter(payment => String(payment.user_id) === filterUser);
        }

        // Transaction ID Filter Logic:
        if (filterTransactionId) {
            const transactionId = filterTransactionId.trim();
            tempPayments = tempPayments.filter(payment => {
                if (payment.transaction_id && payment.transaction_id.toLowerCase() === transactionId.toLowerCase()) {
                    return true; // Direct match on transaction_id field
                }

                if (payment.payment_gateway === 'mpesa') {
                    // Check if the transaction ID exists within the M-Pesa message
                    const mpesaMessage = payment.mpesa_message || ''; // Assuming there's a field for the message
                    return mpesaMessage.toLowerCase().includes(transactionId.toLowerCase());
                }

                return false;
            });
        }



        setFilteredPayments(tempPayments);
    }, [filterStatus, filterGateway, filterAmount, filterDateFrom, filterDateTo, filterCaseId, filterUser, filterTransactionId, data]);

    useEffect(() => {
        handleFilter();
    }, [handleFilter]);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return format(date, 'MMM dd, yyyy HH:mm');
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    // const handleDeletePayment = async (paymentId: number | undefined) => {
    //     if (paymentId === undefined) {
    //         toast.error('Invalid Payment ID.');
    //         return;
    //     }
    //     try {
    //         await deletePayment(paymentId).unwrap();
    //         toast.success('Payment deleted successfully!');
    //         setFilteredPayments(prevPayments => prevPayments.filter(payment => payment.payment_id !== paymentId));
    //         refetch();
    //     } catch (error) {
    //         console.error('Failed to delete payment:', error);
    //         toast.error('Failed to delete payment.');
    //     }
    // };

    const resetFilters = () => {
        setFilterStatus('');
        setFilterGateway('');
        setFilterAmount('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterCaseId('');
        setFilterUser('');
        setFilterTransactionId(''); // Clear Transaction ID filter
        setFilteredPayments(data?.payments || []);
        refetch();
    };

    const handlePaymentModeSelect = (mode: PaymentMode) => {
        setSelectedPaymentMode(mode);
        setIsPaymentModeSelectionOpen(false);

        switch (mode) {
            case 'cash':
                setIsCashModalOpen(true);
                break;
            case 'mpesa':
                setIsMpesaModalOpen(true);
                break;
            case 'stripe':
                setIsStripeModalOpen(true);
                break;
            default:
                break;
        }
        console.log(`Selected payment mode: ${selectedPaymentMode}`);
    };

    const handleClosePayment = () => {
        setIsCashModalOpen(false);
        setIsMpesaModalOpen(false);
        setIsStripeModalOpen(false);
        setSelectedPaymentMode('');
        refetch();
    };

     const getStatusColor = (status: string | undefined): string => {
        const safeStatus = status || ''; // Provide a default value
        switch (safeStatus) {
            case 'pending':
                return 'text-yellow-500';
            case 'completed':
                return 'text-green-500';
            case 'failed':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };
    

    return (
        <div className="w-full p-2 font-sans"> {/* Enhanced Typography (font-sans) */}
            <div className="bg-blue-100 dark:bg-blue-900 z-10 py-2 mb-2 flex items-center justify-between rounded shadow"> {/* Box Shadows and Rounded Borders */}
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 text-center">
                    Payment History
                </h2>
                <div>
                    <div className="relative inline-block text-left">
                        <div>
                            <button
                                type="button"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => setIsPaymentModeSelectionOpen(true)}
                                aria-expanded="true"
                                aria-haspopup="true"
                            >
                                Initiate Payment
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {isPaymentModeSelectionOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                <div className="py-1" role="none">
                                    <button
                                        onClick={() => handlePaymentModeSelect('cash')}
                                        className="text-gray-700 dark:text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                                        role="menuitem" tabIndex={-1} id="menu-item-0"
                                    >
                                        Cash
                                    </button>
                                    <button
                                        onClick={() => handlePaymentModeSelect('mpesa')}
                                        className="text-gray-700 dark:text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                                        role="menuitem" tabIndex={-1} id="menu-item-1"
                                    >
                                        M-Pesa
                                    </button>
                                    <button
                                        onClick={() => handlePaymentModeSelect('stripe')}
                                        className="text-gray-700 dark:text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                                        role="menuitem" tabIndex={-1} id="menu-item-2"
                                    >
                                        Stripe
                                    </button>
                                </div>
                                <div className="py-1" role="none">
                                    <button
                                        onClick={() => setIsPaymentModeSelectionOpen(false)}
                                        className="text-red-700 dark:text-red-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-red-900 dark:hover:text-red-200"
                                        role="menuitem" tabIndex={-1} id="menu-item-3"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
                {/* Status Filter */}
                <div>
                    <label htmlFor="statusFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Status:</label>
                    <select
                        id="statusFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                {/* Gateway Filter */}
                <div>
                    <label htmlFor="gatewayFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Gateway:</label>
                    <select
                        id="gatewayFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        value={filterGateway}
                        onChange={(e) => setFilterGateway(e.target.value)}
                    >
                        <option value="">All Gateways</option>
                        <option value="stripe">Stripe</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                {/* Amount Filter */}
                <div>
                    <label htmlFor="amountFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Amount:</label>
                    <input
                        type="number"
                        id="amountFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        placeholder="Enter amount"
                        value={filterAmount}
                        onChange={(e) => setFilterAmount(e.target.value)}
                    />
                </div>

                {/* Date From Filter */}
                <div>
                    <label htmlFor="dateFromFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Date From:</label>
                    <input
                        type="date"
                        id="dateFromFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                    />
                </div>

                {/* Date To Filter */}
                <div>
                    <label htmlFor="dateToFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Date To:</label>
                    <input
                        type="date"
                        id="dateToFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                    />
                </div>

                {/* Case ID Filter */}
                <div>
                    <label htmlFor="caseIdFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Case ID:</label>
                    <input
                        type="text"
                        id="caseIdFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        placeholder="Enter Case ID"
                        value={filterCaseId}
                        onChange={(e) => setFilterCaseId(e.target.value)}
                    />
                </div>

                {/* User Filter */}
                <div>
                    <label htmlFor="userFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">User ID:</label>
                    <input
                        type="number"
                        id="userFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        placeholder="Enter User ID"
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                    />
                </div>

                 {/* Transaction ID Filter */}
                 <div>
                    <label htmlFor="transactionIdFilter" className="block text-sm font-medium text-blue-700 dark:text-blue-300">Transaction ID / M-Pesa Message:</label>
                    <input
                        type="text"
                        id="transactionIdFilter"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white hover:border-indigo-500"
                        placeholder="Enter Transaction ID or Paste M-Pesa Message"
                        value={filterTransactionId}
                        onChange={(e) => setFilterTransactionId(e.target.value)}
                    />
                </div>
            </div>

            {/* Reset Filters Button */}
            <div className="mb-4">
                <button
                    onClick={resetFilters}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Reset Filters
                </button>
            </div>

            {/* Payment Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 uppercase text-sm">
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">ID</th>
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Amount</th>
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Status</th>
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Gateway</th>
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Date</th>
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Transaction ID</th>
                            {/* <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={7} className="text-center py-4">Loading payments...</td></tr>
                        ) : isError ? (
                            <tr><td colSpan={7} className="text-center py-4 text-red-500">Error loading payments.please check your internet connection and reload the page. If connected to internet  and this error  persist contact support team</td></tr>
                        ) : filteredPayments.length > 0 ? (
                            filteredPayments.map((payment, index) => (
                                <tr key={payment.payment_id} className={`hover:bg-gray-200 dark:hover:bg-neutral-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'} transition-colors duration-200`}> {/* Striped Rows and Hover Effects */}
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-semibold">{payment.payment_id}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-semibold">{payment.payment_amount}</p>
                                    </td>
                                    <td className={`px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm ${getStatusColor(payment.payment_status)}`}>
                                        <p className=" whitespace-no-wrap font-semibold">{payment.payment_status}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-semibold">{payment.payment_gateway}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-semibold">
                                            {formatDate(payment.payment_date)}
                                        </p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm">
                                        <p className="text-blue-500 dark:text-blue-400 whitespace-no-wrap font-semibold">{payment.transaction_id}</p>
                                    </td>
                                    {/* <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800  text-sm text-right">
                                        <button
                                            onClick={() => handleDeletePayment(payment.payment_id)}
                                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 font-bold py-1 px-3 rounded"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="text-center py-4">No payments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {isCashModalOpen && (
                <CashPaymentModal isOpen={isCashModalOpen} onClose={handleClosePayment} />
            )}
            {isMpesaModalOpen && (
                <MpesaPayment isOpen={isMpesaModalOpen} onClose={handleClosePayment} />
            )}
            {isStripeModalOpen && (
                <StripePaymentModal isOpen={isStripeModalOpen} onClose={handleClosePayment} />
            )}
        </div>
    );
};

export default PaymentHistory;