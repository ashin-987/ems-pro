import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, StatusBadge, PageLoader } from '../components/ui';
import { format } from 'date-fns';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      setEmployee(response.data.data);
    } catch (error) {
      toast.error('Failed to load employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading employee details..." />;
  }

  if (!employee) {
    return null;
  }

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <Icon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-gray-900 mt-1">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Employees
        </button>
        {canEdit && (
          <Button onClick={() => navigate(`/employees/edit/${id}`)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-bold text-3xl">
                {employee.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                  <p className="text-gray-600 mt-1">{employee.position}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Employee Code: <span className="font-medium">{employee.employeeCode}</span>
                  </p>
                </div>
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={Mail} label="Email" value={employee.email} />
            <InfoItem icon={Phone} label="Phone" value={employee.phone} />
            <div className="md:col-span-2">
              <InfoItem icon={MapPin} label="Address" value={employee.address} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={Building2} label="Department" value={employee.department} />
            <InfoItem icon={Briefcase} label="Position" value={employee.position} />
            <InfoItem
              icon={Calendar}
              label="Joining Date"
              value={employee.joiningDate ? format(new Date(employee.joiningDate), 'PPP') : 'N/A'}
            />
            <InfoItem
              icon={DollarSign}
              label="Salary"
              value={employee.salary ? `₹${employee.salary.toLocaleString()}` : 'N/A'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Status</p>
              <p className="mt-1">
                <StatusBadge status={employee.status} />
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Employee Since</p>
              <p className="text-gray-900 mt-1">
                {employee.joiningDate
                  ? format(new Date(employee.joiningDate), 'MMMM yyyy')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline/Audit Info (if available) */}
      {employee.createdAt && (
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Created At</p>
                <p className="text-gray-900 mt-1">
                  {format(new Date(employee.createdAt), 'PPP p')}
                </p>
                {employee.createdBy && (
                  <p className="text-xs text-gray-500 mt-1">by {employee.createdBy}</p>
                )}
              </div>
              {employee.updatedAt && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Last Updated</p>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(employee.updatedAt), 'PPP p')}
                  </p>
                  {employee.updatedBy && (
                    <p className="text-xs text-gray-500 mt-1">by {employee.updatedBy}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDetail;