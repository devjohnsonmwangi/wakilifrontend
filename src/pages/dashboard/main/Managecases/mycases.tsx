// MyCases.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store'; // Ensure this path is correct
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useCallback } from 'react';
import CreateCaseForm from '../../main/Managecases/createcase';
import EditCaseForm from '../../main/Managecases/updatecase';
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails';
import SingleCaseMpesaPayment from '../Payments/Payments';
import { toast, Toaster } from 'sonner';

import {
    FaEdit, FaRegWindowRestore, FaPlus, FaSearch, FaTrashAlt, FaEye, FaMoneyBill,
    FaSun, FaMoon,
    FaFingerprint,
    FaTag,
    FaBarcode,
    FaFileInvoiceDollar,
    FaClipboardCheck,
    FaWallet,
    FaCogs,
    FaUserCircle,
    FaExclamationTriangle,
    FaRedo
} from 'react-icons/fa';

// Helper component for table headers
const HeaderCell = ({ icon: Icon, text, className = '' }: { icon: React.ElementType, text: string, className?: string }) => (
    // Ensured whitespace-nowrap is here
    <th className={`px-5 py-3.5 border-b-2 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${className}`}>
      <div className="flex items-center">
        <Icon className="mr-2 h-4 w-4 opacity-70" /> {text}
      </div>
    </th>
);

// Modern Skeleton Loader Row for Table
const SkeletonRow = ({ columns }: { columns: number }) => (
    <tr className="animate-pulse">
        {Array.from({ length: columns }).map((_, index) => (
            <td key={index} className="px-5 py-5 border-b border-gray-200 dark:border-slate-700 bg-transparent">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            </td>
        ))}
    </tr>
);

const MyCases = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const user_id = user?.user_id ?? 0;
    const userFullName = user?.full_name || "User";
    const userProfilePicture = user?.profile_picture || null;

    const [isProfileImgError, setIsProfileImgError] = useState(false);

    const { data: caseData, isLoading: caseLoading, error: rawCaseError, refetch } = caseAndPaymentAPI.useGetUserCasesByUserIdQuery(user_id, {
        refetchOnMountOrArgChange: true,
        skip: !user_id,
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

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('theme');
            return savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    useEffect(() => {
        setIsProfileImgError(false);
    }, [userProfilePicture]);


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
            toast.success('Case reopened successfully!');
        } catch (error) {
            console.error('Error reopening case', error);
            toast.error('Failed to reopen case.');
        }
    };

    useEffect(() => {
        const is404Error = errorStatus === 404;
        if (is404Error) {
            setCases([]);
        } else if (Array.isArray(caseData)) {
            setCases(caseData);
        } else if (!caseLoading && !caseErrorExists) {
            setCases([]);
        }
    }, [caseData, caseLoading, caseErrorExists, errorStatus]);

    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases)) return [];
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
        toast.success('Payment successful! Case status updated.');
    }, [refetch, closePaymentModal]);

    const handlePaymentFailure = useCallback(() => {
        toast.error('Payment failed. Please try again.');
    }, []);
    
    const UserProfileIcon = () => {
        if (userProfilePicture && !isProfileImgError) {
            return (
                <img
                    src={userProfilePicture}
                    alt={`${userFullName}'s profile`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/50 shadow-sm"
                    onError={() => setIsProfileImgError(true)}
                />
            );
        }
        const initials = userFullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
        return (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-400 dark:bg-indigo-400 flex items-center justify-center text-white text-lg sm:text-xl font-semibold shadow-sm border-2 border-white/50">
                {initials !== '?' ? initials : <FaUserCircle size={20} />}
            </div>
        );
    };


    const renderTableContent = () => {
        const tableHeaders = (
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                <tr>
                    <HeaderCell icon={FaFingerprint} text="Case ID" className="border-slate-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaTag} text="Status" className="border-slate-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaBarcode} text="Track Number" className="border-slate-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaFileInvoiceDollar} text="Fees" className="border-slate-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaClipboardCheck} text="Payment" className="border-slate-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaWallet} text="Balance" className="border-slate-200 dark:border-slate-600"/>
                    <HeaderCell icon={FaCogs} text="Actions" className="border-slate-200 dark:border-slate-600 text-center justify-center"/>
                </tr>
            </thead>
        );
        
        const numberOfColumns = 7;

        if (caseLoading) {
            return (
                 <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        {tableHeaders}
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={numberOfColumns} />)}
                        </tbody>
                    </table>
                </div>
            );
        }
        
        const noCasesForUserMessage = (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-b-lg">
                <FaRegWindowRestore className="mx-auto text-5xl text-slate-400 dark:text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No Cases Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    You currently have no cases. Get started by creating one!
                </p>
                <button
                    className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center mx-auto"
                    onClick={openCreateModal}
                >
                    <FaPlus className="mr-2 h-4 w-4" /> Create New Case
                </button>
            </div>
        );


        if (caseErrorExists) {
            if (errorStatus === 404) {
                return noCasesForUserMessage;
            }
            return (
                <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-700 rounded-b-lg">
                    <FaExclamationTriangle className="mx-auto text-5xl text-red-400 dark:text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                        Oops! Something went wrong.
                    </h3>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        We couldn't load your cases. (Error: {errorStatus || 'Unknown'}).
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md shadow-sm hover:shadow-md transition-all duration-150 flex items-center mx-auto"
                    >
                        <FaRedo className="mr-2 h-4 w-4" /> Try Again
                    </button>
                </div>
            );
        }
        
        const hasNoData = !Array.isArray(caseData) || caseData.length === 0;
        if (hasNoData && !caseLoading && !caseErrorExists) {
             return noCasesForUserMessage;
        }


        if (filteredCases.length === 0) {
            return (
                <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-b-lg">
                    <FaSearch className="mx-auto text-5xl text-slate-400 dark:text-slate-500 mb-4" />
                     <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No Matching Cases
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        No cases match your current filter criteria.
                    </p>
                    <button 
                        onClick={resetFilters} 
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                        Reset Filters
                    </button>
                </div>
            );
        }

        const actionButtonBase = "flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out whitespace-nowrap";
        const iconMr = "mr-1.5 h-3.5 w-3.5";


        return (
            <div className="overflow-x-auto shadow-sm rounded-b-lg"> {/* This is the key div for horizontal scroll */}
                <table className="min-w-full leading-normal"> {/* Ensures table takes at least full width, allowing it to expand further */}
                    {tableHeaders}
                    <tbody className="text-slate-700 dark:text-slate-300">
                        {filteredCases.map((caseItem, index) => (
                            <tr key={caseItem.case_id}
                                className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors duration-150 ease-in-out
                                           ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/60'}`}
                            >
                                <td className="px-5 py-4 text-sm whitespace-nowrap"> {/* Added whitespace-nowrap to data cells too */}
                                    <p className="font-medium text-slate-800 dark:text-slate-100">{caseItem.case_id}</p>
                                </td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">
                                    <span className={`px-3 py-1.5 text-xs font-semibold leading-tight rounded-full
                                        ${caseItem.case_status === 'open' 
                                            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-600/30' 
                                            : 'text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-600/30'}`}>
                                        {caseItem.case_status.charAt(0).toUpperCase() + caseItem.case_status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.case_track_number}</td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">
                                    {typeof caseItem.fee === 'number' ? `Ksh ${caseItem.fee.toFixed(2)}` : caseItem.fee}
                                </td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.payment_status}</td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">
                                    {typeof caseItem.payment_balance === 'number'
                                        ? `Ksh ${caseItem.payment_balance.toFixed(2)}`
                                        : (caseItem.payment_balance == null ? 'N/A' : caseItem.payment_balance)}
                                </td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap"> {/* Actions cell */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className={`${actionButtonBase} bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-600 dark:hover:bg-sky-700`}
                                            onClick={() => openViewModal(caseItem)} title="View Details">
                                            <FaEye className={iconMr} /> View
                                        </button>
                                        {caseItem.case_status === 'closed' ? (
                                            <button
                                                className={`${actionButtonBase} bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-700`}
                                                onClick={() => handleReopenCase(caseItem)} title="Reopen Case">
                                                <FaRegWindowRestore className={iconMr} /> Reopen
                                            </button>
                                        ) : (
                                            <button
                                                className={`${actionButtonBase} bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700`}
                                                onClick={() => handleOpenEditModal(caseItem)} title="Edit Case">
                                                <FaEdit className={iconMr} /> Edit
                                            </button>
                                        )}
                                        {caseItem.payment_status !== 'paid' && caseItem.fee > 0 && (caseItem.payment_balance == null || caseItem.payment_balance > 0) && (
                                            <button
                                                className={`${actionButtonBase} bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700`}
                                                onClick={() => openPaymentModal(caseItem)} title="Make Payment">
                                                <FaMoneyBill className={iconMr} /> Pay
                                            </button>
                                        )}
                                         <button
                                            className={`${actionButtonBase} bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700`}
                                            onClick={() => handleOpenDeleteModal(caseItem)} title="Delete Case">
                                            <FaTrashAlt className={iconMr} /> Delete
                                        </button>
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
        <>
        <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
        <div className={`bg-slate-100 dark:bg-slate-900 min-h-screen py-6 sm:py-8 font-sans transition-colors duration-300`}>
            <div className="container mx-auto max-w-7xl">
                <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
                    <header className="bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 dark:from-purple-700 dark:via-indigo-700 dark:to-sky-600 py-6 px-6 sm:px-8 text-white flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
                            <UserProfileIcon />
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                                    {userFullName}'s Cases
                                </h1>
                                <p className="text-sm sm:text-base text-purple-100 dark:text-indigo-200 opacity-90">
                                    Manage and track your cases efficiently.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                                aria-label="Toggle dark mode"
                                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                            </button>
                             <button
                                className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center text-sm sm:text-base"
                                onClick={openCreateModal}
                            >
                                <FaPlus className="mr-2 h-4 w-4" /> New Case
                            </button>
                        </div>
                    </header>

                    <div className="p-4 sm:p-6">
                        <div className="mb-6 p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 sm:mb-0">
                                    Filter Cases
                                </h3>
                                <button
                                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { placeholder: "Case Number", value: filter.subject, key: 'subject' },
                                    { placeholder: "Description", value: filter.description, key: 'description' }
                                ].map(input => (
                                <div className="relative" key={input.key}>
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FaSearch className="text-slate-400 dark:text-slate-500 h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={input.placeholder}
                                        value={input.value}
                                        onChange={(e) => setFilter({ ...filter, [input.key]: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm shadow-sm"
                                    />
                                </div>
                                ))}
                                <div>
                                    <select
                                        title='Filter by status'
                                        value={filter.status}
                                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                        className="block w-full py-2.5 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm"
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

                    {isCreateModalOpen && <CreateCaseForm isOpen={isCreateModalOpen} onClose={closeCreateModal} isDarkMode={isDarkMode} />}
                    {isEditModalOpen && editCase && <EditCaseForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} caseItem={editCase} isDarkMode={isDarkMode} />}
                    {isDeleteModalOpen && caseToDelete && <DeleteCaseForm isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} caseItem={caseToDelete} refetch={refetch} isDarkMode={isDarkMode} />}
                    {isViewModalOpen && selectedCase && <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeViewModal} isDarkMode={isDarkMode} />}
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
        </div>
        </>
    );
};

export default MyCases;