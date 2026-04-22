import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Users, UserCheck, UserX, TrendingUp, Plus, RefreshCw } from 'lucide-react';
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
import { Card, CardHeader, CardTitle, CardContent, StatCard, Button } from '../components/ui';
import { DashboardSkeleton } from '../components/SkeletonLoaders';
import { NoDataChartState, ErrorState } from '../components/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await axiosInstance.get('/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Loading State
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <ErrorState error={error} onRetry={handleRefresh} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { 
    totalEmployees, 
    activeEmployees, 
    inactiveEmployees, 
    onLeave, 
    departmentStats, 
    monthlyJoinings 
  } = dashboardData;

  // Chart Colors
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  // Check if there's any data
  const hasEmployees = totalEmployees > 0;
  const hasDepartmentData = departmentStats && departmentStats.length > 0;
  const hasJoiningData = monthlyJoinings && monthlyJoinings.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
        
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
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

      {/* No Employees State - Show CTA */}
      {!hasEmployees && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No employees in the system yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by adding your first employee. You can add them individually or import from a CSV file.
              </p>
              <Button onClick={() => navigate('/employees/add')}>
                <Plus className="h-4 w-4" />
                Add Your First Employee
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row - Only show if there are employees */}
      {hasEmployees && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {hasDepartmentData ? (
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
                <NoDataChartState type="department" />
              )}
            </CardContent>
          </Card>

          {/* Monthly Joinings */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Joinings</CardTitle>
            </CardHeader>
            <CardContent>
              {hasJoiningData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyJoinings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill="#6366f1" 
                      name="New Joinings"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoDataChartState type="joining" />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Overview - Only show if there are employees */}
      {hasEmployees && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Total Departments</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {departmentStats?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Avg. per Department</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {departmentStats && departmentStats.length > 0
                    ? Math.round(totalEmployees / departmentStats.length)
                    : 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Active Rate</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {totalEmployees > 0 
                    ? `${Math.round((activeEmployees / totalEmployees) * 100)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
