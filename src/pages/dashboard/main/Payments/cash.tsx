// src/components/CashPaymentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useCreateCashPaymentMutation } from '../../../../features/payment/paymentAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import Redux Toolkit Query hooks
import {
    useFetchCasesQuery,
} from '../../../../features/case/caseAPI';  // Adjust path as needed

import {
    CaseDataTypes as Case,
    CaseStatus,
    CaseType,
} from '../../../../features/case/caseAPI';  // Import Case type and enums

interface CashPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CreateCashPaymentVariables {
    case_id: number;
    user_id: number;
    amount: number;
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({ isOpen, onClose }) => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createCashPayment] = useCreateCashPaymentMutation();
    const navigate = useNavigate();

    // Filter state
    const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
    const [stationFilter, setStationFilter] = useState(''); // New filter for station
    const [caseNumberFilter, setCaseNumberFilter] = useState(''); // New filter for case number
    const [trackNumberFilter, setTrackNumberFilter] = useState(''); // New filter for track number
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch cases using the Redux Toolkit Query hook
    const { data: cases, isLoading, isError, error } = useFetchCasesQuery();

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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error('Please enter a valid positive amount.');
            return;
        }

        if (!selectedCase) {
            toast.error("Please select a case to record payment.");
            return;
        }

        setIsSubmitting(true);

        const paymentData: CreateCashPaymentVariables = {
            case_id: selectedCase.case_id,
            user_id: selectedCase.user_id,
            amount: Number(amount),
        };

        try {
            await createCashPayment(paymentData).unwrap();
            toast.success("Cash payment recorded successfully!");
            onClose();

            setTimeout(() => {
                navigate('/dashboard/cases');
            }, 1500);
        } catch (error: unknown) {
            console.error("API Payment Creation Error", error);

            let errorMessage = 'Failed to create payment record';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'data' in error) {
                const dataError = error as { data?: { message?: string } };
                errorMessage = dataError.data?.message ?? errorMessage;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[90vh]">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-2xl font-extrabold text-blue-600 text-center">
                            Record Cash Payment Portal
                        </h3>
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

                    <div className="py-6 px-6 lg:px-8">
                        {/* Case Table and Filters */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-blue-500 mb-3">Select Case To Make  Payment:</h4>

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
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter Case Number"
                                        value={caseNumberFilter}
                                        onChange={(e) => setCaseNumberFilter(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="trackNumberFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Filter by Track Number:
                                    </label>
                                    <input
                                        type="text"
                                        id="trackNumberFilter"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter Track Number"
                                        value={trackNumberFilter}
                                        onChange={(e) => setTrackNumberFilter(e.target.value)}
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
                                        placeholder="Parties"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Case Table */}
                            {isLoading ? (
                                <p className="font-semibold text-center text-gray-500 dark:text-gray-400">Loading cases...</p>
                            ) : isError ? (
                                <p className="font-semibold text-center text-red-500 dark:text-red-400">Error loading cases: {error instanceof Error ? error.message : 'Unknown error'}</p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg shadow-md">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                        <thead className="bg-blue-50 dark:bg-blue-900">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Case ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    User ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Fees
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Station
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Case Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                    Track Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
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

                        {/* Payment Form */}
                        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="amount" className="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    disabled={!selectedCase}
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting || !selectedCase}
                                    title="Record Payment"
                                >
                                    {isSubmitting ? (
                                        <div className='flex items-center'>
                                            <span className="loading loading-spinner text-white"></span>
                                            <span> Processing...</span>
                                        </div>
                                    ) : (
                                        "Record Payment"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                                    onClick={onClose}
                                    title="Cancel"
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