import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';
import { authApi } from '../api/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const isAuthenticated = !!token && !!user;

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(username, password);
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem('token', response.accessToken);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const userData = await authApi.getMe(token);
      setUser(userData);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token, user, fetchCurrentUser]);

  return { user, loading, error, login, logout, isAuthenticated };
}