// MyCases.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import {
    caseAndPaymentAPI,
    CaseDataTypes,
    CaseStatus,
} from "../../../../features/case/caseAPI";
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import CreateCaseForm from '../../main/Managecases/createcase';
import EditCaseForm from '../../main/Managecases/updatecase';
import DeleteCaseForm from '../../main/Managecases/deletecase';
import ViewCaseDetailsModal from './viewsinglecasedetails';
import SingleCaseMpesaPayment from '../Payments/Payments';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    FilePenLine, Wind, Plus, Search, Trash2, Eye, Banknote, Sun, Moon,
    Fingerprint, Tag, Barcode, FileDigit, ClipboardCheck, Wallet, Settings,
    UserCircle, AlertTriangle, RefreshCw, Users, X, ChevronDown
} from 'lucide-react';

// HeaderCell component for table headers
const HeaderCell = ({ icon: Icon, text, className = "" }: { icon: React.ElementType, text: string, className?: string }) => (
    <th scope="col" className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${className}`}>
        <div className="flex items-center space-x-2"><Icon className="inline-block h-4 w-4" /><span>{text}</span></div>
    </th>
);

// SkeletonRow component for loading state
const SkeletonRow = ({ columns }: { columns: number }) => (
    <tr>{Array.from({ length: columns }).map((_, idx) => ( <td key={idx} className="px-5 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td> ))}</tr>
);

const MyCases = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id ?? 0;
    const userRole = user?.role ?? 'client';
    const userFullName = user?.full_name || "User";
    const userProfilePicture = user?.profile_picture || null;

    const [isProfileImgError, setIsProfileImgError] = useState(false);
    const isClientOrUserRole = userRole === 'client' || userRole === 'user';

    const clientCasesQuery = caseAndPaymentAPI.useGetCasesByClientOwnerQuery({ userId, includeAssignees: true }, { skip: !userId || !isClientOrUserRole, refetchOnMountOrArgChange: true });
    const staffCasesQuery = caseAndPaymentAPI.useGetCasesByAssignedStaffQuery(userId, { skip: !userId || isClientOrUserRole, refetchOnMountOrArgChange: true });

    const { data: caseData, isLoading: caseLoading, error: rawCaseError, refetch } = isClientOrUserRole ? clientCasesQuery : staffCasesQuery;
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
    const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false));
    
    // --- Dropdown State & Refs ---
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    useEffect(() => { setIsProfileImgError(false); }, [userProfilePicture]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const handleOpenEditModal = (caseItem: CaseDataTypes) => { setEditCase(caseItem); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditCase(null); };
    const handleOpenDeleteModal = (caseItem: CaseDataTypes) => { setCaseToDelete(caseItem); setIsDeleteModalOpen(true); };
    const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setCaseToDelete(null); };

    const handleReopenCase = async (caseItem: CaseDataTypes) => {
        if (!isClientOrUserRole || (isClientOrUserRole && caseItem.user_id === userId)) {
            try {
                await updateCase({ case_id: caseItem.case_id, case_status: 'open' as CaseStatus }).unwrap();
                refetch();
                toast.success('Case reopened successfully!');
            } catch (error) { toast.error('Failed to reopen case.'); }
        } else { toast.info("You do not have permission to reopen this case."); }
    };

    useEffect(() => {
        if (errorStatus === 404) setCases([]);
        else if (Array.isArray(caseData)) setCases(caseData);
        else if (!caseLoading && !caseErrorExists) setCases([]);
    }, [caseData, caseLoading, caseErrorExists, errorStatus]);

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

    const resetFilters = () => setFilter({ subject: '', description: '', status: '' });
    const handleClearFilter = (filterName: keyof typeof filter) => setFilter(prev => ({...prev, [filterName]: ''}));

    const openViewModal = useCallback((caseItem: CaseDataTypes) => { setSelectedCase(caseItem); setIsViewModalOpen(true); }, []);
    const closeViewModal = useCallback(() => { setIsViewModalOpen(false); setSelectedCase(null); }, []);
    const openPaymentModal = useCallback((caseItem: CaseDataTypes) => { setCaseForPayment(caseItem); setIsPaymentModalOpen(true); }, []);
    const closePaymentModal = useCallback(() => { setIsPaymentModalOpen(false); setCaseForPayment(null); }, []);
    const handlePaymentSuccess = useCallback(() => { refetch(); closePaymentModal(); toast.success('Payment successful! Case status updated.'); }, [refetch, closePaymentModal]);
    const handlePaymentFailure = useCallback(() => { toast.error('Payment failed. Please try again.'); }, []);

    const UserProfileIcon = () => {
        if (userProfilePicture && !isProfileImgError) return <img src={userProfilePicture} alt={`${userFullName}'s profile`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/50 shadow-sm" onError={() => setIsProfileImgError(true)} />;
        const initials = userFullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
        return <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-400 dark:bg-indigo-400 flex items-center justify-center text-white text-lg sm:text-xl font-semibold shadow-sm border-2 border-white/50">{initials !== '?' ? initials : <UserCircle size={20} />}</div>;
    };

    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    const renderTableContent = () => {
        const tableHeaders = ( <thead className="bg-indigo-600 dark:bg-indigo-800 text-white border-b-2 border-indigo-400 dark:border-indigo-700"><tr><HeaderCell icon={Fingerprint} text="Case ID" className="border-r border-indigo-500 dark:border-indigo-700"/><HeaderCell icon={Tag} text="Status" className="border-r border-indigo-500 dark:border-indigo-700"/><HeaderCell icon={Barcode} text="Case Number" className="border-r border-indigo-500 dark:border-indigo-700"/>{!isClientOrUserRole && <HeaderCell icon={UserCircle} text="Client Name" className="border-r border-indigo-500 dark:border-indigo-700"/>}{isClientOrUserRole && <HeaderCell icon={Users} text="Assigned Staff" className="border-r border-indigo-500 dark:border-indigo-700"/>}<HeaderCell icon={FileDigit} text="Total Fees" className="border-r border-indigo-500 dark:border-indigo-700"/><HeaderCell icon={ClipboardCheck} text="Payment Status" className="border-r border-indigo-500 dark:border-indigo-700"/><HeaderCell icon={Wallet} text="Balance" className="border-r border-indigo-500 dark:border-indigo-700"/><HeaderCell icon={Settings} text="Actions" className="text-center justify-center"/></tr></thead> );
        const noCasesForUserMessage = ( <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-b-lg"><Wind className="mx-auto text-5xl text-slate-400 dark:text-slate-500 mb-4" /><h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No Cases Found</h3><p className="text-slate-500 dark:text-slate-400 mb-6">You currently have no cases associated with your account.</p></div> );

        if (caseLoading) return ( <div className="overflow-x-auto"><table className="min-w-full leading-normal">{tableHeaders}<tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={8} />)}</tbody></table></div> );
        if (caseErrorExists) { if (errorStatus === 404) return noCasesForUserMessage; return ( <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-700 rounded-b-lg"><AlertTriangle className="mx-auto text-5xl text-red-400 dark:text-red-500 mb-4" /><h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Oops! Something went wrong.</h3><p className="text-red-600 dark:text-red-400 mb-4">We couldn't load your cases. (Error: {errorStatus || 'Unknown'}).</p><button onClick={() => refetch()} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md shadow-sm flex items-center mx-auto"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</button></div> ); }
        if ((!Array.isArray(caseData) || caseData.length === 0) && !caseLoading && !caseErrorExists) return noCasesForUserMessage;
        if (filteredCases.length === 0) return ( <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-b-lg"><Search className="mx-auto text-5xl text-slate-400 dark:text-slate-500 mb-4" /><h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No Matching Cases</h3><p className="text-slate-500 dark:text-slate-400 mb-6">No cases match your current filter criteria.</p><button onClick={resetFilters} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Reset Filters</button></div> );

        return (
            <div className="overflow-x-auto shadow-sm rounded-b-lg"><table className="min-w-full leading-normal">{tableHeaders}<tbody className="text-slate-700 dark:text-slate-300">{filteredCases.map((caseItem, index) => ( <tr key={caseItem.case_id} className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/60'}`}><td className="px-5 py-4 text-sm whitespace-nowrap"><p className="font-medium text-slate-800 dark:text-slate-100">{caseItem.case_id}</p></td><td className="px-5 py-4 text-sm whitespace-nowrap"><span className={`px-3 py-1.5 text-xs font-semibold leading-tight rounded-full ${caseItem.case_status === 'open' ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-600/30' : caseItem.case_status === 'closed' ? 'text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-600/30' : 'text-slate-700 bg-slate-100 dark:text-slate-200 dark:bg-slate-600/30'}`}>{caseItem.case_status.charAt(0).toUpperCase() + caseItem.case_status.slice(1)}</span></td><td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.case_number}</td>{!isClientOrUserRole && <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.owner?.full_name || 'N/A'}</td>}{isClientOrUserRole && <td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.assignees && caseItem.assignees.length > 0 ? caseItem.assignees.map(a => a.assignee?.full_name || 'Unassigned').join(', ') : 'Not Assigned'}</td>}<td className="px-5 py-4 text-sm whitespace-nowrap">Ksh {parseFloat(caseItem.fee).toFixed(2)}</td><td className="px-5 py-4 text-sm whitespace-nowrap">{caseItem.payment_status}</td><td className="px-5 py-4 text-sm whitespace-nowrap">Ksh {parseFloat(caseItem.payment_balance).toFixed(2)}</td><td className="px-5 py-4 text-sm whitespace-nowrap"><div className="flex items-center space-x-2"><button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-sky-500 hover:bg-sky-600 text-white" onClick={() => openViewModal(caseItem)} title="View Details"><Eye className="mr-1.5 h-3.5 w-3.5" /> View</button>{caseItem.case_status === 'closed' && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleReopenCase(caseItem)} title="Reopen Case"><Wind className="mr-1.5 h-3.5 w-3.5" /> Reopen</button> )}{!isClientOrUserRole && caseItem.case_status !== 'closed' && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleOpenEditModal(caseItem)} title="Edit Case"><FilePenLine className="mr-1.5 h-3.5 w-3.5" /> Edit</button> )}{isClientOrUserRole && caseItem.payment_status !== 'paid' && parseFloat(caseItem.payment_balance) > 0 && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-purple-500 hover:bg-purple-600 text-white" onClick={() => openPaymentModal(caseItem)} title="Make Payment"><Banknote className="mr-1.5 h-3.5 w-3.5" /> Pay</button> )}{!isClientOrUserRole && ( <button className="flex items-center text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md bg-red-500 hover:bg-red-600 text-white" onClick={() => handleOpenDeleteModal(caseItem)} title="Delete Case"><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</button> )}</div></td></tr> ))}</tbody></table></div>
        );
    };

    return (
        <>
            <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
            <div className={`bg-slate-100 dark:bg-slate-900 min-h-screen py-6 sm:py-8 font-sans transition-colors duration-300`}>
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
                        <header className="bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 dark:from-purple-700 dark:via-indigo-700 dark:to-sky-600 py-6 px-6 sm:px-8 text-white flex flex-col sm:flex-row justify-between items-center">
                            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0"><UserProfileIcon /><div><h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{userFullName}'s Cases</h1><p className="text-sm sm:text-base text-purple-100 dark:text-indigo-200 opacity-90">Manage and track your {isClientOrUserRole ? 'personal' : 'assigned'} cases efficiently.</p></div></div>
                            <div className="flex items-center space-x-3"><button onClick={toggleDarkMode} className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10" title="Toggle dark mode">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>{!isClientOrUserRole && ( <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center" onClick={openCreateModal}><Plus className="mr-2 h-4 w-4" /> New Case</button> )}</div>
                        </header>

                        <div className="p-4 sm:p-6">
                            <div className="mb-6 p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 sm:mb-0">Filter Cases</h3>
                                    <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium" onClick={resetFilters}>Reset Filters</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                        <input type="text" placeholder="Case Number..." value={filter.subject} onChange={(e) => setFilter({ ...filter, subject: e.target.value })} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />
                                        {filter.subject && (<button type="button" onClick={() => handleClearFilter('subject')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                        <input type="text" placeholder="Description / Client / Staff..." value={filter.description} onChange={(e) => setFilter({ ...filter, description: e.target.value })} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />
                                        {filter.description && (<button type="button" onClick={() => handleClearFilter('description')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}
                                    </div>
                                    <div ref={statusDropdownRef} className="relative">
                                        <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}>
                                            <span className={`truncate font-semibold ${!filter.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filter.status ? filter.status.charAt(0).toUpperCase() + filter.status.slice(1).replace('_', ' ') : 'All Statuses'}</span>
                                            <div className="flex items-center">
                                                {filter.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('status'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {isStatusDropdownOpen && (
                                                <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                    <li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilter(f => ({...f, status: ''})); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>
                                                    {['open', 'in_progress', 'closed', 'on_hold', 'resolved'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilter(f => ({...f, status})); setIsStatusDropdownOpen(false); }}>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</button></li>))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                            {renderTableContent()}
                        </div>

                        {isCreateModalOpen && !isClientOrUserRole && <CreateCaseForm isOpen={isCreateModalOpen} onClose={closeCreateModal} isDarkMode={isDarkMode} />}
                        {isEditModalOpen && editCase && <EditCaseForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} caseItem={editCase} isDarkMode={isDarkMode} />}
                        {isDeleteModalOpen && caseToDelete && <DeleteCaseForm isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} caseItem={caseToDelete} refetch={refetch} isDarkMode={isDarkMode} />}
                        {isViewModalOpen && selectedCase && <ViewCaseDetailsModal selectedCase={selectedCase} closeModal={closeViewModal} isDarkMode={isDarkMode} />}
                        {caseForPayment && <SingleCaseMpesaPayment caseId={caseForPayment.case_id} userId={caseForPayment.user_id} fee={parseFloat(caseForPayment.fee)} isOpen={isPaymentModalOpen} onClose={closePaymentModal} onPaymentSuccess={handlePaymentSuccess} onPaymentFailure={handlePaymentFailure} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyCases;