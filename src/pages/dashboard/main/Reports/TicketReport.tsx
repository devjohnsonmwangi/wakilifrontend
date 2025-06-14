// src/components/TicketReport.tsx

import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, TooltipProps
} from 'recharts';
import { TicketAPI, TypeTickets } from "../../../../features/Tickets/AllTickets";
import { usersAPI, UserDataTypes } from "../../../../features/users/usersAPI";
import {
    Ticket, TicketCheck, TicketX, AlertTriangle, ServerCrash, Info
} from 'lucide-react';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// --- THEME & COLOR CONFIGURATION ---

const useTheme = () => {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => setTheme(document.documentElement.classList.contains('dark') || darkQuery.matches ? 'dark' : 'light');
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        darkQuery.addEventListener('change', updateTheme);
        return () => { observer.disconnect(); darkQuery.removeEventListener('change', updateTheme); };
    }, []);
    return theme;
};

const LIGHT_COLORS = ['#22c55e', '#ef4444', '#3b82f6']; // Open, Closed, Total
const DARK_COLORS = ['#4ade80', '#f87171', '#60a5fa'];

// --- INTERFACES ---

interface UserTicketData {
    name: string;
    Open: number;
    Closed: number;
}
interface ProcessedSummary {
    totalTickets: number;
    totalOpen: number;
    totalClosed: number;
    userTicketData: UserTicketData[];
    overallStatusData: { name: string; value: number }[];
}

// --- MODERN UI COMPONENTS ---

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className={`p-3 rounded-lg shadow-xl text-sm backdrop-blur-sm border
                ${theme === 'dark' ? 'bg-gray-900/70 border-gray-700 text-gray-50' : 'bg-white/70 border-gray-300 text-gray-900'}`
            }>
                <p className="font-bold">{label}</p>
                {payload.map((p, i) => (
                     <p key={i} style={{ color: p.color }}>
                        {`${p.name}: ${p.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80"></div>)}
        </div>
    </div>
);


const TicketReport = () => {
    const theme = useTheme();
    const { data: tickets, isLoading: ticketsLoading, isError: ticketsError, refetch: refetchTickets } = TicketAPI.useGetTicketsQuery(undefined, { pollingInterval: 30000 });
    const { data: usersData, isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = usersAPI.useFetchUsersQuery(undefined, { pollingInterval: 30000 });
    
    const [summary, setSummary] = useState<ProcessedSummary | null>(null);

    const FANCY_COLORS = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#374151'; 
    const gridColor = theme === 'dark' ? '#3f3f46' : '#e5e7eb'; 

    useEffect(() => {
        if (tickets && usersData) {
            const userTicketMap: Record<number, { Open: number; Closed: number }> = {};
            
            tickets.forEach((ticket: TypeTickets) => {
                const { user_id, status } = ticket;
                if (!user_id) return;
                if (!userTicketMap[user_id]) {
                    userTicketMap[user_id] = { Open: 0, Closed: 0 };
                }
                if (status === 'Open') userTicketMap[user_id].Open += 1;
                else if (status === 'Closed') userTicketMap[user_id].Closed += 1;
            });

            const userTicketData = Object.entries(userTicketMap).map(([userId, counts]) => {
                const user = usersData.find((u: UserDataTypes) => u.user_id === Number(userId));
                return {
                    name: user?.full_name || `User ID ${userId}`,
                    Open: counts.Open,
                    Closed: counts.Closed,
                };
            });
            
            const totalOpen = tickets.filter(t => t.status === 'Open').length;
            const totalClosed = tickets.filter(t => t.status === 'Closed').length;

            setSummary({
                totalTickets: tickets.length,
                totalOpen,
                totalClosed,
                userTicketData,
                overallStatusData: [
                    { name: 'Open', value: totalOpen },
                    { name: 'Closed', value: totalClosed },
                ],
            });
        }
    }, [tickets, usersData]);

    const isLoading = ticketsLoading || usersLoading;
    const isError = ticketsError || usersError;
    const handleRefetch = () => { refetchTickets(); refetchUsers(); };

    if (isLoading) return <SkeletonLoader />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Failed to Load Report Data</h3>
                <p className="text-red-600 dark:text-red-400 mt-2 mb-6">There was an error fetching ticket or user information.</p>
                <button onClick={handleRefetch} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">Try Again</button>
            </div>
        );
    }
    
    if (!summary || summary.totalTickets === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-dashed border-gray-300 dark:border-gray-700">
                <ServerCrash className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Ticket Data Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">There are no tickets to display in the report.</p>
            </div>
        );
    }

    const statCards = [
        { name: "Total Tickets", value: summary.totalTickets, Icon: Ticket, color: "from-blue-500 to-sky-600"},
        { name: "Open Tickets", value: summary.totalOpen, Icon: TicketX, color: "from-green-500 to-emerald-600"},
        { name: "Closed Tickets", value: summary.totalClosed, Icon: TicketCheck, color: "from-red-500 to-rose-600"},
    ];
    
    return (
        // This component is now just a container for the report's content.
        // It has no background or outer padding, so it will fit anywhere.
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map(({ name, value, Icon, color }) => (
                     <div key={name} className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                        <div className="flex justify-between items-start">
                            <div className='space-y-1'><p className="font-semibold">{name}</p><p className="text-4xl font-bold">{value}</p></div>
                            <Icon className="w-8 h-8 text-white/50" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Overall Ticket Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={summary.overallStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" paddingAngle={5} cornerRadius={8}>
                                {summary.overallStatusData.map((_, index) => <Cell key={`cell-${index}`} fill={FANCY_COLORS[index % FANCY_COLORS.length]} stroke="none" />)}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: tickColor, paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Tickets per User</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={summary.userTicketData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis type="number" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
                            <Legend wrapperStyle={{ fontSize: '14px', color: tickColor }} />
                            <Bar dataKey="Open" stackId="a" fill={FANCY_COLORS[0]} radius={[0, 8, 8, 0]} />
                            <Bar dataKey="Closed" stackId="a" fill={FANCY_COLORS[1]} radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex"><div className="flex-shrink-0"><Info className="h-5 w-5 text-blue-500" /></div><div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Analysis & Conclusion</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                       This report provides an overview of tickets by user and status. Analyzing these metrics can help identify workload imbalances, track resolution efficiency, and improve overall support performance.
                    </p>
                </div></div>
            </div>
        </div>
    );
};

// Main page container that provides the title and layout
const TicketReportPage = () => {
     return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Support & Tickets Analytics</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">An overview of ticket distribution and support workload.</p>
                </div>
                {/* Render the TicketReport component */}
                <TicketReport />
            </div>
        </div>
    );
}

export default TicketReportPage;