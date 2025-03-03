import { PieChart, Pie, Tooltip as RechartsTooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { TicketAPI, TicketDataTypes } from "../../../../features/Tickets/AllTickets";
import { usersAPI, UserDataTypes } from "../../../../features/users/usersAPI";
import { useState, useEffect } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];

interface UserTicketData {
  name: string;
  open: number;
  closed: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const TicketReport = () => {
  const page = undefined;
  const fetchDuration = 10000;
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = TicketAPI.useGetTicketsQuery(page, {
    pollingInterval: fetchDuration, refetchOnMountOrArgChange: true
  });

  const { data: usersData, isLoading: usersLoading, error: usersError } = usersAPI. useFetchUsersQuery(page, {
    pollingInterval: fetchDuration, refetchOnMountOrArgChange: true
  });

  const [userTicketData, setUserTicketData] = useState<UserTicketData[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalOpen, setTotalOpen] = useState(0);
  const [totalClosed, setTotalClosed] = useState(0);
  const [pieChartWidth, setPieChartWidth] = useState<number>(Math.min(window.innerWidth * 0.9, 500));
  const [barChartData, setBarChartData] = useState<UserTicketData[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setPieChartWidth(Math.min(window.innerWidth * 0.9, 500));
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

  useEffect(() => {
    if (tickets && usersData) {
      const userTicketMap: Record<number, { open: number; closed: number }> = {};

      tickets.forEach((ticket: TicketDataTypes) => { // Added type annotation
        const { user_id, status } = ticket;
        if (!userTicketMap[user_id]) {
          userTicketMap[user_id] = { open: 0, closed: 0 };
        }
        if (status === 'Open') {
          userTicketMap[user_id].open += 1;
        } else if (status === 'Closed') {
          userTicketMap[user_id].closed += 1;
        }
      });

      const data = Object.entries(userTicketMap).map(([user_id, counts]) => {
        const user = usersData.find((u: UserDataTypes) => u.user_id === Number(user_id)); // Added type annotation
        return {
          name: user ? user.full_name : 'Unknown User',
          open: counts.open,
          closed: counts.closed
        };
      });

      setUserTicketData(data);
      setBarChartData(data); //Setting Bar Chart data here

      setTotalTickets(tickets.length);
      setTotalOpen(tickets.filter(ticket => ticket.status === 'Open').length);
      setTotalClosed(tickets.filter(ticket => ticket.status === 'Closed').length);
    }
  }, [tickets, usersData]);

  const pieData = userTicketData.flatMap(user => [
    { name: `${user.name} - Open`, value: user.open },
    { name: `${user.name} - Closed`, value: user.closed }
  ]);

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

  if (ticketsLoading || usersLoading) {
    content = <div className="text-center">Loading ticket and user data...</div>;
  } else if (ticketsError || usersError) {
    content = <div className="text-center text-red-500">Error loading data. Please check your network and try again.</div>;
  } else if (!tickets || !usersData || tickets.length === 0 || usersData.length === 0) {
    content = <div className="text-center">No ticket data available.</div>;
  } else {
    content = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-blue-100 dark:bg-blue-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Tickets</h3>
            <div className="text-4xl font-bold text-blue-800 dark:text-blue-100">{totalTickets}</div>
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mt-2">{totalTickets}</div>
          </div>

          <div className="bg-green-100 dark:bg-green-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-200">Open Tickets</h3>
            <div className="text-4xl font-bold text-green-800 dark:text-green-100">{totalOpen}</div>
            <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mt-2">{totalOpen}</div>
          </div>

          <div className="bg-red-100 dark:bg-red-900 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-200">Closed Tickets</h3>
            <div className="text-4xl font-bold text-red-800 dark:text-red-100">{totalClosed}</div>
            <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mt-2">{totalClosed}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
            {/* Pie Chart */}
            <div className='w-full md:w-1/2 bg-white rounded-lg shadow-md p-4'>
                <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Ticket Distribution (Pie)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            fill="#8884d8"
                            label
                            labelLine={false}
                        >
                            {pieData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend align="center" verticalAlign="bottom" layout="vertical" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className='w-full md:w-1/2 bg-white rounded-lg shadow-md p-4'>
                <h3 className="text-center text-lg mb-2 font-semibold text-gray-800">Tickets per User (Bar)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="open" fill="#82ca9d" name="Open Tickets" />
                        <Bar dataKey="closed" fill="#8884d8" name="Closed Tickets" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </>
    );
  }

  return (
    <div className='bg-slate-200 p-4'>
      <div className='card mx-auto bg-white w-full rounded-md mb-5 border-2 p-4'>
        <h2 className="text-center text-2xl mb-4 text-webcolor font-bold">Ticket Report</h2>
        {content}
        {tickets && usersData && tickets.length > 0 && usersData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
            <p className="text-gray-700">
              This report provides an overview of tickets, broken down by user and status. The pie chart visualizes the proportion of open and closed tickets,
              while the bar chart shows the distribution of tickets among users.  Analyzing these metrics can help identify workload imbalances,
              track resolution times, and improve overall support efficiency. Areas with high open tickets requires monitoring for quick resolution and areas that need resource allocation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketReport;