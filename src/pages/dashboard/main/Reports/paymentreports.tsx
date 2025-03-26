// src/components/PaymentReport.tsx
import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { useFetchPaymentsQuery, PaymentDataTypes } from '../../../../features/payment/paymentAPI';

// Define the colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];

// Define interfaces for payment summary and chart data
interface PaymentSummary {
    totalPayments: number;
    totalPending: number;
    totalCompleted: number;
    totalFailed: number;
    totalAmountPending: number;
    totalAmountCompleted: number;
    totalAmountFailed: number;
}

interface ChartData {
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}

interface ApiResponse {
    success: boolean;
    payments: PaymentDataTypes[];
}

// Correctly typed hook result
interface FetchPaymentsQueryResult {
    data?: ApiResponse;
    isLoading: boolean;
    isError: boolean;
    error: unknown; // Or a more specific error type if you have one
}

const PaymentReport = () => {
    // Fetch payments data
     const { data, isLoading, isError, error } = useFetchPaymentsQuery() as FetchPaymentsQueryResult;
    const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
        totalPayments: 0,
        totalPending: 0,
        totalCompleted: 0,
        totalFailed: 0,
        totalAmountPending: 0,
        totalAmountCompleted: 0,
        totalAmountFailed: 0,
    });

    const [statusPieData, setStatusPieData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (data?.success && Array.isArray(data.payments)) {
            const payments = data.payments;
            const totalPayments = payments.length;

            const statusCounts = payments.reduce((acc: Record<string, number>, payment: PaymentDataTypes) => {
                let status = payment.payment_status || 'Unknown';
                status = status === 'paid' ? 'completed' : status;
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            const totalAmount = payments.reduce((acc: Record<string, number>, payment: PaymentDataTypes) => {
                let status = payment.payment_status || 'Unknown';
                status = status === 'paid' ? 'completed' : status;
                acc[status] = (acc[status] || 0) + (typeof payment.payment_amount === 'string' || typeof payment.payment_amount === 'number' ? Number(payment.payment_amount) : 0);
                return acc;
            }, {});

            setPaymentSummary({
                totalPayments,
                totalPending: statusCounts['pending'] || 0,
                totalCompleted: statusCounts['completed'] || 0,
                totalFailed: statusCounts['failed'] || 0,
                totalAmountPending: totalAmount['pending'] || 0,
                totalAmountCompleted: totalAmount['completed'] || 0,
                totalAmountFailed: totalAmount['failed'] || 0,
            });

            setStatusPieData([
                { name: 'Pending', value: statusCounts['pending'] || 0 },
                { name: 'Completed', value: statusCounts['completed'] || 0 },
                { name: 'Failed', value: statusCounts['failed'] || 0 },
            ]);
        }
    }, [data]);

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => (
        active && payload && payload.length ? (
            <div className="custom-tooltip bg-white p-2 border rounded shadow-md">
                <p className="label text-sm font-medium">{`${label} : ${payload[0].value}`}</p>
            </div>
        ) : null
    );

    const formatAmount = (amount?: number): string => {
        return typeof amount === 'number' ? `ksh${amount.toFixed(2)}` : 'No Amount';
    };

    let content;

    if (isLoading) {
        content = <div className="text-center">Loading payment data...</div>;
    } else if (isError) {
        content = <div className="text-center text-red-500">Error loading payments: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    } else if (!data || !data.success || !Array.isArray(data.payments) || data.payments.length === 0) {
        content = <div className="text-center">No payment data available.</div>;
    } else {
        content = (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="bg-blue-100 dark:bg-blue-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Payments</h3>
                        <div className="text-4xl font-bold text-blue-800 dark:text-blue-100">{paymentSummary.totalPayments}</div>
                    </div>

                    <div className="bg-yellow-100 dark:bg-yellow-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">Pending Payments</h3>
                        <div className="text-4xl font-bold text-yellow-800 dark:text-yellow-100">{paymentSummary.totalPending}</div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Amount: {formatAmount(paymentSummary.totalAmountPending)}</p>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-200">Completed Payments</h3>
                        <div className="text-4xl font-bold text-green-800 dark:text-green-100">{paymentSummary.totalCompleted}</div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Amount: {formatAmount(paymentSummary.totalAmountCompleted)}</p>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-200">Failed Payments</h3>
                        <div className="text-4xl font-bold text-red-800 dark:text-red-100">{paymentSummary.totalFailed}</div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Amount: {formatAmount(paymentSummary.totalAmountFailed)}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                    {/* Pie Chart */}
                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">Payment Status Distribution (Pie)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusPieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                    labelLine={false}
                                >
                                    {statusPieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend align="center" verticalAlign="bottom" layout="vertical" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">Payment Status (Bar)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusPieData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line Chart */}
                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">Payment Trend (Line)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={statusPieData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="bg-slate-200 p-4">
            <div className="card mx-auto bg-white w-full rounded-md mb-5 border-2 p-4">
                <h2 className="text-center text-2xl mb-4 text-webcolor font-bold">Payment Report</h2>
                {content}
                {data && data.success && Array.isArray(data.payments) && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                        <p className="text-gray-700">
                            This report provides an overview of payments, broken down by status. The pie chart visualizes the proportion of payments by status,
                            while the bar chart and line chart provide alternative views of the same data. Analyzing these metrics can help identify
                            potential issues with payment processing and improve overall financial management. A high number of pending or failed
                            payments may indicate problems with the payment gateway or customer payment methods.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentReport;
