import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();

const originalFetch = global.fetch;
global.fetch = mockFetch;

describe('dashboard API', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetchDashboardData returns DashboardData on 200 OK', async () => {
    const dashboardData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      ordenesPendientes: 40,
      graficoDespachos: [{ fecha: '2024-06-01', cantidad: 10 }],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(dashboardData),
    });

    const { fetchDashboard } = await import('../../src/api/dashboard');
    const result = await fetchDashboard();
    expect(result).toEqual(dashboardData);
  });

  it('fetchDashboardData handles server error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { fetchDashboard } = await import('../../src/api/dashboard');
    await expect(fetchDashboard()).rejects.toThrow();
  });
});