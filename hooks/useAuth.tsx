
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start as true to check for existing session
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      if (!response.ok) {
        throw new Error('Session expired or invalid.');
      }
      const userData: User = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to fetch user profile", e);
      // If profile fetch fails, token is invalid, so log out
      logout();
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
      
      const jwtToken = data.token;
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
      
      // After getting token, fetch profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      if(!profileResponse.ok) {
          throw new Error('Could not retrieve user profile after login.');
      }
      const loggedInUser: User = await profileResponse.json();
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      return loggedInUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'USER' }), // Role is hardcoded to USER for public registration
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Registration failed');
        }
    } catch (err: any) {
        setError(err.message);
        throw err;
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

  const value = { user, token, login, logout, register, loading, error };

  // Render children only when not loading initial session
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
