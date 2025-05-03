import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getCurrentUser, updateUserProfile } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
      addToast('Successfully logged in!', 'success');
      navigate('/');
      return true;
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData);
      setUser(newUser);
      addToast('Registration successful!', 'success');
      navigate('/');
      return true;
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      addToast('Successfully logged out!', 'success');
      navigate('/login');
    } catch (error) {
      addToast(error.message || 'Logout failed', 'error');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await updateUserProfile(profileData);
      setUser(updatedUser);
      addToast('Profile updated successfully!', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Profile update failed', 'error');
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 