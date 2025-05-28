import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { useState, useMemo, useEffect } from 'react';
import CreateTicket from './CreateTicket';
import EditUserTicket from './EditUserTicket';
import DeleteUserTicket from './DeleteUserTicket';
import { FaEdit, FaTrashAlt, FaRegWindowRestore, FaPlus, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { FiMoon, FiSun, FiAlertTriangle, FiCheckCircle, FiLoader, FiInbox, FiUser } from 'react-icons/fi'; // Added FiUser

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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            return savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (ticketData) {
            setTickets(ticketData);
        }
    }, [ticketData]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleDeleteTicket = (ticket: TypeTickets) => {
        setDeleteTicket(ticket);
        (document.getElementById('delete_ticket_modal') as HTMLDialogElement)?.showModal();
    }

    const handleEditTicket = (ticket: TypeTickets) => {
        setEditTicket(ticket);
        (document.getElementById('edit_ticket_modal') as HTMLDialogElement)?.showModal();
    }

    const [updateTicket, { isLoading: isUpdatingTicket }] = TicketAPI.useUpdateTicketMutation();

    const handleReopenTicket = async (ticket: TypeTickets) => {
        try {
            const updatedTicket = { ...ticket, status: 'Open' };
            await updateTicket(updatedTicket).unwrap();
            setTickets((prevTickets) =>
                prevTickets.map((t) => (t.ticket_id === ticket.ticket_id ? updatedTicket : t))
            );
        } catch (error) {
            console.error('Error reopening ticket', error);
        }
    }

    const filteredTickets = useMemo(() => {
        if (!tickets) return [];
        return tickets.filter(ticket => {
            const matchesSubject = ticket.subject.toLowerCase().includes(filter.subject.toLowerCase());
            const matchesDescription = ticket.description.toLowerCase().includes(filter.description.toLowerCase());
            const matchesStatus = filter.status ? ticket.status.toLowerCase() === filter.status.toLowerCase() : true;
            return matchesSubject && matchesDescription && matchesStatus;
        });
    }, [tickets, filter]);

    const resetFilters = () => {
        setFilter({ subject: '', description: '', status: '' });
    };

    const getStatusClassName = (status: string) => {
        switch (status.toLowerCase()) {
            case 'closed':
                return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
            case 'open':
                return 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'closed':
                return <FiCheckCircle className="mr-1 inline" />;
            case 'open':
                return <FiAlertTriangle className="mr-1 inline" />;
            default:
                return null;
        }
    }

    return (
        <div className='bg-slate-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 transition-colors duration-300'>
            <div className='card mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden'>
                {/* MODIFIED HEADER SECTION */}
                <div className="bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-600 dark:to-indigo-700 p-4 md:p-5 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* User Profile Picture */}
                        {userProfilePicture ? (
                            <img
                                src={userProfilePicture}
                                alt={userFullName || 'User profile'}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/60 shadow-sm"
                            />
                        ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                                <FiUser className="text-white/70 text-xl md:text-2xl" />
                            </div>
                        )}
                        {/* User Name and Page Title */}
                        <div>
                            {userFullName && (
                                <p className="text-xs md:text-sm font-medium text-white/80 tracking-wide -mb-0.5 md:-mb-1">
                                    {userFullName}
                                </p>
                            )}
                            <h2 className="text-xl md:text-2xl font-bold flex items-center">
                                <FiInbox className="mr-2 text-xl md:text-2xl" />
                                My Tickets {/* Generic title */}
                            </h2>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                </div>

                <div className="p-4 md:p-6">
                    {ticketLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-300">
                            <FiLoader className="animate-spin text-4xl mb-4 text-sky-500" />
                            <p className="text-xl font-semibold">Loading your tickets...</p>
                            <p className="text-sm">Please wait a moment.</p>
                        </div>
                    ) : ticketError ? (
                         <div className="flex flex-col items-center justify-center text-center p-6 md:p-10 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                            <FiAlertTriangle className="text-5xl text-red-500 dark:text-red-400 mb-4" />
                            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Oops! Something went wrong.</h3>
                            <p className="text-red-600 dark:text-red-400 mb-1">
                                We couldn't load your tickets. Please check your internet connection.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                If the problem persists, please contact support.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="btn bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md flex items-center transition-colors"
                            >
                                <FaSyncAlt className="mr-2" /> Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-gray-700 rounded-lg shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                                    <button
                                        className="btn bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center w-full sm:w-auto"
                                        onClick={() => (document.getElementById('create_ticket') as HTMLDialogElement)?.showModal()}
                                    >
                                        <FaPlus className="mr-2" /> Create New Ticket
                                    </button>
                                    <button
                                        className="btn bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center w-full sm:w-auto"
                                        onClick={resetFilters}
                                    >
                                        <FaSyncAlt className="mr-2" /> Reset Filters
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search by Subject"
                                            value={filter.subject}
                                            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                                            className="input input-bordered w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500 dark:focus:ring-sky-500 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search by Description"
                                            value={filter.description}
                                            onChange={(e) => setFilter({ ...filter, description: e.target.value })}
                                            className="input input-bordered w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500 dark:focus:ring-sky-500 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                        <select
                                            title='status'
                                            value={filter.status}
                                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                            className="select select-bordered w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500 dark:focus:ring-sky-500 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="Open">Open</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto shadow-md rounded-lg">
                                {filteredTickets.length > 0 ? (
                                    <table className="table-auto w-full bg-white dark:bg-gray-800">
                                        <thead className="bg-slate-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold">ID</th>
                                                <th className="px-4 py-3 text-left font-semibold">Subject</th>
                                                <th className="px-4 py-3 text-left font-semibold">Description</th>
                                                <th className="px-4 py-3 text-left font-semibold">Status</th>
                                                <th className="px-4 py-3 text-center font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-700 dark:text-gray-300">
                                            {filteredTickets.map((ticket) => (
                                                <tr key={ticket.ticket_id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 py-3 font-medium">#{ticket.ticket_id}</td>
                                                    <td className="px-4 py-3">{ticket.subject}</td>
                                                    <td className="px-4 py-3 max-w-xs truncate" title={ticket.description}>{ticket.description}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusClassName(ticket.status)}`}>
                                                            {getStatusIcon(ticket.status)} {ticket.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {ticket.status.toLowerCase() === 'closed' ? (
                                                                <button
                                                                    className="btn btn-xs btn-outline btn-warning hover:bg-yellow-500 hover:border-yellow-500 flex items-center"
                                                                    onClick={() => handleReopenTicket(ticket)}
                                                                    disabled={isUpdatingTicket && editTicket?.ticket_id === ticket.ticket_id}
                                                                    title="Reopen Ticket"
                                                                >
                                                                    <FaRegWindowRestore />
                                                                    {isUpdatingTicket && editTicket?.ticket_id === ticket.ticket_id ? <span className="loading loading-spinner loading-xs"></span> : <span className="ml-1 hidden sm:inline">Reopen</span>}
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className="btn btn-xs btn-outline btn-info hover:bg-sky-500 hover:border-sky-500 flex items-center"
                                                                        onClick={() => handleEditTicket(ticket)}
                                                                        title="Edit Ticket"
                                                                    >
                                                                        <FaEdit />
                                                                        <span className="ml-1 hidden sm:inline">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-xs btn-outline btn-error hover:bg-red-500 hover:border-red-500 flex items-center"
                                                                        onClick={() => handleDeleteTicket(ticket)}
                                                                        title="Delete Ticket"
                                                                    >
                                                                        <FaTrashAlt />
                                                                         <span className="ml-1 hidden sm:inline">Delete</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                        <FiInbox size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-xl font-semibold mb-2">No tickets found.</p>
                                        <p>Try adjusting your filters or create a new ticket!</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals (userFullName and userProfilePicture are still passed in case child components need them) */}
            <dialog id='create_ticket' className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-11/12 max-w-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl p-6">
                    <form method="dialog" className="relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 z-10">✕</button>
                    </form>
                    {/* Removed ModalUserInfoHeader from here */}
                    <CreateTicket
                        userFullName={userFullName}
                        userProfilePicture={userProfilePicture}
                        modalId="create_ticket"
                    />
                </div>
                 <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>

            <dialog id='edit_ticket_modal' className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-11/12 max-w-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl p-6">
                    <form method="dialog" className="relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 z-10">✕</button>
                    </form>
                    {/* Removed ModalUserInfoHeader from here */}
                    {editTicket && (
                        <EditUserTicket
                            ticket={editTicket}
                            modalId="edit_ticket_modal"
                            userFullName={userFullName}
                            userProfilePicture={userProfilePicture}
                        />
                    )}
                </div>
                <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>

            <dialog id='delete_ticket_modal' className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-11/12 max-w-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl p-6">
                    <form method="dialog" className="relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 z-10">✕</button>
                    </form>
                     {/* Removed ModalUserInfoHeader from here */}
                    {deleteTicket && (
                        <DeleteUserTicket
                            ticket={deleteTicket}
                            modalId="delete_ticket_modal"
                            userFullName={userFullName}
                            userProfilePicture={userProfilePicture}
                        />
                    )}
                </div>
                <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
        </div>
    );
};

export default MyTickets;