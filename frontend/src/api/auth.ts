import axios from 'axios';
import { AuthTokenResponse } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23005';

export const authApi = {
  login: async (username: string, password: string): Promise<AuthTokenResponse> => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
    return response.data;
  },

  getMe: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};