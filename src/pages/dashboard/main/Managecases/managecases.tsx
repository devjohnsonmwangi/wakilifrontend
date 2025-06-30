// src/pages/dashboard/main/AdminDashboard/AllCases.tsx
import { useEffect, useState, useMemo, useRef } from "react";
//import { Link } from "react-router-dom";
import {
    caseAndPaymentAPI,
    CaseDataTypes,
    CaseAssigneeData
} from "../../../../features/case/caseAPI";
import { Toaster, toast } from 'sonner';
import { RootState } from "../../../../app/store";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, User, X, Search, Filter, BadgeInfo, Trash2, CheckCircle, RefreshCw,
    Info, Moon, Users, Settings, ChevronDown, Sun, Table as TableIcon,
    PieChart as PieChartIcon, BookOpen, Briefcase, PlusCircle, AlertTriangle, Clock,
    DollarSign, Eye, XCircle, TrendingUp, TrendingDown, Download
} from "lucide-react";
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from "./ViewCaseDetailsModal";
import CreateCaseModal from "./createcase"; // <-- Import your CreateCaseModal
import { useFetchUsersQuery } from "../../../../features/users/usersAPI";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- CONFIGURATION & TYPES ---
const ITEMS_PER_PAGE = 15;
type Tab = 'dashboard' | 'analytics' | 'activity';
type ActivityLog = { id: number; timestamp: Date; icon: React.ElementType; color: string; message: string; };

// --- HELPER & REUSABLE COMPONENTS ---
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value == null) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `KES ${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; iconBgClass: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon: Icon, iconBgClass, change, changeType }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgClass}`}><Icon className="w-6 h-6 text-white" /></div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
                {change && changeType && (<span className={`flex items-center text-xs font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>{changeType === 'increase' ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}{change}</span>)}
            </div>
        </div>
    </div>
);
const TabButton: React.FC<{ text: string; icon: React.ElementType; isActive: boolean; onClick: () => void; }> = ({ text, icon: Icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Icon size={16}/>{text}</button> );
const HeaderCell: React.FC<{ text: string; icon: React.ElementType; className?: string }> = ({ text, icon: Icon, className }) => ( <th className={`p-4 text-left text-xs font-semibold uppercase tracking-wider ${className}`}><div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {text}</div></th> );
const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => ( <tr>{Array.from({ length: columns }).map((_, i) => <td key={i} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>)}</tr> );

const AssignedStaffModal: React.FC<{ isOpen: boolean; onClose: () => void; assignees: CaseAssigneeData[] }> = ({ isOpen, onClose, assignees }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"><X size={24} /></button>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">Assigned Staff</h3>
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-80 overflow-y-auto styled-scrollbar">
                            {assignees.map(a => (
                                <li key={a.assignee?.user_id} className="py-3">
                                    <p className="font-semibold text-slate-800 dark:text-white">{a.assignee?.full_name}</p>
                                    <p className="text-sm text-slate-500">{a.assignee?.email}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const AllCases = () => {
    // --- STATE & HOOKS ---
    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [selectedCaseModalData, setSelectedCaseModalData] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

    const { data: allCasesDataFromAPI, error: rawCaseError, isLoading, isFetching, isError, refetch } = caseAndPaymentAPI.useFetchCasesQuery({ includeDetails: true });
    const { data: usersData } = useFetchUsersQuery();
    const { user } = useSelector((state: RootState) => state.user);
    
    const [filters, setFilters] = useState({ term: '', assignedStaffId: '', status: '' });
    const [selectedCaseIds, setSelectedCaseIds] = useState<Set<number>>(new Set());
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAssignees, setSelectedAssignees] = useState<CaseAssigneeData[]>([]);

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const staffDropdownRef = useRef<HTMLDivElement>(null);

    // --- EFFECTS ---
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;

    useEffect(() => {
        if (isError) {
            if (errorStatus === 404) {
                setCases([]);
                toast.info("No cases found in the system.");
            } else {
                toast.error(`Error fetching cases: ${errorStatus || 'Unknown'}`);
            }
        } else if (allCasesDataFromAPI) {
            setCases(allCasesDataFromAPI);
            if(activityLogs.length === 0) {
                 addActivityLog(CheckCircle, 'text-green-500', `${allCasesDataFromAPI.length} cases loaded successfully.`);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allCasesDataFromAPI, isError, errorStatus]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
          if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target as Node)) setIsStaffDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // --- DATA & DERIVED STATE ---
    const staffMembers = useMemo(() => usersData?.filter(u => u.role === 'manager' || u.role === 'admin' || u.role === 'lawyer' || u.role === 'clerks') || [], [usersData]);

    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases)) return [];
        return cases.filter((caseItem) => {
            const searchTerm = filters.term.toLowerCase();
            const clientNameMatch = caseItem.owner?.full_name?.toLowerCase().includes(searchTerm);
            const caseNumberMatch = caseItem.case_number?.toLowerCase().includes(searchTerm);
            const descriptionMatch = caseItem.case_description?.toLowerCase().includes(searchTerm);
            const statusMatch = filters.status ? caseItem.case_status === filters.status : true;
            const staffMatch = filters.assignedStaffId ? caseItem.assignees?.some(a => String(a.assignee?.user_id) === filters.assignedStaffId) : true;
            return (clientNameMatch || caseNumberMatch || descriptionMatch) && statusMatch && staffMatch;
        });
    }, [cases, filters]);

    const analyticsData = useMemo(() => {
        const totalCases = cases.length;
        const statusCounts = cases.reduce((acc, c) => {
            const status = c.case_status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const staffCaseCounts = cases.reduce((acc, c) => {
            c.assignees?.forEach(assignee => {
                const name = assignee.assignee?.full_name || 'Unassigned';
                acc[name] = (acc[name] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);
        
        const staffLeaderboard = Object.entries(staffCaseCounts).map(([name, count]) => ({name, count})).sort((a, b) => b.count - a.count).slice(0, 5);
        const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value}));
        
        const totalFeesBilled = cases.reduce((sum, c) => sum + Number(c.fee || 0), 0);
        const totalPaymentsReceived = cases.reduce((sum, c) => sum + (Number(c.fee || 0) - Number(c.payment_balance || 0)), 0);
        const outstandingBalance = totalFeesBilled - totalPaymentsReceived;
        const collectionRate = totalFeesBilled > 0 ? (totalPaymentsReceived / totalFeesBilled) * 100 : 0;
        const casesOpenedThisMonth = cases.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth() && new Date(c.created_at).getFullYear() === new Date().getFullYear()).length;
        const casesClosedThisMonth = cases.filter(c => c.case_status === 'closed' && new Date(c.updated_at).getMonth() === new Date().getMonth() && new Date(c.updated_at).getFullYear() === new Date().getFullYear()).length;
        const caseTypeDistribution = cases.reduce((acc, c) => {
            const type = c.case_type || 'Uncategorized';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const caseTypeChartData = Object.entries(caseTypeDistribution).map(([name, count]) => ({name, count}));

        return { totalCases, statusCounts, staffLeaderboard, statusPieData, totalFeesBilled, totalPaymentsReceived, outstandingBalance, collectionRate, casesOpenedThisMonth, casesClosedThisMonth, caseTypeChartData };
    }, [cases]);

    const paginatedCases = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCases, currentPage]);
    
    const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);

    // --- HANDLERS ---
    const addActivityLog = (icon: React.ElementType, color: string, message: string) => {
        setActivityLogs(prev => [{ id: Date.now(), timestamp: new Date(), icon, color, message }, ...prev].slice(0, 100));
    };
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleFilterChange = (field: keyof typeof filters, value: string) => { setFilters(prev => ({...prev, [field]: value})); setCurrentPage(1); };
    const resetFilters = () => { setFilters({ term: '', assignedStaffId: '', status: '' }); setCurrentPage(1); toast.info("🌀 Filters have been reset."); };
    const handleClearFilter = (filterName: keyof typeof filters) => { setFilters(prev => ({...prev, [filterName]: ''})); setCurrentPage(1); };

    const handleCaseSelection = (caseId: number) => {
        setSelectedCaseIds(prevState => {
            const newSelection = new Set(prevState);
            if (newSelection.has(caseId)) newSelection.delete(caseId); else newSelection.add(caseId);
            return newSelection;
        });
    };

    const handleExportCSV = () => {
        if (filteredCases.length === 0) { toast.error("No data to export."); return; }
        const headers = ["Case Number", "Description", "Client Name", "Client Email", "Assigned Staff", "Case Type", "Status", "Fee", "Balance"];
        const csvContent = [headers.join(',')];

        filteredCases.forEach((caseItem) => {
            const rowData = [
                `"${caseItem.case_number || 'N/A'}"`,
                `"${(caseItem.case_description || '').replace(/"/g, '""')}"`,
                `"${caseItem.owner?.full_name || 'N/A'}"`,
                `"${caseItem.owner?.email || 'N/A'}"`,
                `"${caseItem.assignees?.map(a => a.assignee?.full_name).join(', ') || 'Unassigned'}"`,
                `"${caseItem.case_type || 'N/A'}"`,
                caseItem.case_status,
                caseItem.fee || 0,
                caseItem.payment_balance || 0
            ];
            csvContent.push(rowData.join(','));
        });

        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'all_cases_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Case data exported to CSV.");
    };

    const openViewModal = (caseItem: CaseDataTypes) => { setSelectedCaseModalData(caseItem); setIsViewModalOpen(true); };
    const closeViewModal = () => { setIsViewModalOpen(false); setSelectedCaseModalData(null); };
    const openDeleteModal = (caseItem: CaseDataTypes) => { setCaseToDelete(caseItem); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setCaseToDelete(null); };
    
    // --- RENDER LOGIC ---
    const renderDashboardTab = () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Total Cases" value={analyticsData.totalCases} icon={Briefcase} iconBgClass="bg-blue-500" />
                <SummaryCard title="Open Cases" value={analyticsData.statusCounts['open'] || 0} icon={CheckCircle} iconBgClass="bg-green-500" />
                <SummaryCard title="In Progress" value={analyticsData.statusCounts['in_progress'] || 0} icon={RefreshCw} iconBgClass="bg-sky-500" />
                <SummaryCard title="On Hold" value={analyticsData.statusCounts['on_hold'] || 0} icon={Clock} iconBgClass="bg-orange-500" />
            </div>

            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-8">All Cases</h3>
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                     <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="term" placeholder="Client, Case No, Desc..." value={filters.term} onChange={(e) => handleFilterChange('term', e.target.value)} className="block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 pr-4" /></div></div>
                    <div ref={staffDropdownRef} className="relative">
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Assigned Staff</label>
                        <button type="button" onClick={() => setIsStaffDropdownOpen(p => !p)} className={`block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 px-4 text-left flex justify-between items-center`}>
                            <span className={`truncate ${!filters.assignedStaffId ? 'text-slate-400 dark:text-slate-500' : 'font-semibold'}`}>{staffMembers.find(s => String(s.user_id) === filters.assignedStaffId)?.full_name || 'All Staff'}</span>
                            <div className="flex items-center">
                                {filters.assignedStaffId && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('assignedStaffId'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isStaffDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        <AnimatePresence>
                            {isStaffDropdownOpen && (
                                <motion.ul initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <li key="all-staff"><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => { handleFilterChange('assignedStaffId', ''); setIsStaffDropdownOpen(false); }}>All Staff</button></li>
                                    {staffMembers.map(staff => (<li key={staff.user_id}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => { handleFilterChange('assignedStaffId', String(staff.user_id)); setIsStaffDropdownOpen(false); }}>{staff.full_name}</button></li>))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    <div ref={statusDropdownRef} className="relative">
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Status</label>
                        <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 px-4 text-left flex justify-between items-center`}>
                            <span className={`truncate ${!filters.status ? 'text-slate-400 dark:text-slate-500' : 'font-semibold'}`}>{filters.status ? filters.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Statuses'}</span>
                            <div className="flex items-center">
                                {filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('status'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        <AnimatePresence>
                            {isStatusDropdownOpen && (
                                <motion.ul initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                     <li key="all-statuses"><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>
                                    {['open', 'in_progress', 'on_hold', 'resolved', 'closed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button></li>))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    <button onClick={resetFilters} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"><Filter size={16}/> Reset All</button>
                </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 styled-scrollbar">
                 <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4"><input type="checkbox" className="form-checkbox" onChange={(e) => setSelectedCaseIds(e.target.checked ? new Set(filteredCases.map(c => c.case_id)) : new Set())} checked={selectedCaseIds.size > 0 && selectedCaseIds.size === filteredCases.length}/></th>
                            <HeaderCell text="Case Info" icon={BadgeInfo} className="whitespace-nowrap" />
                            <HeaderCell text="Client Info" icon={User} className="whitespace-nowrap"/>
                            <HeaderCell text="Assigned To" icon={Users} className="whitespace-nowrap"/>
                            <HeaderCell text="Case Type" icon={FileText} className="whitespace-nowrap"/>
                            <HeaderCell text="Financials" icon={DollarSign} className="whitespace-nowrap"/>
                            <HeaderCell text="Status" icon={Info} />
                            <HeaderCell text="Actions" icon={Settings} className="text-center whitespace-nowrap" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {(isLoading || isFetching) && [1,2,3,4,5].map(i => <SkeletonRow key={i} columns={8}/>)}
                        {!(isLoading || isFetching) && paginatedCases.map(caseItem => (
                            <tr key={caseItem.case_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                                <td className="p-4"><input type="checkbox" className="form-checkbox" checked={selectedCaseIds.has(caseItem.case_id)} onChange={() => handleCaseSelection(caseItem.case_id)} /></td>
                                <td className="p-4 whitespace-nowrap"><div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100"><Briefcase size={14}/>{caseItem.case_number}</div><div className="text-xs text-slate-500 truncate max-w-xs ml-6" title={caseItem.case_description || undefined}>{caseItem.case_description}</div></td>
                                <td className="p-4 whitespace-nowrap"><div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100"><User size={14}/>{caseItem.owner?.full_name ?? 'N/A'}</div><div className="text-xs text-slate-500 ml-6">{caseItem.owner?.email ?? 'N/A'}</div></td>
                                <td className="p-4 whitespace-nowrap">
                                    {caseItem.assignees && caseItem.assignees.length > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{caseItem.assignees.length} Staff</span>
                                            <button onClick={() => {setSelectedAssignees(caseItem.assignees || []); setIsStaffModalOpen(true);}} className="text-blue-500 hover:underline text-xs">(View)</button>
                                        </div>
                                    ) : (
                                        <span className="italic text-gray-400 dark:text-slate-500">Not Assigned</span>
                                    )}
                                </td>
                                <td className="p-4 font-semibold whitespace-nowrap">{caseItem.case_type}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100"><DollarSign size={14}/><span>Fee: {formatCurrency(caseItem.fee)}</span></div>
                                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold"><CheckCircle size={14}/><span>Paid: {formatCurrency(Number(caseItem.fee) - Number(caseItem.payment_balance))}</span></div>
                                    <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-semibold"><AlertTriangle size={14}/><span>Balance: {formatCurrency(caseItem.payment_balance)}</span></div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ {open: 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200', in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-200', on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-200', resolved: 'bg-purple-100 text-purple-800 dark:bg-purple-700/30 dark:text-purple-200', closed: 'bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200'}[caseItem.case_status] || 'bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-slate-200'}`}>{caseItem.case_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                </td>
                                <td className="p-4 text-center"><div className="flex items-center justify-center gap-1"><button onClick={() => openViewModal(caseItem)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold bg-sky-100 hover:bg-sky-200 dark:bg-sky-700/50 dark:text-sky-300 dark:hover:bg-sky-700" title="View Details"><Eye size={14}/> View</button>{(user?.role === 'admin' || user?.role === 'manager') && (<button onClick={() => openDeleteModal(caseItem)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold bg-red-100 hover:bg-red-200 dark:bg-red-700/50 dark:text-red-300 dark:hover:bg-red-700" title="Delete Case"><Trash2 size={14} /> Delete</button>)}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">Showing <strong>{paginatedCases.length}</strong> of <strong>{filteredCases.length}</strong> results</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Prev</button>
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Next</button>
                    </div>
                </div>
            )}
        </>
    );

    const renderAnalyticsTab = () => (
         <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Financial & Case Overview</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="Total Fees Billed" value={formatCurrency(analyticsData.totalFeesBilled)} icon={DollarSign} iconBgClass="bg-blue-500" />
                    <SummaryCard title="Payments Received" value={formatCurrency(analyticsData.totalPaymentsReceived)} icon={CheckCircle} iconBgClass="bg-green-500" />
                    <SummaryCard title="Outstanding Balance" value={formatCurrency(analyticsData.outstandingBalance)} icon={AlertTriangle} iconBgClass="bg-red-500" />
                    <SummaryCard title="Collection Rate" value={`${analyticsData.collectionRate.toFixed(1)}%`} icon={TrendingUp} iconBgClass="bg-purple-500" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard title="Total Cases" value={analyticsData.totalCases} icon={Briefcase} iconBgClass="bg-slate-500" />
                <SummaryCard title="Opened This Month" value={analyticsData.casesOpenedThisMonth} icon={PlusCircle} iconBgClass="bg-sky-500" />
                <SummaryCard title="Closed This Month" value={analyticsData.casesClosedThisMonth} icon={XCircle} iconBgClass="bg-pink-500" />
                <SummaryCard title="Currently In Progress" value={analyticsData.statusCounts['in_progress'] || 0} icon={RefreshCw} iconBgClass="bg-indigo-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Case Type Distribution</h3>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={analyticsData.caseTypeChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                                <XAxis type="number" stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
                                <YAxis type="category" dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} width={120} />
                                <Tooltip cursor={{ fill: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)' }} contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Cases by Status</h3>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }} />
                                <Legend />
                                <Pie data={analyticsData.statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>{analyticsData.statusPieData.map((_, index) => <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />)}</Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
             <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Top Staff by Assigned Cases</h3>
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {analyticsData.staffLeaderboard.length > 0 ? analyticsData.staffLeaderboard.map((staff, index) => (
                            <li key={staff.name} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-6 text-center">{index + 1}</span><p className="font-semibold text-slate-800 dark:text-white">{staff.name}</p></div>
                                <p className="font-bold text-blue-500">{staff.count} cases</p>
                            </li>
                        )) : <p className="text-center text-slate-500 p-4">No staff assignment data available.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderActivityLogTab = () => (
        <div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Recent Activity</h3>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-4">
                {activityLogs.map(log => { const Icon = log.icon; return (<div key={log.id} className="flex items-start gap-3"><Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${log.color}`} /><div><p className="text-sm text-slate-700 dark:text-slate-200">{log.message}</p><p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p></div></div>);})}
                 {activityLogs.length === 0 && <p className="text-center text-slate-500 p-4">No activity recorded yet.</p>}
            </div>
        </div>
    );
    
    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" duration={3000} />
            <div className="p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen text-gray-800 dark:text-slate-200 transition-colors duration-300">
                <div className="max-w-screen-2xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">Case Management</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Oversee, analyze, and manage all legal cases.</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <button onClick={handleExportCSV} disabled={filteredCases.length === 0} className="font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Download size={16} /> <span className="hidden sm:inline">Export CSV</span></button>
                             <button onClick={() => setIsCreateModalOpen(true)} className="font-semibold py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2"><PlusCircle size={18} /> <span className="hidden sm:inline">New Case</span></button>
                            <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Toggle theme">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                            <button onClick={() => refetch()} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Refresh Data"><RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} /></button>
                        </div>
                    </header>
                    
                    <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                        <TabButton text="Dashboard" icon={TableIcon} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <TabButton text="Analytics" icon={PieChartIcon} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                        <TabButton text="Activity Log" icon={BookOpen} isActive={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                    </div>

                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 rounded-2xl shadow-xl p-6 sm:p-8 h-full">
                         {isError && errorStatus !== 404 ? (
                            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
                                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Failed to Load Data</h3>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">A network error occurred. Please try again.</p>
                                <button onClick={() => refetch()} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center mx-auto"><RefreshCw className="inline mr-2 h-4 w-4"/>Retry</button>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'dashboard' && renderDashboardTab()}
                                {activeTab === 'analytics' && renderAnalyticsTab()}
                                {activeTab === 'activity' && renderActivityLogTab()}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            {isViewModalOpen && selectedCaseModalData && (<ViewCaseDetailsModal selectedCase={selectedCaseModalData} closeModal={closeViewModal} isDarkMode={isDarkMode} currentUserRole={user?.role} />)}
            {isDeleteModalOpen && caseToDelete && (<DeleteCaseForm isOpen={isDeleteModalOpen} onClose={closeDeleteModal} caseItem={caseToDelete} refetch={refetch} isDarkMode={isDarkMode} />)}
            <CreateCaseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <AssignedStaffModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} assignees={selectedAssignees} />
        </>
    );
};

export default AllCases;