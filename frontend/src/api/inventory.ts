import axios from 'axios';
import { InventoryItem, InventoryCheckRequest, InventoryCheckResponse } from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23005';

export const inventoryApi = {
  get: async (productId: string): Promise<InventoryItem> => {
    const response = await axios.get(`${API_URL}/api/inventory/${productId}`);
    return response.data;
  },

  check: async (data: InventoryCheckRequest): Promise<InventoryCheckResponse> => {
    const response = await axios.post(`${API_URL}/api/inventory/check`, data);
    return response.data;
  },
};