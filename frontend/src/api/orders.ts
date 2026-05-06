import axios from 'axios';
import { Order, OrderCreateRequest, OrderCreateResponse } from '../types/order';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23005';

export const ordersApi = {
  create: async (data: OrderCreateRequest): Promise<OrderCreateResponse> => {
    const response = await axios.post(`${API_URL}/api/orders`, data);
    return response.data;
  },

  getAll: async (userId?: string) => {
    const params = userId ? { params: { userId } } : {};
    const response = await axios.get(`${API_URL}/api/orders`, params);
    return response.data;
  },

  getOne: async (id: string): Promise<Order> => {
    const response = await axios.get(`${API_URL}/api/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: Order['status']) => {
    const response = await axios.patch(`${API_URL}/api/orders/${id}/status`, { status });
    return response.data;
  },
};