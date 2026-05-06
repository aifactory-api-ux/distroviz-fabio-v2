import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();

const originalFetch = global.fetch;
global.fetch = mockFetch;

describe('ordenes API', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetchOrdenes returns array of Orden on 200 OK', async () => {
    const ordenes = [
      { id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(ordenes),
    });

    const { fetchOrdenes } = await import('../../src/api/ordenes');
    const result = await fetchOrdenes();
    expect(result).toEqual(ordenes);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/ordenes'));
  });

  it('createOrden sends correct payload and returns Orden on 201 Created', async () => {
    const newOrden = { id: 2, fecha: '2024-06-02', planta: 'Planta Sur', centroDistribucion: 'CD Sur', producto: 'Producto B', cantidad: 200, estado: 'pendiente' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newOrden),
    });

    const { createOrden } = await import('../../src/api/ordenes');
    const result = await createOrden({ fecha: '2024-06-02', planta: 'Planta Sur', centroDistribucion: 'CD Sur', producto: 'Producto B', cantidad: 200, estado: 'pendiente' });
    expect(result).toEqual(newOrden);
  });

  it('deleteOrden sends DELETE and returns 204 No Content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const { deleteOrden } = await import('../../src/api/ordenes');
    await expect(deleteOrden(2)).resolves.toBeUndefined();
  });
});