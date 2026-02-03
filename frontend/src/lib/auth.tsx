'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUserId(response.id);
    setIsAuthenticated(true);
    localStorage.setItem('userId', response.id);
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    const response = await api.register(name, phone, email, password);
    setUserId(response.id);
    setIsAuthenticated(true);
    localStorage.setItem('userId', response.id);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors
    }
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
