import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { useState, useMemo, useEffect, useRef } from 'react';
import CreateTicket from './CreateTicket';
import EditUserTicket from './EditUserTicket';
import DeleteUserTicket from './DeleteUserTicket';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    FilePenLine, Trash2, Wind, Plus, Search, RefreshCw, Moon, Sun,
    AlertTriangle, CheckCircle, Loader2, Inbox, User, X, ChevronDown
} from 'lucide-react';

const MyTickets = () => {
    const userState = useSelector((state: RootState) => state.user);
    const user_id = userState.user?.user_id ?? 0;
    const userFullName = userState.user?.full_name;
    const userProfilePicture = userState.user?.profile_picture;

    const { data: ticketData, isLoading: ticketLoading, error: ticketError, refetch } = TicketAPI.useGetUserTicketsQuery(user_id, {
        refetchOnMountOrArgChange: true,
    });

    const [tickets, setTickets] = useState<TypeTickets[]>([]);
    const [filter, setFilter] = useState({ subject: '', description: '', status: '' });
    const [editTicket, setEditTicket] = useState<TypeTickets | null>(null);
    const [deleteTicket, setDeleteTicket] = useState<TypeTickets | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false));

    // --- Dropdown State & Refs ---
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if (ticketData) setTickets(ticketData); }, [ticketData]);
    useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); localStorage.setItem('darkMode', String(isDarkMode)); }, [isDarkMode]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleDeleteTicket = (ticket: TypeTickets) => { setDeleteTicket(ticket); (document.getElementById('delete_ticket_modal') as HTMLDialogElement)?.showModal(); };
    const handleEditTicket = (ticket: TypeTickets) => { setEditTicket(ticket); (document.getElementById('edit_ticket_modal') as HTMLDialogElement)?.showModal(); };

    const [updateTicket, { isLoading: isUpdatingTicket }] = TicketAPI.useUpdateTicketMutation();

    const handleReopenTicket = async (ticket: TypeTickets) => {
        try {
            await updateTicket({ ...ticket, status: 'Open' }).unwrap();
            setTickets(prev => prev.map(t => (t.ticket_id === ticket.ticket_id ? { ...t, status: 'Open' } : t)));
        } catch (error) { console.error('Error reopening ticket', error); }
    };

    const filteredTickets = useMemo(() => {
        if (!tickets) return [];
        return tickets.filter(ticket =>
            ticket.subject.toLowerCase().includes(filter.subject.toLowerCase()) &&
            ticket.description.toLowerCase().includes(filter.description.toLowerCase()) &&
            (filter.status ? ticket.status.toLowerCase() === filter.status.toLowerCase() : true)
        );
    }, [tickets, filter]);

    const resetFilters = () => setFilter({ subject: '', description: '', status: '' });
    const handleClearFilter = (filterName: keyof typeof filter) => setFilter(prev => ({...prev, [filterName]: ''}));

    const getStatusClassName = (status: string) => {
        switch (status.toLowerCase()) {
            case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-200';
            case 'open': return 'bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-slate-200';
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'closed': return <CheckCircle className="mr-1.5 h-3.5 w-3.5" />;
            case 'open': return <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />;
            default: return null;
        }
    };

    const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;
    const dropdownListVariants: Variants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } } };

    return (
        <div className='bg-slate-100 dark:bg-slate-900 min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300'>
            <div className='max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden'>
                <header className="bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-600 dark:to-indigo-700 p-4 md:p-5 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {userProfilePicture ? ( <img src={userProfilePicture} alt={userFullName || 'User profile'} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/60 shadow-sm" /> ) : ( <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50"><User className="text-white/70 h-6 w-6" /></div> )}
                        <div>
                            {userFullName && <p className="text-xs md:text-sm font-medium text-white/80 tracking-wide -mb-0.5 md:-mb-1">{userFullName}</p>}
                            <h2 className="text-xl md:text-2xl font-bold flex items-center"><Inbox className="mr-2 h-6 w-6" />My Tickets</h2>
                        </div>
                    </div>
                    <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors" aria-label="Toggle dark mode">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                </header>

                <div className="p-4 md:p-6">
                    {ticketLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-300"><Loader2 className="animate-spin text-4xl mb-4 text-sky-500" /><p className="text-xl font-semibold">Loading your tickets...</p><p className="text-sm">Please wait a moment.</p></div>
                    ) : ticketError ? (
                        <div className="flex flex-col items-center justify-center text-center p-6 md:p-10 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg"><AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" /><h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Oops! Something went wrong.</h3><p className="text-red-600 dark:text-red-400 mb-1">We couldn't load your tickets. Please check your internet connection.</p><p className="text-sm text-gray-500 dark:text-gray-400 mb-6">If the problem persists, please contact support.</p><button onClick={() => refetch()} className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md flex items-center transition-colors"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</button></div>
                    ) : (
                        <>
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                                    <button className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center" onClick={() => (document.getElementById('create_ticket') as HTMLDialogElement)?.showModal()}><Plus className="mr-2 h-4 w-4" /> Create New Ticket</button>
                                    <button className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 shadow-md flex items-center justify-center" onClick={resetFilters}><RefreshCw className="mr-2 h-4 w-4" /> Reset Filters</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                        <input type="text" placeholder="Search by Subject..." value={filter.subject} onChange={(e) => setFilter({ ...filter, subject: e.target.value })} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />
                                        {filter.subject && (<button type="button" onClick={() => handleClearFilter('subject')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                        <input type="text" placeholder="Search by Description..." value={filter.description} onChange={(e) => setFilter({ ...filter, description: e.target.value })} className={`${inputBaseClasses} py-2.5 pl-10 pr-10`} />
                                        {filter.description && (<button type="button" onClick={() => handleClearFilter('description')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16} /></button>)}
                                    </div>
                                    <div ref={statusDropdownRef} className="relative">
                                        <button type="button" onClick={() => setIsStatusDropdownOpen(p => !p)} className={`${inputBaseClasses} text-left flex justify-between items-center py-2.5 px-4`}>
                                            <span className={`truncate font-semibold ${!filter.status ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>{filter.status || 'All Statuses'}</span>
                                            <div className="flex items-center">
                                                {filter.status && (<button type="button" onClick={(e) => { e.stopPropagation(); handleClearFilter('status'); }} className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={16}/></button>)}
                                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {isStatusDropdownOpen && (
                                                <motion.ul variants={dropdownListVariants} initial="hidden" animate="visible" exit="exit" className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                    <li><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilter(f => ({...f, status: ''})); setIsStatusDropdownOpen(false); }}>All Statuses</button></li>
                                                    {['Open', 'Closed'].map(status => (<li key={status}><button type="button" className="w-full text-left px-4 py-2.5 text-sm font-semibold" onClick={() => { setFilter(f => ({...f, status})); setIsStatusDropdownOpen(false); }}>{status}</button></li>))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto shadow-md rounded-lg">
                                {filteredTickets.length > 0 ? (
                                    <table className="table-auto w-full bg-white dark:bg-slate-800">
                                        <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase text-sm">
                                            <tr><th className="px-4 py-3 text-left font-semibold">ID</th><th className="px-4 py-3 text-left font-semibold">Subject</th><th className="px-4 py-3 text-left font-semibold">Description</th><th className="px-4 py-3 text-left font-semibold">Status</th><th className="px-4 py-3 text-center font-semibold">Actions</th></tr>
                                        </thead>
                                        <tbody className="text-slate-700 dark:text-slate-300">
                                            {filteredTickets.map((ticket) => (
                                                <tr key={ticket.ticket_id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 py-3 font-medium">#{ticket.ticket_id}</td>
                                                    <td className="px-4 py-3">{ticket.subject}</td>
                                                    <td className="px-4 py-3 max-w-xs truncate" title={ticket.description}>{ticket.description}</td>
                                                    <td className="px-4 py-3"><span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusClassName(ticket.status)}`}>{getStatusIcon(ticket.status)} {ticket.status}</span></td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {ticket.status.toLowerCase() === 'closed' ? ( <button className="px-2 py-1.5 text-xs font-semibold rounded-md flex items-center bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-700/50 dark:text-amber-300 dark:hover:bg-amber-700" onClick={() => handleReopenTicket(ticket)} disabled={isUpdatingTicket && editTicket?.ticket_id === ticket.ticket_id} title="Reopen Ticket">{isUpdatingTicket && editTicket?.ticket_id === ticket.ticket_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wind className="mr-1 h-3.5 w-3.5" /><span className="hidden sm:inline">Reopen</span></>} </button> ) : (
                                                                <>
                                                                    <button className="px-2 py-1.5 text-xs font-semibold rounded-md flex items-center bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-700/50 dark:text-sky-300 dark:hover:bg-sky-700" onClick={() => handleEditTicket(ticket)} title="Edit Ticket"><FilePenLine className="mr-1 h-3.5 w-3.5" /><span className="hidden sm:inline">Edit</span></button>
                                                                    <button className="px-2 py-1.5 text-xs font-semibold rounded-md flex items-center bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/50 dark:text-red-300 dark:hover:bg-red-700" onClick={() => handleDeleteTicket(ticket)} title="Delete Ticket"><Trash2 className="mr-1 h-3.5 w-3.5" /><span className="hidden sm:inline">Delete</span></button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-16 text-gray-500 dark:text-gray-400"><Inbox size={48} className="mx-auto mb-4 opacity-50" /><p className="text-xl font-semibold mb-2">No tickets found.</p><p>Try adjusting your filters or create a new ticket!</p></div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <dialog id='create_ticket' className="modal modal-bottom sm:modal-middle"><div className="modal-box w-11/12 max-w-3xl rounded-lg"><form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form><CreateTicket userFullName={userFullName} userProfilePicture={userProfilePicture} modalId="create_ticket" /></div><form method="dialog" className="modal-backdrop"><button>close</button></form></dialog>
            <dialog id='edit_ticket_modal' className="modal modal-bottom sm:modal-middle"><div className="modal-box w-11/12 max-w-3xl rounded-lg"><form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>{editTicket && <EditUserTicket ticket={editTicket} modalId="edit_ticket_modal" userFullName={userFullName} userProfilePicture={userProfilePicture} />}</div><form method="dialog" className="modal-backdrop"><button>close</button></form></dialog>
            <dialog id='delete_ticket_modal' className="modal modal-bottom sm:modal-middle"><div className="modal-box w-11/12 max-w-lg rounded-lg"><form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>{deleteTicket && <DeleteUserTicket ticket={deleteTicket} modalId="delete_ticket_modal" userFullName={userFullName} userProfilePicture={userProfilePicture} />}</div><form method="dialog" className="modal-backdrop"><button>close</button></form></dialog>
        </div>
    );
};

export default MyTickets;