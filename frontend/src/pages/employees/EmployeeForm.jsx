import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, Select, Textarea, FormField, Card, CardContent } from '../components/ui';

const EmployeeForm = ({ employee, onSubmit, isLoading, mode = 'add' }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        joiningDate: employee.joiningDate || '',
        status: employee.status || 'Active',
      });
    }
  }, [employee, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Position validation
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    // Salary validation
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    // Joining Date validation
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Employees
        </button>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {mode === 'edit' ? 'Edit Employee' : 'Add New Employee'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name" required error={errors.name}>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                </FormField>

                <FormField label="Email Address" required error={errors.email}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </FormField>

                <FormField label="Phone Number" required error={errors.phone}>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                </FormField>

                <FormField label="Status" required error={errors.status}>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    error={errors.status}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </Select>
                </FormField>

                <FormField label="Address" required error={errors.address} className="md:col-span-2">
                  <Textarea
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    error={errors.address}
                  />
                </FormField>
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Department" required error={errors.department}>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    error={errors.department}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </Select>
                </FormField>

                <FormField label="Position" required error={errors.position}>
                  <Input
                    type="text"
                    name="position"
                    placeholder="e.g., Software Engineer"
                    value={formData.position}
                    onChange={handleChange}
                    error={errors.position}
                  />
                </FormField>

                <FormField label="Salary" required error={errors.salary}>
                  <Input
                    type="number"
                    name="salary"
                    placeholder="e.g., 50000"
                    value={formData.salary}
                    onChange={handleChange}
                    error={errors.salary}
                  />
                </FormField>

                <FormField label="Joining Date" required error={errors.joiningDate}>
                  <Input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    error={errors.joiningDate}
                  />
                </FormField>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employees')}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4" />
                {mode === 'edit' ? 'Update Employee' : 'Add Employee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm;
