// src/pages/dashboard/main/AdminDashboard/AllCases.tsx
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
    caseAndPaymentAPI,
    CaseDataTypes,
    CaseStatus,
} from "../../../../features/case/caseAPI";
import { Toaster, toast } from 'sonner';
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    FileText, User, Mail, X, Search, Filter, Phone, BadgeInfo, Trash2, CheckCircle, RefreshCw,
    Banknote, Info,  Moon, Users, Settings, ChevronDown, RotateCcw, Sun
} from "lucide-react";
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from "./ViewCaseDetailsModal";

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

    const { data: allCasesDataFromAPI, error: rawCaseError, isLoading, isFetching, isError, refetch } = caseAndPaymentAPI.useFetchCasesQuery({ includeDetails: true }, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 300000, // 5 minutes
    });

    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const loggedInUserId = user?.user_id;
    const loggedInUserRole = user?.role;
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

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;

    useEffect(() => {
        if (isError) {
            if (errorStatus === 404) {
                setCases([]);
                toast.info("No cases found in the system at the moment.");
            } else {
                toast.error(`Error fetching cases: ${errorStatus || 'Unknown error'}`);
            }
        } else if (allCasesDataFromAPI) {
            setCases(allCasesDataFromAPI);
        } else if (!isLoading && !isFetching && !allCasesDataFromAPI && !isError) {
            setCases([]);
        }
    }, [allCasesDataFromAPI, isLoading, isFetching, isError, errorStatus]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUpdateStatus = async (case_id: number, case_status: CaseStatus, actionType: 'close' | 'reopen') => {
        const actionId = `${actionType}-${case_id}`;
        try {
            setLoadingActionId(actionId);
            await updateCase({ case_id, case_status }).unwrap();
            if (loggedInUserId) await addLog({ user_id: loggedInUserId, action: `📜 Case ${case_id} status updated to ${case_status}` }).unwrap();
            toast.success(`🎉 Case ${case_status === 'closed' ? 'closed' : 'reopened'} successfully!`);
            refetch();
        } catch (err) {
            toast.error(`❌ Failed to ${actionType} case`);
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
                if (loggedInUserId) await addLog({ user_id: loggedInUserId, action: `📜 Case ${case_id} status updated to ${case_status} (bulk)` }).unwrap();
            }
            toast.success('🎉 Bulk case status updated successfully!');
            setSelectedCaseIds(new Set());
            refetch();
        } catch (err) {
            toast.error('❌ Failed to update cases status in bulk');
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
            const caseNumberLower = caseItem.case_number?.toLowerCase() ?? '';
            const assignedStaffNamesLower = caseItem.assignees?.map(a => a.assignee?.full_name?.toLowerCase() || '').join(' ') || '';
            const matchesClientFullName = filters.clientFullName ? clientFullNameLower.includes(filters.clientFullName.toLowerCase()) : true;
            const matchesClientEmail = filters.clientEmail ? clientEmailLower.includes(filters.clientEmail.toLowerCase()) : true;
            const matchesDescriptionOrCaseNumber = filters.description ? (caseDescLower.includes(filters.description.toLowerCase()) || caseNumberLower.includes(filters.description.toLowerCase())) : true;
            const matchesAssignedStaff = filters.assignedStaffName ? assignedStaffNamesLower.includes(filters.assignedStaffName.toLowerCase()) : true;
            const selectedFilterStatusLower = filters.status.toLowerCase();
            const matchesStatus = selectedFilterStatusLower ? itemActualStatusLower === selectedFilterStatusLower : true;
            return matchesClientFullName && matchesClientEmail && matchesDescriptionOrCaseNumber && matchesAssignedStaff && matchesStatus;
        });
    }, [cases, filters]);

    const resetFilters = () => {
        setFilters({ clientFullName: '', clientEmail: '', description: '', assignedStaffName: '', status: '' });
        toast.info("🌀 Filters have been reset.");
    };
    
    const handleClearFilter = (filterName: keyof typeof filters) => setFilters(prev => ({...prev, [filterName]: ''}));
    
    const handleCaseSelection = (caseId: number) => {
        setSelectedCaseIds(prevState => {
            const newSelection = new Set(prevState);
            if (newSelection.has(caseId)) newSelection.delete(caseId); else newSelection.add(caseId);
            return newSelection;
        });
    };

    const openViewModal = useCallback((caseItem: CaseDataTypes) => { setSelectedCaseModalData(caseItem); setIsViewModalOpen(true); }, []);
    const closeViewModal = useCallback(() => { setIsViewModalOpen(false); setSelectedCaseModalData(null); }, []);
    const openDeleteModal = (caseItem: CaseDataTypes) => { setCaseToDelete(caseItem); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setCaseToDelete(null); };

    // --- Message Components ---
    const StylishMessage = ({ icon, title, message, children }: { icon: React.ReactNode; title: string; message: string; children?: React.ReactNode }) => (
        <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-5">{icon}</div>
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-md mb-5">{message}</p>
            {children}
        </div>
    );
    
    // --- Render Logic ---
    const renderCasesContent = () => {
        if (isLoading || (isFetching && !allCasesDataFromAPI && !isError)) return ( <div className="flex flex-col justify-center items-center py-24 space-y-5"><AnimatedLoader /><p className="text-xl text-gray-700 dark:text-slate-300 font-medium">Loading cases, please stand by...</p></div> );
        if (isError) return <StylishMessage icon={<X className="h-8 w-8 text-red-500"/>} title="Oops! Something Went Wrong" message={`We encountered an issue loading case data (Error: ${errorStatus || 'Unknown'}). Please check your internet connection and try again.`} children={<button onClick={() => refetch()} className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors" disabled={isFetching || isLoading}>{isFetching || isLoading ? 'Refreshing...' : 'Try Refreshing Data'}</button>} />;
        if (!cases || cases.length === 0) return <StylishMessage icon={<RefreshCw className="h-8 w-8 text-sky-500"/>} title="No Cases Found" message="There are currently no cases recorded in the system." children={<button onClick={() => refetch()} className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors" disabled={isFetching || isLoading}>{isFetching || isLoading ? 'Refreshing...' : 'Try Refreshing Data'}</button>}/>;
        if (filteredCases.length === 0) return <StylishMessage icon={<Search className="h-8 w-8 text-yellow-500"/>} title="No Cases Match Your Filters" message="We couldn't find any cases matching your current filter criteria." children={<button onClick={resetFilters} className="px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">Reset All Filters</button>} />;

        const tableHeaders = ( <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-indigo-700 dark:to-purple-700 sticky top-0 z-10"><tr className="text-left"><th className="p-3 w-12"><input type="checkbox" className="checkbox checkbox-xs checkbox-primary" onChange={(e) => { if (e.target.checked) setSelectedCaseIds(new Set(filteredCases.map(c => c.case_id))); else setSelectedCaseIds(new Set()); }} checked={selectedCaseIds.size > 0 && selectedCaseIds.size === filteredCases.length}/></th><th className="p-3 whitespace-nowrap min-w-[100px]"><BadgeInfo className="inline mr-1.5 h-4 w-4" />Case ID</th><th className="p-3 whitespace-nowrap min-w-[180px]"><User className="inline mr-1.5 h-4 w-4" /> Client Name</th><th className="p-3 whitespace-nowrap min-w-[200px]"><Mail className="inline mr-1.5 h-4 w-4" /> Client Email</th><th className="p-3 whitespace-nowrap min-w-[150px]"><Phone className="inline mr-1.5 h-4 w-4" /> Client Phone</th><th className="p-3 whitespace-nowrap min-w-[180px]"><Users className="inline mr-1.5 h-4 w-4" /> Assigned Staff</th><th className="p-3 whitespace-nowrap min-w-[150px]"><FileText className="inline mr-1.5 h-4 w-4" />Case Type</th><th className="p-3 whitespace-nowrap min-w-[120px]"><Info className="inline mr-1.5 h-4 w-4" />Status</th><th className="p-3 whitespace-nowrap min-w-[120px]"><Banknote className="inline mr-1.5 h-4 w-4" />Fee</th><th className="p-3 whitespace-nowrap min-w-[150px]"><Banknote className="inline mr-1.5 h-4 w-4" />Balance</th><th className="p-3 text-center whitespace-nowrap min-w-[260px]"><Settings className="inline mr-1.5 h-4 w-4" />Actions</th></tr></thead> );
        const openAndInProgressCases = filteredCases.filter(c => c.case_status !== 'closed');
        const closedCases = filteredCases.filter(c => c.case_status === 'closed');
        const renderTable = (caseList: CaseDataTypes[], title: string, count: number, type: 'active' | 'closed') => {
            const statusColorClass = (status: CaseStatus | string) => { const lowerStatus = status.toLowerCase(); if (lowerStatus === 'open') return 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200'; if (lowerStatus === 'in_progress') return 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-200'; if (lowerStatus === 'on_hold') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-200'; if (lowerStatus === 'resolved') return 'bg-purple-100 text-purple-800 dark:bg-purple-700/30 dark:text-purple-200'; if (lowerStatus === 'closed') return 'bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200'; return 'bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-slate-200'; };
            return ( <div className="mb-12"><h2 className={`text-2xl font-semibold mb-5 ${type === 'active' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{type === 'active' ? '🚀' : '✅'} {title} ({count})</h2>{count > 0 ? ( <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800"><table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">{tableHeaders}<tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">{caseList.map(caseItem => ( <tr key={caseItem.case_id} className={`transition-colors duration-150 ${type === 'active' ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'} odd:bg-gray-50 even:bg-white dark:odd:bg-slate-800/70 dark:even:bg-slate-700/70`}><td className="p-3"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary dark:checkbox-info" checked={selectedCaseIds.has(caseItem.case_id)} onChange={() => handleCaseSelection(caseItem.case_id)} aria-label={`Select case ${caseItem.case_id}`} /></td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{caseItem.case_id}</td><td className="p-3 text-sm text-gray-900 dark:text-slate-100 font-medium whitespace-nowrap">{caseItem.owner?.full_name ?? 'N/A'}</td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.owner?.email ?? 'N/A'}</td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.owner?.phone_number ?? 'N/A'}</td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.assignees && caseItem.assignees.length > 0 ? caseItem.assignees.map(a => a.assignee?.full_name || 'Unassigned').join(', ') : <span className="italic text-gray-400 dark:text-slate-500">Not Assigned</span>}</td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">{caseItem.case_type}</td><td className="p-3 text-sm whitespace-nowrap"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClass(caseItem.case_status)}`}>{caseItem.case_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{formatCurrency(caseItem.fee)}</td><td className="p-3 text-sm text-gray-700 dark:text-slate-300 tabular-nums">{formatCurrency(caseItem.payment_balance)}</td><td className="p-3 text-sm text-center"><div className="flex items-center justify-center space-x-1.5 flex-wrap gap-1"><button onClick={() => openViewModal(caseItem)} className="px-2 py-1 text-xs font-semibold rounded-md flex items-center bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-700/50 dark:text-sky-300 dark:hover:bg-sky-700" aria-label={`View details for case ${caseItem.case_id}`}><FileText className="mr-1 h-3.5 w-3.5" /> View</button>{caseItem.case_status !== 'closed' && ( <button onClick={() => handleUpdateStatus(caseItem.case_id, 'closed', 'close')} disabled={loadingActionId === `close-${caseItem.case_id}`} className="px-2 py-1 text-xs font-semibold rounded-md flex items-center bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700/50 dark:text-green-300 dark:hover:bg-green-700" aria-label={`Close case ${caseItem.case_id}`}>{loadingActionId === `close-${caseItem.case_id}` ? <span className="loading loading-spinner loading-xs"></span> : <CheckCircle className="mr-1 h-3.5 w-3.5" />} Close</button> )}{caseItem.case_status === 'closed' && ( <button onClick={() => handleUpdateStatus(caseItem.case_id, 'open', 'reopen')} disabled={loadingActionId === `reopen-${caseItem.case_id}`} className="px-2 py-1 text-xs font-semibold rounded-md flex items-center bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-700/50 dark:text-yellow-300 dark:hover:bg-yellow-700" aria-label={`Reopen case ${caseItem.case_id}`}>{loadingActionId === `reopen-${caseItem.case_id}` ? <span className="loading loading-spinner loading-xs"></span> : < RotateCcw className="mr-1 h-3.5 w-3.5" />} Reopen</button> )}{(loggedInUserRole === 'admin' || loggedInUserRole === 'manager') && ( <button onClick={() => openDeleteModal(caseItem)} className="px-2 py-1 text-xs font-semibold rounded-md flex items-center bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/50 dark:text-red-300 dark:hover:bg-red-700" aria-label={`Delete case ${caseItem.case_id}`}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</button> )}</div></td></tr> ))}</tbody></table></div> ) : ( <p className="text-gray-500 dark:text-slate-400 italic px-2 py-4">No cases in this category match your current filters.</p> )}</div> );
        };
        return ( <> {renderTable(openAndInProgressCases, "Active Cases", openAndInProgressCases.length, 'active')} {renderTable(closedCases, "Closed Cases", closedCases.length, 'closed')} </> );
    };

    const filterInputs = [
        { id: 'clientFullName' as keyof typeof filters, placeholder: 'Search Client Name...' },
        { id: 'clientEmail' as keyof typeof filters, placeholder: 'Search Client Email...' },
        { id: 'assignedStaffName' as keyof typeof filters, placeholder: 'Search Staff Name...' },
        { id: 'description' as keyof typeof filters, placeholder: 'Search Case No. or Desc...' }
    ];

    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" duration={3000} />
            <div className="p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen text-gray-800 dark:text-slate-200 transition-colors duration-300">
                <div className="max-w-full mx-auto">
                    <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400">All Cases Dashboard</h1>
                            <div className="text-sm mt-1 text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">🏠 Dashboard</Link>
                                <span>/</span>
                                <span className="text-gray-700 dark:text-slate-300">All Cases</span>
                            </div>
                        </div>
                        <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300" title="Toggle dark mode">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                    </header>

                    <section className="mb-8 p-4 md:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200/70 dark:border-slate-700">
                        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-5 flex items-center pb-3 border-b border-gray-200 dark:border-slate-600"><Filter className="mr-2.5 h-5 w-5" /> Case Filters</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end pt-2">
                            {filterInputs.map(item => (
                                <div className="relative xl:col-span-1" key={item.id}>
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                    <input type="text" placeholder={item.placeholder} value={filters[item.id]} onChange={(e) => setFilters({ ...filters, [item.id]: e.target.value })} className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} />
                                    {filters[item.id] && (<button type="button" onClick={() => handleClearFilter(item.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}
                                </div>
                            ))}
                            <div ref={statusDropdownRef} className="relative xl:col-span-1">
                                <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}>
                                    <span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status ? filters.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Statuses'}</span>
                                    <div className="flex items-center">
                                        {filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('status'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16}/></button>)}
                                        <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                <AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilters(f => ({...f, status: ''})); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>
                                    {['open', 'in_progress', 'on_hold', 'resolved', 'closed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilters(f => ({...f, status})); setIsStatusDropdownOpen(false); }}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}
                                </motion.ul>)}</AnimatePresence>
                            </div>
                            <div className="xl:col-span-6 flex flex-col sm:flex-row items-center gap-3 pt-3">
                                <button onClick={resetFilters} className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 flex items-center justify-center" aria-label="Reset all filters"><X className="mr-2 h-4 w-4" /> Reset Filters</button>
                                <button className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center" onClick={() => handleBulkUpdateStatus('closed')} disabled={selectedCaseIds.size === 0 || loadingActionId === 'bulk-update'} aria-label={`Close ${selectedCaseIds.size} selected cases`}>{loadingActionId === 'bulk-update' && selectedCaseIds.size > 0 ? <span className="loading loading-spinner loading-xs"></span> : <CheckCircle className="mr-1.5 h-4 w-4" />}Close Selected ({selectedCaseIds.size})</button>
                            </div>
                        </div>
                    </section>

                    <section>{renderCasesContent()}</section>
                </div>
            </div>

            {isViewModalOpen && selectedCaseModalData && (<ViewCaseDetailsModal selectedCase={selectedCaseModalData} closeModal={closeViewModal} isDarkMode={isDarkMode} currentUserRole={loggedInUserRole} />)}
            {isDeleteModalOpen && caseToDelete && (<DeleteCaseForm isOpen={isDeleteModalOpen} onClose={closeDeleteModal} caseItem={caseToDelete} refetch={refetch} isDarkMode={isDarkMode} />)}
        </>
    );
};

export default AllCases;