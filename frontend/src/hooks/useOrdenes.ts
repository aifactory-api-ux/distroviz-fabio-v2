import { useState, useEffect } from 'react';
import { Orden, CreateOrdenDto } from '../types/orden';
import { fetchOrdenes, createOrden, deleteOrden } from '../api/ordenes';

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadOrdenes();
  }, []);

  async function loadOrdenes() {
    try {
      setLoading(true);
      const data = await fetchOrdenes();
      setOrdenes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function createNewOrden(data: CreateOrdenDto) {
    try {
      const newOrden = await createOrden(data);
      setOrdenes((prev) => [...prev, newOrden]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }

  async function removeOrden(id: number) {
    try {
      setDeletingId(id);
      await deleteOrden(id);
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setDeletingId(null);
    }
  }

  return {
    ordenes,
    loading,
    error,
    createOrden: createNewOrden,
    deleteOrden: removeOrden,
    deletingId,
  };
}