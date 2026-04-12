interface PowerUserStat {
  email: string;
  sessionCount: number;
  totalTimeSpent: number; // in seconds
  lastActiveDate: string;
  topCategory: string;
}
const PowerUsersTable: React.FC<{ users: PowerUserStat[] }> = ({ users }) => {
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h > 0 ? `${h}h ` : ''}${m}m`;
    };

    return (
        <div className="col-span-1 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-white">Power Users</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-slate-400">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Sessions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Total Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Last Active</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-white/5">
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{user.email}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">{user.sessionCount}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">{formatTime(user.totalTimeSpent)}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">{user.lastActiveDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default PowerUsersTable;