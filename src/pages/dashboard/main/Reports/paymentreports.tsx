// src/components/PaymentReport.tsx

import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, TooltipProps
} from 'recharts';
import { useFetchPaymentsQuery, PaymentDataTypes } from '../../../../features/payment/paymentAPI';
import {
    CircleDollarSign, Hourglass, CheckCircle, XCircle, AlertTriangle, ServerCrash, Info, BarChart3
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

const LIGHT_COLORS = ['#22c55e', '#f97316', '#ef4444', '#3b82f6'];
const DARK_COLORS = ['#4ade80', '#fb923c', '#f87171', '#60a5fa'];

// --- INTERFACES ---

interface ProcessedSummary {
    totalPayments: number;
    totalAmount: number;
    statusSummary: {
        [key: string]: {
            name: string;
            count: number;
            amount: number;
            Icon: React.ElementType;
            color: string;
        }
    };
    countChartData: { name: string; value: number }[];
    amountChartData: { name: string; value: number; amount: number }[];
}

interface ApiResponse {
    success: boolean;
    payments: PaymentDataTypes[];
}

interface FetchPaymentsQueryResult {
    data?: ApiResponse;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
}

// --- MODERN UI COMPONENTS ---

const formatAmount = (amount: number, currency = 'KES'): string => {
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currencyDisplay: 'code',
        currency: currency.toUpperCase(),
    }).format(amount);
    return formatted.replace(currency.toUpperCase(), currency === 'KES' ? 'ksh' : currency);
};

// FIX: New function to format large currency numbers into a compact form (e.g., 1.2M, 50K)
const formatCompactCurrency = (amount: number, currencyPrefix = 'ksh'): string => {
    if (amount >= 1_000_000) {
        return `${currencyPrefix}${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
        return `${currencyPrefix}${(amount / 1_000).toFixed(0)}K`;
    }
    return `${currencyPrefix}${amount.toFixed(0)}`;
};

const formatAxisTick = (tick: number): string => {
    if (tick >= 1_000_000) return `${(tick / 1_000_000).toFixed(1)}M`;
    if (tick >= 1_000) return `${(tick / 1_000).toFixed(0)}K`;
    return tick.toString();
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        const data = payload[0];
        const isAmount = data.dataKey === 'amount';
        return (
            <div className={`p-3 rounded-lg shadow-xl text-sm backdrop-blur-sm border
                ${theme === 'dark' ? 'bg-gray-900/70 border-gray-700 text-gray-50' : 'bg-white/70 border-gray-300 text-gray-900'}`
            }>
                <p className="font-bold">{label}</p>
                <p className="intro">{isAmount ? formatAmount(data.value as number) : `${data.value} payments`}</p>
            </div>
        );
    }
    return null;
};

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80"></div>)}
        </div>
    </div>
);


const PaymentReport = () => {
    const theme = useTheme();
    const { data, isLoading, isError, error, refetch } = useFetchPaymentsQuery() as FetchPaymentsQueryResult;
    const [summary, setSummary] = useState<ProcessedSummary | null>(null);
    
    const FANCY_COLORS = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#374151'; 
    const gridColor = theme === 'dark' ? '#3f3f46' : '#e5e7eb'; 

    useEffect(() => {
        if (data?.success && Array.isArray(data.payments)) {
            const statusConfig = {
                completed: { name: 'Completed', Icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
                pending: { name: 'Pending', Icon: Hourglass, color: 'from-orange-500 to-amber-600' },
                failed: { name: 'Failed', Icon: XCircle, color: 'from-red-500 to-rose-600' },
            };

            const statusSummary = Object.keys(statusConfig).reduce((acc: ProcessedSummary['statusSummary'], key) => {
                acc[key] = { ...statusConfig[key as keyof typeof statusConfig], count: 0, amount: 0 };
                return acc;
            }, {} as ProcessedSummary['statusSummary']);

            let totalAmount = 0;

            data.payments.forEach(payment => {
                let status = payment.payment_status?.toLowerCase() || 'unknown';
                if (status === 'paid') status = 'completed';

                const amount = Number(payment.payment_amount) || 0;
                if(status === 'completed') totalAmount += amount;

                if (status in statusSummary) {
                    statusSummary[status].count += 1;
                    statusSummary[status].amount += amount;
                }
            });

            setSummary({
                totalPayments: data.payments.length,
                totalAmount: totalAmount,
                statusSummary: statusSummary,
                countChartData: Object.values(statusSummary).map(s => ({ name: s.name, value: s.count })),
                amountChartData: Object.values(statusSummary).map(s => ({ name: s.name, value: s.amount, amount: s.amount }))
            });
        }
    }, [data]);

    if (isLoading) return <SkeletonLoader />;

    if (isError) {
        const errorMessage = (error && typeof error === 'object' && error !== null && 'data' in error)
            ? JSON.stringify((error as { data?: unknown }).data)
            : 'An unknown error occurred.';
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Failed to Load Payments</h3>
                <p className="text-red-600 dark:text-red-400 mt-2 mb-6 max-w-md text-center">{errorMessage}</p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">Try Again</button>
            </div>
        );
    }
    
    if (!summary || summary.totalPayments === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-dashed border-gray-300 dark:border-gray-700">
                <ServerCrash className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Payment Data Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">There are no payments to display in the report.</p>
            </div>
        );
    }

    const statCards = [
        // FIX: Using the new compact formatter for the value
        { name: "Total Revenue", value: formatCompactCurrency(summary.totalAmount), Icon: CircleDollarSign, color: "from-blue-500 to-sky-600"},
        { name: "Total Payments", value: summary.totalPayments, Icon: BarChart3, color: "from-indigo-500 to-violet-600"},
    ];
    
    return (
        <div className="w-full space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map(({ name, value, Icon, color }) => (
                     <div key={name} className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                        <div className="flex justify-between items-start">
                            <div className='space-y-1'><p className="font-semibold">{name}</p><p className="text-4xl font-bold">{value}</p></div>
                            <Icon className="w-8 h-8 text-white/50" />
                        </div>
                    </div>
                ))}
                {Object.values(summary.statusSummary).map(({ name, count, amount, Icon, color }) => (
                    <div key={name} className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                        <div className="flex justify-between items-start">
                            <div className='space-y-1'>
                                <p className="font-semibold">{name}</p>
                                <p className="text-2xl font-bold">{count} <span className="font-normal text-lg opacity-80">Payments</span></p>
                                {/* FIX: Also using the compact formatter here */}
                                <p className="text-xl font-bold opacity-90">{formatCompactCurrency(amount)}</p>
                            </div>
                            <Icon className="w-8 h-8 text-white/50" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Payment Count by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={summary.countChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" paddingAngle={5} cornerRadius={8}>
                                {summary.countChartData.map((_, index) => <Cell key={`cell-${index}`} fill={FANCY_COLORS[index % FANCY_COLORS.length]} stroke="none" />)}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: tickColor, paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Total Amount by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={summary.amountChartData} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                            <defs><linearGradient id="amountBarGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={FANCY_COLORS[3]} stopOpacity={0.8}/><stop offset="95%" stopColor={FANCY_COLORS[3]} stopOpacity={0.2}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 11 }} tickFormatter={formatAxisTick} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
                            <Bar dataKey="amount" name="Amount" fill="url(#amountBarGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Payment Status Trend</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={summary.countChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="value" stroke={FANCY_COLORS[1]} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex"><div className="flex-shrink-0"><Info className="h-5 w-5 text-blue-500" /></div><div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Analysis & Conclusion</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                       This report provides a financial overview of payments. Analyzing these metrics can help identify potential issues with payment processing. A high number of pending or failed payments may indicate problems with payment gateways or customer payment methods.
                    </p>
                </div></div>
            </div>
        </div>
    );
};

// Main page container
const PaymentReportPage = () => {
     return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Financial Analytics: Payments</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">An overview of payment statuses and revenue.</p>
                </div>
                <PaymentReport />
            </div>
        </div>
    );
}

export default PaymentReportPage;