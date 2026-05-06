# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Node.js v20.x
  - NestJS v10.x
  - TypeScript v5.x
  - PostgreSQL v15.x
  - Redis v7.x
  - Docker v24.x
  - Kubernetes (latest stable)
- **Frontend**
  - React v18.x
  - TypeScript v5.x
  - Vite v4.x
- **Infrastructure**
  - Docker Compose v2.x

---

## 2. DATA CONTRACTS

### Backend (TypeScript/NestJS) — DTOs

```typescript
// backend/src/ordenes/dto/orden.dto.ts
export interface Orden {
  id: number;
  fecha: string; // ISO 8601 date string
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}

// backend/src/dashboard/dto/dashboard.dto.ts
export interface DashboardData {
  totalOrdenes: number;
  totalDespachadas: number;
  totalEntregadas: number;
  ordenesPendientes: number;
  graficoDespachos: GraficoDespachos[];
}

export interface GraficoDespachos {
  fecha: string; // ISO 8601 date string
  cantidad: number;
}
```

### Frontend (TypeScript/React) — Interfaces

```typescript
// frontend/src/types/orden.ts
export interface Orden {
  id: number;
  fecha: string; // ISO 8601 date string
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}

// frontend/src/types/dashboard.ts
export interface DashboardData {
  totalOrdenes: number;
  totalDespachadas: number;
  totalEntregadas: number;
  ordenesPendientes: number;
  graficoDespachos: GraficoDespachos[];
}

export interface GraficoDespachos {
  fecha: string; // ISO 8601 date string
  cantidad: number;
}
```

### Orden Creation DTO

```typescript
// backend/src/ordenes/dto/create-orden.dto.ts
export interface CreateOrdenDto {
  fecha: string; // ISO 8601 date string
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}

// frontend/src/types/orden.ts
export interface CreateOrdenDto {
  fecha: string; // ISO 8601 date string
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}
```

---

## 3. API ENDPOINTS

### GET /api/dashboard

- **Method:** GET
- **Path:** `/api/dashboard`
- **Request Body:** _None_
- **Response:**
  - Status: 200 OK
  - Body: `DashboardData` (see Data Contracts)

```json
{
  "totalOrdenes": 120,
  "totalDespachadas": 80,
  "totalEntregadas": 60,
  "ordenesPendientes": 40,
  "graficoDespachos": [
    { "fecha": "2024-06-01", "cantidad": 10 },
    { "fecha": "2024-06-02", "cantidad": 15 }
  ]
}
```

---

### GET /api/ordenes

- **Method:** GET
- **Path:** `/api/ordenes`
- **Request Body:** _None_
- **Response:**
  - Status: 200 OK
  - Body: `Orden[]`

```json
[
  {
    "id": 1,
    "fecha": "2024-06-01",
    "planta": "Planta Norte",
    "centroDistribucion": "CD Central",
    "producto": "Producto A",
    "cantidad": 100,
    "estado": "pendiente"
  }
]
```

---

### POST /api/ordenes

- **Method:** POST
- **Path:** `/api/ordenes`
- **Request Body:** `CreateOrdenDto`
- **Response:**
  - Status: 201 Created
  - Body: `Orden`

```json
{
  "id": 2,
  "fecha": "2024-06-02",
  "planta": "Planta Sur",
  "centroDistribucion": "CD Sur",
  "producto": "Producto B",
  "cantidad": 200,
  "estado": "pendiente"
}
```

---

### DELETE /api/ordenes/:id

- **Method:** DELETE
- **Path:** `/api/ordenes/:id`
- **Request Body:** _None_
- **Response:**
  - Status: 204 No Content

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                        |
|-----------------|---------------|-----------------------------|
| api-service     | 23001         | backend/api-service/        |
| redis           | 26379         | infrastructure/redis/       |
| postgres        | 25432         | infrastructure/postgres/    |
| frontend        | 24000         | frontend/                   |

### SHARED MODULES

| Shared path           | Imported by services      |
|-----------------------|--------------------------|
| backend/shared/       | api-service              |

---

### File Tree

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root-level startup script
├── backend/
│   ├── api-service/
│   │   ├── Dockerfile               # API service Docker image
│   │   ├── src/
│   │   │   ├── main.ts              # NestJS entry point
│   │   │   ├── app.module.ts        # Root module
│   │   │   ├── ordenes/
│   │   │   │   ├── ordenes.controller.ts   # Ordenes REST controller
│   │   │   │   ├── ordenes.service.ts      # Ordenes business logic
│   │   │   │   ├── dto/
│   │   │   │   │   ├── orden.dto.ts        # Orden interface
│   │   │   │   │   └── create-orden.dto.ts # CreateOrdenDto interface
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.controller.ts # Dashboard REST controller
│   │   │   │   ├── dashboard.service.ts    # Dashboard business logic
│   │   │   │   └── dto/
│   │   │   │       └── dashboard.dto.ts    # DashboardData interface
│   │   │   ├── shared/
│   │   │   │   ├── cache.service.ts        # Redis cache abstraction
│   │   │   │   └── db.service.ts           # PostgreSQL DB abstraction
│   │   ├── test/
│   │   │   └── ordenes.e2e-spec.ts         # E2E tests for ordenes
│   │   └── tsconfig.json                   # TypeScript config
│   └── shared/
│       ├── types/
│       │   ├── orden.ts                    # Shared Orden interface
│       │   └── dashboard.ts                # Shared DashboardData interface
│       └── utils/
│           └── date.ts                     # Date utility functions
├── infrastructure/
│   ├── postgres/
│   │   ├── Dockerfile                      # PostgreSQL image
│   │   └── init.sql                        # DB schema/init script
│   └── redis/
│       └── Dockerfile                      # Redis image
├── frontend/
│   ├── Dockerfile                          # Frontend Docker image
│   ├── vite.config.ts                      # Vite config
│   ├── tsconfig.json                       # TypeScript config
│   ├── public/
│   │   └── index.html                      # HTML entry point
│   ├── src/
│   │   ├── main.tsx                        # React entry point
│   │   ├── App.tsx                         # Root component
│   │   ├── api/
│   │   │   ├── ordenes.ts                  # Ordenes API client
│   │   │   └── dashboard.ts                # Dashboard API client
│   │   ├── hooks/
│   │   │   ├── useOrdenes.ts               # Ordenes state hook
│   │   │   └── useDashboard.ts             # Dashboard state hook
│   │   ├── types/
│   │   │   ├── orden.ts                    # Orden interface
│   │   │   └── dashboard.ts                # DashboardData interface
│   │   ├── components/
│   │   │   ├── OrdenList.tsx               # Ordenes table/list
│   │   │   ├── OrdenForm.tsx               # Orden creation form
│   │   │   ├── DashboardKPIs.tsx           # KPIs display
│   │   │   └── DespachosChart.tsx          # Despachos chart
│   │   └── styles/
│   │       └── main.css                    # Global styles
│   └── README.md                           # Frontend documentation
```

---

## 5. ENVIRONMENT VARIABLES

| Name                    | Type   | Description                                      | Example Value                |
|-------------------------|--------|--------------------------------------------------|-----------------------------|
| NODE_ENV                | string | Node.js environment                              | production                  |
| API_PORT                | number | API service listening port                       | 23001                       |
| FRONTEND_PORT           | number | Frontend dev server port                         | 24000                       |
| POSTGRES_HOST           | string | PostgreSQL host                                  | postgres                    |
| POSTGRES_PORT           | number | PostgreSQL port (container-internal: 5432)       | 5432                        |
| POSTGRES_USER           | string | PostgreSQL username                              | distroviz                   |
| POSTGRES_PASSWORD       | string | PostgreSQL password                              | distrovizpw                 |
| POSTGRES_DB             | string | PostgreSQL database name                         | distrovizdb                 |
| REDIS_HOST              | string | Redis host                                       | redis                       |
| REDIS_PORT              | number | Redis port (container-internal: 6379)            | 6379                        |
| REDIS_CACHE_TTL         | number | Redis cache TTL in seconds                       | 300                         |
| VITE_API_URL            | string | Frontend: base URL for API requests              | http://localhost:23001/api  |

---

## 6. IMPORT CONTRACTS

### Backend

```typescript
// backend/api-service/src/ordenes/ordenes.service.ts
import { Orden, CreateOrdenDto } from '../../shared/types/orden';

// backend/api-service/src/dashboard/dashboard.service.ts
import { DashboardData, GraficoDespachos } from '../../shared/types/dashboard';

// backend/api-service/src/shared/cache.service.ts
export class CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
}

// backend/api-service/src/shared/db.service.ts
export class DbService {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<void>;
}
```

### Frontend

```typescript
// frontend/src/api/ordenes.ts
import { Orden, CreateOrdenDto } from '../types/orden';
export async function fetchOrdenes(): Promise<Orden[]>;
export async function createOrden(data: CreateOrdenDto): Promise<Orden>;
export async function deleteOrden(id: number): Promise<void>;

// frontend/src/api/dashboard.ts
import { DashboardData } from '../types/dashboard';
export async function fetchDashboard(): Promise<DashboardData>;

// frontend/src/hooks/useOrdenes.ts
import { Orden, CreateOrdenDto } from '../types/orden';
export function useOrdenes(): {
  ordenes: Orden[];
  loading: boolean;
  error: string | null;
  createOrden: (data: CreateOrdenDto) => Promise<void>;
  deleteOrden: (id: number) => Promise<void>;
  deletingId: number | null;
};

// frontend/src/hooks/useDashboard.ts
import { DashboardData } from '../types/dashboard';
export function useDashboard(): {
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```
React hook: useOrdenes() → { ordenes, loading, error, createOrden, deleteOrden, deletingId }
React hook: useDashboard() → { dashboard, loading, error, refresh }
```

### Reusable Components

```
OrdenList props/inputs: { ordenes: Orden[], onDelete: (id: number) => void, deletingId: number | null }
OrdenForm props/inputs: { onSubmit: (data: CreateOrdenDto) => void, loading: boolean }
DashboardKPIs props/inputs: { dashboard: DashboardData | null }
DespachosChart props/inputs: { graficoDespachos: GraficoDespachos[] }
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Backend files:** `.ts` (TypeScript)
- **Project language:** TypeScript (no JavaScript files)
- **Frontend entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---