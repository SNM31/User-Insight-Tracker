// src/components/LoginActivityByHourChart.tsx

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

interface ChartProps {
  data: { [key: number]: number };
}

const LoginActivityByHourChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = Array.from({ length: 24 }, (_, hour) => ({
    name: `${hour}:00`,
    logins: data[hour] || 0,
  }));

  return (
    <div className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Login Activity by Hour</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart 
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#cbd5e1' }} 
            interval={2}
          />
          <YAxis tick={{ fontSize: 12, fill: '#cbd5e1' }} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)', backgroundColor: '#0f172a' }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Bar dataKey="logins" fill="#38bdf8" barSize={30} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoginActivityByHourChart;