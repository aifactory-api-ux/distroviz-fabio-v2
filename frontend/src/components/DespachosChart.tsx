import { GraficoDespachos } from '../types/dashboard';

interface DespachosChartProps {
  graficoDespachos: GraficoDespachos[];
}

export function DespachosChart({ graficoDespachos }: DespachosChartProps) {
  if (!graficoDespachos || graficoDespachos.length === 0) {
    return (
      <div style={{ padding: '2rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        No hay datos de despachos para mostrar
      </div>
    );
  }

  const maxCantidad = Math.max(...graficoDespachos.map((d) => d.cantidad));

  return (
    <div style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>
      <h2>Despachos por Fecha</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px', marginTop: '1rem' }}>
        {graficoDespachos.map((item, index) => (
          <div key={index} style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                height: `${(item.cantidad / maxCantidad) * 150}px`,
                backgroundColor: 'var(--color-primary)',
                borderRadius: '0.25rem 0.25rem 0 0',
                minHeight: '4px',
              }}
            />
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{item.fecha}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{item.cantidad}</p>
          </div>
        ))}
      </div>
    </div>
  );
}