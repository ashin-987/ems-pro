import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, FormField } from '../components/ui';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      await axiosInstance.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Password changed successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-bold text-2xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.username}</h3>
                <p className="text-sm text-gray-600">{user?.role}</p>
                <p className="text-xs text-gray-500 mt-1">Member since {new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Username</p>
                <p className="mt-1 text-gray-900">{user?.username}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Role</p>
                <p className="mt-1 text-gray-900">{user?.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <FormField label="Current Password" required error={errors.oldPassword}>
              <Input
                type="password"
                name="oldPassword"
                placeholder="Enter current password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                error={errors.oldPassword}
              />
            </FormField>

            <FormField label="New Password" required error={errors.newPassword}>
              <Input
                type="password"
                name="newPassword"
                placeholder="Enter new password (min. 8 characters)"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
              />
            </FormField>

            <FormField label="Confirm New Password" required error={errors.confirmPassword}>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
              />
            </FormField>

            <Button
              type="submit"
              isLoading={isChangingPassword}
              disabled={isChangingPassword}
            >
              <Save className="h-4 w-4" />
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              Use a strong password with at least 8 characters
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              Include a mix of uppercase, lowercase, numbers, and symbols
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              Don't reuse passwords from other accounts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              Change your password regularly for better security
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
