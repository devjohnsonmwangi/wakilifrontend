import { usersAPI, UserDataTypes } from '../../../../features/users/usersAPI';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF4D4D', '#8A2BE2', '#5F9EA0'];

interface UserCounts {
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalLawyers: number;
  totalClerks: number;
  totalManagers: number;
  totalClients: number;
  totalSupporters: number;
}

interface ChartData {
  name: string;
  value: number;
}

const CardsReport = () => {
  const { data: usersData, isLoading: usersLoading, error: usersError } = usersAPI.useFetchUsersQuery();

  const [userCounts, setUserCounts] = useState<UserCounts>({
    totalUsers: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalLawyers: 0,
    totalClerks: 0,
    totalManagers: 0,
    totalClients: 0,
    totalSupporters: 0,
  });

  const [pieData, setPieData] = useState<ChartData[]>([]);
  const [barData, setBarData] = useState<ChartData[]>([]);
  const [lineData, setLineData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (usersData) {
      const usersCount = usersData.length;
      const customersCount = usersData.filter((user: UserDataTypes) => user.role === 'user').length;
      const adminsCount = usersData.filter((user: UserDataTypes) => user.role === 'admin').length;
      const lawyerCount = usersData.filter((user: UserDataTypes) => user.role === 'lawyer').length;
      const clerksCount = usersData.filter((user: UserDataTypes) => user.role === 'clerks').length;
      const managersCount = usersData.filter((user: UserDataTypes) => user.role === 'manager').length;
      const clientsCount = usersData.filter((user: UserDataTypes) => user.role === 'client').length;
      const supportersCount = usersData.filter((user: UserDataTypes) => user.role === 'supports').length;

      // Animation code
      const duration = 500;
      const steps = 15;
      const getStep = (count: number) => count / steps;

      const current = {
        users: 0,
        customers: 0,
        admins: 0,
        lawyers: 0,
        clerks: 0,
        managers: 0,
        clients: 0,
        supporters: 0,
      };

      const interval = setInterval(() => {
        current.users = Math.min(current.users + getStep(usersCount), usersCount);
        current.customers = Math.min(current.customers + getStep(customersCount), customersCount);
        current.admins = Math.min(current.admins + getStep(adminsCount), adminsCount);
        current.lawyers = Math.min(current.lawyers + getStep(lawyerCount), lawyerCount);
        current.clerks = Math.min(current.clerks + getStep(clerksCount), clerksCount);
        current.managers = Math.min(current.managers + getStep(managersCount), managersCount);
        current.clients = Math.min(current.clients + getStep(clientsCount), clientsCount);
        current.supporters = Math.min(current.supporters + getStep(supportersCount), supportersCount);

        setUserCounts({
          totalUsers: Math.floor(current.users),
          totalCustomers: Math.floor(current.customers),
          totalAdmins: Math.floor(current.admins),
          totalLawyers: Math.floor(current.lawyers),
          totalClerks: Math.floor(current.clerks),
          totalManagers: Math.floor(current.managers),
          totalClients: Math.floor(current.clients),
          totalSupporters: Math.floor(current.supporters),
        });

        if (
          current.users >= usersCount &&
          current.customers >= customersCount &&
          current.admins >= adminsCount &&
          current.lawyers >= lawyerCount &&
          current.clerks >= clerksCount &&
          current.managers >= managersCount &&
          current.clients >= clientsCount &&
          current.supporters >= supportersCount
        ) {
          clearInterval(interval);
        }
      }, duration / steps);

      const pieChartData = [
        { name: "Customers", value: customersCount },
        { name: "Admins", value: adminsCount },
        { name: "Lawyers", value: lawyerCount },
        { name: "Clerks", value: clerksCount },
        { name: "Managers", value: managersCount },
        { name: "Clients", value: clientsCount },
        { name: "Supporters", value: supportersCount },
      ];

      setPieData(pieChartData);
      setBarData(pieChartData);  // Setting the bar chart data
      setLineData(pieChartData); // Setting the line chart data

      return () => clearInterval(interval);
    }
  }, [usersData]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
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

  if (usersLoading) {
    content = <div className="text-center">Loading user data...</div>;
  } else if (usersError) {
    content = <div className="text-center text-red-500">Error loading users. Please check your network.</div>;
  } else {
    content = (
      <>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Cards for each user role */}
          {Object.entries(userCounts).map(([role, count]) => (
            <div key={role} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
              <h3 className={`text-lg font-semibold text-${role === 'totalUsers' ? 'blue' : role === 'totalCustomers' ? 'green' : role === 'totalAdmins' ? 'purple' : role === 'totalLawyers' ? 'orange' : role === 'totalClerks' ? 'yellow' : role === 'totalManagers' ? 'indigo' : role === 'totalClients' ? 'pink' : 'red'}-700`}>
                Total {role.charAt(0).toUpperCase() + role.slice(1)}
              </h3>
              <div className={`text-4xl font-bold animate-pulse text-${role === 'totalUsers' ? 'blue' : role === 'totalCustomers' ? 'green' : role === 'totalAdmins' ? 'purple' : role === 'totalLawyers' ? 'orange' : role === 'totalClerks' ? 'yellow' : role === 'totalManagers' ? 'indigo' : role === 'totalClients' ? 'pink' : 'red'}-800`}>
                {count}
              </div>
              <div className={`w-16 h-16 rounded-full bg-${role === 'totalUsers' ? 'blue' : role === 'totalCustomers' ? 'green' : role === 'totalAdmins' ? 'purple' : role === 'totalLawyers' ? 'orange' : role === 'totalClerks' ? 'yellow' : role === 'totalManagers' ? 'indigo' : role === 'totalClients' ? 'pink' : 'red'}-500 text-white flex items-center justify-center mt-2`}>
                {count}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          {/* Pie Chart */}
          <div className='w-full md:w-1/3 bg-white rounded-lg shadow-md p-4'>
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">User Distribution (Pie)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                  labelLine={false}
                >
                  {pieData.map((_, index) => ( // Changed 'entry' to '_' to indicate unused variable
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
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">User Distribution (Bar)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
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
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">User Trends (Line)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
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
        <h2 className="text-center text-2xl mb-4 text-webcolor font-bold">User Report</h2>
        {content}
        {usersData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
            <p className="text-gray-700">
              This report provides a summary of users by role, visualized with a pie chart, bar chart, and line chart.
              The pie chart shows the proportion of each role, the bar chart displays the count of each role,
              and the line chart visualizes trends in user distribution. Understanding these distributions can help administrators
              manage resources, plan training programs, and ensure the system is being used effectively.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardsReport;
