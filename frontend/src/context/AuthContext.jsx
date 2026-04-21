import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      // Backend returns: { token, tokenType, userId, username, fullName, role, refreshToken }
      const { token, refreshToken, userId, username: userName, fullName, role } = response.data.data;

      const userData = {
        userId,
        username: userName,
        fullName,
        role,
      };

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);

      toast.success(`Welcome back, ${userData.username}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    isAdmin: user?.role === 'ADMIN',
    isHR: user?.role === 'HR',
    isManager: user?.role === 'MANAGER',
    isViewer: user?.role === 'VIEWER',
    canEdit: user?.role === 'ADMIN' || user?.role === 'HR',
    canDelete: user?.role === 'ADMIN',
    canViewDashboard: user?.role !== 'VIEWER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
