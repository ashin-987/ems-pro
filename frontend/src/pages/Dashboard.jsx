import { useEffect, useState } from 'react';
import {
  Users, UserCheck, UserX, UserMinus, IndianRupee, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../api/axiosInstance';
import { Spinner, PageHeader } from '../components/ui/index.jsx';

const DEPT_COLORS = ['#6366f1','#06b6d4','#f59e0b','#10b981','#f43f5e','#8b5cf6','#ec4899'];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  const deptData = stats
    ? Object.entries(stats.employeesByDepartment).map(([name, value]) => ({ name, value }))
    : [];

  const formatSalary = (val) =>
    val ? `₹${Number(val).toLocaleString('en-IN')}` : '₹0';

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your workforce"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users}      label="Total Employees"  value={stats?.totalEmployees}   color="bg-primary-600" />
        <StatCard icon={UserCheck}  label="Active"           value={stats?.activeEmployees}  color="bg-emerald-500" />
        <StatCard icon={UserMinus}  label="On Leave"         value={stats?.onLeaveEmployees} color="bg-amber-500"   />
        <StatCard icon={UserX}      label="Inactive"         value={stats?.inactiveEmployees} color="bg-red-500"   />
      </div>

      {/* Salary + charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Monthly salary */}
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center">
            <IndianRupee size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {formatSalary(stats?.totalMonthlySalary)}
            </p>
            <p className="text-sm text-slate-500">Total Active Monthly Salary</p>
          </div>
        </div>

        {/* Department donut */}
        <div className="card xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary-600" />
            <h2 className="font-semibold text-slate-700">Employees by Department</h2>
          </div>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-10">No department data yet</p>
          )}
        </div>
      </div>

      {/* Monthly joins bar chart */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 mb-4">Monthly Joinings (This Year)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats?.monthlyJoinStats || []} barSize={28}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="count" name="Joinings" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
