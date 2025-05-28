// CreateAppointment.tsx

import React, { useState } from 'react';
import { useCreateAppointmentMutation, AppointmentDataTypes } from '../../../../features/appointment/appointmentapi';
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi';
import { useFetchUsersQuery } from '../../../../features/users/usersAPI';
import { Toaster, toast } from 'sonner';

interface CreateAppointmentProps {
    forBranchId: string | number; 
    onAppointmentCreated?: () => void;
    onClose: () => void; // Add onClose props
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ onAppointmentCreated, onClose }) => {
    const [createAppointment, { isLoading: isAppointmentLoading, isError: isAppointmentError }] = useCreateAppointmentMutation();
    const { data: branches, isLoading: isBranchesLoading, isError: isBranchesError } = useFetchBranchLocationsQuery();
    const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useFetchUsersQuery();
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [party, setParty] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [reason, setReason] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBranchId || !party || !appointmentDate || !appointmentTime || !selectedUserId || !reason) {
            toast.error('Please fill in all fields.');
            return;
        }

        const newAppointment: Omit<AppointmentDataTypes, 'appointment_id'> = {
            user_id: selectedUserId,
            branch_id: selectedBranchId,
            party: party,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            status: 'pending',
            reason: reason,
        };

        try {
            await createAppointment(newAppointment).unwrap();
            toast.success('Appointment created successfully!');
            setParty('');
            setAppointmentDate('');
            setAppointmentTime('');
            setSelectedBranchId(null);
            setSelectedUserId(null);
            setReason('');

            if (onAppointmentCreated) {
                onAppointmentCreated();
            }
            onClose(); // Close the modal after successful creation
        } catch (error) {
            console.error('Failed to create appointment:', error);
            toast.error('Failed to create appointment. Please try again.');
        }
    };

    if (isBranchesLoading) {
        return <div className="text-center py-4">Loading branches...</div>;
    }

    if (isBranchesError) {
        return <div className="text-center py-4 text-red-500">Error loading branches.</div>;
    }

    if (isUsersLoading) {
        return <div className="text-center py-4">Loading users...</div>;
    }

    if (isUsersError) {
        return <div className="text-center py-4 text-red-500">Error loading users.</div>;
    }

    const filteredUsers = users ? users.filter(user => user.role !== "client" && user.role !== "user") : [];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-4 sm:p-6 border shadow-lg rounded-xl bg-white max-w-md w-full">
                {/* Adjusted width */}
                <div className="mt-3 text-center">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-blue-700 tracking-tight break-words">
                            Schedule Appointment
                        </h3>
                        <button
                            title="close modal"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="px-4 py-3">
                        <Toaster richColors closeButton />
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="branch" className="block text-blue-500 text-sm font-bold mb-1">Branch:</label>
                                <select
                                    id="branch"
                                    value={selectedBranchId || ''}
                                    onChange={(e) => setSelectedBranchId(parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    disabled={isBranchesLoading}
                                >
                                    <option value="">Select a Branch</option>
                                    {branches && branches.map((branch) => (
                                        <option key={branch.branch_id} value={branch.branch_id}>
                                            {branch.name} - {branch.address}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="userId" className="block text-blue-500 text-sm font-bold mb-1">Appointment Administer:</label>
                                <select
                                    id="userId"
                                    value={selectedUserId || ''}
                                    onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    disabled={isUsersLoading}
                                >
                                    <option value="">Appointment Administer</option>
                                    {filteredUsers && filteredUsers.map((user) => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.full_name} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="party" className="block text-blue-500 text-sm font-bold mb-1">Party:</label>
                                <input
                                    type="text"
                                    id="party"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={party}
                                    onChange={(e) => setParty(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="appointmentDate" className="block text-blue-500 text-sm font-bold mb-1">Date:</label>
                                <input
                                    type="date"
                                    id="appointmentDate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="appointmentTime" className="block text-blue-500 text-sm font-bold mb-1">Time:</label>
                                <input
                                    type="time"
                                    id="appointmentTime"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="reason" className="block text-blue-500 text-sm font-bold mb-1">Reason:</label>
                                <textarea
                                    id="reason"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row justify-between">
                                <button
                                    onClick={onClose}
                                    className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm ${isAppointmentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isAppointmentLoading}
                                >
                                    {isAppointmentLoading ? 'Scheduling...' : 'Schedule Appointment'}
                                </button>
                            </div>

                            {isAppointmentError && <div className="text-red-500 text-sm italic">Error creating appointment.</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointment;
