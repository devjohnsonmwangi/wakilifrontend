import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useCallback } from 'react';
import CreateCaseForm from '../../main/Managecases/createcase';
import EditCaseForm from '../../main/Managecases/updatecase';
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails';
import { FaEdit, FaRegWindowRestore, FaPlus, FaSearch, FaTrashAlt, FaEye, FaMoneyBill } from 'react-icons/fa';
import SingleCaseMpesaPayment from '../Payments/Payments';
import { toast } from 'sonner';
// For type checking RTK Query error, you might import:
// import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
// import { SerializedError } from '@reduxjs/toolkit';

// Assume CaseDataTypes includes payment_balance
// export interface CaseDataTypes { ... payment_balance?: number; ... }

const MyCases = () => {
    const user = useSelector((state: RootState) => state.user);
    const user_id = user.user?.user_id ?? 0;

    const { data: caseData, isLoading: caseLoading, error: rawCaseError, refetch } = caseAndPaymentAPI.useGetUserCasesByUserIdQuery(user_id, {
        refetchOnMountOrArgChange: true,
    });

    // Safely get error status
    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;
    const caseErrorExists = !!rawCaseError;


    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [filter, setFilter] = useState({ subject: '', description: '', status: '' });
    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editCase, setEditCase] = useState<CaseDataTypes | null>(null);
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [selectedCase, setSelectedCase] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [caseForPayment, setCaseForPayment] = useState<CaseDataTypes | null>(null);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const handleOpenEditModal = (caseItem: CaseDataTypes) => {
        setEditCase(caseItem);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditCase(null);
    };

    const handleOpenDeleteModal = (caseItem: CaseDataTypes) => {
        setCaseToDelete(caseItem);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCaseToDelete(null);
    };

    const handleReopenCase = async (caseItem: CaseDataTypes) => {
        try {
            const updatedCase = { ...caseItem, case_status: 'open' as CaseStatus };
            await updateCase(updatedCase).unwrap(); // Use unwrap for error handling if needed
            refetch();
            toast.success('Case reopened successfully!', { duration: 3000 });
        } catch (error) {
            console.error('Error reopening case', error);
            toast.error('Failed to reopen case.', { duration: 3000 });
        }
    };

    useEffect(() => {
        const is404Error = errorStatus === 404;

        if (is404Error) {
            setCases([]); // Treat 404 as no actual case data
        } else if (caseData) {
            setCases(caseData); // Actual data received
        } else if (!caseLoading && !caseErrorExists) {
            // Successful response, but no data (e.g. API returned 200 with null/undefined/empty array)
            setCases([]);
        }
        // If it's a generic error (non-404) and caseData is not updated,
        // `cases` will retain its previous value (potentially stale).
    }, [caseData, caseLoading, caseErrorExists, errorStatus]);

    const filteredCases = useMemo(() => {
        if (!cases) return [];
        return cases.filter(caseItem => {
            const matchesSubject = caseItem.case_number.toLowerCase().includes(filter.subject.toLowerCase());
            const matchesDescription = caseItem.case_description?.toLowerCase().includes(filter.description.toLowerCase());
            const matchesStatus = filter.status ? caseItem.case_status.toLowerCase() === filter.status.toLowerCase() : true;
            return matchesSubject && matchesDescription && matchesStatus;
        });
    }, [cases, filter]);

    const resetFilters = () => {
        setFilter({ subject: '', description: '', status: '' });
    };

    const openViewModal = useCallback((caseItem: CaseDataTypes) => {
        setSelectedCase(caseItem);
        setIsViewModalOpen(true);
    }, []);
    const closeViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedCase(null);
    }, []);

    const openPaymentModal = useCallback((caseItem: CaseDataTypes) => {
        setCaseForPayment(caseItem);
        setIsPaymentModalOpen(true);
    }, []);
    const closePaymentModal = useCallback(() => {
        setIsPaymentModalOpen(false);
        setCaseForPayment(null);
    }, []);

    const handlePaymentSuccess = useCallback(() => {
        refetch();
        closePaymentModal();
        toast.success('Payment successful! Case status updated.', { duration: 3000 });
    }, [refetch, closePaymentModal]);

    const handlePaymentFailure = useCallback(() => {
        console.log("Payment failed!");
        toast.error('Payment failed. Please try again.', { duration: 3000 });
    }, []);

    const renderTableContent = () => {
        const tableHeaders = (
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Case ID</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Track Number</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fees</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Balance</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
        );

        const noCasesForUserMessage = (
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    {tableHeaders}
                    <tbody>
                        <tr>
                            <td colSpan={7} className="px-5 py-10 bg-white text-sm text-center text-gray-500">
                                <FaRegWindowRestore className="mx-auto text-4xl text-gray-400 mb-2" />
                                You currently have no cases.
                                <br />
                                Click the "Create New Case" button above to get started!
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );

        if (caseLoading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full text-purple-600" role="status">
                        <span className="visually-hidden">Loading cases...</span>
                    </div>
                </div>
            );
        }

        if (caseErrorExists) {
            if (errorStatus === 404) {
                return noCasesForUserMessage; // Treat 404 as "No Cases Found for this user"
            } else {
                // Handle other errors (network, server 500, etc.)
                return (
                    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-md shadow-sm">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                            <span role="img" aria-label="error" className="mr-2">⚠️</span>
                            Oops! Something went wrong.
                        </h3>
                        <p className="text-red-600">
                            We encountered an issue loading your cases. This might be due to a network problem or an issue on our end (Error: {errorStatus || 'Unknown'}).
                        </p>
                        <p className="text-gray-700 text-sm mt-3">
                            Please check your internet connection and try <button onClick={() => refetch()} className="text-indigo-600 hover:text-indigo-800 underline font-medium">refreshing</button> the data.
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                            If the problem persists, please contact our support team.
                        </p>
                        <p className="text-gray-600 text-sm mt-4">
                            You can still attempt to <button onClick={openCreateModal} className="text-indigo-600 hover:text-indigo-800 underline font-medium">create a new case</button>.
                        </p>
                    </div>
                );
            }
        }

        // If no error and not loading, then check actual caseData from the hook
        // This handles the scenario where API returns 200 OK with an empty array or undefined/null
        if (!caseData || caseData.length === 0) {
            return noCasesForUserMessage;
        }

        // If caseData has items, but the current filters result in no matches.
        // (filteredCases is derived from the local `cases` state, which is set from caseData)
        if (filteredCases.length === 0) {
            return (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        {tableHeaders}
                        <tbody>
                            <tr>
                                <td colSpan={7} className="px-5 py-10 bg-white text-sm text-center text-gray-500">
                                    <FaSearch className="mx-auto text-4xl text-gray-400 mb-2" />
                                    No cases match your current filter criteria.
                                    <br />
                                    Try adjusting your search terms or <button onClick={resetFilters} className="text-indigo-600 hover:text-indigo-800 underline font-medium">resetting the filters</button>.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        // Cases are available and match filters (or no filters applied).
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    {tableHeaders}
                    <tbody>
                        {filteredCases.map((caseItem) => (
                            <tr key={caseItem.case_id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{caseItem.case_id}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold text-sm leading-tight rounded-full ${caseItem.case_status === 'open' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                        {caseItem.case_status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{caseItem.case_track_number}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {typeof caseItem.fee === 'number' ? caseItem.fee.toFixed(2) : caseItem.fee}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{caseItem.payment_status}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {typeof caseItem.payment_balance === 'number'
                                            ? caseItem.payment_balance.toFixed(2)
                                            : (caseItem.payment_balance == null ? 'N/A' : caseItem.payment_balance)} {/* Check for null or undefined */}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center space-x-2 md:space-x-3">
                                        {caseItem.case_status === 'closed' ? (
                                            <button
                                                className="text-yellow-600 hover:text-yellow-800 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                onClick={() => handleReopenCase(caseItem)}
                                                title="Reopen Case"
                                            >
                                                <FaRegWindowRestore className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                Reopen
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                    onClick={() => handleOpenEditModal(caseItem)}
                                                    title="Edit Case"
                                                >
                                                    <FaEdit className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                    onClick={() => handleOpenDeleteModal(caseItem)}
                                                    title="Delete Case"
                                                >
                                                    <FaTrashAlt className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="text-green-600 hover:text-green-800 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                            onClick={() => openViewModal(caseItem)}
                                            title="View Case Details"
                                        >
                                            <FaEye className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                            View
                                        </button>
                                        {/* Updated Pay button logic */}
                                        {caseItem.payment_status !== 'paid' && caseItem.fee > 0 && (caseItem.payment_balance == null || caseItem.payment_balance > 0) && (
                                            <button
                                                className="text-purple-600 hover:text-purple-800 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                onClick={() => openPaymentModal(caseItem)}
                                                title="Pay Case Fees"
                                            >
                                                <FaMoneyBill className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                Pay
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="container mx-auto max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8 text-white">
                    <h2 className="text-3xl font-semibold text-center tracking-wide">
                        <span role="img" aria-label="briefcase" className="mr-2">💼</span>
                        My Cases Dashboard
                    </h2>
                    <p className="mt-2 text-md text-gray-200 text-center">
                        Manage and track your cases efficiently.
                    </p>
                </div>

                <div className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 flex items-center"
                            onClick={openCreateModal}
                        >
                            <FaPlus className="mr-2" /> Create New Case
                        </button>
                    </div>

                    <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Filter Cases</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Case Number"
                                    value={filter.subject}
                                    onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Description"
                                    value={filter.description}
                                    onChange={(e) => setFilter({ ...filter, description: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <select
                                    title='Filter by status'
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {renderTableContent()}
                </div>

                {/* Modals */}
                <CreateCaseForm isOpen={isCreateModalOpen} onClose={closeCreateModal} />
                <EditCaseForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} caseItem={editCase} />
                <DeleteCaseForm
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    caseItem={caseToDelete}
                    refetch={refetch}
                />
                {isViewModalOpen && selectedCase && (
                    <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeViewModal} />
                )}
                {caseForPayment && (
                    <SingleCaseMpesaPayment
                        caseId={caseForPayment.case_id}
                        userId={caseForPayment.user_id}
                        fee={caseForPayment.fee}
                        isOpen={isPaymentModalOpen}
                        onClose={closePaymentModal}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentFailure={handlePaymentFailure}
                    />
                )}
            </div>
        </div>
    );
};

export default MyCases;