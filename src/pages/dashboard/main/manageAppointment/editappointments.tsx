import React, { useState, useEffect } from "react";
import {
    useUpdateAppointmentMutation,useGetAppointmentByIdQuery, AppointmentDataTypes, AppointmentStatus } from "../../../../features/appointment/appointmentapi";

import { toast } from "sonner";

interface AppointmentEditProps {
    appointmentId: number;
    onAppointmentUpdated?: (appointment: AppointmentDataTypes) => void; //For calendar update
}

const AppointmentEdit: React.FC<AppointmentEditProps> = ({ appointmentId, onAppointmentUpdated }) => {
    const { data: appointment, isLoading: appointmentLoading, isError: appointmentError } =
        useGetAppointmentByIdQuery(appointmentId);

    const [clientId, setClientId] = useState("");
    const [lawyerId, setLawyerId] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [status, setStatus] = useState<AppointmentStatus>("pending");  // Default value

    const [updateAppointment, { isLoading: updateLoading }] = useUpdateAppointmentMutation();

    useEffect(() => {
        if (appointment) {
            setClientId(appointment.client_id.toString());
            setLawyerId(appointment.lawyer_id.toString());
            setAppointmentDate(appointment.appointment_date);
            setStatus(appointment.status);
        }
    }, [appointment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedAppointment = {
            appointment_id: appointmentId,
            client_id: parseInt(clientId),
            lawyer_id: parseInt(lawyerId),
            appointment_date: appointmentDate,
            status: status,
        };

        try {
            const result = await updateAppointment(updatedAppointment).unwrap();
            toast.success("Appointment updated successfully!");
            if (onAppointmentUpdated) {
                onAppointmentUpdated(result);  // Update calendar
            }
        } catch (error: any) {
            console.error("Failed to update appointment:", error);
            toast.error(`Failed to update appointment: ${error.message}`);
        }
    };

    if (appointmentLoading) return <div>Loading appointment...</div>;
    if (appointmentError) return <div>Error loading appointment.</div>;
    if (!appointment) return <div>Appointment not found.</div>;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">Edit Appointment</h2>
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
                    disabled={updateLoading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {updateLoading ? "Updating..." : "Update Appointment"}
                </button>
            </form>
        </div>
    );
};

export default AppointmentEdit;