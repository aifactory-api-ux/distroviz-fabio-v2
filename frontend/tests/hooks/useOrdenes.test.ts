import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetchOrdenes = vi.fn();
const mockCreateOrden = vi.fn();
const mockDeleteOrden = vi.fn();

vi.mock('../../src/api/ordenes', () => ({
  fetchOrdenes: mockFetchOrdenes,
  createOrden: mockCreateOrden,
  deleteOrden: mockDeleteOrden,
}));

describe('useOrdenes hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns ordenes on mount', async () => {
    const ordenes = [{ id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' }];
    mockFetchOrdenes.mockResolvedValueOnce(ordenes);

    const { useOrdenes } = await import('../../src/hooks/useOrdenes');
    const hookResult = useOrdenes();
    expect(hookResult.ordenes).toEqual(ordenes);
  });

  it('handles API error on fetch', async () => {
    mockFetchOrdenes.mockRejectedValueOnce(new Error('API error'));

    const { useOrdenes } = await import('../../src/hooks/useOrdenes');
    const hookResult = useOrdenes();
    expect(hookResult.error).toBeDefined();
  });

  it('can create a new orden and updates state', async () => {
    const ordenes = [{ id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' }];
    const newOrden = { id: 2, fecha: '2024-06-02', planta: 'Planta Sur', centroDistribucion: 'CD Sur', producto: 'Producto B', cantidad: 200, estado: 'pendiente' };
    mockFetchOrdenes.mockResolvedValue(ordenes);
    mockCreateOrden.mockResolvedValueOnce(newOrden);

    const { useOrdenes } = await import('../../src/hooks/useOrdenes');
    const hookResult = useOrdenes();
    await hookResult.createOrden({ fecha: '2024-06-02', planta: 'Planta Sur', centroDistribucion: 'CD Sur', producto: 'Producto B', cantidad: 200, estado: 'pendiente' });
    expect(mockCreateOrden).toHaveBeenCalled();
  });
});