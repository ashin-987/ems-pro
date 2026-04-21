import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, StatCard, PageLoader } from '../components/ui';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { totalEmployees, activeEmployees, inactiveEmployees, onLeave, departmentStats, monthlyJoinings } = dashboardData;

  // Colors for charts
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees || 0}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees || 0}
          icon={UserCheck}
          color="success"
        />
        <StatCard
          title="Inactive"
          value={inactiveEmployees || 0}
          icon={UserX}
          color="danger"
        />
        <StatCard
          title="On Leave"
          value={onLeave || 0}
          icon={TrendingUp}
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {departmentStats && departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No department data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Joinings */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Joinings</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyJoinings && monthlyJoinings.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyJoinings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366f1" name="New Joinings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No joining data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Total Departments</h4>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {departmentStats?.length || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Avg. per Department</h4>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {departmentStats && departmentStats.length > 0
                  ? Math.round(totalEmployees / departmentStats.length)
                  : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
