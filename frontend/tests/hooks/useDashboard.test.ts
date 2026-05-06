import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboard } from '../../src/hooks/useDashboard';

const mockFetchDashboard = vi.fn();

vi.mock('../../src/api/dashboard', () => ({
  fetchDashboard: mockFetchDashboard,
}));

describe('useDashboard hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboardData);
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles API error on fetch', async () => {
    mockFetchDashboard.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await waitFor(() => {
      expect(result.current.dashboard).toBeNull();
    });
  });

  it('refresh function is defined', () => {
    const { result } = renderHook(() => useDashboard());
    expect(result.current.refresh).toBeDefined();
  });
});