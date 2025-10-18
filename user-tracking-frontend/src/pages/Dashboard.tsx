import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

// --- TypeScript Interfaces for Data Structures ---

interface PowerUserStat {
  email: string;
  sessionCount: number;
  totalTimeSpent: number; // in seconds
  lastActiveDate: string;
  topCategory: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  topCategoriesVisited: { [key: string]: number };
  deviceTypeDistribution: { [key: string]: number };
  powerUsers: PowerUserStat[];
}

// --- Reusable UI Components ---

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const TopCategoriesChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, visits: value }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5); // Show top 5

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96 border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-4">Top Visited Categories</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="visits" fill="#facc15" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DeviceChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4f46e5', '#facc15', '#60a5fa']; // Indigo, Yellow, Light Blue

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96 border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-4">Device Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          {/* --- FIX IS HERE: Changed the parameter type to 'any' to resolve the type mismatch --- */}
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const PowerUsersTable: React.FC<{ users: PowerUserStat[] }> = ({ users }) => {
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h > 0 ? `${h}h ` : ''}${m}m`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 col-span-1 lg:col-span-2">
            <h3 className="font-bold text-gray-800 mb-4">Power Users</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.sessionCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(user.totalTimeSpent)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActiveDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- The Main Dashboard Component ---
const Dashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error("No admin token found.");
        }
        const response = await axios.get('http://localhost:8080/api/admin/analytics/summary', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        // setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-8 text-center text-gray-500">No analytics data available.</div>;

  // Formatting values for display
  const formattedAvgDuration = `${Math.round(data.averageSessionDuration)}s`;
  const formattedBounceRate = `${data.bounceRate.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          {/* Placeholder for Date Range Filter */}
          <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Date Range: Last 30 Days</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={data.totalUsers} />
          <StatCard title="Active Users" value={data.activeUsers} />
          <StatCard title="Avg. Session Duration" value={formattedAvgDuration} />
          <StatCard title="Bounce Rate" value={formattedBounceRate} />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopCategoriesChart data={data.topCategoriesVisited} />
          <DeviceChart data={data.deviceTypeDistribution} />
        </div>
        
        <PowerUsersTable users={data.powerUsers} />
      </div>
    </div>
  );
};

export default Dashboard;

