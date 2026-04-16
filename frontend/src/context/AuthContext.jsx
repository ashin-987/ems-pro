import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ems_user')); } catch { return null; }
  });

  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    const { token, ...userInfo } = data.data;
    localStorage.setItem('ems_token', token);
    localStorage.setItem('ems_user', JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
