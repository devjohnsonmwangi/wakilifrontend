import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useCallback } from 'react';
import CreateCaseForm from '../../main/Managecases/createcase'; // Renamed to CreateCaseForm
import EditCaseForm from '../../main/Managecases/updatecase'; // Renamed to EditCaseForm
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails';
import { FaEdit, FaRegWindowRestore, FaPlus, FaSearch, FaTrashAlt, FaEye, FaMoneyBill } from 'react-icons/fa';
import SingleCaseMpesaPayment from '../Payments/Payments';
import { toast } from 'sonner';

const MyCases = () => {
    const user = useSelector((state: RootState) => state.user);
    const user_id = user.user?.user_id ?? 0;

    const { data: caseData, isLoading: caseLoading, error: caseError, refetch } = caseAndPaymentAPI.useGetUserCasesByUserIdQuery(user_id, {
        refetchOnMountOrArgChange: true,
    });

    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [filter, setFilter] = useState({ subject: '', description: '', status: '' });
    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();

    // Modal State:
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [editCase, setEditCase] = useState<CaseDataTypes | null>(null);
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [selectedCase, setSelectedCase] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Rename for clarity
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [caseForPayment, setCaseForPayment] = useState<CaseDataTypes | null>(null);

    // Modal handlers:
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
            await updateCase(updatedCase);
            setCases((prevCases) =>
                prevCases.map((c) => (c.case_id === caseItem.case_id ? updatedCase : c))
            );
            toast.success('Case reopened successfully!', {
                duration: 3000, // Optional: Duration in milliseconds (default: 3000)
            });

        } catch (error) {
            console.error('Error reopening case', error);
            toast.error('Failed to reopen case.', {
                duration: 3000, // Optional: Duration in milliseconds (default: 3000)
            });
        }
    };

    useEffect(() => {
        if (caseData) {
            setCases(caseData);
        }
    }, [caseData]);


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
        toast.success('Payment successful! Case status updated.', {
            duration: 3000, // Optional: Duration in milliseconds (default: 3000)
        });
    }, [refetch, closePaymentModal]);

    const handlePaymentFailure = useCallback(() => {
        console.log("Payment failed!");
        toast.error('Payment failed. Please try again.', {
            duration: 3000, // Optional: Duration in milliseconds (default: 3000)
        });
    }, []);


    if (caseLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (caseError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-xl text-red-600">
                    Error loading data 😞. Please refresh the page.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="container mx-auto max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8 text-white">
                    <h2 className="text-3xl font-semibold text-center tracking-wide">
                        <span role="img" aria-label="briefcase" className="mr-2">💼</span>
                        My Cases Dashboard
                    </h2>
                    <p className="mt-2 text-md text-gray-200 text-center">
                        Manage and track your cases efficiently.
                    </p>
                </div>

                <div className="px-6 py-4">
                    {/* Create Case Button */}
                    <div className="flex justify-end mb-4">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 flex items-center"
                            onClick={openCreateModal}
                        >
                            <FaPlus className="mr-2" /> Create New Case
                        </button>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-500" />
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
                                <FaSearch className="text-gray-500" />
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
                                title='status'
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Status</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 mb-4"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>

                    {/* Case List Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Case ID
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Track Number
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Fees
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Payment Status
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCases.length > 0 ? (
                                    filteredCases.map((caseItem) => (
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
                                                <p className="text-gray-900 whitespace-no-wrap">{caseItem.fee}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{caseItem.payment_status}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center space-x-3">
                                                    {caseItem.case_status === 'closed' ? (
                                                        <button
                                                            className="text-yellow-500 hover:text-yellow-700"
                                                            onClick={() => handleReopenCase(caseItem)}
                                                            title="Reopen"
                                                        >
                                                            <FaRegWindowRestore className="inline-block h-5 w-5 mr-1" />
                                                            Reopen
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="text-blue-500 hover:text-blue-700"
                                                                onClick={() => handleOpenEditModal(caseItem)}
                                                                title="Edit"
                                                            >
                                                                <FaEdit className="inline-block h-5 w-5 mr-1" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => handleOpenDeleteModal(caseItem)}
                                                                title="Delete"
                                                            >
                                                                <FaTrashAlt className="inline-block h-5 w-5 mr-1" />
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        className="text-green-500 hover:text-green-700"
                                                        onClick={() => openViewModal(caseItem)}
                                                        title="View Details"
                                                    >
                                                        <FaEye className="inline-block h-5 w-5 mr-1" />
                                                        View
                                                    </button>
                                                    {caseItem.payment_status !== 'paid' && (
                                                        <button
                                                            className="text-purple-500 hover:text-purple-700"
                                                            onClick={() => openPaymentModal(caseItem)}
                                                            title="Pay Case Fees"
                                                        >
                                                            <FaMoneyBill className="inline-block h-5 w-5 mr-1" />
                                                            Pay
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-5 bg-white text-sm text-center">
                                            No cases found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modals */}
                <CreateCaseForm isOpen={isCreateModalOpen} onClose={closeCreateModal} />

                <EditCaseForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} caseItem={editCase}  />

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