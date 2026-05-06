import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardKPIs } from '../../src/components/DashboardKPIs';
import { DashboardData } from '../../src/types/dashboard';

describe('DashboardKPIs', () => {
  it('renders KPI cards', () => {
    const dashboard: DashboardData = {
      totalOrdenes: 120,
      totalDespachadas: 80,
      totalEntregadas: 60,
      ordenesPendientes: 40,
      graficoDespachos: [],
    };
    render(<DashboardKPIs dashboard={dashboard} />);
    expect(screen.getByText('Total Ordenes')).toBeDefined();
    expect(screen.getByText('120')).toBeDefined();
    expect(screen.getByText('Despachadas')).toBeDefined();
    expect(screen.getByText('80')).toBeDefined();
  });

  it('shows loading indicator when dashboard is null', () => {
    render(<DashboardKPIs dashboard={null} />);
    expect(screen.getByText('Loading KPIs...')).toBeDefined();
  });

  it('renders zero values', () => {
    const dashboard: DashboardData = {
      totalOrdenes: 0,
      totalDespachadas: 0,
      totalEntregadas: 0,
      ordenesPendientes: 0,
      graficoDespachos: [],
    };
    render(<DashboardKPIs dashboard={dashboard} />);
    expect(screen.getByText('0')).toBeDefined();
  });
});