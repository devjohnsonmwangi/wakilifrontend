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
    LineChart,  // Import LineChart and Line
    Line,
    Label
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];
const LINE_COLORS = ['#1a237e', '#388e3c', '#d84315', '#4527a0', '#b71c1c']; // Distinct colors for the line chart

interface ChartData {
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const AppointmentStatusReport = () => {
    const { data: appointmentsData = [], isLoading: appointmentsLoading, isError, error } = appointmentAPI.useFetchAppointmentsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [statusData, setStatusData] = useState<ChartData[]>([]);
    const [barChartData, setBarChartData] = useState<ChartData[]>([]); // New state for bar chart data
    const [lineChartData, setLineChartData] = useState<ChartData[]>([]); // New state for line chart data
    const [reportData, setReportData] = useState<{[key: string]:number}>({})
    //const [chartWidth, setChartWidth] = useState<number>(Math.min(window.innerWidth * 0.9, 500)); // chartWidth unused

    // Handle responsive chart resizing
    useEffect(() => {
        const handleResize = () => {
            //setChartWidth(Math.min(window.innerWidth * 0.9, 500)); // Adjust width based on screen size -- chartWidth unused
            window.dispatchEvent(new Event('resize')); // force rerender charts
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial dimensions

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Process appointment statuses and calculate counts for the pie chart and bar chart
    useEffect(() => {
        if (!appointmentsLoading && appointmentsData.length > 0) {
            const statusCounts: Record<string, number> = {};

            appointmentsData.forEach((appointment: AppointmentDataTypes) => {
                const status = appointment.status || 'Unknown'; // Handle cases where status is undefined
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            const formattedStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
            setStatusData(formattedStatusData);
            setBarChartData(formattedStatusData); // Use the same data for the bar chart initially
            setLineChartData(formattedStatusData);  // Use the same data for the line chart initially
            setReportData(statusCounts)

        } else {
            setStatusData([]);
            setBarChartData([]);
            setLineChartData([]);
            setReportData({})
        }
    }, [appointmentsLoading, appointmentsData]);

    // Custom tooltip component for Recharts
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
        content = <div className="text-center text-red-500">Error loading appointments: {(error as any)?.message || 'Unknown error'}</div>;
    } else if (appointmentsData.length === 0) {
        content = <div className="text-center">No appointment data available.</div>;
    } else {
        content = (
            <>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    {/* Pie Chart */}
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
                                    labelLine={false} // Remove default label lines
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

                    {/* Bar Chart */}
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
                                <Bar dataKey="value" fill="#82ca9d" barSize={30} />  {/*  Increased barSize for better visibility */}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line Chart */}
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
                                <Line type="monotone" dataKey="value" stroke={LINE_COLORS[0]} strokeWidth={3} /> {/* Set line color and width */}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='mt-4 p-4 bg-white rounded-lg shadow-md'>
                    <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Appointment status</h3>
                        {Object.entries(reportData).map((item,index)=>{
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
                            the bar chart shows absolute counts for comparison, and the line chart visualizes trends.  By examining these
                            visualizations, patterns and potential areas for improvement become apparent, such as high cancellation rates
                            or scheduling bottlenecks.  The data-driven insights can guide strategic decisions for better resource management
                            and improved patient experience.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppointmentStatusReport;