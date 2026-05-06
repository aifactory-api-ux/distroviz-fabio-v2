export interface InventoryItem {
  id: string;
  productId: string;
  stock: number;
  updatedAt: string;
}

export interface InventoryCheckRequest {
  productId: string;
  quantity: number;
}

export interface InventoryCheckResponse {
  available: boolean;
  currentStock: number;
}