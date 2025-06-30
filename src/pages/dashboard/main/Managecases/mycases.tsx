// src/pages/dashboard/main/Managecases/MyCases.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import {
    caseAndPaymentAPI,
    CaseDataTypes,
    CaseStatus,
} from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useRef } from 'react';
import CreateCaseModal from './createcase';
import EditCaseForm from './updatecase';
import DeleteCaseForm from './deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails';
import SingleCaseMpesaPayment from '../Payments/Payments';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FilePenLine, Wind, Search, Trash2, Eye, Banknote, Sun, Moon,
    Fingerprint, Tag, Barcode, FileDigit, ClipboardCheck, Wallet, Settings,
    UserCircle, AlertTriangle, RefreshCw, Users, X, ChevronDown, Table as TableIcon,
    PieChart as PieChartIcon, BookOpen, Briefcase, PlusCircle, Filter, DollarSign,
    CheckCircle, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- CONFIGURATION & TYPES ---
const ITEMS_PER_PAGE = 15;
type Tab = 'dashboard' | 'analytics' | 'activity';
type ActivityLog = { id: number; timestamp: Date; icon: React.ElementType; color: string; message: string; };

// --- REUSABLE COMPONENTS & HELPERS ---
const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value == null) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `KES ${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; iconBgClass: string; }> = ({ title, value, icon: Icon, iconBgClass }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgClass}`}><Icon className="w-6 h-6 text-white" /></div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
);
const TabButton: React.FC<{ text: string; icon: React.ElementType; isActive: boolean; onClick: () => void; }> = ({ text, icon: Icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Icon size={16}/>{text}</button> );
const HeaderCell: React.FC<{ icon: React.ElementType, text: string, className?: string }> = ({ icon: Icon, text, className = "" }) => (
    <th scope="col" className={`p-4 text-left text-xs font-semibold uppercase tracking-wider ${className}`}>
        <div className="flex items-center space-x-2"><Icon className="inline-block h-4 w-4" /><span>{text}</span></div>
    </th>
);
const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => (
    <tr>{Array.from({ length: columns }).map((_, idx) => ( <td key={idx} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td> ))}</tr>
);

const MyCases = () => {
    // --- STATE & HOOKS ---
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id ?? 0;
    const userRole = user?.role ?? 'client';

    const isClientOrUserRole = userRole === 'client' || userRole === 'user';
    const clientCasesQuery = caseAndPaymentAPI.useGetCasesByClientOwnerQuery({ userId, includeAssignees: true }, { skip: !userId || !isClientOrUserRole, refetchOnMountOrArgChange: true });
    const staffCasesQuery = caseAndPaymentAPI.useGetCasesByAssignedStaffQuery(userId, { skip: !userId || isClientOrUserRole, refetchOnMountOrArgChange: true });
    const { data: caseData, isLoading, error: rawCaseError, refetch } = isClientOrUserRole ? clientCasesQuery : staffCasesQuery;
    const errorStatus = (rawCaseError && typeof rawCaseError === 'object' && 'status' in rawCaseError) ? (rawCaseError as { status: number }).status : undefined;
    const [updateCase] = caseAndPaymentAPI.useUpdateCaseMutation();

    const [cases, setCases] = useState<CaseDataTypes[]>([]);
    const [filter, setFilter] = useState({ subject: '', description: '', status: '' });
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editCase, setEditCase] = useState<CaseDataTypes | null>(null);
    const [caseToDelete, setCaseToDelete] = useState<CaseDataTypes | null>(null);
    const [selectedCase, setSelectedCase] = useState<CaseDataTypes | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [caseForPayment, setCaseForPayment] = useState<CaseDataTypes | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false));
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // --- EFFECTS ---
    useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (errorStatus === 404) setCases([]);
        else if (Array.isArray(caseData)) setCases(caseData);
        else if (!isLoading && !rawCaseError) setCases([]);
    }, [caseData, isLoading, rawCaseError, errorStatus]);

    // --- DATA & DERIVED STATE ---
    const filteredCases = useMemo(() => {
        if (!Array.isArray(cases)) return [];
        return cases.filter(caseItem => {
            const matchesCaseNumber = caseItem.case_number.toLowerCase().includes(filter.subject.toLowerCase());
            const clientName = caseItem.owner?.full_name?.toLowerCase() || '';
            const assignedStaffNames = caseItem.assignees?.map(a => a.assignee?.full_name?.toLowerCase() || '').join(' ') || '';
            const matchesDescriptionOrParty = (caseItem.case_description?.toLowerCase().includes(filter.description.toLowerCase())) || (clientName.includes(filter.description.toLowerCase())) || (assignedStaffNames.includes(filter.description.toLowerCase()));
            const matchesStatus = filter.status ? caseItem.case_status.toLowerCase() === filter.status.toLowerCase() : true;
            return matchesCaseNumber && matchesDescriptionOrParty && matchesStatus;
        });
    }, [cases, filter]);

    const paginatedCases = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCases, currentPage]);
    
    const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);

    const analyticsData = useMemo(() => {
        const totalCases = cases.length;
        const statusCounts = cases.reduce((acc, c) => {
            const status = c.case_status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value}));
        
        const totalFeesBilled = cases.reduce((sum, c) => sum + Number(c.fee || 0), 0);
        const outstandingBalance = cases.reduce((sum, c) => sum + Number(c.payment_balance || 0), 0);

        return { totalCases, statusCounts, statusPieData, totalFeesBilled, outstandingBalance };
    }, [cases]);

    // --- HANDLERS ---
    const addActivityLog = (icon: React.ElementType, color: string, message: string) => {
        setActivityLogs(prev => [{ id: Date.now(), timestamp: new Date(), icon, color, message }, ...prev].slice(0, 100));
    };
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleFilterChange = (field: keyof typeof filter, value: string) => { setFilter(prev => ({...prev, [field]: value})); setCurrentPage(1); };
    const resetFilters = () => { setFilter({ subject: '', description: '', status: '' }); setCurrentPage(1); };
    const handleClearFilter = (filterName: keyof typeof filter) => { setFilter(prev => ({...prev, [filterName]: ''})); setCurrentPage(1); };

    const handleReopenCase = async (caseItem: CaseDataTypes) => {
        try {
            await updateCase({ case_id: caseItem.case_id, case_status: 'open' as CaseStatus }).unwrap();
            refetch();
            toast.success('Case reopened successfully!');
            addActivityLog(RefreshCw, 'text-blue-500', `Case #${caseItem.case_id} reopened.`);
        } catch (error) { toast.error('Failed to reopen case.'); }
    };
    
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const handleOpenEditModal = (caseItem: CaseDataTypes) => { setEditCase(caseItem); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditCase(null); };
    const handleOpenDeleteModal = (caseItem: CaseDataTypes) => { setCaseToDelete(caseItem); setIsDeleteModalOpen(true); };
    const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setCaseToDelete(null); };
    const openViewModal = (caseItem: CaseDataTypes) => { setSelectedCase(caseItem); setIsViewModalOpen(true); };
    const closeViewModal = () => { setIsViewModalOpen(false); setSelectedCase(null); };
    const openPaymentModal = (caseItem: CaseDataTypes) => { setCaseForPayment(caseItem); setIsPaymentModalOpen(true); };
    const closePaymentModal = () => { setIsPaymentModalOpen(false); setCaseForPayment(null); };
    const handlePaymentSuccess = () => { refetch(); closePaymentModal(); toast.success('Payment successful! Case status updated.'); addActivityLog(CheckCircle, 'text-green-500', `Payment made for case #${caseForPayment?.case_id}.`);};
    const handlePaymentFailure = () => { toast.error('Payment failed. Please try again.'); };

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
        link.setAttribute('download', 'my_cases_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Case data exported to CSV.");
    };

    // --- RENDER LOGIC ---
    const renderDashboardTab = () => (
        <>
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Case Number</label><div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="text" placeholder="Case Number..." value={filter.subject} onChange={(e) => handleFilterChange('subject', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filter.subject && (<button type="button" onClick={() => handleClearFilter('subject')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div></div>
                    <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Description/Party</label><div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/><input type="text" placeholder="Description / Client / Staff..." value={filter.description} onChange={(e) => handleFilterChange('description', e.target.value)} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />{filter.description && (<button type="button" onClick={() => handleClearFilter('description')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}</div></div>
                    <div ref={statusDropdownRef} className="relative">
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Status</label>
                        <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}>
                            <span className={`truncate font-semibold ${!filter.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filter.status ? filter.status.charAt(0).toUpperCase() + filter.status.slice(1).replace('_', ' ') : 'All Statuses'}</span>
                            <div className="flex items-center">
                                {filter.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('status'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        <AnimatePresence>
                            {isStatusDropdownOpen && (
                                <motion.ul initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', ''); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>
                                    {['open', 'in_progress', 'closed', 'on_hold', 'resolved'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { handleFilterChange('status', status); setIsStatusDropdownOpen(false); }}>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</button></li>))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    <button onClick={resetFilters} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"><Filter size={16}/> Reset</button>
                </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 styled-scrollbar">
                <table className="min-w-full leading-normal">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <HeaderCell icon={Fingerprint} text="Case ID" className="whitespace-nowrap" />
                            <HeaderCell icon={Tag} text="Status" />
                            <HeaderCell icon={Barcode} text="Case Number" className="whitespace-nowrap" />
                            {!isClientOrUserRole && <HeaderCell icon={UserCircle} text="Client Name" className="whitespace-nowrap" />}
                            {isClientOrUserRole && <HeaderCell icon={Users} text="Assigned Staff" className="whitespace-nowrap" />}
                            <HeaderCell icon={FileDigit} text="Total Fees" className="whitespace-nowrap" />
                            <HeaderCell icon={ClipboardCheck} text="Payment Status" className="whitespace-nowrap" />
                            <HeaderCell icon={Wallet} text="Balance" />
                            <HeaderCell icon={Settings} text="Actions" className="text-center justify-center whitespace-nowrap" />
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 dark:text-slate-300 text-sm">
                        {isLoading && [1,2,3,4,5].map(i => <SkeletonRow key={i} columns={8} />)}
                        {!isLoading && paginatedCases.length === 0 && (<tr><td colSpan={8} className="text-center p-8"><Search className="mx-auto h-12 w-12 text-slate-400 mb-4" /><h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">No Cases Found</h3><p className="text-sm text-slate-500 mt-1">No cases match your current filters.</p></td></tr>)}
                        {!isLoading && paginatedCases.map((caseItem) => (
                             <tr key={caseItem.case_id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
                                <td className="px-5 py-4 text-sm whitespace-nowrap"><p className="font-medium text-slate-800 dark:text-slate-100">{caseItem.case_id}</p></td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap"><span className={`px-3 py-1.5 text-xs font-semibold leading-tight rounded-full ${caseItem.case_status === 'open' ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-600/30' : caseItem.case_status === 'closed' ? 'text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-600/30' : 'text-slate-700 bg-slate-100 dark:text-slate-200 dark:bg-slate-600/30'}`}>{caseItem.case_status.charAt(0).toUpperCase() + caseItem.case_status.slice(1)}</span></td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.case_number}</td>
                                {!isClientOrUserRole && <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.owner?.full_name || 'N/A'}</td>}
                                {isClientOrUserRole && <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.assignees && caseItem.assignees.length > 0 ? caseItem.assignees.map(a => a.assignee?.full_name || 'Unassigned').join(', ') : 'Not Assigned'}</td>}
                                <td className="px-5 py-4 text-sm whitespace-nowrap">Ksh {parseFloat(caseItem.fee).toFixed(2)}</td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.payment_status}</td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">Ksh {parseFloat(caseItem.payment_balance).toFixed(2)}</td>
                                <td className="px-5 py-4 text-sm whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-sky-500 hover:bg-sky-600 text-white" onClick={() => openViewModal(caseItem)} title="View Details"><Eye className="mr-1.5 h-3.5 w-3.5" /> View</button>
                                        {caseItem.case_status === 'closed' && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleReopenCase(caseItem)} title="Reopen Case"><Wind className="mr-1.5 h-3.5 w-3.5" /> Reopen</button> )}
                                        {!isClientOrUserRole && caseItem.case_status !== 'closed' && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleOpenEditModal(caseItem)} title="Edit Case"><FilePenLine className="mr-1.5 h-3.5 w-3.5" /> Edit</button> )}
                                        {isClientOrUserRole && caseItem.payment_status !== 'paid' && parseFloat(caseItem.payment_balance) > 0 && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-purple-500 hover:bg-purple-600 text-white" onClick={() => openPaymentModal(caseItem)} title="Make Payment"><Banknote className="mr-1.5 h-3.5 w-3.5" /> Pay</button> )}
                                        {!isClientOrUserRole && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-red-500 hover:bg-red-600 text-white" onClick={() => handleOpenDeleteModal(caseItem)} title="Delete Case"><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</button> )}
                                    </div>
                                </td>
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
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">My Case Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="My Total Cases" value={analyticsData.totalCases} icon={Briefcase} iconBgClass="bg-blue-500" />
                    <SummaryCard title="Total Fees Billed" value={formatCurrency(analyticsData.totalFeesBilled)} icon={DollarSign} iconBgClass="bg-green-500" />
                    <SummaryCard title="My Outstanding Balance" value={formatCurrency(analyticsData.outstandingBalance)} icon={AlertTriangle} iconBgClass="bg-red-500" />
                    <SummaryCard title="Open/In Progress" value={(analyticsData.statusCounts['open'] || 0) + (analyticsData.statusCounts['in_progress'] || 0)} icon={RefreshCw} iconBgClass="bg-sky-500" />
                </div>
            </div>
             <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Case Status Distribution</h3>
                <div style={{ height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }} />
                            <Legend />
                            <Pie data={analyticsData.statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>{analyticsData.statusPieData.map((_, index) => <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'][index % 5]} />)}</Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderActivityLogTab = () => (
        <div>
             <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">My Case Activity</h3>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-4">
                {activityLogs.map(log => { const Icon = log.icon; return (<div key={log.id} className="flex items-start gap-3"><Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${log.color}`} /><div><p className="text-sm text-slate-700 dark:text-slate-200">{log.message}</p><p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p></div></div>);})}
                 {activityLogs.length === 0 && <p className="text-center text-slate-500 p-4">No activity recorded yet.</p>}
            </div>
        </div>
    );
    
    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
            <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-2 sm:p-4 lg:p-8 transition-colors duration-300 font-sans`}>
                <div className="max-w-screen-2xl mx-auto">
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">My Cases</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your {isClientOrUserRole ? 'personal' : 'assigned'} cases efficiently.</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <button onClick={handleExportCSV} disabled={filteredCases.length === 0} className="font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Download size={16} /> <span className="hidden sm:inline">Export CSV</span></button>
                            {!isClientOrUserRole && (<button onClick={openCreateModal} className="font-semibold py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2"><PlusCircle size={18} /> <span className="hidden sm:inline">New Case</span></button>)}
                            <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Toggle theme">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                            <button onClick={() => refetch()} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Refresh Data"><RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} /></button>
                        </div>
                    </header>
                    
                    <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                        <TabButton text="Dashboard" icon={TableIcon} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <TabButton text="Analytics" icon={PieChartIcon} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                        <TabButton text="Activity Log" icon={BookOpen} isActive={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                    </div>

                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 rounded-2xl shadow-xl p-6 sm:p-8 h-full">
                        {rawCaseError && errorStatus !== 404 ? (
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
            
            {isCreateModalOpen && !isClientOrUserRole && <CreateCaseModal isOpen={isCreateModalOpen} onClose={closeCreateModal} isDarkMode={isDarkMode} />}
            {isEditModalOpen && editCase && <EditCaseForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} caseItem={editCase} isDarkMode={isDarkMode} />}
            {isDeleteModalOpen && caseToDelete && <DeleteCaseForm isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} caseItem={caseToDelete} refetch={refetch} isDarkMode={isDarkMode} />}
            {isViewModalOpen && selectedCase && <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeViewModal} isDarkMode={isDarkMode} />}
            {caseForPayment && <SingleCaseMpesaPayment caseId={caseForPayment.case_id} userId={caseForPayment.user_id} fee={parseFloat(caseForPayment.fee)} isOpen={isPaymentModalOpen} onClose={closePaymentModal} onPaymentSuccess={handlePaymentSuccess} onPaymentFailure={handlePaymentFailure} />}
        </>
    );
};

export default MyCases;