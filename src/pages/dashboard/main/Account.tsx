// src/pages/dashboard/main/AdminDashboard/Account.tsx
import { UserPlus, AlertTriangle, Fingerprint, UserCircle, User, Mail, Phone, MapPin, Tag, Settings, Shield, Trash2, Sun, Moon, Search, ChevronDown, Loader2, RefreshCw, Table as TableIcon, PieChart as PieChartIcon, Filter as FilterIcon, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import AddClientModal from './registerclients';
import { motion } from 'framer-motion';
import { usersAPI, UserDataTypes } from "../../../features/users/usersAPI"; // Ensure UserDataTypes has profile_pic_url
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- Type Definitions ---
// NOTE: Make sure your UserDataTypes interface in usersAPI.ts includes the optional profile_pic_url field
/*
export interface UserDataTypes {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  phone_number?: string;
  address?: string;
  profile_pic_url?: string; // <-- ADD THIS FIELD TO YOUR TYPE DEFINITION
}
*/
type UserRole = "user" | "admin" | "lawyer" | "client" | "clerks" | "manager" | "supports";
interface ApiErrorResponse { message?: string; error?: string; detail?: string; }
interface RtkQueryError { status?: number | string; data?: ApiErrorResponse | string; error?: string; message?: string; }
type Tab = 'dashboard' | 'analytics';

const ITEMS_PER_PAGE = 15;

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

const roleIcons: { [key in UserRole]: React.ElementType } = {
    admin: Shield, manager: Briefcase, lawyer: Briefcase, clerks: User, client: UserCircle, supports: Settings, user: User,
};

// --- Custom Role Dropdown Component ---
const CustomRoleDropdown = ({ userId, currentRole, onRoleChange, isLoading, isOpen, onToggle, onClose }: { userId: number; currentRole: UserRole; onRoleChange: (userId: number, newRole: UserRole) => void; isLoading: boolean; isOpen: boolean; onToggle: () => void; onClose: () => void; }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentRoleLabel = ROLES.find(r => r.value === currentRole)?.label || 'Unknown Role';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { onClose(); }
    };
    if (isOpen) { document.addEventListener('mousedown', handleClickOutside); }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isOpen, onClose]);

  const handleSelect = (newRole: UserRole) => { onRoleChange(userId, newRole); onClose(); };

  return (
    <div className="relative w-36" ref={dropdownRef}>
      <button type="button" onClick={onToggle} disabled={isLoading} className="relative w-full text-left bg-slate-50 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors flex items-center justify-between">
        {isLoading ? ( <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Updating...</span>) : (
          <><span className="truncate">{currentRoleLabel}</span><ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="py-1 max-h-60 overflow-auto">
            {ROLES.map((role) => (
              <li key={role.value} onClick={() => handleSelect(role.value)} className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm ${currentRole === role.value ? 'bg-indigo-600 text-white' : 'text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <span className={`block truncate ${currentRole === role.value ? 'font-semibold' : 'font-normal'}`}>{role.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children,}: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; children: React.ReactNode; }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="flex justify-center text-red-500 dark:text-red-400 mb-4"><AlertTriangle size={48} strokeWidth={1.5} /></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{children}</div>
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none rounded-lg transition-transform active:scale-95">Cancel</button>
            <button onClick={onConfirm} className="px-6 py-2.5 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 border-none rounded-lg transition-transform active:scale-95">Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Components ---
const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; iconBgClass: string; }> = ({ title, value, icon: Icon, iconBgClass }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgClass}`}><Icon className="w-6 h-6 text-white" /></div>
        <div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p></div>
    </div>
);
const TabButton: React.FC<{ text: string; icon: React.ElementType; isActive: boolean; onClick: () => void; }> = ({ text, icon: Icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Icon size={16}/>{text}</button> );
const HeaderCell: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => ( <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><Icon className="h-4 w-4" />{text}</div></th>);
const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => ( <tr>{Array.from({ length: columns }).map((_, idx) => ( <td key={idx} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td> ))}</tr> );

function Account() {
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers, isFetching } = usersAPI.useFetchUsersQuery();
  const [updateUserMutation] = usersAPI.useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = usersAPI.useDeleteUserMutation();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDataTypes | null>(null);
  const [updatingSelectRoleId, setUpdatingSelectRoleId] = useState<number | null>(null);
  const [togglingUserAdminRoleId, setTogglingUserAdminRoleId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ name: '', email: '', phone_number: '', address: '', role: '' });
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleRegistrationSuccess = () => refetchUsers();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {setFilters({ ...filters, [e.target.name]: e.target.value }); setCurrentPage(1);};
  const handleResetFilters = () => {setFilters({ name: '', email: '', phone_number: '', address: '', role: '' }); setCurrentPage(1);};

  const getApiErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
      const errObj = error as RtkQueryError;
      if (errObj.data && typeof errObj.data === 'object' && 'message' in errObj.data) return errObj.data.message!;
      return 'An unexpected error occurred.';
    }
    return 'An unexpected error occurred.';
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
    const newRole: UserRole = currentRole === 'admin' ? 'user' : 'admin';
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

  const filteredUsers = useMemo(() => {
    return usersData?.filter((user: UserDataTypes) => {
      const { name, email, phone_number, address, role } = filters;
      return (
        (name ? user.full_name.toLowerCase().includes(name.toLowerCase()) : true) &&
        (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true) &&
        (phone_number ? user.phone_number?.toLowerCase().includes(phone_number.toLowerCase()) : true) &&
        (address ? user.address?.toLowerCase().includes(address.toLowerCase()) : true) &&
        (role ? user.role === role : true)
      );
    }) || [];
  }, [usersData, filters]);

  const analyticsData = useMemo(() => {
      if (!usersData) return { totalUsers: 0, roleCounts: {}, rolePieData: [], usersWithPhone: 0, usersWithAddress: 0, phonePercentage: '0%', addressPercentage: '0%' };
      const totalUsers = usersData.length;
      const roleCounts = usersData.reduce((acc, user) => { acc[user.role] = (acc[user.role] || 0) + 1; return acc; }, {} as Record<string, number>);
      const rolePieData = Object.entries(roleCounts).map(([name, value]) => ({name: name.charAt(0).toUpperCase() + name.slice(1), value}));
      const usersWithPhone = usersData.filter(u => u.phone_number && u.phone_number.trim() !== '').length;
      const usersWithAddress = usersData.filter(u => u.address && u.address.trim() !== '').length;
      const phonePercentage = totalUsers > 0 ? ((usersWithPhone / totalUsers) * 100).toFixed(1) : '0';
      const addressPercentage = totalUsers > 0 ? ((usersWithAddress / totalUsers) * 100).toFixed(1) : '0';
      return { totalUsers, roleCounts, rolePieData, usersWithPhone, usersWithAddress, phonePercentage: `${phonePercentage}%`, addressPercentage: `${addressPercentage}%` };
  }, [usersData]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const inputBaseClasses = `block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500`;

  const renderDashboardTab = () => (
    <>
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Name</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="name" value={filters.name} onChange={handleInputChange} placeholder="Filter by name..." className={`${inputBaseClasses} pl-10`} /></div></div>
          <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="email" value={filters.email} onChange={handleInputChange} placeholder="Filter by email..." className={`${inputBaseClasses} pl-10`} /></div></div>
          <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="phone_number" value={filters.phone_number} onChange={handleInputChange} placeholder="Filter by phone..." className={`${inputBaseClasses} pl-10`} /></div></div>
          <div><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Address</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="address" value={filters.address} onChange={handleInputChange} placeholder="Filter by address..." className={`${inputBaseClasses} pl-10`} /></div></div>
          <button onClick={handleResetFilters} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"><FilterIcon size={16}/> Reset All</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 styled-scrollbar">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <HeaderCell icon={Fingerprint} text="ID" />
              <HeaderCell icon={UserCircle} text="Profile" />
              <HeaderCell icon={User} text="Full Name" />
              <HeaderCell icon={Mail} text="Email" />
              <HeaderCell icon={Phone} text="Phone" />
              <HeaderCell icon={MapPin} text="Address" />
              <HeaderCell icon={Tag} text="Role" />
              <HeaderCell icon={Settings} text="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {usersLoading && [1,2,3,4,5].map(i => <SkeletonRow key={i} columns={8} />)}
            {!usersLoading && paginatedUsers.map((user: UserDataTypes) => (
              <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><Fingerprint size={14} className="text-slate-400 flex-shrink-0"/>{user.user_id}</div></td>
                <td className="p-4">
                  {user.profile_picture? (
                    <img src={user.profile_picture} alt={user.full_name || 'User Avatar'} className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-slate-200 dark:ring-slate-600"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold shadow-sm">{user.full_name?.substring(0, 2).toUpperCase() || 'N/A'}</div>
                  )}
                </td>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-100 max-w-xs"><div className="flex items-center gap-2"><User size={14} className="text-slate-400 flex-shrink-0"/><span className="truncate">{user.full_name}</span></div></td>
                <td className="p-4 font-medium max-w-xs"><div className="flex items-center gap-2"><Mail size={14} className="text-slate-400 flex-shrink-0"/><a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline truncate">{user.email}</a></div></td>
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><Phone size={14} className="text-slate-400 flex-shrink-0"/>{user.phone_number || <span className="text-slate-400 dark:text-slate-500">N/A</span>}</div></td>
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 max-w-sm"><div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400 flex-shrink-0"/><span className="truncate">{user.address || <span className="text-slate-400 dark:text-slate-500">N/A</span>}</span></div></td>
                <td className="p-4">
                  <CustomRoleDropdown userId={user.user_id} currentRole={user.role as UserRole} onRoleChange={handleRoleChangeFromSelect} isLoading={updatingSelectRoleId === user.user_id} isOpen={openDropdownId === user.user_id} onToggle={() => setOpenDropdownId(openDropdownId === user.user_id ? null : user.user_id)} onClose={() => setOpenDropdownId(null)} />
                </td>
                <td className="p-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <button onClick={() => handleToggleUserAdminRole(user.user_id, user.role as UserRole)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-sky-100 hover:bg-sky-200 dark:bg-sky-700/50 dark:text-sky-300 dark:hover:bg-sky-700" disabled={togglingUserAdminRoleId === user.user_id} title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}>
                            <Shield size={14} /> {togglingUserAdminRoleId === user.user_id ? '...' : (user.role === 'admin' ? 'Demote' : 'Admin')}
                        </button>
                        <button onClick={() => handleDeleteUserClick(user)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-100 hover:bg-red-200 dark:bg-red-700/50 dark:text-red-300 dark:hover:bg-red-700" title="Delete User" disabled={isDeleting}>
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">Showing <strong>{paginatedUsers.length}</strong> of <strong>{filteredUsers.length}</strong> results</p>
          <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Prev</button>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Next</button>
          </div>
        </div>
      )}
    </>
  );

  const renderAnalyticsTab = () => {
    const roleColors: { [key: string]: string } = {
        admin: 'bg-red-500', manager: 'bg-purple-500', lawyer: 'bg-sky-500', clerks: 'bg-indigo-500', client: 'bg-green-500', supports: 'bg-amber-500', user: 'bg-slate-500',
    };
    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">User Role Breakdown</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">A detailed count of users in each role category.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="Total Users" value={analyticsData.totalUsers} icon={User} iconBgClass="bg-blue-500" />
                    {Object.entries(analyticsData.roleCounts).map(([role, count]) => {
                         const roleInfo = ROLES.find(r => r.value === role); if (!roleInfo) return null;
                         return ( <SummaryCard key={role} title={roleInfo.label + 's'} value={count} icon={roleIcons[role as UserRole] || User} iconBgClass={roleColors[role] || 'bg-gray-500'}/> )
                    })}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Profile Data Completeness</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Analysis of how many user profiles contain key contact information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="With Phone Number" value={`${analyticsData.usersWithPhone} (${analyticsData.phonePercentage})`} icon={Phone} iconBgClass="bg-teal-500" />
                    <SummaryCard title="With Address" value={`${analyticsData.usersWithAddress} (${analyticsData.addressPercentage})`} icon={MapPin} iconBgClass="bg-orange-500" />
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">User Role Distribution</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">A visual representation of the proportion of users in each role.</p>
                <div style={{ height: '400px' }} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: '0.5rem', borderColor: isDarkMode ? '#334155' : '#e2e8f0' }} />
                            <Legend />
                            <Pie data={analyticsData.rolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>{analyticsData.rolePieData.map((_, index) => <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#0ea5e9', '#22c55e', '#a855f7', '#6366f1', '#f97316'][index % 7]} />)}</Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
  };

  return (
    <>
      <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
      <div className="p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">User Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Add, view, and manage all users in the system.</p>
            </div>
            <div className='flex items-center gap-3'>
              <button onClick={() => setIsAddUserModalOpen(true)} className="font-semibold py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2"><UserPlus size={18} /> <span className="hidden sm:inline">New User</span></button>
              <button onClick={() => setIsDarkMode(prev => !prev)} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Toggle theme">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
              <button onClick={() => refetchUsers()} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Refresh Data"><RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} /></button>
            </div>
          </header>
          
          <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
              <TabButton text="Dashboard" icon={TableIcon} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <TabButton text="Analytics" icon={PieChartIcon} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 rounded-2xl shadow-xl p-6 sm:p-8 h-full">
            {usersError ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Failed to Load Data</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{getApiErrorMessage(usersError)}</p>
                    <button onClick={() => refetchUsers()} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center mx-auto"><RefreshCw className="inline mr-2 h-4 w-4"/>Retry</button>
                </div>
            ) : (
              <>
                  {activeTab === 'dashboard' && renderDashboardTab()}
                  {activeTab === 'analytics' && renderAnalyticsTab()}
              </>
            )}
          </motion.div>
        </div>
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