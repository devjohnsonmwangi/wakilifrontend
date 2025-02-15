import { useState } from "react";
import {
    useFetchAppointmentsQuery,
    AppointmentDataTypes,
    useDeleteAppointmentMutation
} from "../../../../features/appointment/appointmentapi";
import AppointmentCreate from "./createappointment";
import AppointmentEdit from "./editappointments";
import { toast } from "sonner";
import { format } from 'date-fns';
import { AiOutlinePlus } from "react-icons/ai"; // Import plus icon

const AppointmentList = () => {
    const { data: appointments, isLoading, isError } = useFetchAppointmentsQuery();
    const [deleteAppointment] = useDeleteAppointmentMutation();
    const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
    const [calendarEvents, setCalendarEvents] = useState<AppointmentDataTypes[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);  // State to control create modal visibility

    const handleDelete = async (appointment_id: number) => {
        try {
            await deleteAppointment(appointment_id).unwrap();
            toast.success("Appointment deleted successfully!");
        } catch (error: any) {
            console.error("Failed to delete appointment:", error);
            toast.error(`Failed to delete appointment: ${error.message}`);
        }
    };

    const handleAppointmentCreated = (newAppointment: AppointmentDataTypes) => {
        setCalendarEvents([...calendarEvents, newAppointment]);
        setShowCreateModal(false); // Close the modal after creating
    };

    const handleAppointmentUpdated = (updatedAppointment: AppointmentDataTypes) => {
        setCalendarEvents(
            calendarEvents.map((event) =>
                event.appointment_id === updatedAppointment.appointment_id ? updatedAppointment : event
            )
        );
        setEditingAppointmentId(null);
    };

    const closeModal = () => {
        setEditingAppointmentId(null);
    };
    const closeCreateModal = () => {
        setShowCreateModal(false);
    };

    if (isLoading) return <div>Loading appointments...</div>;
    if (isError) return <div>Error loading appointments.</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Appointments</h1>

            {/* Create Appointment Button and Modal */}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                    <AiOutlinePlus className="mr-2" />
                    Create Appointment
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Client ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Lawyer ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {appointments?.map((appointment) => (
                            <tr key={appointment.appointment_id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {appointment.appointment_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {appointment.client_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {appointment.lawyer_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {format(new Date(appointment.appointment_date), 'PPP p')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {appointment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setEditingAppointmentId(appointment.appointment_id)}
                                        className="text-blue-600 hover:text-blue-900 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(appointment.appointment_id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingAppointmentId && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 relative" style={{ width: '500px', maxWidth: '90%' }}>
                        <button
                            title="Close"
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <AppointmentEdit appointmentId={editingAppointmentId} onAppointmentUpdated={handleAppointmentUpdated} onClose={closeModal} />
                    </div>
                </div>
            )}
            {showCreateModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 relative" style={{ width: '500px', maxWidth: '90%' }}>
                      
                        <AppointmentCreate onAppointmentCreated={handleAppointmentCreated} onClose={closeCreateModal} />
                    </div>
                </div>
            )}

            {/* Calendar Integration (Placeholder) */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Calendar View</h2>
                {/* Integrate your calendar component here */}
            </div>
        </div>
    );
};

export default AppointmentList;