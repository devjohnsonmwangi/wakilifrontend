import { UserPlus, AlertTriangle, Fingerprint, UserCircle, User, Mail, Phone, MapPin, Tag, Settings, Shield, Trash2, Sun, Moon, Search, X, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import AddClientModal from './registerclients';

import { usersAPI, UserDataTypes } from "../../../features/users/usersAPI";

// --- Type Definitions ---
type UserRole = "user" | "admin" | "lawyer" | "client" | "clerks" | "manager" | "supports";
interface ApiErrorResponse { message?: string; error?: string; detail?: string; }
interface RtkQueryError { status?: number | string; data?: ApiErrorResponse | string; error?: string; message?: string; }

// --- Constant for Roles ---
const ROLES: { value: UserRole; label: string }[] = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'lawyer', label: 'Lawyer' },
    { value: 'clerks', label: 'Clerk' },
    { value: 'client', label: 'Client' },
    { value: 'supports', label: 'Support' },
];


// --- NEW: Custom Role Dropdown Component ---
const CustomRoleDropdown = ({
  userId,
  currentRole,
  onRoleChange,
  isLoading,
  isOpen,
  onToggle,
  onClose
}: {
  userId: number;
  currentRole: UserRole;
  onRoleChange: (userId: number, newRole: UserRole) => void;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentRoleLabel = ROLES.find(r => r.value === currentRole)?.label || 'Unknown Role';

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelect = (newRole: UserRole) => {
    onRoleChange(userId, newRole);
    onClose();
  };

  return (
    <div className="relative w-32" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        disabled={isLoading}
        className="relative w-full text-left bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors flex items-center justify-between"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </span>
        ) : (
          <>
            <span className="truncate">{currentRoleLabel}</span>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="py-1 max-h-60 overflow-auto">
            {ROLES.map((role) => (
              <li
                key={role.value}
                onClick={() => handleSelect(role.value)}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm ${
                  currentRole === role.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className={`block truncate ${currentRole === role.value ? 'font-semibold' : 'font-normal'}`}>
                  {role.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// --- Confirmation Modal Component (Unchanged) ---
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="flex justify-center text-red-500 dark:text-red-400 mb-4">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {children}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none rounded-lg transition-transform active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 border-none rounded-lg transition-transform active:scale-95"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


function Account() {
  const navigate = useNavigate();
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = usersAPI.useFetchUsersQuery();
  const [updateUserMutation] = usersAPI.useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = usersAPI.useDeleteUserMutation();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDataTypes | null>(null);

  const [updatingSelectRoleId, setUpdatingSelectRoleId] = useState<number | null>(null);
  const [togglingUserAdminRoleId, setTogglingUserAdminRoleId] = useState<number | null>(null);
  
  // NEW: State to manage which dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme');
      return savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (usersData) {
       localStorage.setItem('userCount', usersData.length.toString());
    }
  }, [usersData]);

  const handleRegistrationSuccess = () => refetchUsers();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleResetFilters = () => setFilters({ name: '', email: '', phone_number: '', address: '' });
  const handleClearFilter = (filterName: keyof typeof filters) => setFilters(prev => ({ ...prev, [filterName]: '' }));

  // --- (Helper functions are unchanged) ---
  const getApiErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
      const errObj = error as RtkQueryError;
      if (errObj.data) {
        if (typeof errObj.data === 'object') {
          const errorData = errObj.data as ApiErrorResponse;
          if (errorData.message) return errorData.message;
          if (errorData.error && typeof errorData.error === 'string') return errorData.error;
          if (errorData.detail) return errorData.detail;
        } else if (typeof errObj.data === 'string') { return errObj.data; }
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
    } catch (error) { toast.error(`❌ Error updating role: ${getApiErrorMessage(error)}`);
    } finally { setUpdatingSelectRoleId(null); }
  };

  const handleToggleUserAdminRole = async (userId: number, currentRole: UserRole) => {
    setTogglingUserAdminRoleId(userId);
    const newRole: UserRole = (currentRole as UserRole) === 'admin' ? 'user' : 'admin';
    try {
      await updateUserMutation({ user_id: userId, role: newRole }).unwrap();
      toast.success(`🎉 Role for user ${userId} changed to ${newRole}!`);
      refetchUsers();
    } catch (error) { toast.error(`❌ Error changing role: ${getApiErrorMessage(error)}`);
    } finally { setTogglingUserAdminRoleId(null); }
  };

  const handleDeleteUserClick = (user: UserDataTypes) => setUserToDelete(user);

  const executeDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMutation(userToDelete.user_id).unwrap();
      toast.success(`User '${userToDelete.full_name}' deleted successfully!`);
      refetchUsers();
    } catch (error) { toast.error(`❌ Error deleting user: ${getApiErrorMessage(error)}`);
    } finally { setUserToDelete(null); }
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

  const HeaderCell = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <th className="px-2 py-3 md:p-4 whitespace-nowrap"><div className="flex items-center font-semibold"><Icon className="mr-2 h-4 w-4" /> {text}</div></th>
  );
  
  const HeaderCellCenter = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <th className="px-2 py-3 md:p-4 text-center whitespace-nowrap"><div className="flex items-center justify-center font-semibold"><Icon className="mr-2 h-4 w-4" /> {text}</div></th>
  );

  const StylishMessage = ({ icon, title, message, children }: { icon: React.ReactNode; title: string; message?: string; children?: React.ReactNode }) => (
    <div className="text-center py-12 px-6 my-8 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"><div className="text-6xl mb-6 text-indigo-500 dark:text-indigo-400 flex justify-center">{icon}</div><h3 className="text-3xl font-semibold text-slate-700 dark:text-slate-100 mb-3">{title}</h3>{message && <p className="text-slate-500 dark:text-slate-400 text-lg">{message}</p>}{children && <div className="mt-6">{children}</div>}</div>
  );

  const inputBaseClasses = `block w-full text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 transition-colors placeholder-slate-400 dark:placeholder-slate-500`;

  const renderContent = () => {
    if (usersLoading) return ( <div className="text-center py-20"><div role="status" className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 dark:border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" /><p className="text-lg text-indigo-700 dark:text-indigo-300 mt-4 font-semibold">🚀 Loading user data...</p></div> );
    if (usersError) { const rtkQueryError = usersError as RtkQueryError; if (rtkQueryError.status === 404) return <StylishMessage icon={<Shield />} title="No Users Found" message="The system has no users (API reported 404)." />; else { const displayError = getApiErrorMessage(usersError); return ( <StylishMessage icon={<AlertTriangle className="text-red-500 dark:text-red-400" />} title="Oops! Something Went Wrong" message={displayError}><p className="text-slate-500 dark:text-slate-400 mb-4">Please check your network connection. If the problem persists, contact support.</p><button onClick={() => refetchUsers()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-transform active:scale-95 shadow-md">🔄 Retry</button></StylishMessage> ); } }
    if (!usersData || usersData.length === 0) return <StylishMessage icon={<Shield />} title="No Users Found" message="The system currently has no user records. Add one to get started!" />;
    if (filteredUsers.length === 0) return ( <StylishMessage icon={<Search />} title="No Users Match Your Filters" message="Try adjusting your search criteria or reset the filters."><button onClick={handleResetFilters} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-transform active:scale-95 shadow-md">🔄 Reset Filters</button></StylishMessage> );
    
    return (
      <div className="overflow-x-auto shadow-xl dark:shadow-black/20 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-indigo-700 text-white dark:bg-slate-700 dark:text-slate-200 uppercase tracking-wider">
            <tr>
              <HeaderCell icon={Fingerprint} text="ID" />
              <HeaderCell icon={UserCircle} text="Profile" />
              <HeaderCell icon={User} text="Full Name" />
              <HeaderCell icon={Mail} text="Email" />
              <HeaderCell icon={Phone} text="Phone" />
              <HeaderCell icon={MapPin} text="Address" />
              <HeaderCell icon={Tag} text="Role" />
              <HeaderCellCenter icon={Settings} text="Actions" />
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {filteredUsers.map((user: UserDataTypes) => (
              <tr key={user.user_id} className="hover:bg-gray-200 dark:hover:bg-slate-600 odd:bg-gray-100 even:bg-gray-50 dark:odd:bg-slate-800 dark:even:bg-slate-700 transition-colors duration-150">
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 whitespace-nowrap"><div className="flex items-center"><Fingerprint className="inline mr-1.5 h-4 w-4 text-slate-400 dark:text-slate-500" />{user.user_id}</div></td>
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 whitespace-nowrap">{user.profile_picture ? <img src={user.profile_picture} alt={`${user.full_name}'s Profile`} className="w-12 h-12 rounded-full object-cover shadow-sm" /> : <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-lg font-semibold shadow-sm">{user.full_name?.substring(0, 2).toUpperCase() || 'N/A'}</div>}</td>
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">{user.full_name}</td>
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 whitespace-nowrap"><a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline flex items-center"><Mail className="inline mr-2 h-4 w-4" />{user.email}</a></td>
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 whitespace-nowrap">{user.phone_number ? <a href={`tel:${user.phone_number}`} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline flex items-center"><Phone className="inline mr-2 h-4 w-4" />{user.phone_number}</a> : <span className="text-slate-400 dark:text-slate-500">N/A</span>}</td>
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 whitespace-nowrap">{user.address ? <span className="flex items-center"><MapPin className="inline mr-2 h-4 w-4 text-red-500 dark:text-red-400" />{user.address}</span> : <span className="text-slate-400 dark:text-slate-500">N/A</span>}</td>
                
                {/* --- REPLACED with CustomRoleDropdown --- */}
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600">
                  <CustomRoleDropdown
                    userId={user.user_id}
                    currentRole={user.role as UserRole}
                    onRoleChange={handleRoleChangeFromSelect}
                    isLoading={updatingSelectRoleId === user.user_id}
                    isOpen={openDropdownId === user.user_id}
                    onToggle={() => setOpenDropdownId(openDropdownId === user.user_id ? null : user.user_id)}
                    onClose={() => setOpenDropdownId(null)}
                  />
                </td>
                
                <td className="px-2 py-3 md:p-4 border-b border-slate-200 dark:border-slate-600 whitespace-nowrap"><div className="flex flex-row gap-2 items-center justify-center"><button onClick={() => handleToggleUserAdminRole(user.user_id, user.role as UserRole)} className="px-2 py-1.5 text-xs font-semibold rounded-md bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 transition-transform active:scale-95 flex items-center justify-center" disabled={togglingUserAdminRoleId === user.user_id} title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}><Shield size={16} /><span className="hidden sm:inline ml-1.5">{togglingUserAdminRoleId === user.user_id ? '...' : (user.role === 'admin' ? 'User' : 'Admin')}</span></button><button onClick={() => handleDeleteUserClick(user)} className="px-2 py-1.5 text-xs font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center transition-transform active:scale-95" title="Delete User" disabled={isDeleting && userToDelete?.user_id === user.user_id}><Trash2 size={14} /><span className="hidden sm:inline ml-1.5">Delete</span></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
      <div className="p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="mb-4 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md transition-transform active:scale-95">
              🔙 Back
            </button>
            <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors" aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-6 tracking-tight">
          🚀 User Management Dashboard
        </h1>

        <div className="mb-6 p-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
            <div className='flex justify-between items-center mb-4'>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-slate-100">Filter Users</h2>
              <button onClick={() => setIsAddUserModalOpen(true)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-md transition-transform active:scale-95 flex items-center gap-2">
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Add New User</span>
                  <span className="sm:hidden">Add</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Name Filter */}
                <div className="relative lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                  <input type="text" name="name" value={filters.name} onChange={handleInputChange} placeholder="Filter by name..." className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} />
                  {filters.name && (<button type="button" onClick={() => handleClearFilter('name')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}
                </div>
                {/* Email Filter */}
                <div className="relative lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                  <input type="text" name="email" value={filters.email} onChange={handleInputChange} placeholder="Filter by email..." className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} />
                  {filters.email && (<button type="button" onClick={() => handleClearFilter('email')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}
                </div>
                {/* Phone Filter */}
                <div className="relative lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                  <input type="text" name="phone_number" value={filters.phone_number} onChange={handleInputChange} placeholder="Filter by phone..." className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} />
                  {filters.phone_number && (<button type="button" onClick={() => handleClearFilter('phone_number')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}
                </div>
                {/* Address Filter */}
                <div className="relative lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                  <input type="text" name="address" value={filters.address} onChange={handleInputChange} placeholder="Filter by address..." className={`${inputBaseClasses} py-2.5 pl-9 pr-8`} />
                  {filters.address && (<button type="button" onClick={() => handleClearFilter('address')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><X size={16} /></button>)}
                </div>
                {/* Reset Button */}
                <div className="lg:col-span-1">
                    <button onClick={handleResetFilters} className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-transform active:scale-95">
                        🔄 Reset All Filters
                    </button>
                </div>
            </div>
        </div>

        {renderContent()}
      </div>

      <AddClientModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onSuccess={handleRegistrationSuccess} />

      <ConfirmationModal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} onConfirm={executeDelete} title="Confirm User Deletion">
        Are you sure you want to permanently delete the user{' '}
        <strong className="text-slate-800 dark:text-slate-100">{userToDelete?.full_name}</strong>? This action cannot be undone.
      </ConfirmationModal>
    </>
  );
}

export default Account;