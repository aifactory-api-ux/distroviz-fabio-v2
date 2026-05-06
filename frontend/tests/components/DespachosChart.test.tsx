import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DespachosChart } from '../../src/components/DespachosChart';
import { GraficoDespachos } from '../../src/types/dashboard';

describe('DespachosChart', () => {
  it('renders chart with data', () => {
    const graficoDespachos: GraficoDespachos[] = [
      { fecha: '2024-06-01', cantidad: 10 },
      { fecha: '2024-06-02', cantidad: 20 },
    ];
    render(<DespachosChart graficoDespachos={graficoDespachos} />);
    expect(screen.getByText('Despachos por Fecha')).toBeDefined();
    expect(screen.getByText('2024-06-01')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();
  });

  it('renders empty chart when no data', () => {
    render(<DespachosChart graficoDespachos={[]} />);
    expect(screen.getByText('No hay datos de despachos para mostrar')).toBeDefined();
  });

  it('renders empty chart when data is null', () => {
    render(<DespachosChart graficoDespachos={null as any} />);
    expect(screen.getByText('No hay datos de despachos para mostrar')).toBeDefined();
  });

  it('renders chart with single data point', () => {
    const graficoDespachos: GraficoDespachos[] = [
      { fecha: '2024-06-01', cantidad: 15 },
    ];
    render(<DespachosChart graficoDespachos={graficoDespachos} />);
    expect(screen.getByText('15')).toBeDefined();
  });
});