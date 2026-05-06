import { Product } from '../types/product';

interface ProductListProps {
  products: Product[];
  onSelect: (id: string) => void;
}

export function ProductList({ products, onSelect }: ProductListProps) {
  return (
    <div className="product-list">
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id} onClick={() => onSelect(product.id)}>
              <div>Name: {product.name}</div>
              <div>SKU: {product.sku}</div>
              <div>Description: {product.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}