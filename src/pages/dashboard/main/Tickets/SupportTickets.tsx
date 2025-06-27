import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    Ticket, CheckCircle, User, Mail, FileText, RefreshCw, X, Phone, Heading, BadgeInfo,
    Home, Users, Loader2, AlertTriangle, Info, Sun, Moon, Search, ChevronDown, Settings, Clock
} from "lucide-react";

// Helper for styling toast notifications
const getToastStyles = (type: 'success' | 'error' | 'loading' | null) => {
    switch (type) {
        case 'success': return 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700';
        case 'error': return 'bg-red-500 dark:bg-red-600 border-red-600 dark:border-red-700';
        case 'loading': return 'bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-700';
        default: return 'bg-gray-700 dark:bg-gray-600 border-gray-800 dark:border-gray-500';
    }
};

const AllTicket = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) : false));
    useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); if (typeof window !== 'undefined') localStorage.theme = isDarkMode ? 'dark' : 'light'; }, [isDarkMode]);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const [tickets, setTickets] = useState<TypeTickets[]>([]);
    const { data: allUserTickets, isError, isLoading, refetch } = TicketAPI.useGetTicketsQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 300000 });
    const [updateTicket] = TicketAPI.useUpdateTicketMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const user_id = user?.user_id;
    const [addLog] = logAPI.useCreateLogMutation();

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | 'loading' | null>(null);
    const [loadingTicketId, setLoadingTicketId] = useState<number | null>(null);
    const [filters, setFilters] = useState({ full_name: '', email: '', subject: '', status: '' });
    
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if (allUserTickets) setTickets(allUserTickets); }, [allUserTickets]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'loading', duration: number = 3000) => {
        setToastMessage(message);
        setToastType(type);
        if (type !== 'loading') { const timer = setTimeout(() => { setToastMessage(null); setToastType(null); }, duration); return () => clearTimeout(timer); }
    }, []);

    useEffect(() => { if (isError && allUserTickets && allUserTickets.length > 0 && !isLoading) showToast('⚠️ Could not refresh ticket data.', 'error', 5000); }, [isError, allUserTickets, isLoading, showToast]);

    const handleUpdateStatus = useCallback(async (ticket_id: number, status: string) => {
        if (!user_id) { showToast('User not identified. Cannot update ticket.', 'error'); return; }
        setLoadingTicketId(ticket_id);
        showToast(`Updating ticket #${ticket_id}...`, 'loading');
        try {
            await updateTicket({ ticket_id, status }).unwrap();
            await addLog({ user_id, action: `Ticket ${ticket_id} status updated to ${status}` }).unwrap();
            showToast(`Ticket #${ticket_id} status updated successfully!`, 'success');
        } catch (err) {
            showToast(`Failed to update ticket #${ticket_id}.`, 'error');
        } finally {
            setLoadingTicketId(null);
            if (toastType === 'loading') { setToastMessage(null); setToastType(null); }
        }
    }, [updateTicket, addLog, user_id, showToast, toastType]);

    const filteredTickets = useMemo(() => tickets.filter((ticket) => {
        const fullNameMatch = filters.full_name ? ticket.creator.full_name.toLowerCase().includes(filters.full_name.toLowerCase()) : true;
        const emailMatch = filters.email ? ticket.creator.email.toLowerCase().includes(filters.email.toLowerCase()) : true;
        const subjectMatch = filters.subject ? ticket.subject.toLowerCase().includes(filters.subject.toLowerCase()) : true;
        const statusMatch = filters.status ? ticket.status.toLowerCase() === filters.status.toLowerCase() : true;
        return fullNameMatch && emailMatch && subjectMatch && statusMatch;
    }), [tickets, filters]);

    const resetFilters = useCallback(() => { setFilters({ full_name: '', email: '', subject: '', status: '' }); showToast('Filters have been reset.', 'success', 1500); }, [showToast]);
    const handleClearFilter = (filterName: keyof typeof filters) => setFilters(prev => ({...prev, [filterName]: ''}));
    const formatDate = useCallback((dateString: string) => new Date(dateString).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), []);

    if (isLoading && !allUserTickets) return ( <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900"><button onClick={toggleDarkMode} title="Toggle dark mode" className="absolute top-6 right-6 p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button><AnimatedLoader /><p className="mt-4 text-xl text-slate-600 dark:text-slate-300">Loading Tickets...</p></div> );
    
    const openTickets = filteredTickets.filter(ticket => ticket.status === 'Open');
    const closedTickets = filteredTickets.filter(ticket => ticket.status === 'Closed');
    
    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };
    
    const renderTicketRow = (ticket: TypeTickets, isOpenTicket: boolean) => (
        <tr key={ticket.ticket_id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <td className="px-5 py-4 whitespace-nowrap"><div className="flex items-center text-sm"><BadgeInfo className={`mr-2 h-4 w-4 ${isOpenTicket ? 'text-blue-500' : 'text-green-500'}`} />{ticket.ticket_id}</div></td>
            <td className="px-5 py-4 whitespace-nowrap"><div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"><Heading className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" /><span className="truncate" title={ticket.subject}>{ticket.subject}</span></div></td>
            <td className="px-5 py-4 max-w-xs"><div title={ticket.description} className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{ticket.description}</div></td>
            <td className="px-5 py-4 whitespace-nowrap"><div className="text-sm text-gray-800 dark:text-gray-200">{ticket.creator.full_name}</div></td>
            <td className="px-5 py-4 whitespace-nowrap"><a href={`mailto:${ticket.creator.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"><Mail className="mr-1.5 h-4 w-4" /><span className="truncate" title={ticket.creator.email}>{ticket.creator.email}</span></a></td>
            <td className="px-5 py-4 whitespace-nowrap">{ticket.creator.phone_number ? <a href={`tel:${ticket.creator.phone_number}`} className="text-sm text-gray-700 dark:text-gray-300 hover:underline flex items-center"><Phone className="mr-1.5 h-4 w-4" /> {ticket.creator.phone_number}</a> : <span className="text-sm text-gray-400 dark:text-gray-500 italic">N/A</span>}</td>
            <td className="px-5 py-4 whitespace-nowrap"><span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(ticket.updated_at)}</span></td>
            <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                {isOpenTicket ? <button className="flex items-center px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50" onClick={() => handleUpdateStatus(ticket.ticket_id, 'Closed')} disabled={loadingTicketId === ticket.ticket_id} title="Close this ticket">{loadingTicketId === ticket.ticket_id ? <Loader2 className="animate-spin mr-1.5 h-4 w-4" /> : <CheckCircle className="mr-1.5 h-4 w-4" />}Close</button> : <button onClick={() => handleUpdateStatus(ticket.ticket_id, 'Open')} className="flex items-center px-3 py-2 text-xs font-medium text-gray-800 bg-yellow-400 rounded-md hover:bg-yellow-500 disabled:opacity-50" disabled={loadingTicketId === ticket.ticket_id} title="Reopen this ticket">{loadingTicketId === ticket.ticket_id ? <Loader2 className="animate-spin mr-1.5 h-4 w-4" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Reopen</button>}
            </td>
        </tr>
    );
    
    const tableHeaders = [{icon: BadgeInfo, text: "ID"}, {icon: Heading, text: "Subject"}, {icon: FileText, text: "Message"}, {icon: User, text: "Full Name"}, {icon: Mail, text: "Email"}, {icon: Phone, text: "Phone"}, {icon: Clock, text: "Last Updated"}, {icon: Settings, text: "Action"}];
    const renderTableHeader = () => (
        <thead className="bg-blue-600 dark:bg-blue-700 text-white sticky top-0 z-10">
            <tr>
                {tableHeaders.map(header => (
                    <th key={header.text} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                        <div className="flex items-center"><header.icon className="mr-2 h-4 w-4" />{header.text}</div>
                    </th>
                ))}
            </tr>
        </thead>
    );

    return (
        <div className="p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen text-gray-800 dark:text-gray-200">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Ticket Management</h1>
                    <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2" aria-label="Breadcrumb"><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center"><Home className="mr-1.5 h-4 w-4" />Dashboard</Link><span>/</span><Link to="/dashboard/settings" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center"><Users className="mr-1.5 h-4 w-4" />Admin</Link><span>/</span><span className="text-slate-700 dark:text-slate-300 flex items-center"><Ticket className="mr-1.5 h-4 w-4" />All Tickets</span></nav>
                </div>
                <button onClick={toggleDarkMode} title="Toggle dark mode" className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            </header>

            {toastMessage && <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl text-white text-sm font-medium border ${getToastStyles(toastType)} flex items-center`} role="alert">{toastType === 'loading' ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : toastType === 'success' ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertTriangle className="mr-2 h-5 w-5" />} {toastMessage}</div>}
            
            <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    {[{ key: 'full_name', placeholder: 'Filter by Full Name...' }, { key: 'email', placeholder: 'Filter by Email...' }, { key: 'subject', placeholder: 'Filter by Subject...' }].map(f => (
                        <div key={f.key} className="relative lg:col-span-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                            <input type="text" placeholder={f.placeholder} value={filters[f.key as keyof typeof filters]} onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />
                            {filters[f.key as keyof typeof filters] && (<button type="button" onClick={() => handleClearFilter(f.key as keyof typeof filters)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}
                        </div>
                    ))}
                    <div ref={statusDropdownRef} className="relative lg:col-span-1">
                        <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}>
                            <span className={`truncate font-semibold ${!filters.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filters.status || 'All Statuses'}</span>
                            <div className="flex items-center">
                                {filters.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('status'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        <AnimatePresence>{isStatusDropdownOpen && (<motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"><li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilters(f => ({...f, status: ''})); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>{['Open', 'Closed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilters(f => ({...f, status})); setIsStatusDropdownOpen(false); }}>{status}</button></li>))}</motion.ul>)}</AnimatePresence>
                    </div>
                    <button onClick={resetFilters} title="Reset all filters" className="flex items-center justify-center w-full lg:w-auto px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"> <X className="mr-2 h-4 w-4" />Reset Filters</button>
                </div>
            </div>

            {isError && !allUserTickets && !isLoading ? ( <div className="my-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-center"><AlertTriangle className="text-5xl mx-auto mb-4 text-red-500" /><h3 className="text-xl font-semibold mb-2">Error Loading Tickets</h3><p className="text-md text-gray-600 dark:text-gray-400 mb-4">We encountered an issue while trying to fetch ticket data.</p><button onClick={() => refetch()} className="inline-flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"><RefreshCw className="inline mr-2" /> Retry</button></div> ) : (
                <>
                    <section className="mb-8"><h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400 flex items-center"><Ticket className="mr-3 h-7 w-7" /> Open Tickets ({isLoading ? <Loader2 className="animate-spin ml-2" /> : openTickets.length})</h2>{openTickets.length > 0 || isLoading ? <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">{renderTableHeader()}{!isLoading && <tbody className="divide-y divide-slate-200 dark:divide-slate-700">{openTickets.map(ticket => renderTicketRow(ticket, true))}</tbody>}</table>{isLoading && openTickets.length === 0 && <div className="p-6 text-center text-gray-500"><Loader2 className="animate-spin mx-auto text-3xl text-blue-500" /><p className="mt-2">Loading open tickets...</p></div>}</div> : <div className="p-6 text-center text-gray-500 bg-white dark:bg-slate-800 rounded-lg shadow"><Info className="mx-auto text-4xl mb-2 text-blue-400" />No open tickets match your current filters.</div>}</section>
                    <section><h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center"><CheckCircle className="mr-3 h-7 w-7" /> Closed Tickets ({isLoading ? <Loader2 className="animate-spin ml-2" /> : closedTickets.length})</h2>{closedTickets.length > 0 || isLoading ? <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">{renderTableHeader()}{!isLoading && <tbody className="divide-y divide-slate-200 dark:divide-slate-700">{closedTickets.map(ticket => renderTicketRow(ticket, false))}</tbody>}</table>{isLoading && closedTickets.length === 0 && <div className="p-6 text-center text-gray-500"><Loader2 className="animate-spin mx-auto text-3xl text-green-500" /><p className="mt-2">Loading closed tickets...</p></div>}</div> : <div className="p-6 text-center text-gray-500 bg-white dark:bg-slate-800 rounded-lg shadow"><Info className="mx-auto text-4xl mb-2 text-green-400" />No closed tickets match your current filters.</div>}</section>
                </>
            )}
        </div>
    );
};

export default AllTicket;