import React from 'react';
import { Order } from '../types/order';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, status: Order['status']) => void;
}

export function OrderList({ orders, onStatusChange }: OrderListProps) {
  return (
    <div className="order-list">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <div>Order ID: {order.id}</div>
              <div>Product ID: {order.productId}</div>
              <div>Quantity: {order.quantity}</div>
              <div>Status: {order.status}</div>
              <select
                value={order.status}
                onChange={e => onStatusChange(order.id, e.target.value as Order['status'])}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="DISPATCHED">DISPATCHED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}