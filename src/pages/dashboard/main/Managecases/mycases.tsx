import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useCallback } from 'react';
import CreateCaseForm from '../../main/Managecases/createcase';
import EditCaseForm from '../../main/Managecases/updatecase';
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails';
import {
    FaEdit, FaRegWindowRestore, FaPlus, FaSearch, FaTrashAlt, FaEye, FaMoneyBill,
    FaSun, FaMoon, // Dark mode toggle
    FaFingerprint, // Case ID
    FaTag,         // Status
    FaBarcode,     // Track Number
    FaFileInvoiceDollar, // Fees
    FaClipboardCheck, // Payment Status
    FaWallet,      // Payment Balance
    FaCogs,        // Actions
    FaBriefcase    // Header icon
} from 'react-icons/fa';
import SingleCaseMpesaPayment from '../Payments/Payments';
import { toast, Toaster } from 'sonner'; // Ensure Toaster is imported if not already

// Helper component for table headers (reusing from previous example)
const HeaderCell = ({ icon: Icon, text, className = '' }: { icon: React.ElementType, text: string, className?: string }) => (
    <th className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider ${className}`}>
      <div className="flex items-center">
        <Icon className="mr-2 h-4 w-4" /> {text}
      </div>
    </th>
  );

const MyCases = () => {
    const user = useSelector((state: RootState) => state.user);
    const user_id = user.user?.user_id ?? 0;

    const { data: caseData, isLoading: caseLoading, error: rawCaseError, refetch } = caseAndPaymentAPI.useGetUserCasesByUserIdQuery(user_id, {
        refetchOnMountOrArgChange: true,
    });

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

    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('theme');
            return savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };


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
            await updateCase(updatedCase).unwrap();
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
            setCases([]);
        } else if (caseData) {
            setCases(caseData);
        } else if (!caseLoading && !caseErrorExists) {
            setCases([]);
        }
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
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                <tr>
                    <HeaderCell icon={FaFingerprint} text="Case ID" className="border-gray-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaTag} text="Status" className="border-gray-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaBarcode} text="Track Number" className="border-gray-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaFileInvoiceDollar} text="Fees" className="border-gray-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaClipboardCheck} text="Payment Status" className="border-gray-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaWallet} text="Payment Balance" className="border-gray-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaCogs} text="Actions" className="border-gray-200 dark:border-slate-600 text-center justify-center"/>
                </tr>
            </thead>
        );

        const noCasesMessageBaseClasses = "px-5 py-10 text-sm text-center";
        const noCasesForUserMessage = (
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    {tableHeaders}
                    <tbody>
                        <tr>
                            <td colSpan={7} className={`${noCasesMessageBaseClasses} bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400`}>
                                <FaRegWindowRestore className="mx-auto text-4xl text-gray-400 dark:text-slate-500 mb-2" />
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
                    <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full text-purple-600 dark:text-purple-400" role="status">
                        <span className="sr-only">Loading cases...</span> {/* Changed for accessibility */}
                    </div>
                </div>
            );
        }

        if (caseErrorExists) {
            if (errorStatus === 404) {
                return noCasesForUserMessage;
            } else {
                return (
                    <div className="text-center py-10 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md shadow-sm">
                        <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                            <span role="img" aria-label="error" className="mr-2">⚠️</span>
                            Oops! Something went wrong.
                        </h3>
                        <p className="text-red-600 dark:text-red-400">
                            We encountered an issue loading your cases. (Error: {errorStatus || 'Unknown'}).
                        </p>
                        <p className="text-gray-700 dark:text-slate-300 text-sm mt-3">
                            Please check your internet connection and try <button onClick={() => refetch()} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium">refreshing</button>.
                        </p>
                        <p className="text-gray-700 dark:text-slate-300 text-sm mt-1">
                            If the problem persists, please contact our support team.
                        </p>
                        <p className="text-gray-600 dark:text-slate-400 text-sm mt-4">
                            You can still attempt to <button onClick={openCreateModal} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium">create a new case</button>.
                        </p>
                    </div>
                );
            }
        }

        if (!caseData || caseData.length === 0) {
            return noCasesForUserMessage;
        }

        if (filteredCases.length === 0) {
            return (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        {tableHeaders}
                        <tbody>
                            <tr>
                                <td colSpan={7} className={`${noCasesMessageBaseClasses} bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400`}>
                                    <FaSearch className="mx-auto text-4xl text-gray-400 dark:text-slate-500 mb-2" />
                                    No cases match your current filter criteria.
                                    <br />
                                    Try adjusting or <button onClick={resetFilters} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium">resetting the filters</button>.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    {tableHeaders}
                    <tbody className="text-gray-700 dark:text-slate-300">
                        {filteredCases.map((caseItem) => (
                            <tr key={caseItem.case_id}
                                className="hover:bg-gray-100 dark:hover:bg-slate-600
                                           odd:bg-gray-50 even:bg-white
                                           dark:odd:bg-slate-800 dark:even:bg-slate-700
                                           transition-colors duration-150"
                            >
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <p className="text-gray-900 dark:text-slate-100 whitespace-no-wrap">{caseItem.case_id}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold text-sm leading-tight rounded-full 
                                        ${caseItem.case_status === 'open' 
                                            ? 'text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-700/30' 
                                            : 'text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-700/30'}`}>
                                        {caseItem.case_status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <p className="text-gray-900 dark:text-slate-100 whitespace-no-wrap">{caseItem.case_track_number}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <p className="text-gray-900 dark:text-slate-100 whitespace-no-wrap">
                                        {typeof caseItem.fee === 'number' ? caseItem.fee.toFixed(2) : caseItem.fee}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <p className="text-gray-900 dark:text-slate-100 whitespace-no-wrap">{caseItem.payment_status}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <p className="text-gray-900 dark:text-slate-100 whitespace-no-wrap">
                                        {typeof caseItem.payment_balance === 'number'
                                            ? caseItem.payment_balance.toFixed(2)
                                            : (caseItem.payment_balance == null ? 'N/A' : caseItem.payment_balance)}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-slate-600 text-sm">
                                    <div className="flex items-center space-x-2 md:space-x-3">
                                        {caseItem.case_status === 'closed' ? (
                                            <button
                                                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                onClick={() => handleReopenCase(caseItem)}
                                                title="Reopen Case"
                                            >
                                                <FaRegWindowRestore className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                Reopen
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                    onClick={() => handleOpenEditModal(caseItem)}
                                                    title="Edit Case"
                                                >
                                                    <FaEdit className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                                    onClick={() => handleOpenDeleteModal(caseItem)}
                                                    title="Delete Case"
                                                >
                                                    <FaTrashAlt className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-150 flex items-center text-xs sm:text-sm"
                                            onClick={() => openViewModal(caseItem)}
                                            title="View Case Details"
                                        >
                                            <FaEye className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                                            View
                                        </button>
                                        {caseItem.payment_status !== 'paid' && caseItem.fee > 0 && (caseItem.payment_balance == null || caseItem.payment_balance > 0) && (
                                            <button
                                                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-150 flex items-center text-xs sm:text-sm"
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
        <> {/* Added Fragment for Toaster */}
        <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
        <div className="bg-gray-100 dark:bg-slate-900 min-h-screen py-6 text-gray-900 dark:text-slate-200 transition-colors duration-300">
            <div className="container mx-auto max-w-6xl bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-wide">
                            <FaBriefcase className="inline mr-3 mb-1" />
                            My Cases Dashboard
                        </h2>
                        <p className="mt-2 text-md text-purple-100 dark:text-indigo-200">
                            Manage and track your cases efficiently.
                        </p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-white hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                        aria-label="Toggle dark mode"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                    </button>
                </div>

                <div className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 w-full sm:w-auto"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 flex items-center justify-center w-full sm:w-auto"
                            onClick={openCreateModal}
                        >
                            <FaPlus className="mr-2" /> Create New Case
                        </button>
                    </div>

                    <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-slate-100 mb-3">Filter Cases</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400 dark:text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Case Number"
                                    value={filter.subject}
                                    onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-500 rounded-md leading-5 bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400 dark:text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Description"
                                    value={filter.description}
                                    onChange={(e) => setFilter({ ...filter, description: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-500 rounded-md leading-5 bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <select
                                    title='Filter by status'
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                    className="block w-full py-2 px-3 border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="" className="bg-white dark:bg-slate-600 text-black dark:text-slate-300">All Statuses</option>
                                    <option value="open" className="bg-white dark:bg-slate-600 text-black dark:text-slate-300">Open</option>
                                    <option value="closed" className="bg-white dark:bg-slate-600 text-black dark:text-slate-300">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {renderTableContent()}
                </div>

                {/* Modals: These would need their own internal dark mode styling or to receive isDarkMode as a prop */}
                <CreateCaseForm isOpen={isCreateModalOpen} onClose={closeCreateModal} isDarkMode={isDarkMode} />
                <EditCaseForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} caseItem={editCase} isDarkMode={isDarkMode} />
                <DeleteCaseForm
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    caseItem={caseToDelete}
                    refetch={refetch}
                    isDarkMode={isDarkMode}
                />
                {isViewModalOpen && selectedCase && (
                    <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeViewModal} isDarkMode={isDarkMode} />
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
        </>
    );
};

export default MyCases;