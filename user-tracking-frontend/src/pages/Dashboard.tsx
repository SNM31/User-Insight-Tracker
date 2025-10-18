import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import TopCategoriesChart from '../components/TopCategoriesChart';
import DeviceChart from '../components/DeviceChart';
import PowerUsersTable from '../components/PowerUsersTable';

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

