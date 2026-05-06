# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Node.js v20.x
  - NestJS v10.x
  - TypeScript v5.x
  - PostgreSQL v15.x
  - Redis v7.x
  - RabbitMQ v3.x
- **Frontend**
  - React v18.x
  - TypeScript v5.x
- **Infrastructure**
  - Docker v24.x
  - docker-compose v2.x
  - Kubernetes v1.28.x

---

## 2. DATA CONTRACTS

### Backend (NestJS/TypeScript)

#### Order

```typescript
export interface Order {
  id: string; // UUID
  userId: string; // UUID
  productId: string; // UUID
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}
```

#### InventoryItem

```typescript
export interface InventoryItem {
  id: string; // UUID
  productId: string; // UUID
  stock: number;
  updatedAt: string; // ISO8601
}
```

#### User

```typescript
export interface User {
  id: string; // UUID
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string; // ISO8601
}
```

#### Product

```typescript
export interface Product {
  id: string; // UUID
  name: string;
  description: string;
  sku: string;
  createdAt: string; // ISO8601
}
```

#### OrderCreateRequest

```typescript
export interface OrderCreateRequest {
  userId: string; // UUID
  productId: string; // UUID
  quantity: number;
}
```

#### OrderCreateResponse

```typescript
export interface OrderCreateResponse {
  order: Order;
}
```

#### InventoryCheckRequest

```typescript
export interface InventoryCheckRequest {
  productId: string; // UUID
  quantity: number;
}
```

#### InventoryCheckResponse

```typescript
export interface InventoryCheckResponse {
  available: boolean;
  currentStock: number;
}
```

#### AuthTokenResponse

```typescript
export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}
```

---

### Frontend (React/TypeScript)

#### Order

```typescript
export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}
```

#### InventoryItem

```typescript
export interface InventoryItem {
  id: string;
  productId: string;
  stock: number;
  updatedAt: string;
}
```

#### User

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}
```

#### Product

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  createdAt: string;
}
```

#### OrderCreateRequest

```typescript
export interface OrderCreateRequest {
  userId: string;
  productId: string;
  quantity: number;
}
```

#### OrderCreateResponse

```typescript
export interface OrderCreateResponse {
  order: Order;
}
```

#### InventoryCheckRequest

```typescript
export interface InventoryCheckRequest {
  productId: string;
  quantity: number;
}
```

#### InventoryCheckResponse

```typescript
export interface InventoryCheckResponse {
  available: boolean;
  currentStock: number;
}
```

#### AuthTokenResponse

```typescript
export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}
```

---

## 3. API ENDPOINTS

### Auth Service

- **POST /api/auth/login**
  - Request: `{ username: string; password: string }`
  - Response: `AuthTokenResponse`

- **GET /api/auth/me**
  - Auth: Bearer token
  - Response: `User`

---

### Order Service

- **POST /api/orders**
  - Request: `OrderCreateRequest`
  - Response: `OrderCreateResponse`

- **GET /api/orders**
  - Query: `userId?: string`
  - Response: `{ orders: Order[] }`

- **GET /api/orders/:id**
  - Response: `Order`

- **PATCH /api/orders/:id/status**
  - Request: `{ status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED' }`
  - Response: `Order`

---

### Inventory Service

- **GET /api/inventory/:productId**
  - Response: `InventoryItem`

- **POST /api/inventory/check**
  - Request: `InventoryCheckRequest`
  - Response: `InventoryCheckResponse`

---

### Product Service

- **GET /api/products**
  - Response: `{ products: Product[] }`

- **GET /api/products/:id**
  - Response: `Product`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service             | Listening Port | Path                        |
|---------------------|---------------|-----------------------------|
| auth-service        | 23001         | backend/auth-service/       |
| order-service       | 23002         | backend/order-service/      |
| inventory-service   | 23003         | backend/inventory-service/  |
| product-service     | 23004         | backend/product-service/    |
| api-gateway         | 23005         | backend/api-gateway/        |
| frontend            | 23006         | frontend/                   |

### SHARED MODULES

| Shared path         | Imported by services                                 |
|---------------------|-----------------------------------------------------|
| backend/shared/     | auth-service, order-service, inventory-service, product-service, api-gateway |

---

### File Tree

```
.
├── docker-compose.yml                # Multi-service orchestration (all ports 21000–65000)
├── .env.example                      # Template for all environment variables
├── .gitignore                        # Ignore node_modules, build, .env, etc.
├── README.md                         # Project overview and setup instructions
├── run.sh                            # Root-level startup script for local dev
├── backend/
│   ├── shared/                       # Shared TypeScript modules (DTOs, utils)
│   │   ├── dtos/
│   │   │   ├── order.dto.ts          # Order DTOs/interfaces
│   │   │   ├── inventory.dto.ts      # Inventory DTOs/interfaces
│   │   │   ├── user.dto.ts           # User DTOs/interfaces
│   │   │   ├── product.dto.ts        # Product DTOs/interfaces
│   │   └── utils/
│   │       └── redis.ts              # Redis connection utility
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── main.ts               # NestJS bootstrap
│   │   │   ├── app.module.ts         # Root module
│   │   │   ├── auth.controller.ts    # Auth endpoints
│   │   │   ├── auth.service.ts       # Auth logic
│   │   │   ├── user.entity.ts        # User entity/model
│   │   │   └── jwt.strategy.ts       # JWT strategy
│   │   ├── Dockerfile                # Service Dockerfile (EXPOSE 23001)
│   │   └── .env.example              # Service-specific env vars
│   ├── order-service/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.entity.ts
│   │   │   └── event.publisher.ts    # Publishes to RabbitMQ
│   │   ├── Dockerfile                # EXPOSE 23002
│   │   └── .env.example
│   ├── inventory-service/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.entity.ts
│   │   ├── Dockerfile                # EXPOSE 23003
│   │   └── .env.example
│   ├── product-service/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.entity.ts
│   │   ├── Dockerfile                # EXPOSE 23004
│   │   └── .env.example
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── gateway.controller.ts
│   │   │   ├── gateway.service.ts
│   │   ├── Dockerfile                # EXPOSE 23005
│   │   └── .env.example
├── frontend/
│   ├── public/
│   │   ├── index.html                # HTML entry point
│   ├── src/
│   │   ├── main.tsx                  # React entry point
│   │   ├── App.tsx                   # Root component
│   │   ├── api/
│   │   │   ├── auth.ts               # Auth API client
│   │   │   ├── orders.ts             # Orders API client
│   │   │   ├── inventory.ts          # Inventory API client
│   │   │   ├── products.ts           # Products API client
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Auth state hook
│   │   │   ├── useOrders.ts          # Orders state hook
│   │   │   ├── useInventory.ts       # Inventory state hook
│   │   │   ├── useProducts.ts        # Products state hook
│   │   ├── components/
│   │   │   ├── OrderList.tsx         # Order list component
│   │   │   ├── OrderForm.tsx         # Order creation form
│   │   │   ├── InventoryStatus.tsx   # Inventory status display
│   │   │   ├── ProductList.tsx       # Product list component
│   │   │   ├── LoginForm.tsx         # Login form
│   │   │   └── UserMenu.tsx          # User menu/profile
│   │   ├── types/
│   │   │   ├── order.ts              # Order interfaces
│   │   │   ├── inventory.ts          # Inventory interfaces
│   │   │   ├── user.ts               # User interfaces
│   │   │   ├── product.ts            # Product interfaces
│   ├── Dockerfile                    # EXPOSE 23006
│   └── .env.example
├── k8s/
│   ├── auth-deployment.yaml          # Kubernetes deployment for auth-service
│   ├── order-deployment.yaml         # Kubernetes deployment for order-service
│   ├── inventory-deployment.yaml     # Kubernetes deployment for inventory-service
│   ├── product-deployment.yaml       # Kubernetes deployment for product-service
│   ├── gateway-deployment.yaml       # Kubernetes deployment for api-gateway
│   ├── frontend-deployment.yaml      # Kubernetes deployment for frontend
│   ├── postgres-deployment.yaml      # PostgreSQL deployment
│   ├── redis-deployment.yaml         # Redis deployment
│   ├── rabbitmq-deployment.yaml      # RabbitMQ deployment
│   └── ingress.yaml                  # Ingress configuration
```

---

## 5. ENVIRONMENT VARIABLES

| Name                        | Type    | Description                                         | Example Value                |
|-----------------------------|---------|-----------------------------------------------------|-----------------------------|
| NODE_ENV                    | string  | Node environment                                    | production                  |
| PORT                        | number  | Service listening port                              | 23001                       |
| DATABASE_URL                | string  | PostgreSQL connection string                        | postgres://user:pass@db:5432/distroviz |
| REDIS_URL                   | string  | Redis connection string                             | redis://redis:6379          |
| RABBITMQ_URL                | string  | RabbitMQ connection string                          | amqp://rabbitmq:5672        |
| JWT_SECRET                  | string  | JWT signing secret (auth-service)                   | supersecretjwtkey           |
| JWT_EXPIRES_IN              | string  | JWT expiration (e.g., 3600s)                        | 3600s                       |
| API_GATEWAY_URL             | string  | API Gateway base URL                                | http://api-gateway:23005    |
| FRONTEND_URL                | string  | Frontend base URL                                   | http://localhost:23006      |
| POSTGRES_USER               | string  | PostgreSQL username                                 | distroviz                   |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                                 | distrovizpass               |
| POSTGRES_DB                 | string  | PostgreSQL database name                            | distroviz                   |
| REACT_APP_API_URL           | string  | Frontend: API Gateway URL                           | http://localhost:23005      |

---

## 6. IMPORT CONTRACTS

### Backend

- `from 'backend/shared/dtos/order.dto' import Order, OrderCreateRequest, OrderCreateResponse`
- `from 'backend/shared/dtos/inventory.dto' import InventoryItem, InventoryCheckRequest, InventoryCheckResponse`
- `from 'backend/shared/dtos/user.dto' import User`
- `from 'backend/shared/dtos/product.dto' import Product`
- `from 'backend/shared/utils/redis' import getRedisClient`

### Frontend

- `import { Order, OrderCreateRequest, OrderCreateResponse } from '../types/order'`
- `import { InventoryItem, InventoryCheckRequest, InventoryCheckResponse } from '../types/inventory'`
- `import { User } from '../types/user'`
- `import { Product } from '../types/product'`
- `import { useAuth } from '../hooks/useAuth'`
- `import { useOrders } from '../hooks/useOrders'`
- `import { useInventory } from '../hooks/useInventory'`
- `import { useProducts } from '../hooks/useProducts'`

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives (React Hooks)

- `useAuth() → { user, loading, error, login, logout, isAuthenticated }`
- `useOrders() → { orders, loading, error, createOrder, updateOrderStatus, fetchOrders }`
- `useInventory() → { inventory, loading, error, checkInventory, fetchInventory }`
- `useProducts() → { products, loading, error, fetchProducts }`

### Reusable Components

- `OrderList` props: `{ orders: Order[], onStatusChange: (id: string, status: Order['status']) => void }`
- `OrderForm` props: `{ onSubmit: (data: OrderCreateRequest) => void, loading: boolean }`
- `InventoryStatus` props: `{ inventory: InventoryItem | null, loading: boolean }`
- `ProductList` props: `{ products: Product[], onSelect: (id: string) => void }`
- `LoginForm` props: `{ onLogin: (username: string, password: string) => void, loading: boolean, error: string | null }`
- `UserMenu` props: `{ user: User, onLogout: () => void }`

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Backend files:** `.ts` (TypeScript)
- **Project language:** TypeScript (no JavaScript files)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---