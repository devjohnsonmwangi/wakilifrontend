import  { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import {
    useFetchCasesQuery,
    
} from '../../../../features/case/caseAPI'; // Adjust the import path


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];

interface CaseSummary {
    totalCases: number;
    openCases: number;
    inProgressCases: number;
    closedCases: number;
    onHoldCases: number;
    resolvedCases: number;
}

interface ChartData {
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?:  { value: number }[];
    label?: string;
}

const CaseReport = () => {
    const { data: cases, isLoading, isError, error } = useFetchCasesQuery();

    const [caseSummary, setCaseSummary] = useState<CaseSummary>({
        totalCases: 0,
        openCases: 0,
        inProgressCases: 0,
        closedCases: 0,
        onHoldCases: 0,
        resolvedCases: 0,
    });

    const [statusPieData, setStatusPieData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (cases) {
            const totalCases = cases.length;
            const openCases = cases.filter(c => c.case_status === 'open').length;
            const inProgressCases = cases.filter(c => c.case_status === 'in_progress').length;
            const closedCases = cases.filter(c => c.case_status === 'closed').length;
            const onHoldCases = cases.filter(c => c.case_status === 'on_hold').length;
            const resolvedCases = cases.filter(c => c.case_status === 'resolved').length;

            setCaseSummary({
                totalCases,
                openCases,
                inProgressCases,
                closedCases,
                onHoldCases,
                resolvedCases,
            });

            setStatusPieData([
                { name: 'Open', value: openCases },
                { name: 'In Progress', value: inProgressCases },
                { name: 'Closed', value: closedCases },
                { name: 'On Hold', value: onHoldCases },
                { name: 'Resolved', value: resolvedCases },
            ]);
        }
    }, [cases]);

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

    if (isLoading) {
        content = <div className="text-center">Loading case data...</div>;
    } else if (isError) {
        content = <div className="text-center text-red-500">Error loading cases: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    } else if (!cases || cases.length === 0) {
        content = <div className="text-center">No case data available.</div>;
    } else {
        content = (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="bg-blue-100 dark:bg-blue-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Cases</h3>
                        <div className="text-4xl font-bold text-blue-800 dark:text-blue-100">{caseSummary.totalCases}</div>
                        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mt-2">{caseSummary.totalCases}</div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-200">Open Cases</h3>
                        <div className="text-4xl font-bold text-green-800 dark:text-green-100">{caseSummary.openCases}</div>
                        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mt-2">{caseSummary.openCases}</div>
                    </div>

                    <div className="bg-yellow-100 dark:bg-yellow-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">In Progress Cases</h3>
                        <div className="text-4xl font-bold text-yellow-800 dark:text-yellow-100">{caseSummary.inProgressCases}</div>
                        <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center mt-2">{caseSummary.inProgressCases}</div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">On Hold Cases</h3>
                        <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{caseSummary.onHoldCases}</div>
                        <div className="w-16 h-16 rounded-full bg-gray-500 text-white flex items-center justify-center mt-2">{caseSummary.onHoldCases}</div>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-200">Closed Cases</h3>
                        <div className="text-4xl font-bold text-red-800 dark:text-red-100">{caseSummary.closedCases}</div>
                        <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mt-2">{caseSummary.closedCases}</div>
                    </div>

                    <div className="bg-indigo-100 dark:bg-indigo-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">Resolved Cases</h3>
                        <div className="text-4xl font-bold text-indigo-800 dark:text-indigo-100">{caseSummary.resolvedCases}</div>
                        <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center mt-2">{caseSummary.resolvedCases}</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                    {/* Pie Chart */}
                    <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
                        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">Case Status Distribution (Pie)</h3>
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
                        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">Case Status (Bar)</h3>
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
                        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">Case Trend (Line)</h3>
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
                <h2 className="text-center text-2xl mb-4 text-webcolor font-bold">Case Report</h2>
                {content}
                {cases && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                        <p className="text-gray-700">
                            This report provides an overview of cases, broken down by status. The pie chart visualizes the proportion of cases by status,
                            while the bar chart and line chart provide alternative views of the same data. Analyzing these metrics can help identify
                            potential bottlenecks in case processing and improve overall efficiency. A high number of open or on-hold cases may indicate
                            areas where additional resources or attention are needed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseReport;