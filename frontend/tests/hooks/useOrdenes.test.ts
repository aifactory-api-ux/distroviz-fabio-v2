import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOrdenes } from '../../src/hooks/useOrdenes';

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and returns ordenes on mount', async () => {
    const ordenes = [{ id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' }];
    mockFetchOrdenes.mockResolvedValueOnce(ordenes);

    const { result } = renderHook(() => useOrdenes());

    await waitFor(() => {
      expect(result.current.ordenes).toEqual(ordenes);
    });
  });

  it('handles API error on fetch', async () => {
    mockFetchOrdenes.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useOrdenes());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('can create a new orden and updates state', async () => {
    const ordenes = [{ id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' }];
    const newOrden = { id: 2, fecha: '2024-06-02', planta: 'Planta Sur', centroDistribucion: 'CD Sur', producto: 'Producto B', cantidad: 200, estado: 'pendiente' };
    mockFetchOrdenes.mockResolvedValue(ordenes);
    mockCreateOrden.mockResolvedValueOnce(newOrden);

    const { result } = renderHook(() => useOrdenes());

    await waitFor(() => {
      expect(result.current.ordenes).toEqual(ordenes);
    });

    await result.current.createOrden({ fecha: '2024-06-02', planta: 'Planta Sur', centroDistribucion: 'CD Sur', producto: 'Producto B', cantidad: 200, estado: 'pendiente' });

    await waitFor(() => {
      expect(result.current.ordenes).toEqual([...ordenes, newOrden]);
    });
  });

  it('deleteOrden function is defined', () => {
    const { result } = renderHook(() => useOrdenes());
    expect(result.current.deleteOrden).toBeDefined();
  });
});