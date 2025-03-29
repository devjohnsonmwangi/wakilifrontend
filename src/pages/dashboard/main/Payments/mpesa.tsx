import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    useInitiateMpesaStkPushMutation,
} from '../../../../features/payment/paymentAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
    useFetchCasesQuery,
    CaseDataTypes as Case,
    CaseStatus,
    CaseType
} from '../../../../features/case/caseAPI';

const MPESA_ICON_URL = "https://stagepass.co.ke/theme/images/clients/WEB-LOGOS-14.jpg";

interface MpesaPaymentProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ApiError {
    data?: {
        message?: string;
    };
}

interface CreateMpesaPaymentVariables {
    case_id: number;
    user_id: number;
    amount: number;
    phoneNumber: string;
}

interface MpesaCallbackResponse {
    success: boolean;
    message: string;
    amount?: string;
    transactionId?: string;
    payerName?: string;
    status?: string;
    resultCode?: number;
    error?: string;
    phoneNumber?: string;
}

interface MpesaEventPayload {
    type: 'MPESA_CALLBACK';
    payload: MpesaCallbackResponse;
}

const MPESA_CALLBACK_TIMEOUT = 60000; // 60 seconds timeout

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentType, setPaymentType] = useState<'stk' | 'direct'>('stk');
    const [initiateMpesaStkPush] = useInitiateMpesaStkPushMutation();
    const navigate = useNavigate();
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isFailModalOpen, setIsFailModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<{ amount: string, receipt: string, payer: string, status: string, phoneNumber: string } | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
    const [callbackReceived, setCallbackReceived] = useState(false);
    const [callbackTimeoutId, setCallbackTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

    // Filter state
    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilter, setStationFilter] = useState('');
    const [caseNumberFilter, setCaseNumberFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: cases, isLoading: isLoadingCases, isError: isErrorCases, error: errorCases } = useFetchCasesQuery();


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

        if (searchTerm) {
            filtered = filtered.filter(caseItem =>
                caseItem.case_number.toLowerCase().includes(searchTerm) ||
                caseItem.case_track_number.toLowerCase().includes(searchTerm) ||
                caseItem.parties.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }, [cases, statusFilter, typeFilter, stationFilter, caseNumberFilter, searchTerm]);

    useEffect(() => {
        if (selectedCase) {
            setAmount(selectedCase.fee.toString());
        } else {
            setAmount('');
        }
    }, [selectedCase]);

    const handlePayment = async () => {
        if (!phoneNumber) {
            toast.error("Phone number is required.");
            setPhoneNumberError("Phone number is required.");
            return;
        }

        if (!selectedCase) {
            toast.error("Case needs to be selected.");
            return;
        }

        if (!amount) {
            toast.error("Amount is required.");
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error('Please enter a valid positive amount.');
            return;
        }

        const isValid = isValidPhoneNumber(phoneNumber)
        if (!isValid) {
            toast.error("Please enter a valid Kenyan phone number starting with 01 or 07 and has 10 digits.");
            setPhoneNumberError("Please enter a valid Kenyan phone number starting with 01 or 07 and has 10 digits.");
            return;
        }

        setIsLoading(true);
        setPaymentError(null);
        setTransactionDetails(null);
        setPhoneNumberError(null);
        setCallbackReceived(false);

        try {
            const paymentData: CreateMpesaPaymentVariables = {
                case_id: selectedCase.case_id,
                user_id: selectedCase.user_id,
                amount: Number(amount),
                phoneNumber: phoneNumber,
            };

            const response = await initiateMpesaStkPush(paymentData).unwrap();

            if (response.success) {
                toast.success("M-Pesa STK push initiated! Check your phone to complete the payment.");

                // Set up callback timeout
                const timeoutId = setTimeout(() => {
                    if (!callbackReceived) {
                        toast.error("No callback received from M-Pesa. Please check your phone and try again.");
                        setPaymentError("No callback received from M-Pesa.");
                        setIsLoading(false);
                        setIsFailModalOpen(true);
                    }
                }, MPESA_CALLBACK_TIMEOUT);

                setCallbackTimeoutId(timeoutId);

            } else {
                toast.error(`Failed to initiate M-Pesa payment: ${response.message || "Unknown error"}`);
                setPaymentError(response.message || "Failed to initiate M-Pesa payment");
                setIsFailModalOpen(true);
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError.data?.message || "Failed to initiate M-Pesa payment.";
            console.error("M-Pesa Payment Error:", apiError);
            toast.error(errorMessage);
            setPaymentError(errorMessage);
            setIsFailModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMpesaCallback = useCallback((data: MpesaCallbackResponse) => {
        setIsLoading(false);
        setCallbackReceived(true); // Set the callbackReceived to true

        // Clear timeout if the callback is received before timeout
        if (callbackTimeoutId) {
            clearTimeout(callbackTimeoutId);
            setCallbackTimeoutId(null);
        }

        if (data.success) {
            setTransactionDetails({
                amount: data.amount || 'N/A',
                receipt: data.transactionId || 'N/A',
                payer: data.payerName || 'N/A',
                status: data.status || 'Completed',
                phoneNumber: data.phoneNumber || 'N/A'
            });
            setIsSuccessModalOpen(true);
        } else {
            setPaymentError(data.message || "Payment Failed");
            setIsFailModalOpen(true);
        }
    }, [callbackTimeoutId]);

    useEffect(() => {
        const callbackListener = (event: MessageEvent<MpesaEventPayload>) => {
            if (event.data.type === 'MPESA_CALLBACK' && event.data.payload) {
                handleMpesaCallback(event.data.payload);
            }
        };

        window.addEventListener('message', callbackListener);

        return () => {
            window.removeEventListener('message', callbackListener);
        };
    }, [handleMpesaCallback]);


    const SuccessModal = () => {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <h3 className="text-2xl font-semibold text-green-500">Payment Successful!</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">The payment has been recorded successfully.</p>
                    {transactionDetails && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount Paid: {transactionDetails.amount}</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Code: {transactionDetails.receipt}</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payer: {transactionDetails.payer}</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number: {transactionDetails.phoneNumber}</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status: {transactionDetails.status}</p>
                        </div>
                    )}
                    <button
                        onClick={() => { setIsSuccessModalOpen(false); onClose(); navigate('/dashboard') }}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Okay
                    </button>
                </div>
            </div>
        );
    };


    const FailModal = () => {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <h3 className="text-2xl font-semibold text-red-500">Payment Failed!</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">Please try again</p>
                    <p className="text-red-700 dark:text-red-300">Error: {paymentError}</p>
                    <button
                        onClick={() => setIsFailModalOpen(false)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                        Okay
                    </button>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50 overflow-auto">
            <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <span role="img" aria-label="mpesa" className="h-12 w-auto text-green-500 mr-2 text-4xl">
                            <img src={MPESA_ICON_URL} alt="Mpesa Icon" className="h-8 w-8" />
                        </span>
                        <h3 className="text-3xl font-extrabold text-green-600 text-center">M-Pesa Payment Portal</h3>
                        <button
                            type="button"
                            className="text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={onClose}
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Case Selection Section */}
                    <div className="p-6">
                        <h4 className="text-xl font-semibold text-green-500 mb-3">Select Case To Make Payment:</h4>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="statusFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Filter by Status:
                                </label>
                                <select
                                    id="statusFilter"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                                <label htmlFor="typeFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Filter by Type:
                                </label>
                                <select
                                    id="typeFilter"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                                <label htmlFor="stationFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Filter by Station:
                                </label>
                                <input
                                    type="text"
                                    id="stationFilter"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter Station"
                                    value={stationFilter}
                                    onChange={(e) => setStationFilter(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="caseNumberFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Filter by Case Number:
                                </label>
                                <input
                                    type="text"
                                    id="caseNumberFilter"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark
                                    .text-white"
                                    placeholder="Enter Case Number"
                                    value={caseNumberFilter}
                                    onChange={(e) => setCaseNumberFilter(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="searchTerm" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Search:
                                </label>
                                <input
                                    type="text"
                                    id="searchTerm"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Search"
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
                                    <thead className="bg-green-50 dark:bg-green-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Case ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">User ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Fees</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Station</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Case Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-300 dark:bg-gray-700 dark:divide-gray-600">
                                        {filteredCases.map((caseItem) => (
                                            <tr key={caseItem.case_id} className={`hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCase?.case_id === caseItem.case_id ? "bg-blue-100 dark:bg-blue-900" : ""}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{caseItem.case_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.user_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{caseItem.fee}</td>
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Payment Form */}
                    <div className="p-6">
                        <h4 className="text-xl font-semibold text-green-500 mb-3">Payment Details</h4>

                        <div className="mb-4">
                            <label htmlFor="paymentType" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Payment Type:
                            </label>
                            <div className="relative">
                                <select
                                    id="paymentType"
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value as 'stk' | 'direct')}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    title="Select payment type"
                                >
                                    <option value="stk">STK Push</option>
                                    <option value="direct">Direct Payment</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">▼</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="amount" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Amount:
                            </label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter amount"
                                disabled={!selectedCase}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                    <span role="img" aria-label="phone" className="h-5 w-5 text-gray-500 mr-2 text-xl">📞</span>
                                    Phone Number:
                                </div>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    setPhoneNumberError(null);
                                }}
                                className={`shadow-sm bg-gray-50 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                                placeholder="Enter your phone number"
                            />
                            {phoneNumberError && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {phoneNumberError}
                                </p>
                            )}
                        </div>

                         {/* Display message while waiting for callback */}
                         {isLoading && !callbackReceived && (
                            <div className="p-4 rounded-md bg-yellow-100 border border-yellow-400 mb-4">
                                <p className="text-gray-700">
                                    Waiting for M-Pesa callback... Please check your phone to complete the payment.
                                    If you don't receive a prompt in 60 seconds, please try again.
                                </p>
                            </div>
                        )}

                        {paymentError && (
                            <div className="p-4 rounded-md bg-red-100 border border-red-400 mb-4">
                                <h3 className="text-lg font-semibold text-red-700">Payment Failed!</h3>
                                <p className="text-gray-700">{paymentError}</p>
                                <div className="flex justify-end mt-4">
                                    <button onClick={handlePayment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 mr-2">Retry</button>
                                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">Cancel</button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={handlePayment}
                                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || !selectedCase || !!phoneNumberError}
                            >
                                {isLoading ? (
                                    <div className='flex items-center'>
                                        <span className="loading loading-spinner text-white"></span>
                                        <span> Processing...</span>
                                    </div>
                                ) : (
                                    'Make Payment'
                                )}
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 ml-2 transition duration-300"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isSuccessModalOpen && <SuccessModal />}
            {isFailModalOpen && <FailModal />}
        </div>
    );

    function isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneRegex = /^(01[0-9]{8}|07[0-9]{8})$/;
        return phoneRegex.test(phoneNumber);
    }
};

export default MpesaPayment;