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
  
  // --- Convert map to a full 24-hour array ---
  // This ensures the chart always shows all 24 hours, even with no data
  const chartData = Array.from({ length: 24 }, (_, hour) => ({
    name: `${hour}:00`,
    logins: data[hour] || 0, // Use 0 if no data exists for that hour
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96 border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-4">Login Activity by Hour</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart 
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            interval={2} // Show a label every 3 hours (0:00, 3:00, etc.)
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="logins" fill="#60a5fa" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoginActivityByHourChart;