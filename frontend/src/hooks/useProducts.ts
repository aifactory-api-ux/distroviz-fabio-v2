import { useState, useCallback } from 'react';
import { Product } from '../types/product';
import { productsApi } from '../api/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts };
}