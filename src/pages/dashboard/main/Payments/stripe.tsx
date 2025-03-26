// src/components/StripePaymentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import {
    useFetchCasesQuery,
    CaseDataTypes as Case,
    CaseStatus,
    CaseType
} from '../../../../features/case/caseAPI';
import { useHandleStripePaymentMutation } from '../../../../features/payment/paymentAPI';

interface StripePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface StripePaymentRequest {
    case_id: number;
    user_id: number;
    amount: number;
}

// Initialize Stripe outside of the component
const stripePromise = loadStripe('pk_test_51PbjmV2KRb5wlrNTEeIUsEuhrnk1wYAmNRO0eqkF3oLwawrZ2VgT824xa3zxkGttW0HS3TqZiSTUwxfqNhGmdTw300tJ0o4DDo'); // Replace with your actual publishable key

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [handleStripePayment] = useHandleStripePaymentMutation();
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    // Filter state
    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilter, setStationFilter] = useState('');
    const [caseNumberFilter, setCaseNumberFilter] = useState('');
    const [trackNumberFilter, setTrackNumberFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: cases, isLoading: isLoadingCases, isError: isErrorCases, error: errorCases } = useFetchCasesQuery();

    // Memoize the filtered cases for performance
    const filteredCases = useMemo(() => {
        if (!cases) return [];

        let filtered = [...cases];

        if (statusFilter) {
            filtered = filtered.filter(caseItem => caseItem.case_status === statusFilter);
        }

        if (typeFilter) {
            filtered = filtered.filter(caseItem => caseItem.case_type === typeFilter);
        }

        if (stationFilter) {
            filtered = filtered.filter(caseItem =>
                caseItem.station.toLowerCase().includes(stationFilter.toLowerCase())
            );
        }

        if (caseNumberFilter) {
            filtered = filtered.filter(caseItem =>
                caseItem.case_number.toLowerCase().includes(caseNumberFilter.toLowerCase())
            );
        }

        if (trackNumberFilter) {
            filtered = filtered.filter(caseItem =>
                caseItem.case_track_number.toLowerCase().includes(trackNumberFilter.toLowerCase())
            );
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(caseItem =>
                caseItem.case_number.toLowerCase().includes(term) ||
                caseItem.case_track_number.toLowerCase().includes(term) ||
                caseItem.parties.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [cases, statusFilter, typeFilter, stationFilter, caseNumberFilter, trackNumberFilter, searchTerm]);


    useEffect(() => {
        if (selectedCase) {
            setAmount(selectedCase.fee.toString());
        } else {
            setAmount('');
        }
    }, [selectedCase]);

    const handleMakePayment = async (case_id: number, user_id: number, amount: string) => {
        console.log('Initiating payment with case_id:', case_id, ' user id:', user_id, 'and amount:', amount);

        // Convert amount to number to ensure it's valid
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber)) {
            toast.error('Invalid amount');
            console.error('Invalid amount:', amount);
            return;
        }

        setIsSubmitting(true);
        try {
            const paymentData: StripePaymentRequest = {
                case_id: case_id,
                user_id: user_id,
                amount: Number(amount),
            };

            const paymentResponse = await handleStripePayment(paymentData).unwrap();
            toast.success('Payment initiated successfully');
            console.log('Payment response:', paymentResponse);

            const stripe = await stripePromise;

            // Redirect to the Stripe checkout URL
            if (paymentResponse.sessionId && stripe) {
                const { error } = await stripe.redirectToCheckout({
                    sessionId: paymentResponse.sessionId,
                });
                if (error) {
                    console.error('Error redirecting to checkout:', error);
                    toast.error('Error redirecting to checkout');
                }
            } else {
                toast.error("Failed to create Stripe session. Please try again.");
            }

        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error('Error initiating payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    // useEffect to handle post-Stripe redirect
    useEffect(() => {
        const redirectPath = localStorage.getItem('redirectAfterStripe');

        if (redirectPath) {
            localStorage.removeItem('redirectAfterStripe');
            navigate('/dashboard/payments'); 
        }
    }, [navigate]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700"> {/* Fancy background, rounded corners, border */}
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                        title="Close"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                    <div className="py-6 px-6 lg:px-8 overflow-y-auto max-h-[80vh]">
                        <h3 className="mb-6 text-3xl font-extrabold text-blue-600 text-center">Stripe Payment Portal</h3> {/* Larger, bolder title, centered, blue */}

                        {/* Case Selection Section */}
                        <div className="mb-6"> {/* Added margin at the bottom */}
                            <h4 className="text-xl font-semibold text-blue-500 mb-3">Select Case To Make  Payment:</h4> {/* Subtitle blue */}

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label htmlFor="statusFilter" className="block text-gray-700 text-sm font-bold mb-2">
                                        Filter by Status:
                                    </label>
                                    <select
                                        id="statusFilter"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="typeFilter" className="block text-gray-700 text-sm font-bold mb-2">
                                        Filter by Type:
                                    </label>
                                    <select
                                        id="typeFilter"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value as CaseType | '')}
                                    >
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
                                    <label htmlFor="stationFilter" className="block text-gray-700 text-sm font-bold mb-2">
                                        Filter by Station:
                                    </label>
                                    <input
                                        type="text"
                                        id="stationFilter"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Station"
                                        value={stationFilter}
                                        onChange={(e) => setStationFilter(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="caseNumberFilter" className="block text-gray-700 text-sm font-bold mb-2">
                                        Filter by Case Number:
                                    </label>
                                    <input
                                        type="text"
                                        id="caseNumberFilter"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Case Number"
                                        value={caseNumberFilter}
                                        onChange={(e) => setCaseNumberFilter(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="trackNumberFilter" className="block text-gray-700 text-sm font-bold mb-2">
                                        Filter by Track Number:
                                    </label>
                                    <input
                                        type="text"
                                        id="trackNumberFilter"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Track Number"
                                        value={trackNumberFilter}
                                        onChange={(e) => setTrackNumberFilter(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="searchTerm" className="block text-gray-700 text-sm font-bold mb-2">
                                        Search:
                                    </label>
                                    <input
                                        type="text"
                                        id="searchTerm"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Parties"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Case Table */}
                            {isLoadingCases ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">Loading cases...</p>
                            ) : isErrorCases ? (
                                <p className="text-center text-red-500 dark:text-red-400">Error loading cases: {errorCases instanceof Error ? errorCases.message : 'Unknown error'}</p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg shadow-md">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Case ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    User ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Fees
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Station
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Case Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Track Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-300 dark:bg-gray-700 dark:divide-gray-600">
                                            {filteredCases.map((caseItem) => (
                                                <tr key={caseItem.case_id} className={`hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCase?.case_id === caseItem.case_id ? "bg-blue-100 dark:bg-blue-900" : ""}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {caseItem.case_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.user_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.fee}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.case_status}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.case_type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.station}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.case_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {caseItem.case_track_number}
                                                    </td>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <h3 className="mb-6 text-3xl font-extrabold text-blue-600 text-center">Payment Details</h3>
                        {selectedCase && (
                            <>
                                <div className="mb-6">
                                    <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                                        Amount:
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter amount"
                                        disabled={!selectedCase}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleMakePayment(selectedCase.case_id, selectedCase.user_id, amount)}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className='flex items-center'>
                                                <span className="loading loading-spinner text-white"></span>
                                                <span> Processing...</span>
                                            </div>
                                        ) : (
                                            "Pay Now"
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StripePaymentModal;