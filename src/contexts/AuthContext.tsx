
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [systemPassword, setSystemPassword] = useState('200531');

  useEffect(() => {
    const savedAuth = localStorage.getItem('taskflow_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === systemPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('taskflow_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('taskflow_authenticated');
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === systemPassword) {
      setSystemPassword(newPassword);
      localStorage.setItem('taskflow_password', newPassword);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem('taskflow_password');
    if (savedPassword) {
      setSystemPassword(savedPassword);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
