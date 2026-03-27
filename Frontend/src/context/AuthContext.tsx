import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Make sure this path is correct!

// Define what your User object looks like from FastAPI
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
  refreshUser: () => Promise<void>; // Added so you can update profile after quiz
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start loading as true!

  // Centralized function to fetch the user profile
  const fetchUser = async (token: string) => {
    try {
      // Pass the token explicitly in case the interceptor isn't catching it yet
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      // If the token is invalid/expired, log them out
      logout(); 
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchUser(token);
      }
      setLoading(false); // Done checking, safe to render routes now
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    setLoading(true);
    localStorage.setItem('access_token', token);
    await fetchUser(token); // Fetch their profile immediately upon login
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};