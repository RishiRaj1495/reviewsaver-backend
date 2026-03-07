import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
  // Mock registration – just store a fake token and user
  localStorage.setItem('token', 'fake-jwt-token');
  setUser({ id: 1, ...userData });
  return { user: { id: 1, ...userData }, token: 'fake-token' };
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};