import { useOrdenes } from '../hooks/useOrdenes';
import { OrdenForm } from './OrdenForm';

export function OrdenList() {
  const { ordenes, loading, error, deleteOrden, deletingId } = useOrdenes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Ordenes</h1>
      <OrdenForm />
      {ordenes.length === 0 ? (
        <div>No ordenes found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Planta</th>
              <th>Centro Distribucion</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.id}</td>
                <td>{orden.fecha}</td>
                <td>{orden.planta}</td>
                <td>{orden.centroDistribucion}</td>
                <td>{orden.producto}</td>
                <td>{orden.cantidad}</td>
                <td>{orden.estado}</td>
                <td>
                  <button
                    onClick={() => deleteOrden(orden.id)}
                    disabled={deletingId === orden.id}
                  >
                    {deletingId === orden.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}