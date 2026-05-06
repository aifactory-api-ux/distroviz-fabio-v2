import { InventoryItem } from '../types/inventory';

interface InventoryStatusProps {
  inventory: InventoryItem | null;
  loading: boolean;
}

export function InventoryStatus({ inventory, loading }: InventoryStatusProps) {
  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (!inventory) {
    return <div>No inventory data available</div>;
  }

  return (
    <div className="inventory-status">
      <h2>Inventory Status</h2>
      <div>Product ID: {inventory.productId}</div>
      <div>Stock: {inventory.stock}</div>
      <div>Last Updated: {new Date(inventory.updatedAt).toLocaleString()}</div>
    </div>
  );
}