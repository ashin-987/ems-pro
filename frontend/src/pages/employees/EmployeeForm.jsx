import { useForm } from 'react-hook-form';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormField, Input, Select, Spinner } from '../../components/ui/index.jsx';

const DEPARTMENTS = ['Engineering','HR','Finance','Marketing','Operations','Sales','Legal'];
const EDUCATIONS  = ['High School','Diploma','BBA','BCA','B.Tech','B.Sc','B.Com','MBA','MCA','M.Tech','M.Sc','PhD'];

export default function EmployeeForm({ defaultValues, onSubmit, isEdit = false }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* ── Personal Info ─────────────────────────────── */}
      <section className="card mb-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required error={errors.name?.message}>
            <Input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
              placeholder="Ravi Kumar"
              error={errors.name}
            />
          </FormField>

          <FormField label="Father's Name" error={errors.fatherName?.message}>
            <Input {...register('fatherName')} placeholder="Suresh Kumar" />
          </FormField>

          <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} />
          </FormField>

          <FormField label="Highest Education" error={errors.education?.message}>
            <Select {...register('education')}>
              <option value="">Select education</option>
              {EDUCATIONS.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
          </FormField>

          <FormField label="Aadhar Number" error={errors.aadharNumber?.message}>
            <Input
              {...register('aadharNumber', {
                pattern: { value: /^[0-9]{12}$/, message: 'Must be exactly 12 digits' },
              })}
              placeholder="123456789012"
              error={errors.aadharNumber}
              maxLength={12}
            />
          </FormField>
        </div>
      </section>

      {/* ── Contact Info ──────────────────────────────── */}
      <section className="card mb-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Email" required error={errors.email?.message}>
            <Input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
              placeholder="ravi@company.com"
              error={errors.email}
            />
          </FormField>

          <FormField label="Phone" error={errors.phone?.message}>
            <Input
              {...register('phone', {
                pattern: { value: /^[0-9]{10}$/, message: 'Must be exactly 10 digits' },
              })}
              placeholder="9876543210"
              error={errors.phone}
              maxLength={10}
            />
          </FormField>

          <FormField label="Address" error={errors.address?.message} className="sm:col-span-2">
            <Input {...register('address')} placeholder="123, MG Road, Bengaluru" />
          </FormField>
        </div>
      </section>

      {/* ── Employment Info ───────────────────────────── */}
      <section className="card mb-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Employment Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Designation" required error={errors.designation?.message}>
            <Input
              {...register('designation', { required: 'Designation is required' })}
              placeholder="Software Engineer"
              error={errors.designation}
            />
          </FormField>

          <FormField label="Department" error={errors.department?.message}>
            <Select {...register('department')}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </FormField>

          <FormField label="Salary (₹ / month)" error={errors.salary?.message}>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('salary', {
                min: { value: 0, message: 'Salary must be positive' },
              })}
              placeholder="50000"
              error={errors.salary}
            />
          </FormField>

          <FormField label="Joining Date" error={errors.joiningDate?.message}>
            <Input type="date" {...register('joiningDate')} />
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <Select {...register('status')}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
            </Select>
          </FormField>
        </div>
      </section>

      {/* ── Actions ───────────────────────────────────── */}
      <div className="flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={() => navigate('/employees')}>
          <ArrowLeft size={16} /> Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner size={16} /> Saving…</> : <><Save size={16} /> {isEdit ? 'Update Employee' : 'Add Employee'}</>}
        </button>
      </div>
    </form>
  );
}
