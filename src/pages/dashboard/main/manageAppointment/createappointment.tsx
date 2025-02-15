import React, { useState } from "react";
import { useCreateAppointmentMutation, AppointmentDataTypes, AppointmentStatus } from "../../../../features/appointment/appointmentapi";
import { toast } from "sonner";
import { AiOutlineClose } from "react-icons/ai"; // Import the close icon

interface AppointmentCreateProps {
    onAppointmentCreated?: (appointment: AppointmentDataTypes) => void;
    onClose: () => void; // Add the onClose prop
}

const AppointmentCreate: React.FC<AppointmentCreateProps> = ({ onAppointmentCreated, onClose }) => {
    const [clientId, setClientId] = useState("");
    const [lawyerId, setLawyerId] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [status, setStatus] = useState<AppointmentStatus>("pending");
    const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newAppointment = {
            client_id: parseInt(clientId),
            lawyer_id: parseInt(lawyerId),
            appointment_date: appointmentDate,
            status: status,
        };

        try {
            const result = await createAppointment(newAppointment).unwrap();
            toast.success("Appointment created successfully!");
            // Reset form fields
            setClientId("");
            setLawyerId("");
            setAppointmentDate("");
            setStatus("pending");

            if (onAppointmentCreated) {
                onAppointmentCreated(result); // Update calendar
            }
            onClose();
        } catch (error: any) {
            console.error("Failed to create appointment:", error);
            toast.error(`Failed to create appointment: ${error.message}`);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 relative">
            <button
                title="Close"
                type="button"
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                <AiOutlineClose className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Create New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="clientId" className="block text-gray-700 text-sm font-bold mb-2">Client ID:</label>
                    <input
                        type="number"
                        id="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lawyerId" className="block text-gray-700 text-sm font-bold mb-2">Lawyer ID:</label>
                    <input
                        type="number"
                        id="lawyerId"
                        value={lawyerId}
                        onChange={(e) => setLawyerId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="appointmentDate" className="block text-gray-700 text-sm font-bold mb-2">Appointment Date/Time:</label>
                    <input
                        type="datetime-local"
                        id="appointmentDate"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {isLoading ? "Creating..." : "Create Appointment"}
                </button>
            </form>
        </div>
    );
};

export default AppointmentCreate;