import { DashboardData } from '../types/dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23001/api';

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}