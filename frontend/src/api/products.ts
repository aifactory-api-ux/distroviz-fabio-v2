import axios from 'axios';
import { Product } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23005';

export const productsApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_URL}/api/products/${id}`);
    return response.data;
  },
};