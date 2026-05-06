# MASTER DEVELOPMENT PLAN

> Fuente de verdad única. Los nombres de clases, fields, rutas y variables
> definidos en §1 son los ÚNICOS válidos — el coder no puede inventar nombres.

> ⚠️ **ORDEN DE IMPLEMENTACIÓN GLOBAL — NO NEGOCIABLE:**
> 1. Implementa **TODOS** los ítems marcados 🔴 TEST (de todos los waves) antes de escribir cualquier ítem 🟢 PROD.
> 2. Una vez escritos todos los tests, implementa los ítems 🟢 PROD.
> 3. Si no hay ítems 🔴 TEST, implementa los 🟢 PROD directamente.
> Razón: el código de producción debe ser escrito sabiendo qué contratos deben satisfacer los tests.

---

# §1 Contratos Globales

## §1.1 Especificación Técnica — Stack, Modelos, Estructura, Env Vars

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

## §1.2 Contrato API (OpenAPI 3.1)
> Ref obligatoria para tests de endpoints: usa los paths, schemas y status codes exactos de aquí.

```yaml
# API_CONTRACT.md

## Auth Service

### POST /api/auth/login

| Method | Path                | Auth Required | Request Body                                      | Response Body         | Status Codes |
|--------|---------------------|--------------|---------------------------------------------------|----------------------|-------------|
| POST   | /api/auth/login     | No           | `{ username: string; password: string }`          | `AuthTokenResponse`  | 200         |

#### AuthTokenResponse

```typescript
{
  accessToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
  };
}
```

---

### GET /api/auth/me

| Method | Path            | Auth Required | Request Body | Response Body | Status Codes |
|--------|-----------------|--------------|--------------|--------------|-------------|
| GET    | /api/auth/me    | Yes (Bearer) | None         | `User`       | 200         |

#### User

```typescript
{
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}
```

---

## Order Service

### POST /api/orders

| Method | Path           | Auth Required | Request Body             | Response Body           | Status Codes |
|--------|----------------|--------------|--------------------------|------------------------|-------------|
| POST   | /api/orders    | No           | `OrderCreateRequest`     | `OrderCreateResponse`  | 200         |

#### OrderCreateRequest

```typescript
{
  userId: string;
  productId: string;
  quantity: number;
}
```

#### OrderCreateResponse

```typescript
{
  order: {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
  };
}
```

---

### GET /api/orders

| Method | Path           | Auth Required | Query Params         | Request Body | Response Body           | Status Codes |
|--------|----------------|--------------|----------------------|--------------|------------------------|-------------|
| GET    | /api/orders    | No           | userId?: string      | None         | `{ orders: Order[] }`  | 200         |

#### Order

```typescript
{
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}
```

---

### GET /api/orders/:id

| Method | Path                | Auth Required | Request Body | Response Body | Status Codes |
|--------|---------------------|--------------|--------------|--------------|-------------|
| GET    | /api/orders/:id     | No           | None         | `Order`      | 200         |

---

### PATCH /api/orders/:id/status

| Method | Path                        | Auth Required | Request Body                                                      | Response Body | Status Codes |
|--------|-----------------------------|--------------|-------------------------------------------------------------------|--------------|-------------|
| PATCH  | /api/orders/:id/status      | No           | `{ status: 'PENDING' \| 'CONFIRMED' \| 'DISPATCHED' \| 'CANCELLED' }` | `Order`      | 200         |

---

## Inventory Service

### GET /api/inventory/:productId

| Method | Path                      | Auth Required | Request Body | Response Body     | Status Codes |
|--------|---------------------------|--------------|--------------|------------------|-------------|
| GET    | /api/inventory/:productId | No           | None         | `InventoryItem`  | 200         |

#### InventoryItem

```typescript
{
  id: string;
  productId: string;
  stock: number;
  updatedAt: string;
}
```

---

### POST /api/inventory/check

| Method | Path                   | Auth Required | Request Body                | Response Body             | Status Codes |
|--------|------------------------|--------------|-----------------------------|--------------------------|-------------|
| POST   | /api/inventory/check   | No           | `InventoryCheckRequest`     | `InventoryCheckResponse` | 200         |

#### InventoryCheckRequest

```typescript
{
  productId: string;
  quantity: number;
}
```

#### InventoryCheckResponse

```typescript
{
  available: boolean;
  currentStock: number;
}
```

---

## Product Service

### GET /api/products

| Method | Path           | Auth Required | Request Body | Response Body              | Status Codes |
|--------|----------------|--------------|--------------|---------------------------|-------------|
| GET    | /api/products  | No           | None         | `{ products: Product[] }` | 200         |

#### Product

```typescript
{
  id: string;
  name: string;
  description: string;
  sku: string;
  createdAt: string;
}
```

---

### GET /api/products/:id

| Method | Path                | Auth Required | Request Body | Response Body | Status Codes |
|--------|---------------------|--------------|--------------|--------------|-------------|
| GET    | /api/products/:id   | No           | None         | `Product`    | 200         |
```

---

# §2 Plan de Implementación

> **REGLA TDD OBLIGATORIA**
> 1. Escribe el ítem 🔴 TEST completo antes de tocar el ítem 🟢 PROD.
> 2. Corre los tests: deben fallar (RED). Si pasan sin código de producción, el test está mal.
> 3. Escribe el código de producción mínimo para que pasen (GREEN).
> 4. Si los tests fallan después del paso 3, corrige SOLO producción — nunca los tests.

---

# §3 Reglas de Infraestructura (obligatorias)

## §3.1 Dockerfiles
- `WORKDIR /app` en todos los Dockerfiles — paths portables, nunca UUIDs ni `/workspace/...`
- El `docker build` debe funcionar en cualquier máquina sin modificaciones

## §3.2 Base de Datos — Auto-Init Obligatorio
Si el proyecto usa base de datos relacional (PostgreSQL, MySQL, SQLite, MariaDB, etc.),
el backend DEBE ejecutar esta secuencia automáticamente al arrancar el contenedor:

1. **Esperar a que la DB esté lista** — retry loop o wait-for-it, nunca asumir que está disponible
2. **Correr migraciones** — `alembic upgrade head` / `prisma migrate deploy` / `knex migrate:latest` / etc.
3. **Seed de datos de ejemplo** — solo si la tabla principal está vacía (idempotente, nunca duplica al reiniciar)
   - Insertar **3–5 registros realistas** por entidad principal
   - El seed usa los mismos modelos/schemas del proyecto — nunca SQL crudo hardcodeado
   - Patrón Python: `if db.query(Model).count() == 0: db.add_all([...]); db.commit()`
   - Patrón Node: `const count = await prisma.model.count(); if (count === 0) { await prisma.model.createMany({...}) }`

Resultado: después de `./run.sh` la app tiene datos de ejemplo listos, sin pasos manuales.

## §3.3 Puertos de Servicio
- Rango obligatorio para **todos** los puertos del host en docker-compose.yml: **21000–65000**.
- Aplica a TODOS los servicios: backends, frontends Y bases de datos / infraestructura.
- El puerto interno del contenedor se mantiene en el default de la tecnología:
  | Tecnología | Puerto interno | Ejemplo host mapping |
  |-----------|---------------|----------------------|
  | PostgreSQL | 5432 | `'25432:5432'` |
  | MySQL      | 3306 | `'23306:3306'` |
  | Redis      | 6379 | `'26379:6379'` |
  | MongoDB    | 27017 | `'37017:27017'` |
  | Backend API | (PORT TABLE §1.1) | `'23001:23001'` |
- NUNCA exponer 3000, 5000, 5432, 6379, 8000, 8080, 8443 en el lado del host.
- El Tech Lead remapeará automáticamente cualquier puerto fuera del rango 21000–65000.

## §3.4 Frontend con Vite / React / Vue
- `index.html` en la RAÍZ del proyecto (mismo nivel que `package.json` y `vite.config.js`)
- NUNCA solo en `public/` — Vite requiere el entry point en la raíz
- Entry point: `<script type='module' src='/src/main.jsx'></script>`

## §3.5 Variables de Entorno
- Vite: `import.meta.env.VITE_NOMBRE` con fallback → `|| 'http://localhost:PUERTO'` (PUERTO del PORT TABLE §1.1)
- Nunca hardcodear URLs, tokens ni secrets en código fuente

## §3.6 Criterios de Finalización
- Todos los archivos listados en §2 deben existir en disco
- Código completo y funcional — sin TODOs ni stubs
- Tests corriendo y pasando antes del commit final
- `git add -A && git commit -m 'feat: implement project'`