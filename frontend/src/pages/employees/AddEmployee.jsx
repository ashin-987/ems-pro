import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import EmployeeForm from './EmployeeForm';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      await axiosInstance.post('/employees', formData);
      toast.success('Employee added successfully!');
      navigate('/employees');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add employee';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return <EmployeeForm onSubmit={handleSubmit} isLoading={isLoading} mode="add" />;
};

export default AddEmployee;
