import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { ResponsiveContainer } from "recharts/types/component/ResponsiveContainer";

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
export default TopCategoriesChart;
