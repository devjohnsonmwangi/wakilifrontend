// src/components/AppointmentStatusReport.tsx

import { useEffect, useState } from 'react';
import { appointmentAPI, AppointmentDataTypes } from '../../../../features/appointment/appointmentapi';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
    ClipboardCheck, ClipboardX, CalendarClock, Ban, CheckCircle, Hourglass, 
    AlertTriangle, Info
} from 'lucide-react';

// --- THEME & COLOR CONFIGURATION ---

// Custom hook to detect the current theme (light/dark)
const useTheme = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            const newTheme = document.documentElement.classList.contains('dark') || darkQuery.matches ? 'dark' : 'light';
            setTheme(newTheme);
        };
        
        updateTheme(); // Initial check

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
const LIGHT_COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#eab308'];
const DARK_COLORS = ['#60a5fa', '#4ade80', '#fb923c', '#c084fc', '#f87171', '#facc15'];

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
                <p className="intro">{`Appointments: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// Animated Skeleton Loader for a better loading experience
const SkeletonLoader = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 p-6">
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4 mx-auto"></div>
                <div className="h-56 w-full bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
            </div>
        ))}
    </div>
);


const AppointmentStatusReport = () => {
    const theme = useTheme();
    const { data: appointmentsData = [], isLoading, isError, error, refetch } = appointmentAPI.useFetchAppointmentsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
    
    // --- DYNAMIC STYLES BASED ON THEME ---
    const FANCY_COLORS = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#374151'; // zink-400 vs gray-700
    const gridColor = theme === 'dark' ? '#3f3f46' : '#e5e7eb'; // zink-700 vs gray-200

    // Styles for the "Stat Cards"
    const statusStyles: { [key: string]: { icon: React.ElementType, color: string } } = {
        'Confirmed': { icon: CheckCircle, color: 'text-green-500' },
        'Pending': { icon: Hourglass, color: 'text-yellow-500' },
        'Cancelled': { icon: Ban, color: 'text-red-500' },
        'Completed': { icon: ClipboardCheck, color: 'text-blue-500' },
        'Scheduled': { icon: CalendarClock, color: 'text-purple-500' },
        'Unknown': { icon: ClipboardX, color: 'text-gray-500' },
    };

    // Process data when it arrives
    useEffect(() => {
        if (!isLoading && appointmentsData.length > 0) {
            const statusCounts = appointmentsData.reduce((acc, appointment: AppointmentDataTypes) => {
                const status = appointment.status || 'Unknown';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const formattedData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
            setStatusData(formattedData);
        } else {
            setStatusData([]);
        }
    }, [isLoading, appointmentsData]);

    // --- RENDER FUNCTIONS FOR DIFFERENT STATES ---

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Oops! Something went wrong.</h3>
                <p className="text-red-600 dark:text-red-400 mt-2 mb-6">
                    {error instanceof Error ? error.message : 'Please check your network connection.'}
                </p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">
                    Try Again
                </button>
            </div>
        );
    }

    if (statusData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <ClipboardX className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Appointment Data</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">There's no data available to generate a report.</p>
            </div>
        );
    }

    // Main content render
    return (
        <div className="w-full space-y-8 p-2 md:p-0">
            {/* --- KEY METRICS / STAT CARDS --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusData.map(({ name, value }) => {
                    const { icon: Icon, color } = statusStyles[name] || statusStyles['Unknown'];
                    return (
                        <div key={name} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-8 h-8 ${color}`} />
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{name}</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" paddingAngle={5} cornerRadius={8}>
                                {statusData.map((_entry, index) => <Cell key={`cell-${index}`} fill={FANCY_COLORS[index % FANCY_COLORS.length]} stroke="none" />)}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: tickColor }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Status Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={FANCY_COLORS[0]} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={FANCY_COLORS[0]} stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
                            <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Status Trend</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={statusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={FANCY_COLORS[1]} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={FANCY_COLORS[1]} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="value" stroke={FANCY_COLORS[1]} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} fill="url(#lineGradient)" />
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
                            This report provides a multifaceted view of appointment statuses. The pie chart offers a proportional overview,
                            the bar chart shows absolute counts for comparison, and the line chart could visualize trends if data were time-based.
                            By examining these visualizations, patterns and potential areas for improvement become apparent.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Main container for the report page
const AppointmentReportPage = () => {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Appointment Analytics</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                        A visual summary of appointment statuses across the platform.
                    </p>
                </div>
                <AppointmentStatusReport />
            </div>
        </div>
    );
};

export default AppointmentReportPage;