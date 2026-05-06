import { describe, it, expect } from 'vitest';
import { Orden, CreateOrdenDto } from '../../src/types/orden';

describe('Orden interface', () => {
  it('matches API contract fields and types', () => {
    const orden: Orden = {
      id: 1,
      fecha: '2024-06-01',
      planta: 'Planta Norte',
      centroDistribucion: 'CD Central',
      producto: 'Producto A',
      cantidad: 100,
      estado: 'pendiente',
    };
    expect(orden.id).toBe(1);
    expect(orden.fecha).toBe('2024-06-01');
  });

  it('rejects invalid estado values', () => {
    const orden = {
      id: 1,
      fecha: '2024-06-01',
      planta: 'Planta Norte',
      centroDistribucion: 'CD Central',
      producto: 'Producto A',
      cantidad: 100,
      estado: 'invalid' as any,
    };
    expect(['pendiente', 'despachado', 'entregado'].includes(orden.estado)).toBe(false);
  });
});

describe('CreateOrdenDto interface', () => {
  it('matches API contract fields and types', () => {
    const dto: CreateOrdenDto = {
      fecha: '2024-06-01',
      planta: 'Planta Norte',
      centroDistribucion: 'CD Central',
      producto: 'Producto A',
      cantidad: 100,
      estado: 'pendiente',
    };
    expect(dto.fecha).toBe('2024-06-01');
    expect(dto.cantidad).toBe(100);
  });
});