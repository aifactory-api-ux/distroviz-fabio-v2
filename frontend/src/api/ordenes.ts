import { Orden, CreateOrdenDto } from '../types/orden';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23001/api';

export async function fetchOrdenes(): Promise<Orden[]> {
  const response = await fetch(`${API_URL}/ordenes`);
  if (!response.ok) {
    throw new Error('Failed to fetch ordenes');
  }
  return response.json();
}

export async function createOrden(data: CreateOrdenDto): Promise<Orden> {
  const response = await fetch(`${API_URL}/ordenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create orden');
  }
  return response.json();
}

export async function deleteOrden(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/ordenes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete orden');
  }
}