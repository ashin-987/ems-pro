import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusBadge,
  Pagination,
  PageLoader,
  EmptyState,
  Modal,
  ModalContent,
  ModalFooter,
} from '../components/ui';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { canEdit, canDelete } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    department: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employeeId: null,
    employeeName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, filters, pagination.currentPage, pagination.pageSize]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage - 1,
        size: pagination.pageSize,
        search: searchTerm,
        status: filters.status,
        department: filters.department,
      };

      const response = await axiosInstance.get('/employees', { params });
      const data = response.data.data;

      setEmployees(data.content);
      setPagination({
        ...pagination,
        totalPages: data.totalPages,
        currentPage: data.number + 1,
      });
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ status: '', department: '' });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/employees/${deleteModal.employeeId}`);
      toast.success('Employee deleted successfully');
      fetchEmployees();
      setDeleteModal({ isOpen: false, employeeId: null, employeeName: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (employees.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Department', 'Position', 'Status', 'Joining Date'];
    const csvData = employees.map(emp => [
      emp.employeeCode,
      emp.name,
      emp.email,
      emp.department,
      emp.position,
      emp.status,
      emp.joiningDate,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
  };

  if (loading && employees.length === 0) {
    return <PageLoader message="Loading employees..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your organization's employees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          {canEdit && (
            <Button onClick={() => navigate('/employees/add')}>
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or employee code..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </Select>
            </div>

            {/* Department Filter */}
            <div>
              <Select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </Select>
            </div>
          </div>

          {(searchTerm || filters.status || filters.department) && (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Filters
              </button>
              <span className="text-sm text-gray-500">
                {employees.length} result{employees.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Employees Table */}
      {employees.length === 0 ? (
        <Card>
          <EmptyState
            icon={Search}
            title="No employees found"
            message={
              searchTerm || filters.status || filters.department
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first employee'
            }
            action={
              canEdit && !searchTerm && !filters.status && !filters.department ? (
                <Button onClick={() => navigate('/employees/add')}>
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              ) : null
            }
          />
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hide-on-mobile">Email</TableHead>
                <TableHead className="hide-on-mobile">Department</TableHead>
                <TableHead className="hide-on-mobile">Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employeeCode}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell className="hide-on-mobile text-gray-600">{employee.email}</TableCell>
                  <TableCell className="hide-on-mobile">{employee.department}</TableCell>
                  <TableCell className="hide-on-mobile">{employee.position}</TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/employees/view/${employee.id}`)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => navigate(`/employees/edit/${employee.id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              employeeId: employee.id,
                              employeeName: employee.name,
                            })
                          }
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
            />
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, employeeId: null, employeeName: '' })}
        title="Delete Employee"
      >
        <ModalContent>
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deleteModal.employeeName}</strong>? This action
            cannot be undone.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ isOpen: false, employeeId: null, employeeName: '' })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EmployeeList;
