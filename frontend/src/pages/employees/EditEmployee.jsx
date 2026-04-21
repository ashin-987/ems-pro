import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import EmployeeForm from './EmployeeForm';
import { PageLoader } from '../../components/ui';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      await axiosInstance.put(`/employees/${id}`, formData);
      toast.success('Employee updated successfully!');
      navigate('/employees');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update employee';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading employee details..." />;
  }

  return <EmployeeForm employee={employee} onSubmit={handleSubmit} isLoading={isSubmitting} mode="edit" />;
};

export default EditEmployee;
