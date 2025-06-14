// src/components/CaseReport.tsx

import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { useFetchCasesQuery, CaseDataTypes } from '../../../../features/case/caseAPI';
import {
    FolderKanban, FolderOpen, FolderSync, FolderClosed, FolderClock, FolderCheck,
    AlertTriangle, ServerCrash, Info
} from 'lucide-react';

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

const LIGHT_COLORS = ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#a855f7', '#64748b'];
const DARK_COLORS = ['#60a5fa', '#4ade80', '#fb923c', '#f87171', '#c084fc', '#94a3b8'];

// FIX 2: Moved statusStyles outside the component to make it a true constant
// This resolves the react-hooks/exhaustive-deps warning.
const statusStyles: { [key: string]: { icon: React.ElementType, color: string, name: string } } = {
    totalCases: { icon: FolderKanban, color: 'from-blue-500 to-sky-600', name: 'Total Cases' },
    open: { icon: FolderOpen, color: 'from-green-500 to-emerald-600', name: 'Open' },
    in_progress: { icon: FolderSync, color: 'from-yellow-500 to-amber-600', name: 'In Progress' },
    closed: { icon: FolderClosed, color: 'from-red-500 to-rose-600', name: 'Closed' },
    on_hold: { icon: FolderClock, color: 'from-slate-500 to-gray-600', name: 'On Hold' },
    resolved: { icon: FolderCheck, color: 'from-purple-500 to-violet-600', name: 'Resolved' },
};


// --- MODERN UI COMPONENTS ---

// FIX 1: Defined a specific type for the tooltip payload to avoid 'any'
type TooltipPayload = {
    name: string;
    value: number;
    payload: object;
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className={`p-3 rounded-lg shadow-xl text-sm backdrop-blur-sm border
                ${theme === 'dark' ? 'bg-gray-900/70 border-gray-700 text-gray-50' : 'bg-white/70 border-gray-300 text-gray-900'}`
            }>
                <p className="font-bold">{label}</p>
                <p className="intro">{`Cases: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80"></div>
            ))}
        </div>
    </div>
);


const CaseReport = () => {
    const theme = useTheme();
    const { data: cases, isLoading, isError, error, refetch } = useFetchCasesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
    const [caseSummary, setCaseSummary] = useState<{ name: string; value: number }[]>([]);

    const FANCY_COLORS = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#374151'; 
    const gridColor = theme === 'dark' ? '#3f3f46' : '#e5e7eb'; 

    useEffect(() => {
        if (cases) {
            const counts = {
                totalCases: cases.length,
                open: cases.filter((c: CaseDataTypes) => c.case_status === 'open').length,
                in_progress: cases.filter((c: CaseDataTypes) => c.case_status === 'in_progress').length,
                closed: cases.filter((c: CaseDataTypes) => c.case_status === 'closed').length,
                on_hold: cases.filter((c: CaseDataTypes) => c.case_status === 'on_hold').length,
                resolved: cases.filter((c: CaseDataTypes) => c.case_status === 'resolved').length,
            };

            const summaryForCards = Object.entries(counts).map(([key, value]) => ({ name: key, value }));
            const dataForCharts = summaryForCards
                .filter(d => d.name !== 'totalCases' && d.value > 0)
                .map(d => ({ ...d, name: statusStyles[d.name]?.name || d.name }));

            setCaseSummary(summaryForCards);
            setChartData(dataForCharts);
        }
    }, [cases]); // The 'statusStyles' dependency is no longer needed here
    
    // --- RENDER LOGIC ---

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError) {
        const errorMessage = (error && 'data' in error) 
            ? JSON.stringify(error.data) 
            : (error && 'message' in error) 
            ? error.message 
            : 'An unknown error occurred.';

        return (
            <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Failed to Load Case Data</h3>
                <p className="text-red-600 dark:text-red-400 mt-2 mb-6 max-w-md text-center">{errorMessage}</p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">
                    Try Again
                </button>
            </div>
        );
    }

    if (!cases || cases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <ServerCrash className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Case Data Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">There are no cases to display in the report.</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {caseSummary.map(({ name, value }) => {
                    const style = statusStyles[name];
                    if (!style) return null;
                    const { icon: Icon, color, name: displayName } = style;
                    return (
                        <div key={name} className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform duration-300 hover:-translate-y-2`}>
                            <div className='space-y-1'>
                                <p className="font-semibold text-sm opacity-90">{displayName}</p>
                                <p className="text-4xl font-bold">{value}</p>
                            </div>
                            <Icon className="absolute w-16 h-16 -right-4 -bottom-4 text-white/20" />
                        </div>
                    );
                })}
            </div>

            {/* --- CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Status Distribution</h3>
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

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Case Volume by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                            <defs><linearGradient id="caseBarGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={FANCY_COLORS[0]} stopOpacity={0.8}/><stop offset="95%" stopColor={FANCY_COLORS[0]} stopOpacity={0.2}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
                            <Bar dataKey="value" fill="url(#caseBarGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Case Status Trend</h3>
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
                <div className="flex"><div className="flex-shrink-0"><Info className="h-5 w-5 text-blue-500" /></div><div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Analysis & Conclusion</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        This report provides a high-level overview of case statuses. Analyzing these metrics can help identify potential bottlenecks in case processing and improve overall efficiency. A high number of open or on-hold cases may indicate areas where additional resources or attention are needed.
                    </p>
                </div></div>
            </div>
        </div>
    );
};

// Main page container
const CaseReportPage = () => {
     return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Case Analytics Dashboard</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">An overview of case statuses and distribution.</p>
                </div>
                <CaseReport />
            </div>
        </div>
    );
}

export default CaseReportPage;