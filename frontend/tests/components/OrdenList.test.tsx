import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OrdenList } from '../../src/components/OrdenList';

const mockUseOrdenes = vi.fn();

vi.mock('../../src/hooks/useOrdenes', () => ({
  useOrdenes: () => mockUseOrdenes(),
}));

describe('OrdenList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders list of orders', async () => {
    const ordenes = [{ id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' }];
    mockUseOrdenes.mockReturnValue({ ordenes, loading: false, error: null, deleteOrden: vi.fn(), deletingId: null });

    render(<BrowserRouter><OrdenList /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByText('Planta Norte')).toBeDefined();
    });
  });

  it('shows loading indicator', () => {
    mockUseOrdenes.mockReturnValue({ ordenes: [], loading: true, error: null, deleteOrden: vi.fn(), deletingId: null });
    render(<BrowserRouter><OrdenList /></BrowserRouter>);
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows error message on failure', () => {
    mockUseOrdenes.mockReturnValue({ ordenes: [], loading: false, error: 'API error', deleteOrden: vi.fn(), deletingId: null });
    render(<BrowserRouter><OrdenList /></BrowserRouter>);
    expect(screen.getByText('Error: API error')).toBeDefined();
  });

  it('renders empty state when no orders', () => {
    mockUseOrdenes.mockReturnValue({ ordenes: [], loading: false, error: null, deleteOrden: vi.fn(), deletingId: null });
    render(<BrowserRouter><OrdenList /></BrowserRouter>);
    expect(screen.getByText('No ordenes found')).toBeDefined();
  });
});