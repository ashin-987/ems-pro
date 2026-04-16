import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { PageHeader, Spinner } from '../../components/ui/index.jsx';
import EmployeeForm from './EmployeeForm';
import toast from 'react-hot-toast';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get(`/employees/${id}`)
      .then(r => setEmployee(r.data.data))
      .catch(() => { toast.error('Employee not found'); navigate('/employees'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    try {
      await api.put(`/employees/${id}`, {
        ...values,
        salary: values.salary ? Number(values.salary) : null,
      });
      toast.success('Employee updated successfully!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      throw err;
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Spinner size={32} /></div>;
  }

  // Map entity fields to form defaults
  const defaults = {
    name:         employee.name,
    fatherName:   employee.fatherName,
    dateOfBirth:  employee.dateOfBirth,
    email:        employee.email,
    phone:        employee.phone,
    address:      employee.address,
    designation:  employee.designation,
    department:   employee.department,
    salary:       employee.salary,
    education:    employee.education,
    aadharNumber: employee.aadharNumber,
    status:       employee.status,
    joiningDate:  employee.joiningDate,
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Edit Employee"
        subtitle={`Updating record for ${employee.name} · ${employee.empCode}`}
      />
      <EmployeeForm defaultValues={defaults} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
