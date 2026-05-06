import { DashboardData } from '../types/dashboard';

interface DashboardKPIsProps {
  dashboard: DashboardData | null;
}

export function DashboardKPIs({ dashboard }: DashboardKPIsProps) {
  if (!dashboard) {
    return <div>Loading KPIs...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
        <h3>Total Ordenes</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboard.totalOrdenes}</p>
      </div>
      <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
        <h3>Despachadas</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboard.totalDespachadas}</p>
      </div>
      <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
        <h3>Entregadas</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboard.totalEntregadas}</p>
      </div>
      <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
        <h3>Pendientes</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboard.ordenesPendientes}</p>
      </div>
    </div>
  );
}