import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OrdenForm } from '../../src/components/OrdenForm';

const mockCreateOrden = vi.fn();

vi.mock('../../src/api/ordenes', () => ({
  createOrden: mockCreateOrden,
}));

describe('OrdenForm', () => {
  beforeEach(() => {
    mockCreateOrden.mockReset();
    mockCreateOrden.mockResolvedValue({ id: 1, fecha: '2024-06-01', planta: 'Planta Norte', centroDistribucion: 'CD Central', producto: 'Producto A', cantidad: 100, estado: 'pendiente' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits valid form', async () => {
    render(<BrowserRouter><OrdenForm /></BrowserRouter>);
    const fechaInput = screen.getByPlaceholderText('Fecha (YYYY-MM-DD)');
    const plantaInput = screen.getByPlaceholderText('Planta');
    const cdInput = screen.getByPlaceholderText('Centro Distribucion');
    const productoInput = screen.getByPlaceholderText('Producto');

    fireEvent.change(fechaInput, { target: { value: '2024-06-01' } });
    fireEvent.change(plantaInput, { target: { value: 'Planta Norte' } });
    fireEvent.change(cdInput, { target: { value: 'CD Central' } });
    fireEvent.change(productoInput, { target: { value: 'Producto A' } });

    fireEvent.click(screen.getByText('Create Orden'));

    await waitFor(() => {
      expect(mockCreateOrden).toHaveBeenCalledWith(expect.objectContaining({
        fecha: '2024-06-01',
        planta: 'Planta Norte',
        centroDistribucion: 'CD Central',
        producto: 'Producto A',
      }));
    });
  });

  it('shows validation errors for missing fields', async () => {
    render(<BrowserRouter><OrdenForm /></BrowserRouter>);
    fireEvent.click(screen.getByText('Create Orden'));

    await waitFor(() => {
      expect(screen.getByText('All fields are required')).toBeDefined();
    });
  });

  it('prevents negative cantidad', async () => {
    render(<BrowserRouter><OrdenForm /></BrowserRouter>);
    const cantidadInput = screen.getByPlaceholderText('Cantidad');
    fireEvent.change(cantidadInput, { target: { value: '-5' } });

    fireEvent.click(screen.getByText('Create Orden'));

    await waitFor(() => {
      expect(screen.getByText('Cantidad must be non-negative')).toBeDefined();
    });
  });
});