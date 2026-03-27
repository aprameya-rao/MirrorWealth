import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { ENDPOINTS } from '../api/axios';

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
  refreshUser: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Start loading as true so App.tsx knows to wait before redirecting
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout(); // Invalid token, clear everything
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchUser(token);
      }
      setLoading(false); // Done initializing
    };
    initAuth();
  }, []);

  const login = async (token: string) => {
    setLoading(true);
    localStorage.setItem('access_token', token);
    await fetchUser(token);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};