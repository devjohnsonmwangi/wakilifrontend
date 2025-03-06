
import React, { useState, useEffect, useCallback } from 'react';
import PaymentModal from './PaymentModal'; // Adjust the path as necessary
import {
    useFetchPaymentsQuery,
    PaymentDataTypes, // Ensure you import PaymentDataTypes
    useDeletePaymentMutation // Import the delete mutation
} from '../../../../features/payment/paymentAPI'; // Adjust the path as necessary

import { toast } from "sonner";
import { format } from 'date-fns'; // For formatting dates

interface ParentComponentProps {
    // No props needed for this component now
}

const ParentComponent: React.FC<ParentComponentProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterGateway, setFilterGateway] = useState<string>('');
    const [filterAmount, setFilterAmount] = useState<string>('');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [filterCaseId, setFilterCaseId] = useState<string>(''); // Changed to case ID
    const [filterUser, setFilterUser] = useState<string>('');

    const { data: payments, isLoading, isError } = useFetchPaymentsQuery(); // Destructure refetch from the query

    const [filteredPayments, setFilteredPayments] = useState<PaymentDataTypes[] | undefined>(payments);
    const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation(); // Get the delete mutation

    useEffect(() => {
        setFilteredPayments(payments); // Initialize with all payments
    }, [payments]);

    // Filter Function
    const handleFilter = useCallback(() => {
        if (!payments) {
            return; // Return early if payments is undefined or null
        }

        let tempPayments = [...payments]; // Create a copy to avoid mutating the original data

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
            try {
                const fromDate = new Date(filterDateFrom);
                tempPayments = tempPayments.filter(payment => {
                    const paymentDate = new Date(payment.payment_date || ''); // Provide a default value in case of undefined
                    return paymentDate >= fromDate;
                });
            } catch (error) {
                console.error("Error filtering by date from:", error);
            }
        }

        if (filterDateTo) {
            try {
                const toDate = new Date(filterDateTo);
                tempPayments = tempPayments.filter(payment => {
                    const paymentDate = new Date(payment.payment_date || ''); // Provide a default value in case of undefined
                    return paymentDate <= toDate;
                });
            } catch (error) {
                console.error("Error filtering by date to:", error);
            }
        }

        if (filterCaseId) { // Changed from filterCaseNumber to filterCaseId
            tempPayments = tempPayments.filter(payment => String(payment.case_id) === filterCaseId); // Filter by case ID
        }

        if (filterUser) {
            tempPayments = tempPayments.filter(payment => String(payment.user_id) === filterUser); // Ensure correct type
        }

        setFilteredPayments(tempPayments);
    }, [filterStatus, filterGateway, filterAmount, filterDateFrom, filterDateTo, filterCaseId, filterUser, payments]);

    // Use Effect to run the Filter Function
    useEffect(() => {
        handleFilter();
    }, [handleFilter]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) {
            return "N/A"; // Handle undefined date
        }
        try {
            const date = new Date(dateString);
            return format(date, 'MMM dd, yyyy HH:mm'); // Example: Aug 15, 2024 14:30
        } catch (formatError) {
            console.error("Error formatting date:", formatError);
            return "Invalid Date";
        }
    };

    // New function to handle the actions
    const handlePaymentAction = (message: string, type: "success" | "error" = "success") => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    const handleDeletePayment = async (paymentId: number | undefined) => { // Ensure paymentId is a number
        if (paymentId === undefined) {
            toast.error('Invalid Payment ID.');
            return;
        }
        try {
            await deletePayment(Number(paymentId)).unwrap(); // Convert paymentId to string
            toast.success('Payment deleted successfully!');
            // Remove the deleted payment from the local state
            setFilteredPayments(prevPayments => prevPayments?.filter(payment => payment.payment_id !== paymentId));
        } catch (error: unknown) { // Use 'unknown' type for error
            console.error('Failed to delete payment:', error);
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to delete payment.'); // Access the error message safely
            } else {
                toast.error('Failed to delete payment.'); // Fallback message
            }
        }
    };

    // Function to reset filters
    const resetFilters = () => {
        setFilterStatus('');
        setFilterGateway('');
        setFilterAmount('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterCaseId(''); // Reset case ID filter
        setFilterUser('');
        setFilteredPayments(payments); // Reset filtered payments to all payments
    };

    return (
        <div className="w-full p-2">
            {/* Header */}
            <div className=" bg-blue-100 dark:bg-blue-900 z-10 py-2 mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 text-center">
                    Payment History
                </h2>
                <div>
                    {/* Button to open the modal */}
                    <button
                        onClick={handleOpenModal}
                        className=" bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Initiate Payment
                    </button>
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
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        {/* Add more options as needed */}
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
                        {/* Add more options as needed */}
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
                            <th className="px-3 py-2 sm:px-5 sm:py-3 border-b-2 border-gray-200 dark:border-neutral-800 text-left font-semibold">Actions</th> {/* New column */}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={7} className="text-center py-4">Loading payments...</td></tr>
                        ) : isError ? (  // Handle error state
                            <tr><td colSpan={7} className="text-center py-4 text-red-500">Error loading payments.</td></tr>
                        ) : filteredPayments && filteredPayments.length > 0 ? ( // Check for payments and length
                            filteredPayments.map((payment) => (
                                <tr key={payment.payment_id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{payment.payment_id}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{payment.payment_amount}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{payment.payment_status}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{payment.payment_gateway}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                                            {formatDate(payment.payment_date)}
                                        </p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{payment.transaction_id}</p>
                                    </td>
                                    <td className="px-3 py-2 sm:px-5 sm:py-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-right">
                                        <button
                                            onClick={() => handleDeletePayment(payment.payment_id)} // Ensure payment_id is passed correctly
                                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 font-bold py-1 px-3 rounded"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="text-center py-4">No payments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAction={handlePaymentAction}
            />
        </div>
    );
};

export default ParentComponent;


