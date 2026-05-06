import { useState } from 'react';
import { CreateOrdenDto } from '../types/orden';
import { createOrden as createOrdenApi } from '../api/ordenes';

export function OrdenForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateOrdenDto>({
    fecha: '',
    planta: '',
    centroDistribucion: '',
    producto: '',
    cantidad: 0,
    estado: 'pendiente',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fecha || !formData.planta || !formData.centroDistribucion || !formData.producto) {
      setError('All fields are required');
      return;
    }

    if (formData.cantidad < 0) {
      setError('Cantidad must be non-negative');
      return;
    }

    const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(formData.fecha);
    if (!isoDate) {
      setError('Fecha must be a valid ISO 8601 date (YYYY-MM-DD)');
      return;
    }

    try {
      setLoading(true);
      await createOrdenApi(formData);
      setFormData({
        fecha: '',
        planta: '',
        centroDistribucion: '',
        producto: '',
        cantidad: 0,
        estado: 'pendiente',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-border)' }}>
      <h2>Create New Orden</h2>
      {error && <div style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input
          type="text"
          name="fecha"
          placeholder="Fecha (YYYY-MM-DD)"
          value={formData.fecha}
          onChange={handleChange}
        />
        <input
          type="text"
          name="planta"
          placeholder="Planta"
          value={formData.planta}
          onChange={handleChange}
        />
        <input
          type="text"
          name="centroDistribucion"
          placeholder="Centro Distribucion"
          value={formData.centroDistribucion}
          onChange={handleChange}
        />
        <input
          type="text"
          name="producto"
          placeholder="Producto"
          value={formData.producto}
          onChange={handleChange}
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad}
          onChange={handleChange}
        />
        <select name="estado" value={formData.estado} onChange={handleChange}>
          <option value="pendiente">Pendiente</option>
          <option value="despachado">Despachado</option>
          <option value="entregado">Entregado</option>
        </select>
      </div>
      <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Creating...' : 'Create Orden'}
      </button>
    </form>
  );
}