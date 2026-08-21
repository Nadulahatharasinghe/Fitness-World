import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to format user with correct profileImage URL
const formatUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    profileImage: user.profileImage 
      ? (user.profileImage.startsWith('http') 
        ? user.profileImage 
        : `${BASE_URL}${user.profileImage}`) 
      : ''
  };
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('fw_token');
      const savedUser = localStorage.getItem('fw_user');
      if (token && savedUser) {
        try {
          setUser(formatUser(JSON.parse(savedUser)));
          // Re-validate token with server
          const { data } = await authAPI.me();
          const formattedUser = formatUser(data.user);
          setUser(formattedUser);
          localStorage.setItem('fw_user', JSON.stringify(formattedUser));
        } catch {
          localStorage.removeItem('fw_token');
          localStorage.removeItem('fw_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials);
    if (data.twofaRequired) {
      return { twofaRequired: true, tempToken: data.tempToken, message: data.message };
    }
    const formattedUser = formatUser(data.user);
    localStorage.setItem('fw_token', data.token);
    localStorage.setItem('fw_user', JSON.stringify(formattedUser));
    setUser(formattedUser);
    return { success: true, user: formattedUser };
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await authAPI.register(userData);
    const formattedUser = formatUser(data.user);
    localStorage.setItem('fw_token', data.token);
    localStorage.setItem('fw_user', JSON.stringify(formattedUser));
    setUser(formattedUser);
    return { success: true, user: formattedUser };
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    localStorage.removeItem('fw_token');
    localStorage.removeItem('fw_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    const formattedUser = formatUser(updatedUser);
    setUser(formattedUser);
    localStorage.setItem('fw_user', JSON.stringify(formattedUser));
  }, []);

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isLoggedIn, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
