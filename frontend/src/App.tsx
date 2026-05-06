import { Routes, Route, Link } from 'react-router-dom';
import { OrdenList } from './components/OrdenList';
import { DashboardKPIs } from './components/DashboardKPIs';
import { DespachosChart } from './components/DespachosChart';
import { useDashboard } from './hooks/useDashboard';

function Dashboard() {
  const { dashboard, loading, error, refresh } = useDashboard();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={refresh}>Refresh</button>
      <DashboardKPIs dashboard={dashboard} />
      <DespachosChart graficoDespachos={dashboard?.graficoDespachos || []} />
    </div>
  );
}

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/ordenes">Ordenes</Link>
      </nav>
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ordenes" element={<OrdenList />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;