import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: number | string;
  email: string;
  full_name?: string;
  rra_coefficient?: number | null;
  risk_level?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 🔥 initialize immediately from localStorage (NO delay)
  const token = localStorage.getItem('access_token');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState<boolean>(false); // no async init anymore

  const login = async (token: string) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};