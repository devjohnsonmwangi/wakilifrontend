import React, { useState, useMemo } from 'react';
import {
  useFetchAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  AppointmentDataTypes,
  AppointmentStatus
} from '../../../../features/appointment/appointmentapi'; // Adjust path
import { useFetchBranchLocationsQuery } from '../../../../features/branchlocation/branchlocationapi'; // Adjust path
import { Toaster, toast } from 'sonner';
import CreateAppointment from './createappointment'; // Adjust path
import EditAppointment from './editappointments'; // Adjust path

const ListAppointments: React.FC = () => {
  const { data: appointments, isLoading, isError, refetch } = useFetchAppointmentsQuery();
  const { data: branchLocations } = useFetchBranchLocationsQuery(); // Fetch branch locations
  const [updateAppointment, { isLoading: isStatusLoading }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeleteLoading }] = useDeleteAppointmentMutation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataTypes | null>(null);

  // State for filtering
  const [searchStatus, setSearchStatus] = useState('');
  const [searchParty, setSearchParty] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (appointment: AppointmentDataTypes) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedAppointment(null);
    setIsEditModalOpen(false);
  };

  const handleAppointmentCreated = () => {
    refetch(); // Refresh the list after creating an appointment
  };

  const handleAppointmentUpdated = () => {
    refetch(); // Refresh the list after updating an appointment
  };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment({ appointment_id: appointmentId, status: newStatus }).unwrap();
      toast.success(`Appointment status updated to ${newStatus}!`);
      refetch(); // Refresh the list after status update
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      toast.error('Failed to update appointment status. Please try again.');
    }
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    try {
      await deleteAppointment(appointmentId).unwrap();
      toast.success('Appointment deleted successfully!');
      refetch(); // Refresh the list after deleting an appointment
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      toast.error('Failed to delete appointment. Please try again.');
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments?.filter(appointment => {
      const statusMatch = searchStatus ? appointment.status === searchStatus : true;
      const partyMatch = searchParty ? appointment.party.toLowerCase().includes(searchParty.toLowerCase()) : true;

      // Match branch location with the filter
      const branchLocationName = branchLocations?.find(location => location.branch_id === appointment.branch_id)?.name || '';
      const locationMatch = searchLocation ? branchLocationName.toLowerCase().includes(searchLocation.toLowerCase()) : true;

      return statusMatch && partyMatch && locationMatch;
    });
  }, [appointments, searchStatus, searchParty, searchLocation, branchLocations]);

  if (isLoading) {
    return <div className="text-center py-4">Loading appointments...</div>;
  }

  if (isError) {
    return <div className="text-center py-4 text-red-500">Error loading appointments.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster richColors closeButton />
      <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-6 text-center">
        Appointments
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Appointment
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by party"
          value={searchParty}
          onChange={(e) => setSearchParty(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Filter by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <select
          title='Filter by status'
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-xl"> {/* Apply shadow here */}
        <div className="min-w-full overflow-hidden"> {/*Ensure inner div doesn't clip shadow */}
          <table className="min-w-full leading-normal table-auto">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">ID</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Party</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Date</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Time</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Reason</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Status</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Location</th>
                <th className="px-2 py-3 text-left text-lg font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments?.map((appointment) => (
                <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-lg font-medium text-gray-900">{appointment.appointment_id}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg text-gray-700">{appointment.party}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg text-gray-700">{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg text-gray-700">{appointment.appointment_time}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg text-gray-700">
                    <div className="w-48 max-h-20 overflow-y-auto">
                      <textarea
                        title='Reason'
                        readOnly
                        value={appointment.reason}
                        rows={2}
                        className="shadow-md appearance-none border-none bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg text-gray-700">
                    <select
                      title="Change Status"
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value as AppointmentStatus)}
                      className="shadow-md appearance-none border-none bg-gray-100 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                      disabled={isStatusLoading}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg text-gray-700">
                    {branchLocations?.find(location => location.branch_id === appointment.branch_id)?.name || 'N/A'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => openEditModal(appointment)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.appointment_id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-lg"
                        disabled={isDeleteLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateAppointment
          onAppointmentCreated={handleAppointmentCreated}
          onClose={closeCreateModal}
        />
      )}

      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          appointment={selectedAppointment}
          onAppointmentUpdated={handleAppointmentUpdated}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default ListAppointments;
