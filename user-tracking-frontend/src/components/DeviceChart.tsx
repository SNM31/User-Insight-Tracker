import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const DeviceChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4f46e5', '#facc15', '#60a5fa']; // Indigo, Yellow, Light Blue

  return (
    <div className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Device Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f172a' }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default DeviceChart;