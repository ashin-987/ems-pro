import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { PageHeader } from '../../components/ui/index.jsx';
import EmployeeForm from './EmployeeForm';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AddEmployee() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await api.post('/employees', {
        ...values,
        salary: values.salary ? Number(values.salary) : null,
      });
      toast.success('Employee added successfully!');
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add employee';
      toast.error(msg);
      // re-throw so react-hook-form keeps isSubmitting=false correctly
      throw err;
    }
  };

  const defaults = {
    status: 'ACTIVE',
    joiningDate: format(new Date(), 'yyyy-MM-dd'),
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Add Employee"
        subtitle="Fill in the details below to onboard a new team member"
      />
      <EmployeeForm defaultValues={defaults} onSubmit={handleSubmit} />
    </div>
  );
}
