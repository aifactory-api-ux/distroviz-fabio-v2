import { useState, useCallback } from 'react';
import { Order, OrderCreateRequest } from '../types/order';
import { ordersApi } from '../api/orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getAll(userId);
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: OrderCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.create(data);
      setOrders(prev => [...prev, response.order]);
      return response.order;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await ordersApi.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, error, createOrder, updateOrderStatus, fetchOrders };
}