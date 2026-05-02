import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getDashboardRole, getTokenPayload } from '../utils/tokenUtils';
import { useAuthContext } from '../context/AuthContext';

import StatCard from '../components/StatCard';
import TopCategoriesChart from '../components/TopCategoriesChart';
import DeviceChart from '../components/DeviceChart';
import PowerUsersTable from '../components/PowerUsersTable';
import FilterBar from '../components/FilterBar';
import LoginActivityByHourChart from '../components/LoginActivityByHourChart';

interface MetricsFilterRequest {
  startDate: string;
  endDate: string;
  country: string | null;
  deviceType: string | null;
  userId: number | null;
}

interface PowerUserStat {
  email: string;
  sessionCount: number;
  totalTimeSpent: number;
  lastActiveDate: string;
  topCategory: string;
}

interface AnalyticsResponse {
  totalSessions: number;
  averageSessionDuration: number;
  topCategoriesVisited: { [key: string]: number };
  topSubcategoriesVisited: { [key: string]: number };
  deviceTypeDistribution: { [key: string]: number };
  loginActivityByHour: { [key: number]: number };
  countryDistribution: { [key: string]: number };
  totalUsers?: number;
  activeUsers?: number;
  bounceRate?: number;
  powerUsers?: PowerUserStat[];
  totalTimeSpent?: number;
  lastActiveDate?: string;
}

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { adminToken: token, adminLogout } = useAuthContext();
  const tokenPayload = useMemo(() => (token ? getTokenPayload(token) : null), [token]);
  const userRole = getDashboardRole(token) ?? 'ROLE_ADVERTISER';
  const isAdmin = userRole === 'ROLE_ADMIN';
  const userIdentity =
    (typeof tokenPayload?.sub === 'string' && tokenPayload.sub) ||
    (typeof tokenPayload?.email === 'string' && tokenPayload.email) ||
    'Dashboard member';
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<MetricsFilterRequest>({
    ...getDefaultDateRange(),
    country: null,
    deviceType: null,
    userId: null,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No dashboard token found. Sign in with Google to continue.');
      setLoading(false);
      return;
    }

    // Skip fetch when date range is incomplete
    if (!filters.startDate || !filters.endDate) {
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== null && v !== ''),
        );

        const response = await axios.get(
          'http://localhost:8080/api/admin/analytics/metrics',
          {
            params: cleanFilters,
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch analytics data. Make sure the dashboard analytics endpoint accepts the dashboard token.');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters, token]);

  const handleDashboardLogout = () => {
    adminLogout();
    navigate('/dashboard/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-40 rounded-[2rem] border border-white/10 bg-white/5" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="h-36 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <div className="h-36 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <div className="h-36 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <div className="h-36 rounded-[1.75rem] border border-white/10 bg-white/5" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <div className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-rose-400/20 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-200">Dashboard unavailable</p>
          <h1 className="mt-4 text-4xl font-semibold">We could not load your workspace.</h1>
          <p className="mt-5 text-base leading-7 text-slate-300">{error}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard/login')}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
            >
              Return to dashboard sign-in
            </button>
            <button
              onClick={handleDashboardLogout}
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-100 transition hover:border-indigo-400/60"
            >
              Clear dashboard session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <h1 className="text-3xl font-semibold">No analytics data available yet.</h1>
          <p className="mt-4 text-slate-300">Once backend metrics are returned, your charts and KPI cards will appear here.</p>
        </div>
      </div>
    );
  }

  const isUserDrillDown = data.totalTimeSpent != null;
  const formattedAvgDuration = data.averageSessionDuration ? `${Math.round(data.averageSessionDuration)}s` : 'N/A';
  const formattedBounceRate = data.bounceRate ? `${data.bounceRate.toFixed(1)}%` : 'N/A';
  const roleLabel = isAdmin ? 'Admin' : 'Advertiser';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),_transparent_30%),radial-gradient(circle_at_right,_rgba(251,191,36,0.08),_transparent_25%)]" />
      <div className="max-w-7xl mx-auto">
        <div className="relative px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-indigo-300/20 bg-indigo-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                    Dashboard Workspace
                  </span>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                    {roleLabel}
                  </span>
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Premium visibility into your user activity.</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Use your Google-backed dashboard access to explore performance, audience behavior, and power-user activity in one private analytics surface.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-sm text-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</p>
                  <p className="mt-1 text-base font-medium text-white">{userIdentity}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Access level</p>
                  <p className="mt-1 text-base font-medium text-white">{roleLabel}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/dashboard/invites')}
                    className="mt-2 rounded-full border border-indigo-300/40 bg-indigo-300/10 px-4 py-2 text-sm text-indigo-100 transition hover:border-indigo-300/80"
                  >
                    Invite team
                  </button>
                )}
                <button
                  onClick={handleDashboardLogout}
                  className="mt-2 rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-indigo-400/60 hover:text-white"
                >
                  Sign out of dashboard
                </button>
              </div>
            </div>
          </div>

          <FilterBar
            userRole={userRole}
            currentFilters={filters}
            onFilterChange={setFilters}
          />

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {isUserDrillDown ? (
              <>
                <StatCard title="Total Time Spent" value={data.totalTimeSpent ? `${Math.round(data.totalTimeSpent / 60)}m` : 'N/A'} />
                <StatCard title="Last Active" value={data.lastActiveDate || 'N/A'} />
                <StatCard title="Total Sessions" value={data.totalSessions} />
                <StatCard title="Avg. Session" value={formattedAvgDuration} />
              </>
            ) : (
              <>
                <StatCard title="Total Sessions" value={data.totalSessions} />
                <StatCard title="Avg. Session" value={formattedAvgDuration} />
                {data.totalUsers != null && <StatCard title="Total Users" value={data.totalUsers} />}
                {data.activeUsers != null && <StatCard title="Active Users" value={data.activeUsers} />}
                {data.bounceRate != null && <StatCard title="Bounce Rate" value={formattedBounceRate} />}
              </>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {data.topCategoriesVisited && <TopCategoriesChart data={data.topCategoriesVisited} />}
            {data.deviceTypeDistribution && <DeviceChart data={data.deviceTypeDistribution} />}
            {data.loginActivityByHour && <LoginActivityByHourChart data={data.loginActivityByHour} />}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Workspace notes</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Built for invited stakeholders.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Admins can review deeper user-level insights and manage invitations. Advertisers can access the curated dashboard surface without the admin-only controls.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="mt-2 text-lg font-medium text-white">{roleLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-400">Date range</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {filters.startDate} to {filters.endDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && data.powerUsers && data.powerUsers.length > 0 && <div className="mt-8"><PowerUsersTable users={data.powerUsers} /></div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;