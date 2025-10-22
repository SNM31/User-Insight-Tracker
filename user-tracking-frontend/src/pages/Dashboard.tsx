import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- ASSUMPTION: You have an auth context like this ---
// import { useAuth } from '../context/AuthContext';

// --- Import ALL your components ---
import StatCard from '../components/StatCard';
import TopCategoriesChart from '../components/TopCategoriesChart';
import DeviceChart from '../components/DeviceChart';
import PowerUsersTable from '../components/PowerUsersTable';
import FilterBar from '../components/FilterBar';
import LoginActivityByHourChart from '../components/LoginActivityByHourChart';
// (You'd also import TopSubcategoriesChart, CountryDistributionChart etc.)

// --- TypeScript Interfaces for Data Structures ---

// This matches your backend's MetricsFilterRequest
interface MetricsFilterRequest {
  startDate: string;
  endDate: string;
  country: string | null;
  deviceType: string | null;
  userId: string | null;
  // Add any other filters you have
}

interface PowerUserStat {
  email: string;
  sessionCount: number;
  totalTimeSpent: number; // in seconds
  lastActiveDate: string;
  topCategory: string;
}

// This matches your full backend AnalyticsResponse DTO
interface AnalyticsResponse {
  // General (Advertiser + Admin)
  totalSessions: number;
  averageSessionDuration: number;
  topCategoriesVisited: { [key: string]: number };
  topSubcategoriesVisited: { [key: string]: number };
  deviceTypeDistribution: { [key: string]: number };
  loginActivityByHour: { [key: number]: number };
  countryDistribution: { [key: string]: number };

  // Admin-Only (PII) - Optional
  totalUsers?: number;
  activeUsers?: number;
  bounceRate?: number;
  powerUsers?: PowerUserStat[];

  // User-Specific (Admin Drill-Down) - Optional
  totalTimeSpent?: number;
  lastActiveDate?: string;
}


// --- Utility to get default dates (e.g., Last 30 Days) ---
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};


// --- The Main Dashboard Component ---
const Dashboard = () => {
  // --- ASSUMPTION: Getting user/role from context ---
  // const { user, token } = useAuth();
  
  // --- MOCKED AUTH (Replace this with your real useAuth hook) ---
  const { user, token } = {
    user: { role: 'USER_ADMIN' }, // 'USER_ADMIN' or 'USER_ADVERTISER'
    token: localStorage.getItem('adminToken'), // Or your real token
  };
  // --- End Mock ---

  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW: State for all filters ---
  const [filters, setFilters] = useState<MetricsFilterRequest>({
    ...getDefaultDateRange(),
    country: null,
    deviceType: null,
    userId: null,
  });

  // --- UPDATED: Data fetching from the new API ---
  useEffect(() => {
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Body is just the filters
        const requestBody = filters; 

        const response = await axios.post(
          'http://localhost:8080/api/analytics', // Your flexible endpoint
          requestBody,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [filters, token]); // <-- Re-fetches when filters change!

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-8 text-center text-gray-500">No analytics data available.</div>;

  // --- Conditional Logic ---
  const isUserDrillDown = data.totalTimeSpent != null; // Check if we are in user-drill-down view
  
  // Format values safely (they might be null)
  const formattedAvgDuration = data.averageSessionDuration ? `${Math.round(data.averageSessionDuration)}s` : 'N/A';
  const formattedBounceRate = data.bounceRate ? `${data.bounceRate.toFixed(1)}%` : 'N/A';

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - NOW DYNAMIC */}
        <div className="flex-col md:flex-row flex justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <FilterBar
            userRole={user.role}
            currentFilters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* --- KPI Cards (Conditionally Rendered) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isUserDrillDown ? (
            <>
              {/* --- User Drill-Down KPIs --- */}
              <StatCard title="Total Time Spent" value={data.totalTimeSpent ? `${Math.round(data.totalTimeSpent / 60)}m` : 'N/A'} />
              <StatCard title="Last Active" value={data.lastActiveDate || 'N/A'} />
              <StatCard title="Total Sessions" value={data.totalSessions} />
            </>
          ) : (
            <>
              {/* --- General KPIs (PII safely hidden with '&&') --- */}
              <StatCard title="Total Sessions" value={data.totalSessions} />
              <StatCard title="Avg. Session" value={formattedAvgDuration} />
              
              {/* These cards will only show for Admins (since advertisers get null) */}
              {data.totalUsers && <StatCard title="Total Users" value={data.totalUsers} />}
              {data.activeUsers && <StatCard title="Active Users" value={data.activeUsers} />}
              {data.bounceRate && <StatCard title="Bounce Rate" value={formattedBounceRate} />}
            </>
          )}
        </div>

        {/* --- Charts and Tables (Conditionally Rendered) --- */}
        
        {/* Charts that are safe/common for most views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {data.topCategoriesVisited && <TopCategoriesChart data={data.topCategoriesVisited} />}
          {data.deviceTypeDistribution && <DeviceChart data={data.deviceTypeDistribution} />}
          {data.loginActivityByHour && <LoginActivityByHourChart data={data.loginActivityByHour} />}
          {/* You would add CountryDistributionChart here too */}
        </div>
        
        {/* --- PII Table (Only shows if data.powerUsers exists) --- */}
        {data.powerUsers && (
          <PowerUsersTable users={data.powerUsers} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;