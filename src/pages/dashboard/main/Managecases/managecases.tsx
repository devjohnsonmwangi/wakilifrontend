import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { caseAndPaymentAPI, CaseDataTypes, CaseStatus } from "../../../../features/case/caseAPI";
import { Toaster, toast } from 'sonner';
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import {
    FaFileAlt, FaUser, FaEnvelope, FaTimes, FaSearch, FaFilter,
    FaPhone, FaIdCard, FaTrashAlt, FaCheckCircle, FaRegWindowRestore, FaMoneyBillAlt, FaInfoCircle,
    FaThList, FaSun, FaMoon // Added for dark mode toggle
} from "react-icons/fa";
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from "./ViewCaseDetailsModal"; // Ensure this path is correct

// Helper function to safely format currency
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value == null) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `KES ${num.toFixed(2)}`;
};

const AllCases = () => {
    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [selectedCaseModalData, setSelectedCaseModalData] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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


    const {
        data: allUserCasesData,
        error: rawCaseError,
        isLoading,
        isFetching,
        isError,
        refetch
    } = caseAndPaymentAPI.useFetchCasesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 300000, // 5 minutes
    });

    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const user_id = user?.user_id;
    const [addLog] = logAPI.useCreateLogMutation();
    const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        fullName: '',
        email: '',
        description: '',
        status: '' // 'open', 'in_progress', 'closed', or '' for all
    });
    const [selectedCaseIds, setSelectedCaseIds] = useState<Set<number>>(new Set());
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Extracts the HTTP status from the error object provided by RTK Query
    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;

    useEffect(() => {
        if (isError) {
            if (errorStatus === 404) {
                setCases([]);
            }
        } else if (allUserCasesData) {
            setCases(allUserCasesData);
        } else if (!isLoading && !isFetching && !allUserCasesData && !isError) {
            // Handle case where API returns 200 OK but with no data (e.g. null or empty array)
            setCases([]);
        }
    }, [allUserCasesData, isLoading, isFetching, isError, errorStatus]);

    const handleUpdateStatus = async (case_id: number, case_status: CaseStatus, actionType: 'close' | 'reopen') => {
        const actionId = `${actionType}-${case_id}`;
        try {
            setLoadingActionId(actionId);
            await updateCase({ case_id, case_status }).unwrap();
            if (user_id) { // Ensure user_id is available
                await addLog({ user_id, action: `📜 Case ${case_id} status updated to ${case_status}` }).unwrap();
            }
            toast.success(`🎉 Case ${case_status === 'closed' ? 'closed' : 'reopened'} successfully!`);
            refetch();
        } catch (err) {
            toast.error(`❌ Failed to ${actionType} case`);
            console.error(`Error ${actionType} case:`, err);
        } finally {
            setLoadingActionId(null);
        }
    };

    const handleBulkUpdateStatus = async (case_status: CaseStatus) => {
        const currentSelectedCaseIds = Array.from(selectedCaseIds);
        if (currentSelectedCaseIds.length === 0) {
            toast.info("ℹ️ No cases selected for bulk update.");
            return;
        }
        setLoadingActionId('bulk-update');
        try {
            for (const case_id of currentSelectedCaseIds) {
                await updateCase({ case_id, case_status }).unwrap();
                if (user_id) { // Ensure user_id is available
                    await addLog({ user_id, action: `📜 Case ${case_id} status updated to ${case_status} (bulk)` }).unwrap();
                }
            }
            toast.success('🎉 Bulk case status updated successfully!');
            setSelectedCaseIds(new Set());
            refetch();
        } catch (err) {
            toast.error('❌ Failed to update cases status in bulk');
            console.error("Bulk update error:", err);
        } finally {
            setLoadingActionId(null);
        }
    };

    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases)) return [];
        return cases.filter((caseItem) => {
            const userFullName = caseItem.user?.full_name?.toLowerCase() ?? '';
            const userEmail = caseItem.user?.email?.toLowerCase() ?? '';
            const caseDesc = caseItem.case_description?.toLowerCase() ?? '';
            const itemActualStatus = caseItem.case_status?.toLowerCase() ?? '';

            const matchesFullName = filters.fullName ? userFullName.includes(filters.fullName.toLowerCase()) : true;
            const matchesEmail = filters.email ? userEmail.includes(filters.email.toLowerCase()) : true;
            const matchesDescription = filters.description ? caseDesc.includes(filters.description.toLowerCase()) : true;
            const selectedFilterStatus = filters.status.toLowerCase(); // Ensure filter status is also lowercase
            const matchesStatus = selectedFilterStatus ? itemActualStatus === selectedFilterStatus : true;

            return matchesFullName && matchesEmail && matchesDescription && matchesStatus;
        });
    }, [cases, filters]);

    const resetFilters = () => {
        setFilters({
            fullName: '',
            email: '',
            description: '',
            status: ''
        });
        toast.info("🌀 Filters have been reset.");
    };

    const handleCaseSelection = (caseId: number) => {
        setSelectedCaseIds(prevState => {
            const newSelection = new Set(prevState);
            if (newSelection.has(caseId)) {
                newSelection.delete(caseId);
            } else {
                newSelection.add(caseId);
            }
            return newSelection;
        });
    };

    const openViewModal = useCallback((caseItem: CaseDataTypes) => {
        setSelectedCaseModalData(caseItem);
        setIsViewModalOpen(true);
    }, []);

    const closeViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedCaseModalData(null);
    }, []);

    const openDeleteModal = (caseItem: CaseDataTypes) => {
        setCaseToDelete(caseItem);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCaseToDelete(null);
    };

    const noCasesInSystemMessage = (
        <div className="text-center py-12 px-6 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 rounded-lg shadow-md">
            <FaRegWindowRestore className="mx-auto text-6xl text-sky-400 dark:text-sky-500 mb-5" />
            <h3 className="text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-3">
                No Cases Found
            </h3>
            <p className="text-sky-600 dark:text-sky-400 text-md mb-5">
                There are currently no cases recorded in the system.
            </p>
            <button
                onClick={() => refetch()}
                className="btn btn-sm btn-outline btn-primary dark:text-sky-300 dark:border-sky-400 dark:hover:bg-sky-400 dark:hover:text-slate-900"
                disabled={isFetching}
            >
                {isFetching ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
                Try Refreshing Data
            </button>
        </div>
    );

    const noMatchingFiltersMessage = (
        <div className="text-center py-12 px-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-md">
            <FaSearch className="mx-auto text-6xl text-yellow-400 dark:text-yellow-500 mb-5" />
            <h3 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300 mb-3">
                No Cases Match Your Filters
            </h3>
            <p className="text-yellow-600 dark:text-yellow-400 text-md mb-5">
                We couldn't find any cases matching your current filter criteria.
            </p>
            <button
                onClick={resetFilters}
                className="btn btn-sm btn-outline btn-warning dark:text-yellow-300 dark:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-slate-900"
            >
                Reset All Filters
            </button>
        </div>
    );

    const apiErrorMessage = (
        <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center justify-center">
                <span role="img" aria-label="error" className="mr-3 text-4xl">⚠️</span>
                Oops! Something Went Wrong
            </h3>
            <p className="text-red-600 dark:text-red-400 text-md mb-2">
                We encountered an issue loading case data (Error: {errorStatus || 'Unknown'}).
            </p>
            <p className="text-gray-700 dark:text-slate-300 text-sm mb-5">
                Please check your internet connection and try again.
            </p>
            <button
                onClick={() => refetch()}
                className="btn btn-sm btn-outline btn-error dark:text-red-300 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-slate-900"
                disabled={isFetching}
            >
                {isFetching ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
                Refresh Data
            </button>
        </div>
    );

    const renderCasesContent = () => {
        if (isLoading || (isFetching && !allUserCasesData && !isError)) {
            return (
                <div className="flex flex-col justify-center items-center py-24 space-y-5">
                    <AnimatedLoader />
                    <p className="text-xl text-gray-700 dark:text-slate-300 font-medium">Loading cases, please stand by...</p>
                </div>
            );
        }

        if (isError) {
            if (errorStatus === 404) {
                return noCasesInSystemMessage;
            } else {
                return apiErrorMessage;
            }
        }

        if (!cases || cases.length === 0) {
            return noCasesInSystemMessage;
        }

        if (filteredCases.length === 0) {
            return noMatchingFiltersMessage;
        }

        const tableHeaders = (
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-indigo-700 dark:to-purple-700 sticky top-0 z-10">
                <tr className="text-left">
                    <th className="p-3 w-12"> {/* Checkbox */} </th>
                    <th className="p-3 whitespace-nowrap min-w-[100px]"><FaIdCard className="inline mr-1.5" />Case ID</th>
                    <th className="p-3 whitespace-nowrap min-w-[180px]"><FaUser className="inline mr-1.5" />Client Name</th>
                    <th className="p-3 whitespace-nowrap min-w-[200px]"><FaEnvelope className="inline mr-1.5" />Client Email</th>
                    <th className="p-3 whitespace-nowrap min-w-[150px]"><FaPhone className="inline mr-1.5" />Client Phone</th>
                    <th className="p-3 whitespace-nowrap min-w-[150px]"><FaFileAlt className="inline mr-1.5" />Case Type</th>
                    <th className="p-3 whitespace-nowrap min-w-[120px]"><FaInfoCircle className="inline mr-1.5" />Status</th>
                    <th className="p-3 whitespace-nowrap min-w-[120px]"><FaMoneyBillAlt className="inline mr-1.5" />Fee</th>
                    <th className="p-3 whitespace-nowrap min-w-[150px]"><FaMoneyBillAlt className="inline mr-1.5" />Payment Balance</th>
                    <th className="p-3 text-center whitespace-nowrap min-w-[260px]"><FaThList className="inline mr-1.5" />Actions</th> {/* Adjusted min-width for actions */}
                </tr>
            </thead>
        );

        const openAndInProgressCases = filteredCases.filter(c => c.case_status === 'open' || c.case_status === 'in_progress');
        const closedCases = filteredCases.filter(c => c.case_status === 'closed');

        const renderTable = (caseList: CaseDataTypes[], title: string, count: number, type: 'active' | 'closed') => {
            const headerColor = type === 'active' 
                ? 'text-indigo-700 dark:text-indigo-400' 
                : 'text-slate-700 dark:text-slate-300';
            
            const statusColorClass = (status: CaseStatus | string) => { // Ensure status can be string for safety
                const lowerStatus = status.toLowerCase();
                if (lowerStatus === 'open') return 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200';
                if (lowerStatus === 'in_progress') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-200';
                if (lowerStatus === 'closed') return 'bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200';
                return 'bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-slate-200'; // Fallback
            };

            return (
                <div className="mb-12">
                    <h2 className={`text-2xl font-semibold mb-5 ${headerColor}`}>
                        {type === 'active' ? '🚀' : '✅'} {title} ({count})
                    </h2>
                    {count > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600"> {/* Adjusted dark border */}
                                {tableHeaders}
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600"> {/* Adjusted dark border */}
                                    {caseList.map(caseItem => (
                                        <tr key={caseItem.case_id} 
                                            className={`
                                                ${type === 'active' ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'}
                                                 odd:bg-gray-50 even:bg-white
                                                 dark:odd:bg-slate-800/70 dark:even:bg-slate-700/70 
                                                 transition-colors duration-150
                                            `}> {/* Adjusted dark row bg opacity for subtlety */}
                                            <td className="p-3"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary dark:checkbox-info" checked={selectedCaseIds.has(caseItem.case_id)} onChange={() => handleCaseSelection(caseItem.case_id)} aria-label={`Select case ${caseItem.case_id}`} /></td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{caseItem.case_id}</td>
                                            <td className="p-3 text-sm text-gray-900 dark:text-slate-100 font-medium whitespace-nowrap">{caseItem.user?.full_name ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.user?.email ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.user?.phone_number ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.case_type}</td>
                                            <td className="p-3 text-sm whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClass(caseItem.case_status)}`}>
                                                    {caseItem.case_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{formatCurrency(caseItem.fee)}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{formatCurrency(caseItem.payment_balance)}</td>
                                            <td className="p-3 text-sm text-center">
                                                <div className="flex items-center justify-center space-x-1.5 flex-wrap gap-1">
                                                    <button 
                                                        onClick={() => openViewModal(caseItem)} 
                                                        className="btn btn-xs btn-outline btn-info dark:text-sky-400 dark:border-sky-400 dark:hover:bg-sky-400 dark:hover:text-slate-900 flex items-center" 
                                                        aria-label={`View details for case ${caseItem.case_id}`}>
                                                        <FaFileAlt className="mr-1" /> View
                                                    </button>
                                                    {caseItem.case_status !== 'closed' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(caseItem.case_id, 'closed', 'close')} 
                                                            disabled={loadingActionId === `close-${caseItem.case_id}`} 
                                                            className="btn btn-xs btn-outline btn-success dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 flex items-center" 
                                                            aria-label={`Close case ${caseItem.case_id}`}>
                                                            {loadingActionId === `close-${caseItem.case_id}` ? <span className="loading loading-spinner loading-xs"></span> : <FaCheckCircle className="mr-1" />} Close
                                                        </button>
                                                    )}
                                                    {caseItem.case_status === 'closed' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(caseItem.case_id, 'open', 'reopen')} 
                                                            disabled={loadingActionId === `reopen-${caseItem.case_id}`} 
                                                            className="btn btn-xs btn-outline btn-warning dark:text-yellow-400 dark:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-slate-900 flex items-center" 
                                                            aria-label={`Reopen case ${caseItem.case_id}`}>
                                                            {loadingActionId === `reopen-${caseItem.case_id}` ? <span className="loading loading-spinner loading-xs"></span> : <FaRegWindowRestore className="mr-1" />} Reopen
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => openDeleteModal(caseItem)} 
                                                        className="btn btn-xs btn-outline btn-error dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-slate-900 flex items-center" 
                                                        aria-label={`Delete case ${caseItem.case_id}`}>
                                                        <FaTrashAlt className="mr-1" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-slate-400 italic px-2 py-4">No cases in this category match your current filters.</p>
                    )}
                </div>
            );
        };

        return (
            <>
                {renderTable(openAndInProgressCases, "Open & In Progress Cases", openAndInProgressCases.length, 'active')}
                {renderTable(closedCases, "Closed Cases", closedCases.length, 'closed')}
            </>
        );
    };

    const filterInputs = [
        { id: 'fullName' as keyof typeof filters, label: 'Client Full Name', icon: FaUser, placeholder: 'Search by Full Name' },
        { id: 'email' as keyof typeof filters, label: 'Client Email', icon: FaEnvelope, placeholder: 'Search by Email' },
        { id: 'description' as keyof typeof filters, label: 'Case Description', icon: FaFileAlt, placeholder: 'Search by Description' }
    ];

    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" duration={3000} />
            <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-800 dark:text-slate-200 transition-colors duration-300">
                <div className="container mx-auto max-w-full xl:max-w-screen-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400">Cumulative Case Management Portal</h1>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle dark mode"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                        </button>
                    </div>

                    <div className="breadcrumbs text-sm mb-6 text-gray-500 dark:text-slate-400">
                        <ul>
                            <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">🏠 Dashboard</Link></li>
                            <li><Link to="/dashboard/account" className="hover:text-indigo-600 dark:hover:text-indigo-400">Admin</Link></li>
                            <li className="text-gray-700 dark:text-slate-300">Cumulative Case Management</li>
                        </ul>
                    </div>

                    <div className="mb-8 p-5 md:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200/70 dark:border-slate-700">
                        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-5 flex items-center pb-3 border-b border-gray-200 dark:border-slate-600">
                            <FaFilter className="mr-2.5 text-indigo-500 dark:text-indigo-400 h-5 w-5" /> Case Filters
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pt-2">
                            {filterInputs.map(item => (
                                <div className="form-control" key={item.id}>
                                    <label className="label py-1 cursor-pointer" htmlFor={item.id}>
                                        <span className="label-text text-sm font-semibold text-gray-700 dark:text-slate-300 flex items-center">
                                            <item.icon className="mr-2 text-indigo-500 dark:text-indigo-400 w-4 h-4" />
                                            {item.label}
                                        </span>
                                    </label>
                                    <input
                                        id={item.id}
                                        type="text"
                                        placeholder={item.placeholder}
                                        value={filters[item.id]}
                                        onChange={(e) => setFilters({ ...filters, [item.id]: e.target.value })}
                                        className="input input-bordered input-sm w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            ))}
                            <div className="form-control">
                                <label className="label py-1 cursor-pointer" htmlFor="statusFilter">
                                    <span className="label-text text-sm font-semibold text-gray-700 dark:text-slate-300 flex items-center">
                                        <FaInfoCircle className="mr-2 text-indigo-500 dark:text-indigo-400 w-4 h-4" />
                                        Case Status
                                    </span>
                                </label>
                                <select
                                    id="statusFilter"
                                    title="Filter by status"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="select select-bordered select-sm h-10 w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">All Statuses</option>
                                    <option value="open" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">Open</option>
                                    <option value="in_progress" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">In Progress</option>
                                    <option value="closed" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">Closed</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={resetFilters}
                                className="btn btn-sm btn-outline btn-neutral dark:border-slate-500 dark:text-slate-300 dark:hover:bg-slate-700 w-full sm:w-auto flex items-center transition-colors"
                                aria-label="Reset all filters"
                            >
                                <FaTimes className="mr-2" /> Reset Filters
                            </button>
                            <button
                                className="btn btn-sm btn-primary dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:border-indigo-600 w-full sm:w-auto flex items-center"
                                onClick={() => handleBulkUpdateStatus('closed')}
                                disabled={selectedCaseIds.size === 0 || loadingActionId === 'bulk-update'}
                                aria-label={`Close ${selectedCaseIds.size} selected cases`}
                            >
                                {loadingActionId === 'bulk-update' && selectedCaseIds.size > 0 ? <span className="loading loading-spinner loading-xs"></span> : <FaCheckCircle className="mr-1.5" />}
                                Close Selected ({selectedCaseIds.size})
                            </button>
                        </div>
                    </div>

                    {renderCasesContent()}

                </div>
            </div>

            {isViewModalOpen && selectedCaseModalData && (
                <ViewCaseDetailsModal selectedCase={selectedCaseModalData} closeModal={closeViewModal} isDarkMode={isDarkMode} />
            )}

            {isDeleteModalOpen && caseToDelete && (
                <DeleteCaseForm
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    caseItem={caseToDelete}
                    refetch={refetch}
                    isDarkMode={isDarkMode} // Pass prop
                />
            )}
        </>
    );
};

export default AllCases;