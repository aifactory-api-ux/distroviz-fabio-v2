import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { UserMenu } from './components/UserMenu';
import { OrdenList } from './components/OrdenList';
import { OrdenForm } from './components/OrdenForm';
import { DashboardKPIs } from './components/DashboardKPIs';
import { DespachosChart } from './components/DespachosChart';
import { useDashboard } from './hooks/useDashboard';

function Dashboard() {
  const { dashboard } = useDashboard();
  return (
    <div>
      <DashboardKPIs dashboard={dashboard} />
      <DespachosChart graficoDespachos={dashboard?.graficoDespachos || []} />
    </div>
  );
}

function Ordenes() {
  return (
    <div>
      <h1>Ordenes</h1>
      <OrdenForm />
      <OrdenList />
    </div>
  );
}

function NotFound() {
  return <div>404 Not Found</div>;
}

function App() {
  const { user, loading: authLoading, error, login, logout, isAuthenticated } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} loading={authLoading} error={error} />;
  }

  return (
    <div className="app">
      <header>
        <h1>DistroViz</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/ordenes">Ordenes</Link>
        </nav>
        <UserMenu user={user!} onLogout={logout} />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;