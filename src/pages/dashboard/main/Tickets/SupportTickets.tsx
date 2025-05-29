import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import {
    FaTicketAlt, FaCheckCircle, FaUser, FaEnvelope, FaFileAlt, FaRedo, FaTimes, FaPhone, FaHeading, FaIdCard,
    FaHome,
    FaUsers,
    FaSpinner, FaExclamationTriangle, FaInfoCircle,
    FaSun, FaMoon // Icons for dark mode toggle
} from "react-icons/fa";

// Helper for styling toast
const getToastStyles = (type: 'success' | 'error' | 'loading' | null) => {
    switch (type) {
        case 'success':
            return 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700';
        case 'error':
            return 'bg-red-500 dark:bg-red-600 border-red-600 dark:border-red-700';
        case 'loading':
            return 'bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-700';
        default:
            return 'bg-gray-700 dark:bg-gray-600 border-gray-800 dark:border-gray-500';
    }
};

const AllTicket = () => {
    // --- Dark Mode State ---
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return true;
            }
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            if (typeof window !== 'undefined') localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            if (typeof window !== 'undefined') localStorage.theme = 'light';
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    // --- End Dark Mode State ---

    const [tickets, setTickets] = useState<TypeTickets[]>([]);
    const { data: allUserTickets, isError, isLoading, refetch } = TicketAPI.useGetTicketsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 300000,
    });
    const [updateTicket] = TicketAPI.useUpdateTicketMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const user_id = user?.user_id;
    const [addLog] = logAPI.useCreateLogMutation();

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | 'loading' | null>(null);
    const [loadingTicketId, setLoadingTicketId] = useState<number | null>(null);

    const [filters, setFilters] = useState({
        full_name: '',
        email: '',
        subject: '',
        status: ''
    });

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'loading', duration: number = 3000) => {
        setToastMessage(message);
        setToastType(type);
        if (type !== 'loading') {
            const timer = setTimeout(() => {
                setToastMessage(null);
                setToastType(null);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (allUserTickets) {
            setTickets(allUserTickets);
        }
    }, [allUserTickets]);
    
    useEffect(() => {
        if (isError && allUserTickets && allUserTickets.length > 0 && !isLoading) {
            showToast('⚠️ Could not refresh ticket data. Displaying last known information.', 'error', 5000);
        }
    }, [isError, allUserTickets, isLoading, showToast]);

    const handleUpdateStatus = useCallback(async (ticket_id: number, status: string) => {
        if (!user_id) {
            showToast('User not identified. Cannot update ticket.', 'error');
            return;
        }
        setLoadingTicketId(ticket_id);
        showToast(`Updating ticket #${ticket_id} to ${status}...`, 'loading');
        try {
            await updateTicket({ ticket_id, status }).unwrap();
            await addLog({ user_id, action: `Ticket ${ticket_id} status updated to ${status}` }).unwrap();
            showToast(`Ticket #${ticket_id} status updated to ${status} successfully!`, 'success');
        } catch (err) {
            console.error("Failed to update ticket:", err);
            showToast(`Failed to update ticket #${ticket_id} status.`, 'error');
        } finally {
            setLoadingTicketId(null);
            if (toastType === 'loading') {
                setToastMessage(null);
                setToastType(null);
            }
        }
    }, [updateTicket, addLog, user_id, showToast, toastType]);

    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            const fullNameMatch = filters.full_name ? ticket.user.full_name.toLowerCase().includes(filters.full_name.toLowerCase()) : true;
            const emailMatch = filters.email ? ticket.user.email.toLowerCase().includes(filters.email.toLowerCase()) : true;
            const subjectMatch = filters.subject ? ticket.subject.toLowerCase().includes(filters.subject.toLowerCase()) : true;
            const statusMatch = filters.status ? ticket.status.toLowerCase() === filters.status.toLowerCase() : true;
            return fullNameMatch && emailMatch && subjectMatch && statusMatch;
        });
    }, [tickets, filters]);

    const resetFilters = useCallback(() => {
        setFilters({
            full_name: '',
            email: '',
            subject: '',
            status: ''
        });
        showToast('Filters have been reset.', 'success', 1500);
    }, [showToast]);

    const formatDate = useCallback((dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString(undefined, options);
    }, []);

    // Full-page loading state (if this component itself represents the "modal" view when loading)
    if (isLoading && !allUserTickets) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 relative">
                {/* Dark Mode Toggle - Placed within this loading view too if it's modal-like */}
                <button
                    onClick={toggleDarkMode}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-yellow-500"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
                <AnimatedLoader />
                <p className="mt-4 text-xl">Loading Tickets...</p>
            </div>
        );
    }
    
    const openTickets = filteredTickets.filter(ticket => ticket.status === 'Open');
    const closedTickets = filteredTickets.filter(ticket => ticket.status === 'Closed');

    const renderTicketRow = (ticket: TypeTickets, isOpenTicket: boolean) => (
        <tr key={ticket.ticket_id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm">
                    <FaIdCard className={`mr-2 h-4 w-4 ${isOpenTicket ? 'text-blue-500' : 'text-green-500'}`} />
                    {ticket.ticket_id}
                </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    <FaHeading className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="truncate" title={ticket.subject}>{ticket.subject}</span>
                </div>
            </td>
            <td className="px-5 py-4 max-w-xs">
                 <div 
                    title={ticket.description}
                    className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible focus:whitespace-normal focus:overflow-visible"
                    tabIndex={0}
                 >
                    {ticket.description}
                 </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-800 dark:text-gray-200">{ticket.user.full_name}</div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <a href={`mailto:${ticket.user.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                    <FaEnvelope className="mr-1.5 h-4 w-4 flex-shrink-0" /> <span className="truncate" title={ticket.user.email}>{ticket.user.email}</span>
                </a>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                {ticket.user.phone_number ? (
                    <a href={`tel:${ticket.user.phone_number}`} className="text-sm text-gray-700 dark:text-gray-300 hover:underline flex items-center">
                        <FaPhone className="mr-1.5 h-4 w-4 flex-shrink-0" /> {ticket.user.phone_number}
                    </a>
                ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500 italic">N/A</span>
                )}
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(ticket.updated_at)}</span>
            </td>
            <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                {isOpenTicket ? (
                    <button
                        className="flex items-center px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
                        onClick={() => handleUpdateStatus(ticket.ticket_id, 'Closed')}
                        disabled={loadingTicketId === ticket.ticket_id}
                        title="Close this ticket"
                    >
                        {loadingTicketId === ticket.ticket_id ? (
                            <FaSpinner className="animate-spin mr-1.5 h-4 w-4" />
                        ) : (
                            <FaCheckCircle className="mr-1.5 h-4 w-4" />
                        )}
                        Close
                    </button>
                ) : (
                    <button
                        onClick={() => handleUpdateStatus(ticket.ticket_id, 'Open')}
                        className="flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:text-gray-900 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
                        disabled={loadingTicketId === ticket.ticket_id}
                        title="Reopen this ticket"
                    >
                         {loadingTicketId === ticket.ticket_id ? (
                            <FaSpinner className="animate-spin mr-1.5 h-4 w-4" />
                        ) : (
                            <FaRedo className="mr-1.5 h-4 w-4" />
                        )}
                        Reopen
                    </button>
                )}
            </td>
        </tr>
    );

    return (
        // Main container now has `position: relative`
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 relative">
            {/* Dark Mode Toggle Button - Positioned absolutely within this component */}
            <h1 className="text-3xl font-semibold text-green-800 dark:text-green-100 mb-4 sm:mb-0">
                  Ticket portal, Manage Users  Concerns  Here
                </h1>
            <button
                onClick={toggleDarkMode}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                // `absolute` positioning, `top-4/6` and `right-4/6` to align with padding
                className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-yellow-500"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex space-x-2 items-center">
                    <li className="flex items-center">
                        <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                            <FaHome className="mr-1.5 h-4 w-4" />Dashboard
                        </Link>
                    </li>
                    <li><span className="mx-2 text-gray-400 dark:text-gray-500">/</span></li>
                    <li className="flex items-center">
                        <Link to="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                            <FaUsers className="mr-1.5 h-4 w-4" />Admin
                        </Link>
                    </li>
                    <li><span className="mx-2 text-gray-400 dark:text-gray-500">/</span></li>
                    <li className="flex items-center font-medium text-gray-700 dark:text-gray-100">
                        <FaTicketAlt className="mr-1.5 h-4 w-4" />All Tickets
                    </li>
                </ol>
            </nav>

            {/* Toast Notification - Remains fixed to viewport, bottom-right */}
            {toastMessage && (
                <div
                    className={`fixed bottom-6 right-6 z-[100] p-4 rounded-lg shadow-xl text-white text-sm font-medium border ${getToastStyles(toastType)} flex items-center transition-all duration-300 ease-in-out transform animate-fadeInUp`}
                    role="alert"
                >
                    {toastType === 'loading' && <FaSpinner className="animate-spin mr-2 text-lg" />}
                    {toastType === 'success' && <FaCheckCircle className="mr-2 text-lg" />}
                    {toastType === 'error' && <FaExclamationTriangle className="mr-2 text-lg" />}
                    {toastMessage}
                </div>
            )}
            
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
                    {[
                        { Icon: FaUser, placeholder: "Full Name", value: filters.full_name, key: 'full_name' },
                        { Icon: FaEnvelope, placeholder: "Email", value: filters.email, key: 'email' },
                        { Icon: FaFileAlt, placeholder: "Subject", value: filters.subject, key: 'subject' },
                    ].map(f => (
                        <div key={f.key}>
                            <label htmlFor={f.key} className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{f.placeholder}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <f.Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    id={f.key}
                                    type="text"
                                    placeholder={`Filter by ${f.placeholder}`}
                                    title={`Filter by ${f.placeholder}`}
                                    value={f.value}
                                    onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-sm placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </div>
                    ))}
                     <div>
                        <label htmlFor="status-filter" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Status</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaTicketAlt className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <select
                                id="status-filter"
                                title="Filter by status"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-sm appearance-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={resetFilters}
                        title="Reset all filters"
                        className="flex items-center justify-center px-4 py-2.5 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white dark:border-red-600 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white transition-colors text-sm font-medium col-span-1 md:col-span-2 lg:col-span-1"
                    >
                        <FaTimes className="mr-2 h-4 w-4" />
                        Reset Filters
                    </button>
                </div>
            </div>

            {isError && !allUserTickets && !isLoading ? (
                <div className="my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                    <FaExclamationTriangle className="text-5xl mx-auto mb-4 text-red-500 dark:text-red-400" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Error Loading Tickets</h3>
                    <p className="text-md text-gray-600 dark:text-gray-400 mb-4">We encountered an issue while trying to fetch the ticket data.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Please check your connection or try again. If the problem persists, contact support.</p>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        <FaRedo className="inline mr-2" /> Retry
                    </button>
                </div>
            ) : (
                <>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400 flex items-center">
                            <FaTicketAlt className="mr-3 text-3xl flex-shrink-0" /> Open Tickets ({isLoading ? <FaSpinner className="animate-spin ml-2 text-xl"/> : openTickets.length})
                        </h2>
                        {openTickets.length > 0 || isLoading ? (
                            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-750 sticky top-0 z-10">
                                        <tr>
                                            {["ID", "Subject", "Message", "Full Name", "Email", "Phone", "Last Updated", "Action"].map(header => (
                                                <th key={header} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    {!isLoading && (
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {openTickets.map(ticket => renderTicketRow(ticket, true))}
                                        </tbody>
                                    )}
                                </table>
                                {isLoading && openTickets.length === 0 && (
                                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                        <FaSpinner className="animate-spin mx-auto text-3xl text-blue-500" />
                                        <p className="mt-2">Loading open tickets...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <FaInfoCircle className="mx-auto text-4xl mb-2 text-blue-400" />
                                No open tickets match your current filters.
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center">
                            <FaCheckCircle className="mr-3 text-3xl flex-shrink-0" /> Closed Tickets ({isLoading ? <FaSpinner className="animate-spin ml-2 text-xl"/> : closedTickets.length})
                        </h2>
                        {closedTickets.length > 0 || isLoading ? (
                        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-750 sticky top-0 z-10">
                                        <tr>
                                            {["ID", "Subject", "Message", "Full Name", "Email", "Phone", "Last Updated", "Action"].map(header => (
                                                <th key={header} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                {!isLoading && (
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {closedTickets.map(ticket => renderTicketRow(ticket, false))}
                                    </tbody>
                                )}
                            </table>
                            {isLoading && closedTickets.length === 0 && (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    <FaSpinner className="animate-spin mx-auto text-3xl text-green-500" />
                                    <p className="mt-2">Loading closed tickets...</p>
                                </div>
                            )}
                        </div>
                         ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
                                 <FaInfoCircle className="mx-auto text-4xl mb-2 text-green-400" />
                                No closed tickets match your current filters.
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default AllTicket;

// Global CSS (e.g., index.css or app.css) - fadeInUp animation for toast
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-fadeInUp {
    animation: fadeInUp 0.3s ease-out;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
*/