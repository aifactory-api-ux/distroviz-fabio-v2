import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useOrders } from './hooks/useOrders';
import { useProducts } from './hooks/useProducts';
import { LoginForm } from './components/LoginForm';
import { UserMenu } from './components/UserMenu';
import { OrderList } from './components/OrderList';
import { OrderForm } from './components/OrderForm';
import { ProductList } from './components/ProductList';

function App() {
  const { user, loading: authLoading, error, login, logout, isAuthenticated } = useAuth();
  const { orders, loading: ordersLoading, createOrder, updateOrderStatus, fetchOrders } = useOrders();
  const { products, loading: productsLoading, fetchProducts } = useProducts();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated, fetchOrders, fetchProducts]);

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
        <UserMenu user={user!} onLogout={logout} />
      </header>

      <main>
        <section>
          <ProductList products={products} onSelect={() => {}} />
        </section>

        <section>
          <OrderForm onSubmit={createOrder} loading={ordersLoading} />
        </section>

        <section>
          <OrderList orders={orders} onStatusChange={updateOrderStatus} />
        </section>
      </main>
    </div>
  );
}

export default App;