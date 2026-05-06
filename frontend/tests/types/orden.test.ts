import { describe, it, expect } from 'vitest';

interface Orden {
  id: number;
  fecha: string;
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}

interface CreateOrdenDto {
  fecha: string;
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}

function validateOrden(obj: any): obj is Orden {
  return (
    typeof obj.id === 'number' &&
    typeof obj.fecha === 'string' &&
    typeof obj.planta === 'string' &&
    typeof obj.centroDistribucion === 'string' &&
    typeof obj.producto === 'string' &&
    typeof obj.cantidad === 'number' &&
    ['pendiente', 'despachado', 'entregado'].includes(obj.estado)
  );
}

function validateCreateOrdenDto(obj: any): obj is CreateOrdenDto {
  return (
    typeof obj.fecha === 'string' &&
    typeof obj.planta === 'string' &&
    typeof obj.centroDistribucion === 'string' &&
    typeof obj.producto === 'string' &&
    typeof obj.cantidad === 'number' &&
    ['pendiente', 'despachado', 'entregado'].includes(obj.estado)
  );
}

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
    expect(validateOrden(orden)).toBe(true);
  });

  it('rejects missing required fields', () => {
    const invalidOrden = {
      id: 1,
      fecha: '2024-06-01',
      planta: 'Planta Norte',
      producto: 'Producto A',
      cantidad: 100,
      estado: 'pendiente',
    };
    expect(validateOrden(invalidOrden)).toBe(false);
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
    expect(validateCreateOrdenDto(dto)).toBe(true);
  });
});