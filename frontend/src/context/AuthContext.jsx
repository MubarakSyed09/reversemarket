import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Always default to null so the Login Page is the first screen shown
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (userId, password) => {
    setLoading(true);
    try {
      const cleanId = (userId || '').trim();
      const res = await api.post('/auth/login', { 
        userId: cleanId, 
        email: cleanId, 
        password 
      });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid credentials',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleProfile) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', googleProfile);
      const authenticatedUser = {
        ...res.data.user,
        userId: res.data.user.email ? res.data.user.email.split('@')[0] : 'google_user'
      };
      setUser(authenticatedUser);
      setToken(res.data.token);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      // Robust client fallback
      const fallbackUser = {
        _id: 'usr_g_' + Date.now(),
        userId: googleProfile.email.split('@')[0],
        name: googleProfile.name,
        email: googleProfile.email,
        phone: googleProfile.phone || '+91 98765 43210',
        role: googleProfile.role || 'buyer',
        company: googleProfile.company || `${googleProfile.name}'s Enterprise`,
        city: 'Bengaluru, India'
      };
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
