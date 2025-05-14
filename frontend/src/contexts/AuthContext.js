'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));
      } catch (err) {
        console.error('Error parsing user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Login attempt:', credentials);
      const response = await userAPI.login(credentials);
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return response;
    } catch (err) {
      console.error('Login error:', err.message, err.response?.data);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Register attempt:', userData);
      const response = await userAPI.register(userData);
      console.log('Register response:', response.data);
      return response;
    } catch (err) {
      console.error('Register error:', err.message, err.response?.data, err.response?.status);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}