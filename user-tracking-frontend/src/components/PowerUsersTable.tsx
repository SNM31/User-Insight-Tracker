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
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 col-span-1 lg:col-span-2">
            <h3 className="font-bold text-gray-800 mb-4">Power Users</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.sessionCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(user.totalTimeSpent)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActiveDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default PowerUsersTable;