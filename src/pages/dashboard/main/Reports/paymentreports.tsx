import  { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import {
    useFetchPaymentsQuery,
} from '../../../../features/payment/paymentAPI'; // Import from the correct relative path

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];

interface PaymentSummary {
    totalPayments: number;
    totalPending: number;
    totalPaid: number;
    totalFailed: number;
    totalAmountPending: number;
    totalAmountPaid: number;
    totalAmountFailed: number;
}

interface ChartData {
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const PaymentReport = () => {
    const { data: payments, isLoading, isError, error } = useFetchPaymentsQuery();
    const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
        totalPayments: 0,
        totalPending: 0,
        totalPaid: 0,
        totalFailed: 0,
        totalAmountPending: 0,
        totalAmountPaid: 0,
        totalAmountFailed: 0,
    });

    const [statusPieData, setStatusPieData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (payments) {
            const totalPayments = payments.length;
            const pendingPayments = payments.filter(p => p.payment_status === 'pending');
            const paidPayments = payments.filter(p => p.payment_status === 'paid');
            const failedPayments = payments.filter(p => p.payment_status === 'failed');

            const totalAmountPending = pendingPayments.reduce((sum, p) => sum + (p.payment_amount || 0), 0);
            const totalAmountPaid = paidPayments.reduce((sum, p) => sum + (p.payment_amount || 0), 0);
            const totalAmountFailed = failedPayments.reduce((sum, p) => sum + (p.payment_amount || 0), 0);

            setPaymentSummary({
                totalPayments,
                totalPending: pendingPayments.length,
                totalPaid: paidPayments.length,
                totalFailed: failedPayments.length,
                totalAmountPending,
                totalAmountPaid,
                totalAmountFailed,
            });

            setStatusPieData([
                { name: 'Pending', value: pendingPayments.length },
                { name: 'Paid', value: paidPayments.length },
                { name: 'Failed', value: failedPayments.length },
            ]);
        }
    }, [payments]);

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip bg-white p-2 border rounded shadow-md">
                    <p className="label text-sm font-medium">{`${label} : ${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    const formatAmount = (amount: number | undefined): string => {
      if (typeof amount !== 'number') {
        return 'N/A'; // Or any other placeholder you prefer
      }
      return amount.toFixed(2);
    };

    let content;

    if (isLoading) {
        content = <div className="text-center">Loading payment data...</div>;
    } else if (isError) {
        content = <div className="text-center text-red-500">Error loading payments: {(error as any)?.message || 'Unknown error'}</div>;
    } else if (!payments || payments.length === 0) {
        content = <div className="text-center">No payment data available.</div>;
    } else {
        content = (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="bg-blue-100 dark:bg-blue-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Payments</h3>
                        <div className="text-4xl font-bold text-blue-800 dark:text-blue-100">{paymentSummary.totalPayments}</div>
                        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mt-2">{paymentSummary.totalPayments}</div>
                    </div>

                    <div className="bg-yellow-100 dark:bg-yellow-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">Pending Payments</h3>
                        <div className="text-4xl font-bold text-yellow-800 dark:text-yellow-100">{paymentSummary.totalPending}</div>
                        <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center mt-2">{paymentSummary.totalPending}</div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Amount: ${formatAmount(paymentSummary.totalAmountPending)}</p>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-200">Paid Payments</h3>
                        <div className="text-4xl font-bold text-green-800 dark:text-green-100">{paymentSummary.totalPaid}</div>
                        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mt-2">{paymentSummary.totalPaid}</div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Amount: ${formatAmount(paymentSummary.totalAmountPaid)}</p>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-200">Failed Payments</h3>
                        <div className="text-4xl font-bold text-red-800 dark:text-red-100">{paymentSummary.totalFailed}</div>
                        <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mt-2">{paymentSummary.totalFailed}</div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Amount: ${formatAmount(paymentSummary.totalAmountFailed)}</p>
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
                                    fill="#8884d8"
                                    label
                                    labelLine={false}
                                >
                                    {statusPieData.map((entry, index) => (
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
                {payments && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                        <p className="text-gray-700">
                            This report provides an overview of payments, broken down by status. The pie chart visualizes the proportion of payments by status,
                            while the bar chart and line chart provide alternative views of the same data. Analysing these metrics can help identify
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