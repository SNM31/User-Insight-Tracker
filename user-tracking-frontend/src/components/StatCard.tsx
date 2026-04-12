const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
    <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{title}</h3>
    <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
  </div>
);
export default StatCard;