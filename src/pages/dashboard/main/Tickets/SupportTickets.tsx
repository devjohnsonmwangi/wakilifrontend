import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { logAPI } from "../../../../features/log/logsapi";
import { RootState } from "../../../../app/store";
import AnimatedLoader from "../../../../components/AnimatedLoader";
import { useSelector } from "react-redux";
import {
    FaTicketAlt, FaCheckCircle, FaUser, FaEnvelope, FaFileAlt, FaRedo, FaTimes, FaPhone, FaHeading, FaIdCard
} from "react-icons/fa";

const AllTicket = () => {
    const [tickets, setTickets] = useState<TypeTickets[]>([]);
    const { data: allUserTickets, isError, isLoading } = TicketAPI.useGetTicketsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 600000,
    });
    const [updateTicket] = TicketAPI.useUpdateTicketMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const user_id = user?.user_id;
    const [addLog] = logAPI.useCreateLogMutation();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
    const [loadingTicketId, setLoadingTicketId] = useState<number | null>(null);

    const [filters, setFilters] = useState({
        full_name: '',
        email: '',
        subject: '',
        status: ''
    });

   // const [selectedTickets, setSelectedTickets] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (allUserTickets) {
            setTickets(allUserTickets);
        }
    }, [allUserTickets]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage(null);
            setToastType(null);
        }, 3000);
    };

    const handleUpdateStatus = async (ticket_id: number, status: string) => {
        try {
            setLoadingTicketId(ticket_id);
            await updateTicket({ ticket_id, status }).unwrap();
            await addLog({ user_id, action: `📜 Ticket ${ticket_id} status updated to ${status}` }).unwrap();
            showToast('🎉 Ticket status updated successfully!', 'success');
        } catch (err) {
            showToast('❌ Failed to update ticket status', 'error');
        } finally {
            setLoadingTicketId(null);
        }
    };

    // const handleBulkUpdateStatus = async (status: string) => {
    //     const selectedTicketIds = Array.from(selectedTickets);
    //     try {
    //         for (const ticket_id of selectedTicketIds) {
    //             await updateTicket({ ticket_id, status }).unwrap();
    //             await addLog({ user_id, action: `📜 Ticket ${ticket_id} status updated to ${status}` }).unwrap();
    //         }
    //         showToast('🎉 Bulk ticket status updated successfully!', 'success');
    //     } catch (err) {
    //         showToast('❌ Failed to update tickets status', 'error');
    //     }
    // };

    // Filtering tickets based on filters
    const filteredTickets = tickets.filter((ticket) => {
        return (
            (filters.full_name ? ticket.user.full_name.toLowerCase().includes(filters.full_name.toLowerCase()) : true) &&
            (filters.email ? ticket.user.email.toLowerCase().includes(filters.email.toLowerCase()) : true) &&
            (filters.subject ? ticket.subject.toLowerCase().includes(filters.subject.toLowerCase()) : true) &&
            (filters.status ? ticket.status.toLowerCase() === filters.status.toLowerCase() : true)
        );
    });

    // Conditional rendering during loading state
    if (isLoading) {
        return <div className="text-center"><AnimatedLoader /> Loading Tickets...</div>;
    }

    if (isError) {
        showToast('❌ Failed to load tickets', 'error');
        return <div className="text-center">Failed to load tickets</div>;
    }

    const resetFilters = () => {
        setFilters({
            full_name: '',
            email: '',
            subject: '',
            status: ''
        });
    };

    // const handleTicketSelection = (ticketId: number) => {
    //     setSelectedTickets(prevState => {
    //         const newSelection = new Set(prevState);
    //         if (newSelection.has(ticketId)) {
    //             newSelection.delete(ticketId);
    //         } else {
    //             newSelection.add(ticketId);
    //         }
    //         return newSelection;
    //     });
    // };

    // Function to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    return (
        <div className="w-full h-full p-0">
            <div className="breadcrumbs text-sm my-6 text-yellow-300 flex items-center gap-2">
                <FaTicketAlt />
                <ul className="flex gap-2">
                    <li><Link to="/dashboard/profile">🏠 Dashboard</Link></li>
                    <li><Link to="/dashboard/account">📋 Admin</Link></li>
                    <li><span className="inline-flex items-center gap-2">🎟️ Tickets</span></li>
                </ul>
            </div>

            {toastMessage && (
                <div className={`toast ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-md text-white mb-4`}>
                    {toastMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
                <div className="flex items-center gap-1">
                    <FaUser />
                    <input
                        type="text"
                        placeholder="Search by Full Name"
                        value={filters.full_name}
                        onChange={(e) => setFilters({ ...filters, full_name: e.target.value })}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <FaEnvelope />
                    <input
                        type="text"
                        placeholder="Search by Email"
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FaFileAlt />
                    <input
                        type="text"
                        placeholder="Search by Subject"
                        value={filters.subject}
                        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FaTicketAlt />
                    <select
                        title="status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="select select-bordered w-full"
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        onClick={resetFilters}
                        className="btn btn-outline btn-error mt-4 md:mt-0"
                    >
                        <FaTimes className="inline mr-2" />
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Open Tickets Section */}
            <h2 className="text-3xl font-semibold mb-6 text-indigo-600">
                🚀 Open Tickets
            </h2>


            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="table table-zebra text-gray-800 w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                        <tr className="text-xl">
                            <th>🎫 Ticket ID</th>
                            <th>📝 Subject</th>
                            <th>💬 Message</th>
                            <th>🙋 Full Name</th>
                            <th>📧 Email</th>
                            <th><FaPhone className="inline mr-1 text-green-600" /> Phone</th>
                            <th>📅 Date</th>
                            <th>⚙️ Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.filter(ticket => ticket.status === 'Open').map((ticket) => (
                            <tr key={ticket.ticket_id} className="hover:bg-indigo-50">
                                <td><FaIdCard className="inline mr-1 text-indigo-600" /> {ticket.ticket_id}</td>
                                <td><FaHeading className="inline mr-1 text-indigo-600" /> {ticket.subject}</td>
                                <td>
                                    <textarea
                                       placeholder="description"
                                       title="description"
                                        readOnly
                                        value={ticket.description}
                                        className="w-full h-24 border border-gray-300 rounded-md p-2 resize-none"
                                    />
                                </td>
                                <td><FaUser className="inline mr-1 text-indigo-600" /> {ticket.user.full_name}</td>
                                <td className="relative group">
                                    <input
                                        placeholder="email"
                                        type="text"
                                        value={ticket.user.email}
                                        readOnly
                                        className="input input-bordered w-full cursor-pointer"
                                        onClick={() => window.location.href = `mailto:${ticket.user.email}`}
                                    />
                                    <div className="absolute left-0 -bottom-8 bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {ticket.user.email}
                                    </div>
                                </td>
                                <td>
                                    <a href={`tel:${ticket.user.phone_number}`} className="text-green-600 hover:underline">
                                        <FaPhone className="inline mr-1" /> {ticket.user.phone_number}
                                    </a>
                                </td>
                                <td>
                                    {formatDate(ticket.updated_at)}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline btn-info text-white hover:bg-indigo-500"
                                        onClick={() => handleUpdateStatus(ticket.ticket_id, 'Closed')}
                                        disabled={loadingTicketId === ticket.ticket_id}
                                    >
                                        {loadingTicketId === ticket.ticket_id ? 'Closing...' : <FaCheckCircle className="inline mr-2" />}
                                        Close Ticket
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Closed Tickets Section */}
            <h2 className="text-3xl font-semibold mt-8 mb-6 text-gray-700">
                ✅ Closed Tickets
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="table table-zebra text-gray-800 w-full">
                    <thead className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                        <tr className="text-xl">
                            <th>🎫 Ticket ID</th>
                            <th>📝 Subject</th>
                            <th>💬 Message</th>
                            <th>🙋 Full Name</th>
                            <th>📧 Email</th>
                            <th><FaPhone className="inline mr-1 text-green-600" /> Phone</th>
                            <th>📅 Date</th>
                            <th>⚙️ Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.filter(ticket => ticket.status === 'Closed').map(ticket => (
                            <tr key={ticket.ticket_id} className="hover:bg-green-50">
                                <td><FaIdCard className="inline mr-1 text-green-600" /> {ticket.ticket_id}</td>
                                <td><FaHeading className="inline mr-1 text-green-600" /> {ticket.subject}</td>
                                <td>
                                    <textarea
                                        title="description"
                                        readOnly
                                        value={ticket.description}
                                        className="w-full h-24 border border-gray-300 rounded-md p-2 resize-none"
                                    />
                                </td>
                                <td><FaUser className="inline mr-1 text-green-600" /> {ticket.user.full_name}</td>
                                <td className="relative group">
                                    <input
                                        placeholder="email"
                                        title="email"
                                        type="text"
                                        value={ticket.user.email}
                                        readOnly
                                        className="input input-bordered w-full cursor-pointer"
                                        onClick={() => window.location.href = `mailto:${ticket.user.email}`}
                                    />
                                    <div title="email" className="absolute left-0 -bottom-8 bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {ticket.user.email}
                                    </div>
                                </td>
                                <td>
                                    <a href={`tel:${ticket.user.phone_number}`} className="text-green-600 hover:underline">
                                        <FaPhone className="inline mr-1" /> {ticket.user.phone_number}
                                    </a>
                                </td>
                                <td>
                                    {formatDate(ticket.updated_at)}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateStatus(ticket.ticket_id, 'Open')}
                                        className="btn btn-outline bg-yellow-500 text-white"
                                    >
                                        <FaRedo className="inline" /> Reopen
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllTicket;
