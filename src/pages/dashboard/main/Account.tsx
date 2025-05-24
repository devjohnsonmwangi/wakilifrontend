import { usersAPI, UserDataTypes } from "../../../features/users/usersAPI";
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTrash,
  FaUsersSlash, // For no users in system
  FaFilter,     // For no users matching filters
  FaExclamationCircle // For general API error
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Define a more specific type for roles if not already in UserDataTypes
type UserRole = "user" | "admin" | "lawyer" | "client" | "clerks" | "manager" | "supports";

// Define a type for API error responses from your backend's JSON payload
interface ApiErrorResponse {
  message?: string;
  error?: string ; // Can be a string or an object with more details
  detail?: string;
}

// Interface to represent the structure of errors from RTK Query
interface RtkQueryError {
  status?: number | string;
  data?: ApiErrorResponse | string ;
  error?: string;
  message?: string;
}


function Account() {
  const navigate = useNavigate();
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = usersAPI.useFetchUsersQuery();
  const [updateUserMutation] = usersAPI.useUpdateUserMutation();
  const [deleteUserMutation] = usersAPI.useDeleteUserMutation();

  const [updatingSelectRoleId, setUpdatingSelectRoleId] = useState<number | null>(null);
  const [togglingUserAdminRoleId, setTogglingUserAdminRoleId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  useEffect(() => {
    if (usersData) {
      // localStorage.setItem('userCount', usersData.length.toString());
    }
  }, [usersData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    setFilters({ name: '', email: '', phone_number: '', address: '' });
  };

  const getApiErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
      const errObj = error as RtkQueryError;
      if (errObj.data) {
        if (typeof errObj.data === 'object') {
          const errorData = errObj.data as ApiErrorResponse;
          if (errorData.message) return errorData.message;
          if (errorData.error && typeof errorData.error === 'string') return errorData.error;
          if (errorData.detail) return errorData.detail;
        } else if (typeof errObj.data === 'string') {
          return errObj.data;
        }
      }
      if (errObj.error && typeof errObj.error === 'string') {
        if (errObj.status === 'FETCH_ERROR') return `Network error: ${errObj.error}. Please check your internet connection.`;
        if (errObj.status === 'PARSING_ERROR') return `Error parsing server response: ${errObj.error}.`;
        return errObj.error;
      }
      if (errObj.message && typeof errObj.message === 'string') return errObj.message;
      if (typeof errObj.status === 'number') {
        if (errObj.status === 400) return 'Bad Request: The server could not understand the request (400).';
        if (errObj.status === 401) return 'Unauthorized: Authentication failed or is required (401).';
        if (errObj.status === 403) return 'Forbidden: You do not have permission to perform this action (403).';
        if (errObj.status === 404) return 'Not Found: The requested resource could not be found (404).';
        if (errObj.status === 422) return 'Validation Error: Please check the data you provided (422).';
        if (errObj.status >= 500) return `Server Error: The server encountered an internal error (${errObj.status}). Please try again later.`;
        return `Request failed with status code ${errObj.status}.`;
      }
      if (typeof errObj.status === 'string') return `An API interaction error occurred: ${errObj.status}.`;
    }
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred. Please try again.';
  };

  const handleRoleChangeFromSelect = async (userId: number, newRole: UserRole) => {
    setUpdatingSelectRoleId(userId);
    try {
      await updateUserMutation({ user_id: userId, role: newRole }).unwrap();
      toast.success(`🎉 Role for user ${userId} updated to ${newRole}!`);
      refetchUsers(); 
    } catch (error) {
      console.error('Error updating user role from select:', error);
      toast.error(`❌ Error updating role: ${getApiErrorMessage(error)}`);
    } finally {
      setUpdatingSelectRoleId(null);
    }
  };

  const handleToggleUserAdminRole = async (userId: number, currentRole: UserRole) => {
    setTogglingUserAdminRoleId(userId);
    const newRole: UserRole = (currentRole as UserRole) === 'admin' ? 'user' : 'admin'; 
    try {
      await updateUserMutation({ user_id: userId, role: newRole }).unwrap();
      toast.success(`🎉 Role for user ${userId} changed to ${newRole}!`);
      refetchUsers();
    } catch (error) {
      console.error('Error toggling user/admin role:', error);
      toast.error(`❌ Error changing role: ${getApiErrorMessage(error)}`);
    } finally {
      setTogglingUserAdminRoleId(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
        return;
    }
    try {
      await deleteUserMutation(userId).unwrap();
      toast.success('🎉 User deleted successfully!');
      refetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`❌ Error deleting user: ${getApiErrorMessage(error)}`);
    }
  };

  const filteredUsers = usersData?.filter((user: UserDataTypes) => {
    const { name, email, phone_number, address } = filters;
    return (
      (name ? user.full_name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true) &&
      (phone_number ? user.phone_number?.toLowerCase().includes(phone_number.toLowerCase()) : true) &&
      (address ? user.address?.toLowerCase().includes(address.toLowerCase()) : true)
    );
  }) || [];

  // Reusable component for stylish empty/error states
  const StylishMessage = ({ icon, title, message, children }: { icon: React.ReactNode; title: string; message?: string; children?: React.ReactNode }) => (
    <div className="text-center py-12 px-6 my-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl shadow-lg border border-slate-200">
      <div className="text-6xl mb-6 text-indigo-400 flex justify-center">
        {icon}
      </div>
      <h3 className="text-3xl font-semibold text-slate-700 mb-3">
        {title}
      </h3>
      {message && <p className="text-slate-500 text-lg">{message}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );


  const renderContent = () => {
    if (usersLoading) {
      return (
        <div className="text-center py-20">
          <div role="status" className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-lg text-indigo-700 mt-4 font-semibold">🚀 Loading user data... Please wait.</p>
        </div>
      );
    }

    if (usersError) {
      const rtkQueryError = usersError as RtkQueryError;

      if (rtkQueryError.status === 404) {
        const apiMessage = (rtkQueryError.data && typeof rtkQueryError.data === 'object')
          ? (rtkQueryError.data as ApiErrorResponse).message || (rtkQueryError.data as ApiErrorResponse).error || (rtkQueryError.data as ApiErrorResponse).detail
          : null;
        return (
          <StylishMessage
            icon={<FaUsersSlash />}
            title={typeof apiMessage === 'string' ? apiMessage : "No Users Found"}
            message="It seems there are no users currently in the system (API reported 404)."
          />
        );
      } else {
        const displayError = getApiErrorMessage(usersError);
        return (
          <StylishMessage
            icon={<FaExclamationCircle className="text-red-500" />}
            title="Oops! Something Went Wrong"
            message={displayError}
          >
            <p className="text-slate-500 mb-4">Please check your network connection. If the problem persists, contact support.</p>
            <button
              onClick={() => refetchUsers()}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
            >
              🔄 Retry
            </button>
          </StylishMessage>
        );
      }
    }

    // Handles API 200 OK with empty array
    if (!usersData || usersData.length === 0) {
      return (
        <StylishMessage
          icon={<FaUsersSlash />}
          title="No Users Found"
          message="The system currently has no user records. Perhaps it's time to add some!"
        />
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <StylishMessage
          icon={<FaFilter />}
          title="No Users Match Your Filters"
          message="Try adjusting your search criteria or reset the filters to see all users."
        >
          <button
            onClick={handleResetFilters}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            🔄 Reset Filters
          </button>
        </StylishMessage>
      );
    }

    return (
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Profile</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Address</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: UserDataTypes) => (
              <tr key={user.user_id} className="hover:bg-indigo-100 transition-colors duration-150">
                <td className="p-3 border-b border-gray-200">{user.user_id}</td>
                <td className="p-3 border-b border-gray-200">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={`${user.full_name}'s Profile`} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {user.full_name?.substring(0, 2).toUpperCase() || 'N/A'}
                    </div>
                  )}
                </td>
                <td className="p-3 border-b border-gray-200 font-medium">{user.full_name}</td>
                <td className="p-3 border-b border-gray-200">
                  <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                    <FaEnvelope className="inline mr-2" />
                    {user.email}
                  </a>
                </td>
                <td className="p-3 border-b border-gray-200">
                  {user.phone_number ? (
                    <a href={`tel:${user.phone_number}`} className="text-green-600 hover:text-green-800 hover:underline flex items-center">
                      <FaPhone className="inline mr-2" />
                      {user.phone_number}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-3 border-b border-gray-200">
                  {user.address ? (
                    <span className="flex items-center"><FaMapMarkerAlt className="inline mr-2 text-red-500" />{user.address}</span>
                  ) : (
                     <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-3 border-b border-gray-200">
                  
                <select
                  title="Change Role"
                  className="select select-bordered select-sm h-11 w-37 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={user.role}
                  onChange={(e) => handleRoleChangeFromSelect(user.user_id, e.target.value as UserRole)}
                  disabled={updatingSelectRoleId === user.user_id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="clerks">Clerk</option>
                  <option value="client">Client</option>
                  <option value="supports">Support</option>
                </select>
                </td>
                <td className="p-3 border-b border-gray-200">
               
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                    
                    <button
                      onClick={() => handleToggleUserAdminRole(user.user_id, user.role as UserRole)}
                      className="btn btn-sm bg-sky-500 text-white hover:bg-sky-600 w-full sm:w-auto px-3"
                      disabled={togglingUserAdminRoleId === user.user_id}
                      title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    >
                      {togglingUserAdminRoleId === user.user_id ? 'Updating...' : (user.role === 'admin' ? 'Make User' : 'Make Admin')}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600 w-full sm:w-auto px-3 flex items-center justify-center"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="p-4 md:p-6 bg-gradient-to-br from-slate-100 to-gray-200 min-h-screen">
        <div className="mb-4 flex justify-start">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition duration-150">
            🔙 Back
            </button>
        </div>
        <h1 className="text-center text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 tracking-tight">
          🚀 User Management Dashboard
        </h1>

        <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <input type="text" name="name" value={filters.name} onChange={handleInputChange} placeholder="🔍 Filter by name" className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500" />
            <input type="text" name="email" value={filters.email} onChange={handleInputChange} placeholder="✉️ Filter by email" className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500" />
            <input type="text" name="phone_number" value={filters.phone_number} onChange={handleInputChange} placeholder="📞 Filter by phone" className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500" />
            <input type="text" name="address" value={filters.address} onChange={handleInputChange} placeholder="📍 Filter by address" className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500" />
            <button onClick={handleResetFilters} className="btn bg-indigo-500 text-white hover:bg-indigo-600 w-full sm:w-auto sm:col-span-2 lg:col-span-1">
                🔄 Reset Filters
            </button>
            </div>
        </div>

        {renderContent()}
      </div>
    </>
  );
}

export default Account;