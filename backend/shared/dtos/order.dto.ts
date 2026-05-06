export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface OrderCreateResponse {
  order: Order;
}