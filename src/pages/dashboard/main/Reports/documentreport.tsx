
import { useEffect, useState } from 'react';
import { appointmentAPI, AppointmentDataTypes } from '../../../../features/appointment/appointmentapi';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    Label
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];
const LINE_COLORS = ['#1a237e', '#388e3c', '#d84315', '#4527a0', '#b71c1c'];

interface ChartData {
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[]; // Specify the type for payload
    label?: string;
}

const AppointmentStatusReport = () => {
    const { data: appointmentsData = [], isLoading: appointmentsLoading, isError, error } = appointmentAPI.useFetchAppointmentsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [statusData, setStatusData] = useState<ChartData[]>([]);
    const [barChartData, setBarChartData] = useState<ChartData[]>([]);
    const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
    const [reportData, setReportData] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event('resize'));
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!appointmentsLoading && appointmentsData.length > 0) {
            const statusCounts: Record<string, number> = {};

            appointmentsData.forEach((appointment: AppointmentDataTypes) => {
                const status = appointment.status || 'Unknown';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            const formattedStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
            setStatusData(formattedStatusData);
            setBarChartData(formattedStatusData);
            setLineChartData(formattedStatusData);
            setReportData(statusCounts);

        } else {
            setStatusData([]);
            setBarChartData([]);
            setLineChartData([]);
            setReportData({});
        }
    }, [appointmentsLoading, appointmentsData]);

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

    let content;

    if (appointmentsLoading) {
        content = <div className="text-center">Loading appointment data...</div>;
    } else if (isError) {
        content = <div className="text-center text-red-500">Error loading appointments: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    } else if (appointmentsData.length === 0) {
        content = <div className="text-center">No appointment data available.</div>;
    } else {
        content = (
            <>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Appointment Status Distribution (Pie)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    fill="#8884d8"
                                    label
                                    labelLine={false}
                                >
                                    {statusData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend align="center" verticalAlign="bottom" layout="vertical" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Appointment Status (Bar)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis>
                                    <Label angle={-90} value="Count" position="insideLeft" style={{ textAnchor: 'middle' }} />
                                </YAxis>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Appointment Status Trend (Line)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis>
                                    <Label angle={-90} value="Count" position="insideLeft" style={{ textAnchor: 'middle' }} />
                                </YAxis>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke={LINE_COLORS[0]} strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='mt-4 p-4 bg-white rounded-lg shadow-md'>
                    <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Appointment status</h3>
                    {Object.entries(reportData).map((item, index) => {
                        return <p className="text-gray-700" key={index}>{item[0]}: {item[1]}</p>
                    })}
                </div>
            </>
        );
    }

    return (
        <div className='bg-slate-200 p-4'>
            <div className='card mx-auto bg-white w-full rounded-md mb-5 border-2 p-4'>
                <h2 className="text-center text-2xl mb-4 text-webcolor font-bold">Appointment Status Report</h2>
                {content}

                {appointmentsData.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                        <p className="text-gray-700">
                            This report provides a multifaceted view of appointment statuses. The pie chart offers a proportional overview,
                            the bar chart shows absolute counts for comparison, and the line chart visualizes trends. By examining these
                            visualizations, patterns and potential areas for improvement become apparent, such as high cancellation rates
                            or scheduling bottlenecks. The data-driven insights can guide strategic decisions for better resource management
                            and improved patient experience.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppointmentStatusReport;