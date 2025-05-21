import { usersAPI, UserDataTypes } from "../../../features/users/usersAPI";
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTrash } from 'react-icons/fa'; // Import FaTrash icon
import { useNavigate } from 'react-router-dom';  

function Account() {
  const navigate = useNavigate(); 
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = usersAPI.useFetchUsersQuery();
  const [isUpdatingRole, setIsUpdatingRole] = useState<number | null>(null);
  const [updateUser] = usersAPI.useUpdateUserMutation();
  const [deleteUser] = usersAPI.useDeleteUserMutation();
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  useEffect(() => {
    if (usersData) {
      localStorage.setItem('userDetails', JSON.stringify(usersData));
    }
  }, [usersData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    setFilters({ name: '', email: '', phone_number: '', address: '' });
  };

  const handleRoleChange = async (userId: number, newRole: "user" | "admin" | "lawyer" | "client" | "clerk" | "manager" | "support") => {
    setIsUpdatingRole(userId);
    try {
      await updateUser({ user_id: userId, role: newRole });
      toast.success('🎉 Role updated successfully!');
      refetchUsers();
    } catch (error) {
      console.error('Error updating user role', error);
      toast.error('❌ Error updating user role');
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await deleteUser(userId);
      if (response && 'error' in response && typeof response.error === 'string') {
        throw new Error(response);
      }
      toast.success('🎉 User deleted successfully!');
      refetchUsers();
    } catch (error) {
      console.error('Error deleting user', error); 
      toast.error('❌ Error deleting user');
    }
  };
  
  if (usersLoading) {
    return <div>🚀 Loading user data...</div>;
  }

  if (usersError) {
    return  <div className="flex justify-center items-center h-screen">
    <div className="text-center text-xl text-red-600">
        Error loading users data 😞. Please  check your network and refresh the page . if connected to  internet and  this error persists contact support team
    </div>
</div>
  }

  if (!usersData || usersData.length === 0) {
    return <div>🚫 No Users Found</div>;
  }

  const filteredUsers = usersData.filter((user: UserDataTypes) => {
    const { name, email, phone_number, address } = filters;
    return (
      (name ? user.full_name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true) &&
      (phone_number ? user.phone_number.toLowerCase().includes(phone_number.toLowerCase()) : true) &&
      (address ? user.address.toLowerCase().includes(address.toLowerCase()) : true)
    );
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className="overflow-x-auto rounded-lg p-6 bg-gradient-to-br from-slate-100 to-gray-300 min-h-screen">
        <button onClick={() => navigate(-1)} className="mb-4 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          🔙 Back
        </button>
        <h2 className="text-center text-3xl font-extrabold text-indigo-600">🚀 User Management Dashboard</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
          <input type="text" name="name" value={filters.name} onChange={handleInputChange} placeholder="🔍 Filter by name" className="input input-bordered w-full" />
          <input type="text" name="email" value={filters.email} onChange={handleInputChange} placeholder="✉️ Filter by email" className="input input-bordered w-full" />
          <input type="text" name="phone_number" value={filters.phone_number} onChange={handleInputChange} placeholder="📞 Filter by phone" className="input input-bordered w-full" />
          <input type="text" name="address" value={filters.address} onChange={handleInputChange} placeholder="📍 Filter by address" className="input input-bordered w-full" />
          <button onClick={handleResetFilters} className="btn bg-indigo-500 text-white hover:bg-indigo-600">🔄 Reset</button>
        </div>

        <div className="overflow-x-auto"> {/* Add this div for scrolling */}
          <table className="table table-zebra w-full shadow-md rounded-lg">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th>ID</th>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: UserDataTypes) => (
                <tr key={user.user_id} className="hover:bg-indigo-50">
                  <td>{user.user_id}</td>
                  <td>
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white">No Image</span>
                      </div>
                    )}
                  </td>
                  <td>{user.full_name}</td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-indigo-600 hover:underline">
                      <FaEnvelope className="inline mr-1" />
                      {user.email}
                    </a>
                  </td>
                  <td>
                    <a href={`tel:${user.phone_number}`} className="text-green-600 hover:underline">
                      <FaPhone className="inline mr-1" />
                      {user.phone_number}
                    </a>
                  </td>
                  <td><FaMapMarkerAlt className="inline mr-1 text-red-600" />{user.address}</td>
                  <td>
                    <select
                      title="Change Role"
                      className="select select-bordered"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value as "user" | "admin" | "lawyer" | "client" | "clerk" | "manager" | "support")}
                      disabled={isUpdatingRole === user.user_id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="clerk">Clerk</option>
                      <option value="client">Client</option>
                      <option value="support">Support</option>
                    </select>
                  </td>
                  <td className="flex flex-col sm:flex-row gap-2"> {/* Change to flex-col for mobile responsiveness */}
                    <button 
                      onClick={() => handleRoleChange(user.user_id, user.role === 'user' ? 'admin' : 'user')}
                      className="btn bg-green-500 text-white hover:bg-green-600 max-w-[100px] sm:max-w-[120px]" // Limit width for larger screens
                      disabled={isUpdatingRole === user.user_id}
                    >
                      {isUpdatingRole === user.user_id ? 'Updating...' : 'Change Role'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.user_id)} 
                      className="btn bg-red-500 text-white hover:bg-red-600 max-w-[100px] sm:max-w-[120px] flex items-center justify-center" // Limit width for larger screens
                    >
                      <FaTrash className="text-white" /> {/* Only the trash icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Account;
