"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('sabuj_menar_token');
    const storedUser = localStorage.getItem('sabuj_menar_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('sabuj_menar_token', newToken);
    localStorage.setItem('sabuj_menar_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('sabuj_menar_token');
    localStorage.removeItem('sabuj_menar_user');
    setToken(null);
    setUser(null);
  };

  const checkAuth = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('sabuj_menar_token');
    if (!storedToken) {
      logout();
      return false;
    }
    try {
      const response = await api.get('/auth/me');
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('sabuj_menar_user', JSON.stringify(response.data));
        return true;
      }
      return false;
    } catch (err) {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, checkAuth }}>
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
