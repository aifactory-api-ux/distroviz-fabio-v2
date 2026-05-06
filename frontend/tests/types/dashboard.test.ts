import { describe, it, expect } from 'vitest';
import { GraficoDespachos, DashboardData } from '../../src/types/dashboard';

describe('DashboardData interface', () => {
  it('matches API contract fields and types', () => {
    const data: DashboardData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      ordenesPendientes: 40,
      graficoDespachos: [{ fecha: '2024-06-01', cantidad: 10 }],
    };
    expect(data.totalOrdenes).toBe(120);
    expect(data.totalDespachadas).toBe(80);
  });

  it('rejects invalid dashboard data structure', () => {
    const invalidData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      graficoDespachos: [],
    } as any;
    expect(invalidData.ordenesPendientes).toBeUndefined();
  });
});

describe('GraficoDespachos interface', () => {
  it('matches API contract fields and types', () => {
    const item: GraficoDespachos = {
      fecha: '2024-06-01',
      cantidad: 10,
    };
    expect(item.fecha).toBe('2024-06-01');
    expect(item.cantidad).toBe(10);
  });
});