// src/components/CardsReport.tsx

import { usersAPI, UserDataTypes } from '../../../../features/users/usersAPI';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import {
    Users, UserCheck, Shield, Gavel, FileSignature, Briefcase, UserSquare, Handshake,
    AlertTriangle, ServerCrash, Info
} from 'lucide-react';

// --- THEME & COLOR CONFIGURATION ---

// Custom hook to detect the current theme (light/dark) - you can move this to a shared file
const useTheme = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            const newTheme = document.documentElement.classList.contains('dark') || darkQuery.matches ? 'dark' : 'light';
            setTheme(newTheme);
        };
        
        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        darkQuery.addEventListener('change', updateTheme);

        return () => {
            observer.disconnect();
            darkQuery.removeEventListener('change', updateTheme);
        };
    }, []);

    return theme;
};

// Modern, vibrant color palettes for light and dark modes
const LIGHT_COLORS = ['#3b82f6', '#16a34a', '#9333ea', '#f97316', '#ca8a04', '#db2777', '#4338ca'];
const DARK_COLORS = ['#60a5fa', '#4ade80', '#c084fc', '#fb923c', '#facc15', '#f472b6', '#818cf8'];


// --- MODERN UI COMPONENTS ---

// Custom Tooltip with a modern "glassmorphism" effect
import type { TooltipProps } from 'recharts';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className={`p-3 rounded-lg shadow-xl text-sm
                backdrop-blur-sm border
                ${theme === 'dark' 
                    ? 'bg-gray-900/70 border-gray-700 text-gray-50' 
                    : 'bg-white/70 border-gray-300 text-gray-900'}`
            }>
                <p className="font-bold">{label}</p>
                <p className="intro">{`Count: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// Animated Skeleton Loader for a better loading experience
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(8)].map((_, i) => (
                 <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 p-6">
                    <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4 mx-auto"></div>
                    <div className="h-56 w-full bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
                </div>
            ))}
        </div>
    </div>
);


// Styles and Icons for the "Stat Cards" (moved outside component to avoid useEffect dependency warning)
const roleStyles: { [key: string]: { icon: React.ElementType, color: string, name: string } } = {
    'totalUsers': { icon: Users, color: 'from-sky-500 to-blue-600', name: 'Total Users'},
    'customers': { icon: UserCheck, color: 'from-green-500 to-emerald-600', name: 'Customers' },
    'admins': { icon: Shield, color: 'from-purple-500 to-violet-600', name: 'Admins' },
    'lawyers': { icon: Gavel, color: 'from-orange-500 to-amber-600', name: 'Lawyers' },
    'clerks': { icon: FileSignature, color: 'from-yellow-500 to-lime-600', name: 'Clerks' },
    'managers': { icon: Briefcase, color: 'from-indigo-500 to-slate-600', name: 'Managers' },
    'clients': { icon: UserSquare, color: 'from-pink-500 to-rose-600', name: 'Clients' },
    'supporters': { icon: Handshake, color: 'from-teal-500 to-cyan-600', name: 'Supporters' },
};

const CardsReport = () => {
    const theme = useTheme();
    const { data: usersData, isLoading, isError, error, refetch } = usersAPI.useFetchUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    
    // Simplified state
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
    const [userCounts, setUserCounts] = useState<{ name: string; value: number }[]>([]);

    // --- DYNAMIC STYLES BASED ON THEME ---
    const FANCY_COLORS = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#374151'; 
    const gridColor = theme === 'dark' ? '#3f3f46' : '#e5e7eb'; 

    useEffect(() => {
        if (usersData) {
            const counts = {
                totalUsers: usersData.length,
                customers: usersData.filter((u: UserDataTypes) => u.role === 'user').length,
                admins: usersData.filter((u: UserDataTypes) => u.role === 'admin').length,
                lawyers: usersData.filter((u: UserDataTypes) => u.role === 'lawyer').length,
                clerks: usersData.filter((u: UserDataTypes) => u.role === 'clerks').length,
                managers: usersData.filter((u: UserDataTypes) => u.role === 'manager').length,
                clients: usersData.filter((u: UserDataTypes) => u.role === 'client').length,
                supporters: usersData.filter((u: UserDataTypes) => u.role === 'supports').length,
            };

            const userCountsForCards = Object.entries(counts).map(([key, value]) => ({
                name: key,
                value,
            }));
            
            const dataForCharts = userCountsForCards
                .filter(d => d.name !== 'totalUsers') // Exclude total from charts
                .map(d => ({ ...d, name: roleStyles[d.name]?.name || d.name }));

            setUserCounts(userCountsForCards);
            setChartData(dataForCharts);
        }
    }, [usersData]);
    
    // --- RENDER LOGIC ---

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Failed to Load User Data</h3>
                <p className="text-red-600 dark:text-red-400 mt-2 mb-6">
                    {error ? 'An error occurred.' : 'Please check your network connection.'}
                </p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">
                    Try Again
                </button>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <ServerCrash className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No User Data Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">The user database appears to be empty.</p>
            </div>
        );
    }
    
    return (
        <div className="w-full space-y-8">
            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {userCounts.map(({ name, value }) => {
                    const style = roleStyles[name];
                    if (!style) return null;
                    const { icon: Icon, color, name: displayName } = style;
                    return (
                        <div key={name} className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform duration-300 hover:-translate-y-2`}>
                            <div className="flex justify-between items-start">
                                <div className='space-y-1'>
                                    <p className="font-semibold">{displayName}</p>
                                    <p className="text-4xl font-bold">{value}</p>
                                </div>
                                <Icon className="w-8 h-8 text-white/50" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Role Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" paddingAngle={5} cornerRadius={8}>
                                {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={FANCY_COLORS[index % FANCY_COLORS.length]} stroke="none" />)}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: tickColor, paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">User Counts by Role</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                            <defs>
                                <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={FANCY_COLORS[0]} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={FANCY_COLORS[0]} stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
                            <Bar dataKey="value" fill="url(#userBarGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">User Role Trends</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="value" stroke={FANCY_COLORS[1]} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

             {/* --- CONCLUSION --- */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Analysis & Conclusion</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                            This report provides a summary of users by role. Understanding these distributions can help administrators
                            manage resources, plan training programs, and ensure the system is being used effectively.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main page container
const UserReportPage = () => {
     return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Analytics Dashboard</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                        An overview of user roles and distribution across the platform.
                    </p>
                </div>
                <CardsReport />
            </div>
        </div>
    );
}

export default UserReportPage;