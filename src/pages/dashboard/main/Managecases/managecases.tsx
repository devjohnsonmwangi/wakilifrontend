// src/pages/dashboard/main/AdminDashboard/AllCases.tsx (or your file path)
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    caseAndPaymentAPI,
    CaseDataTypes,
    CaseStatus, // From caseAPI
     // From caseAPI
    // CaseAssigneeData // This type is part of CaseDataTypes.assignees
} from "../../../../features/case/caseAPI"; // Ensure correct path
import { Toaster, toast } from 'sonner';
import { logAPI } from "../../../../features/log/logsapi"; // Ensure correct path
import { RootState } from "../../../../app/store"; // Ensure correct path
import AnimatedLoader from "../../../../components/AnimatedLoader"; // Ensure correct path
import { useSelector } from "react-redux";
import {
    FaFileAlt, FaUser, FaEnvelope, FaTimes, FaSearch, FaFilter,
    FaPhone, FaIdCard, FaTrashAlt, FaCheckCircle, FaRegWindowRestore, FaMoneyBillAlt, FaInfoCircle,
    FaThList, FaSun, FaMoon, FaUsers // Added FaUsers for assigned staff
} from "react-icons/fa";
import DeleteCaseForm from '../../main/Managecases/deletecase'; // Ensure correct path
import ViewCaseDetailsModal from "./ViewCaseDetailsModal"; // Ensure correct path

// Helper function to safely format currency
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value == null) return 'N/A';
    // Case fee/balance are strings from API representing decimal, convert to number for formatting
    const num = Number(value);
    if (isNaN(num)) return 'N/A'; // Or handle as the raw string if that's preferred for 'N/A'
    return `KES ${num.toFixed(2)}`;
};

const AllCases = () => {
    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [selectedCaseModalData, setSelectedCaseModalData] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    const {
        data: allCasesDataFromAPI,
        error: rawCaseError,
        isLoading,
        isFetching,
        isError,
        refetch
    } = caseAndPaymentAPI.useFetchCasesQuery({ includeDetails: true }, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 300000, // 5 minutes
    });

    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const loggedInUserId = user?.user_id;
    const loggedInUserRole = user?.role; // For permission checks
    const [addLog] = logAPI.useCreateLogMutation();
    const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        clientFullName: '',
        clientEmail: '',
        description: '',
        assignedStaffName: '',
        status: ''
    });
    const [selectedCaseIds, setSelectedCaseIds] = useState<Set<number>>(new Set());
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;

    useEffect(() => {
        if (isError) {
            if (errorStatus === 404) {
                setCases([]);
                // toast.info("No cases found in the system at the moment.");
            } else {
                // toast.error(`Error fetching cases: ${errorStatus || 'Unknown error'}`);
            }
        } else if (allCasesDataFromAPI) {
            setCases(allCasesDataFromAPI);
        } else if (!isLoading && !isFetching && !allCasesDataFromAPI && !isError) {
            setCases([]);
        }
    }, [allCasesDataFromAPI, isLoading, isFetching, isError, errorStatus]);

    const handleUpdateStatus = async (case_id: number, case_status: CaseStatus, actionType: 'close' | 'reopen') => {
        const actionId = `${actionType}-${case_id}`;
        try {
            setLoadingActionId(actionId);
            await updateCase({ case_id, case_status }).unwrap(); // Pass as object
            if (loggedInUserId) {
                await addLog({ user_id: loggedInUserId, action: `📜 Case ${case_id} status updated to ${case_status}` }).unwrap();
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
                await updateCase({ case_id, case_status }).unwrap(); // Pass as object
                if (loggedInUserId) {
                    await addLog({ user_id: loggedInUserId, action: `📜 Case ${case_id} status updated to ${case_status} (bulk)` }).unwrap();
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
            const clientFullNameLower = caseItem.owner?.full_name?.toLowerCase() ?? '';
            const clientEmailLower = caseItem.owner?.email?.toLowerCase() ?? '';
            const caseDescLower = caseItem.case_description?.toLowerCase() ?? '';
            const itemActualStatusLower = caseItem.case_status?.toLowerCase() ?? '';
            const caseNumberLower = caseItem.case_number?.toLowerCase() ?? ''; // Assuming case_number can be filtered

            const assignedStaffNamesLower = caseItem.assignees?.map(a => a.assignee?.full_name?.toLowerCase() || '').join(' ') || '';

            const matchesClientFullName = filters.clientFullName ? clientFullNameLower.includes(filters.clientFullName.toLowerCase()) : true;
            const matchesClientEmail = filters.clientEmail ? clientEmailLower.includes(filters.clientEmail.toLowerCase()) : true;
            // Updated description filter to search case number as well
            const matchesDescriptionOrCaseNumber = filters.description ? (caseDescLower.includes(filters.description.toLowerCase()) || caseNumberLower.includes(filters.description.toLowerCase())) : true;
            const matchesAssignedStaff = filters.assignedStaffName ? assignedStaffNamesLower.includes(filters.assignedStaffName.toLowerCase()) : true;

            const selectedFilterStatusLower = filters.status.toLowerCase();
            const matchesStatus = selectedFilterStatusLower ? itemActualStatusLower === selectedFilterStatusLower : true;

            return matchesClientFullName && matchesClientEmail && matchesDescriptionOrCaseNumber && matchesAssignedStaff && matchesStatus;
        });
    }, [cases, filters]);

    const resetFilters = () => {
        setFilters({
            clientFullName: '',
            clientEmail: '',
            description: '',
            assignedStaffName: '',
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
                disabled={isFetching || isLoading}
            >
                {isFetching || isLoading ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
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
                disabled={isFetching || isLoading}
            >
                {isFetching || isLoading ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
                Refresh Data
            </button>
        </div>
    );

    const renderCasesContent = () => {
        if (isLoading || (isFetching && !allCasesDataFromAPI && !isError)) {
            return (
                <div className="flex flex-col justify-center items-center py-24 space-y-5">
                    <AnimatedLoader />
                    <p className="text-xl text-gray-700 dark:text-slate-300 font-medium">Loading cases, please stand by...</p>
                </div>
            );
        }

        if (isError) {
            if (errorStatus === 404) return noCasesInSystemMessage;
            return apiErrorMessage;
        }

        if (!cases || cases.length === 0) return noCasesInSystemMessage;
        if (filteredCases.length === 0) return noMatchingFiltersMessage;

        const tableHeaders = (
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-indigo-700 dark:to-purple-700 sticky top-0 z-10">
                <tr className="text-left">
                    <th className="p-3 w-12"> <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedCaseIds(new Set(filteredCases.map(c => c.case_id)));
                        } else {
                            setSelectedCaseIds(new Set());
                        }
                    }}
                    checked={selectedCaseIds.size > 0 && selectedCaseIds.size === filteredCases.length}
                    /> </th>
                    <th className="p-3 whitespace-nowrap min-w-[100px]"><FaIdCard className="inline mr-1.5" />Case ID</th>
                    <th className="p-3 whitespace-nowrap min-w-[180px]"><FaUser className="inline mr-1.5" /> Client Name</th>
                    <th className="p-3 whitespace-nowrap min-w-[200px]"><FaEnvelope className="inline mr-1.5" /> Client Email</th>
                    <th className="p-3 whitespace-nowrap min-w-[150px]"><FaPhone className="inline mr-1.5" /> Client Phone</th>
                    <th className="p-3 whitespace-nowrap min-w-[180px]"><FaUsers className="inline mr-1.5" /> Assigned Staff</th>
                    <th className="p-3 whitespace-nowrap min-w-[150px]"><FaFileAlt className="inline mr-1.5" />Case Type</th>
                    <th className="p-3 whitespace-nowrap min-w-[120px]"><FaInfoCircle className="inline mr-1.5" />Status</th>
                    <th className="p-3 whitespace-nowrap min-w-[120px]"><FaMoneyBillAlt className="inline mr-1.5" />Fee</th>
                    <th className="p-3 whitespace-nowrap min-w-[150px]"><FaMoneyBillAlt className="inline mr-1.5" />Balance</th>
                    <th className="p-3 text-center whitespace-nowrap min-w-[260px]"><FaThList className="inline mr-1.5" />Actions</th>
                </tr>
            </thead>
        );

        const openAndInProgressCases = filteredCases.filter(c => c.case_status === 'open' || c.case_status === 'in_progress' || c.case_status === 'on_hold' || c.case_status === 'resolved');
        const closedCases = filteredCases.filter(c => c.case_status === 'closed');

        const renderTable = (caseList: CaseDataTypes[], title: string, count: number, type: 'active' | 'closed') => {
            const headerColor = type === 'active'
                ? 'text-indigo-700 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300';

            const statusColorClass = (status: CaseStatus | string) => {
                const lowerStatus = status.toLowerCase();
                if (lowerStatus === 'open') return 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200';
                if (lowerStatus === 'in_progress') return 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-200';
                if (lowerStatus === 'on_hold') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-200';
                if (lowerStatus === 'resolved') return 'bg-purple-100 text-purple-800 dark:bg-purple-700/30 dark:text-purple-200';
                if (lowerStatus === 'closed') return 'bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200';
                return 'bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-slate-200';
            };

            return (
                <div className="mb-12">
                    <h2 className={`text-2xl font-semibold mb-5 ${headerColor}`}>
                        {type === 'active' ? '🚀' : '✅'} {title} ({count})
                    </h2>
                    {count > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                                {tableHeaders}
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                                    {caseList.map(caseItem => (
                                        <tr key={caseItem.case_id}
                                            className={`
                                                ${type === 'active' ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'}
                                                 odd:bg-gray-50 even:bg-white
                                                 dark:odd:bg-slate-800/70 dark:even:bg-slate-700/70
                                                 transition-colors duration-150
                                            `}>
                                            <td className="p-3"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary dark:checkbox-info" checked={selectedCaseIds.has(caseItem.case_id)} onChange={() => handleCaseSelection(caseItem.case_id)} aria-label={`Select case ${caseItem.case_id}`} /></td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{caseItem.case_id}</td>
                                            <td className="p-3 text-sm text-gray-900 dark:text-slate-100 font-medium whitespace-nowrap">{caseItem.owner?.full_name ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.owner?.email ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.owner?.phone_number ?? 'N/A'}</td>
                                            <td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                                                {caseItem.assignees && caseItem.assignees.length > 0
                                                    ? caseItem.assignees.map(a => a.assignee?.full_name || 'Unassigned').join(', ')
                                                    : <span className="italic text-gray-400 dark:text-slate-500">Not Assigned</span>}
                                            </td>
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
                                                    {(loggedInUserRole === 'admin' || loggedInUserRole === 'manager') && ( // Example permission
                                                        <button
                                                            onClick={() => openDeleteModal(caseItem)}
                                                            className="btn btn-xs btn-outline btn-error dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-slate-900 flex items-center"
                                                            aria-label={`Delete case ${caseItem.case_id}`}>
                                                            <FaTrashAlt className="mr-1" /> Delete
                                                        </button>
                                                    )}
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
                {renderTable(openAndInProgressCases, "Active Cases", openAndInProgressCases.length, 'active')}
                {renderTable(closedCases, "Closed Cases", closedCases.length, 'closed')}
            </>
        );
    };

    const filterInputs = [
        { id: 'clientFullName' as keyof typeof filters, label: 'Client Name', icon: FaUser, placeholder: 'Search Client Name' },
        { id: 'clientEmail' as keyof typeof filters, label: 'Client Email', icon: FaEnvelope, placeholder: 'Search Client Email' },
        { id: 'assignedStaffName' as keyof typeof filters, label: 'Assigned Staff', icon: FaUsers, placeholder: 'Search Staff Name' },
        { id: 'description' as keyof typeof filters, label: 'Case No./Desc.', icon: FaFileAlt, placeholder: 'Search Case No. or Desc.' }
    ];

    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" duration={3000} />
            <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-800 dark:text-slate-200 transition-colors duration-300">
                <div className="container mx-auto max-w-full xl:max-w-screen-2xl">
                    <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400">All Cases Dashboard</h1>
                            <div className="breadcrumbs text-sm mt-1 text-gray-500 dark:text-slate-400">
                                <ul>
                                    <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">🏠 Dashboard</Link></li>
                                    <li><Link to="/dashboard/account" className="hover:text-indigo-600 dark:hover:text-indigo-400">Admin</Link></li>
                                    <li className="text-gray-700 dark:text-slate-300">All Cases</li>
                                </ul>
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle dark mode"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                        </button>
                    </header>


                    <section className="mb-8 p-5 md:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200/70 dark:border-slate-700">
                        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-5 flex items-center pb-3 border-b border-gray-200 dark:border-slate-600">
                            <FaFilter className="mr-2.5 text-indigo-500 dark:text-indigo-400 h-5 w-5" /> Case Filters
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-5 pt-2">
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
                                    <option value="" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">All</option>
                                    <option value="open" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">Open</option>
                                    <option value="in_progress" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">In Progress</option>
                                    <option value="on_hold" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">On Hold</option>
                                    <option value="resolved" className="bg-white dark:bg-slate-700 text-black dark:text-slate-300">Resolved</option>
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
                    </section>

                    <section>
                        {renderCasesContent()}
                    </section>

                </div>
            </div>

            {isViewModalOpen && selectedCaseModalData && (
                <ViewCaseDetailsModal
                    selectedCase={selectedCaseModalData}
                    closeModal={closeViewModal}
                    isDarkMode={isDarkMode}
                    currentUserRole={loggedInUserRole} // Pass current user's role
                />
            )}

            {isDeleteModalOpen && caseToDelete && (
                <DeleteCaseForm
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    caseItem={caseToDelete}
                    refetch={refetch}
                    isDarkMode={isDarkMode}
                />
            )}
        </>
    );
};

export default AllCases;