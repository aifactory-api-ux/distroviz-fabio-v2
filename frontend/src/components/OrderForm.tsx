import React, { useState } from 'react';
import { OrderCreateRequest } from '../types/order';

interface OrderFormProps {
  onSubmit: (data: OrderCreateRequest) => void;
  loading: boolean;
}

export function OrderForm({ onSubmit, loading }: OrderFormProps) {
  const [userId, setUserId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userId, productId, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2>Create Order</h2>
      <div>
        <label>User ID</label>
        <input
          type="text"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Product ID</label>
        <input
          type="text"
          value={productId}
          onChange={e => setProductId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value, 10))}
          min="1"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Order'}
      </button>
    </form>
  );
}