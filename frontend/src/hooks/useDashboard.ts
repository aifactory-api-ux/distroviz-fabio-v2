import { useState, useEffect } from 'react';
import { DashboardData } from '../types/dashboard';
import { fetchDashboard } from '../api/dashboard';

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await fetchDashboard();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}