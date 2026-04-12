import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TopCategoriesChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, visits: value }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5); // Show top 5

  return (
    <div className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Top Visited Categories</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: '#cbd5e1' }} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f172a' }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Bar dataKey="visits" fill="#818cf8" barSize={20} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default TopCategoriesChart;
