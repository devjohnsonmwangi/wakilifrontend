// EditAppointment.tsx

import React, { useState, useEffect } from 'react';
import {
  useUpdateAppointmentMutation,
  AppointmentDataTypes,
} from '../../../../features/appointment/appointmentapi'; // Adjust path
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; // Adjust path
import { useFetchUsersQuery } from '../../../../features/users/usersAPI'; // Adjust path
import { Toaster, toast } from 'sonner';

interface EditAppointmentProps {
  appointment: AppointmentDataTypes; // Pass the appointment data to edit
  onAppointmentUpdated?: () => void; // Callback after successful update
  onClose: () => void;
}

const EditAppointment: React.FC<EditAppointmentProps> = ({ appointment, onAppointmentUpdated, onClose }) => {
  const [updateAppointment, { isLoading: isUpdateLoading, isError: isUpdateError }] = useUpdateAppointmentMutation();
  const { data: branches, isLoading: isBranchesLoading, isError: isBranchesError } = useFetchBranchLocationsQuery();
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useFetchUsersQuery();

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(appointment.branch_id);
  const [party, setParty] = useState(appointment.party);
  const [appointmentDate, setAppointmentDate] = useState(appointment.appointment_date);
  const [appointmentTime, setAppointmentTime] = useState(appointment.appointment_time);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(appointment.user_id);
  const [reason, setReason] = useState(appointment.reason || ''); // Use empty string if reason is undefined

  useEffect(() => {
    // Initialize state with appointment data when the component mounts or when the appointment prop changes
    setSelectedBranchId(appointment.branch_id);
    setParty(appointment.party);
    setAppointmentDate(appointment.appointment_date);
    setAppointmentTime(appointment.appointment_time);
    setSelectedUserId(appointment.user_id);
    setReason(appointment.reason || '');
  }, [appointment]); // Run when 'appointment' prop changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBranchId || !party || !appointmentDate || !appointmentTime || !selectedUserId || !reason) {
      toast.error('Please fill in all fields.');
      return;
    }

    const updatedAppointment: Omit<AppointmentDataTypes, 'created_at' | 'updated_at' | 'appointment_id'> = {
      user_id: selectedUserId,
      branch_id: selectedBranchId,
      party: party,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: appointment.status, // Keep the original status
      reason: reason,
    };

    try {
      await updateAppointment({
        appointment_id: appointment.appointment_id,
        ...updatedAppointment,
        appointment_date: new Date(appointmentDate).toISOString(), // Convert to ISO string
        appointment_time: appointmentTime //Make sure the date is string
      }).unwrap();
      toast.success('Appointment updated successfully!');
      if (onAppointmentUpdated) {
        onAppointmentUpdated();
      }
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Failed to update appointment. Please try again.');
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
      <div className="relative top-20 mx-auto p-8 border shadow-lg rounded-xl bg-white w-3/4 md:w-2/3 lg:w-1/2">
        <div className="mt-3 text-center">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-extrabold text-blue-700 tracking-tight">
              Edit Appointment
            </h3>
            <button
              title="close module"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-7 py-3">
            <Toaster richColors closeButton />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="branch" className="block text-blue-500 text-sm font-bold mb-2">Branch:</label>
                <select
                  id="branch"
                  value={selectedBranchId || ''}
                  onChange={(e) => setSelectedBranchId(parseInt(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                <label htmlFor="userId" className="block text-blue-500 text-sm font-bold mb-2">Appointment Administer:</label>
                <select
                  id="userId"
                  value={selectedUserId || ''}
                  onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isUsersLoading}
                >
                  <option value="">Appointment Administer:</option>
                  {filteredUsers && filteredUsers.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.full_name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="party" className="block text-blue-500 text-sm font-bold mb-2">Party:</label>
                <input
                  type="text"
                  id="party"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="appointmentDate" className="block text-blue-500 text-sm font-bold mb-2">Date:</label>
                <input
                  type="date"
                  id="appointmentDate"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="appointmentTime" className="block text-blue-500 text-sm font-bold mb-2">Time:</label>
                <input
                  type="time"
                  id="appointmentTime"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-blue-500 text-sm font-bold mb-2">Reason:</label>
                <textarea
                  id="reason"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={onClose}
                  className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline ${isUpdateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? 'Updating...' : 'Update Appointment'}
                </button>
              </div>

              {isUpdateError && <div className="text-red-500 text-sm italic">Error updating appointment.</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;