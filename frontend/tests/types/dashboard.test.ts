import { describe, it, expect } from 'vitest';

interface GraficoDespachos {
  fecha: string;
  cantidad: number;
}

interface DashboardData {
  totalOrdenes: number;
  totalDespachadas: number;
  totalEntregadas: number;
  ordenesPendientes: number;
  graficoDespachos: GraficoDespachos[];
}

function validateGraficoDespachos(obj: any): obj is GraficoDespachos {
  return typeof obj.fecha === 'string' && typeof obj.cantidad === 'number';
}

function validateDashboardData(obj: any): obj is DashboardData {
  return (
    typeof obj.totalOrdenes === 'number' &&
    typeof obj.totalDespachadas === 'number' &&
    typeof obj.totalEntregadas === 'number' &&
    typeof obj.ordenesPendientes === 'number' &&
    Array.isArray(obj.graficoDespachos) &&
    obj.graficoDespachos.every(validateGraficoDespachos)
  );
}

describe('DashboardData interface', () => {
  it('matches API contract fields and types', () => {
    const data: DashboardData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      ordenesPendientes: 40,
      graficoDespachos: [{ fecha: '2024-06-01', cantidad: 10 }],
    };
    expect(validateDashboardData(data)).toBe(true);
  });

  it('rejects missing required fields', () => {
    const invalidData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      graficoDespachos: [],
    };
    expect(validateDashboardData(invalidData)).toBe(false);
  });
});

describe('GraficoDespachos interface', () => {
  it('matches API contract fields and types', () => {
    const item: GraficoDespachos = {
      fecha: '2024-06-01',
      cantidad: 10,
    };
    expect(validateGraficoDespachos(item)).toBe(true);
  });
});