import { useState, useCallback } from 'react';
import { InventoryItem } from '../types/inventory';
import { inventoryApi } from '../api/inventory';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.get(productId);
      setInventory(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkInventory = useCallback(async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await inventoryApi.check({ productId, quantity });
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { inventory, loading, error, checkInventory, fetchInventory };
}