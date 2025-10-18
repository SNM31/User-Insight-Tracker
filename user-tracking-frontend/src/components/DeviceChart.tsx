import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
export default DeviceChart;