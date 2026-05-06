import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetchDashboard = vi.fn();

vi.mock('../../src/api/dashboard', () => ({
  fetchDashboard: mockFetchDashboard,
}));

describe('useDashboard hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns dashboard data on mount', async () => {
    const dashboardData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      ordenesPendientes: 40,
      graficoDespachos: [],
    };
    mockFetchDashboard.mockResolvedValueOnce(dashboardData);

    const { useDashboard } = await import('../../src/hooks/useDashboard');
    const hookResult = useDashboard();
    expect(hookResult.dashboard).toEqual(dashboardData);
  });

  it('handles API error on fetch', async () => {
    mockFetchDashboard.mockRejectedValueOnce(new Error('API error'));

    const { useDashboard } = await import('../../src/hooks/useDashboard');
    const hookResult = useDashboard();
    expect(hookResult.error).toBeDefined();
  });
});