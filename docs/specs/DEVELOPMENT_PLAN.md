# MASTER DEVELOPMENT PLAN

> Fuente de verdad única. Los nombres de clases, fields, rutas y variables
> definidos en §1 son los ÚNICOS válidos — el coder no puede inventar nombres.
> En §2 cada wave muestra 🔴 TEST primero y 🟢 PROD después: escríbelos en ese orden.

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

## §1.2 Contrato API (OpenAPI 3.1)
> Ref obligatoria para tests de endpoints: usa los paths, schemas y status codes exactos de aquí.

```yaml
# API_CONTRACT.md

## GET /api/dashboard

| Property         | Value                |
|------------------|---------------------|
| HTTP Method      | GET                 |
| Path             | /api/dashboard      |
| Request Body     | None                |
| Response Status  | 200 OK              |
| Auth Required    | No                  |

**Response Body Schema:**  
Type: `DashboardData`

| Field               | Type                     | Required |
|---------------------|--------------------------|----------|
| totalOrdenes        | number                   | Yes      |
| totalDespachadas    | number                   | Yes      |
| totalEntregadas     | number                   | Yes      |
| ordenesPendientes   | number                   | Yes      |
| graficoDespachos    | GraficoDespachos[]       | Yes      |

**GraficoDespachos**

| Field   | Type    | Required |
|---------|---------|----------|
| fecha   | string  | Yes      |
| cantidad| number  | Yes      |


---

## GET /api/ordenes

| Property         | Value                |
|------------------|---------------------|
| HTTP Method      | GET                 |
| Path             | /api/ordenes        |
| Request Body     | None                |
| Response Status  | 200 OK              |
| Auth Required    | No                  |

**Response Body Schema:**  
Type: `Orden[]`

**Orden**

| Field                | Type                                               | Required |
|----------------------|----------------------------------------------------|----------|
| id                   | number                                             | Yes      |
| fecha                | string (ISO 8601 date string)                      | Yes      |
| planta               | string                                             | Yes      |
| centroDistribucion   | string                                             | Yes      |
| producto             | string                                             | Yes      |
| cantidad             | number                                             | Yes      |
| estado               | 'pendiente' \| 'despachado' \| 'entregado'         | Yes      |


---

## POST /api/ordenes

| Property         | Value                |
|------------------|---------------------|
| HTTP Method      | POST                |
| Path             | /api/ordenes        |
| Request Body     | CreateOrdenDto      |
| Response Status  | 201 Created         |
| Auth Required    | No                  |

**Request Body Schema:**  
Type: `CreateOrdenDto`

| Field                | Type                                               | Required |
|----------------------|----------------------------------------------------|----------|
| fecha                | string (ISO 8601 date string)                      | Yes      |
| planta               | string                                             | Yes      |
| centroDistribucion   | string                                             | Yes      |
| producto             | string                                             | Yes      |
| cantidad             | number                                             | Yes      |
| estado               | 'pendiente' \| 'despachado' \| 'entregado'         | Yes      |

**Response Body Schema:**  
Type: `Orden`

| Field                | Type                                               | Required |
|----------------------|----------------------------------------------------|----------|
| id                   | number                                             | Yes      |
| fecha                | string (ISO 8601 date string)                      | Yes      |
| planta               | string                                             | Yes      |
| centroDistribucion   | string                                             | Yes      |
| producto             | string                                             | Yes      |
| cantidad             | number                                             | Yes      |
| estado               | 'pendiente' \| 'despachado' \| 'entregado'         | Yes      |


---

## DELETE /api/ordenes/:id

| Property         | Value                |
|------------------|---------------------|
| HTTP Method      | DELETE              |
| Path             | /api/ordenes/:id    |
| Request Body     | None                |
| Response Status  | 204 No Content      |
| Auth Required    | No                  |

**Response Body:** None

---
```

## §1.3 Archivos de Test y Scripts a Crear (TDD — complemento de la estructura §1.1)
> La FILE STRUCTURE de §1.1 fue generada antes de los specs TDD — no incluye `tests/` ni `run_tests.sh`.
> Los siguientes archivos son OBLIGATORIOS. Créalos en los paths exactos indicados.
> ⚠️  NUNCA usar archivos `.spec.*` co-ubicados con el source.

**Scripts de ejecución (crear y hacer chmod +x):**
- `backend/api-service/run_tests.sh`
- `backend/shared/run_tests.sh`
- `frontend/run_tests.sh`
- `shared/types/run_tests.sh`

**Archivos de test (crear en los paths exactos):**
- `backend/api-service/src/dashboard/dto/tests/test_dashboard_dto.py`
- `backend/api-service/src/ordenes/dto/tests/test_create_orden_dto.py`
- `backend/api-service/src/ordenes/dto/tests/test_orden_dto.py`
- `backend/api-service/src/shared/tests/test_cache_service.py`
- `backend/api-service/src/shared/tests/test_db_service.py`
- `backend/api-service/tests/test_app_module.py`
- `backend/api-service/tests/test_dashboard_controller.py`
- `backend/api-service/tests/test_dashboard_service.py`
- `backend/api-service/tests/test_main.py`
- `backend/api-service/tests/test_ordenes_controller.py`
- `backend/api-service/tests/test_ordenes_service.py`
- `backend/shared/tests/test_config.py`
- `backend/shared/tests/test_create_orden_dto.py`
- `backend/shared/tests/test_dashboard.py`
- `backend/shared/tests/test_dashboard_dto.py`
- `backend/shared/tests/test_date.py`
- `backend/shared/tests/test_orden.py`
- `backend/shared/tests/test_orden_dto.py`
- `backend/shared/tests/test_schemas.py`
- `frontend/tests/App.test.tsx`
- `frontend/tests/api/dashboard.test.ts`
- `frontend/tests/api/ordenes.test.ts`
- `frontend/tests/components/DashboardKPIs.test.tsx`
- `frontend/tests/components/DespachosChart.test.tsx`
- `frontend/tests/components/OrdenForm.test.tsx`
- `frontend/tests/components/OrdenList.test.tsx`
- `frontend/tests/hooks/useDashboard.test.ts`
- `frontend/tests/hooks/useOrdenes.test.ts`
- `frontend/tests/main.test.tsx`
- `frontend/tests/styles/main.test.ts`
- `frontend/tests/tsconfig.test.ts`
- `frontend/tests/types/dashboard.test.ts`
- `frontend/tests/types/orden.test.ts`
- `frontend/tests/vite.config.test.ts`
- `shared/types/tests/test_dashboard.py`
- `shared/types/tests/test_orden.py`

---

# §2 Plan de Implementación

> **REGLA TDD OBLIGATORIA**
> 1. Escribe el ítem 🔴 TEST completo antes de tocar el ítem 🟢 PROD.
> 2. Corre los tests: deben fallar (RED). Si pasan sin código de producción, el test está mal.
> 3. Escribe el código de producción mínimo para que pasen (GREEN).
> 4. Si los tests fallan después del paso 3, corrige SOLO producción — nunca los tests.

## Wave 1

### 🟢 PROD — run_tests.sh — backend/api-service
> Crea el archivo `backend/api-service/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
  - `backend/api-service/run_tests.sh`

**Detalle:**
```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> [backend/api-service] Installing Python test dependencies..."
pip install pytest pytest-cov pytest-asyncio httpx anyio aiosqlite     fastapi sqlalchemy pyjwt passlib bcrypt python-multipart -q 2>/dev/null || true
# Install project deps declared in requirements.txt if present
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt -q 2>/dev/null || true
fi
echo ">>> [backend/api-service] Running tests..."
# Override DB URLs to SQLite in-memory so tests run without a live database
export DATABASE_URL="sqlite+aiosqlite:///:memory:"
export ASYNC_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export DB_URL="sqlite:///:memory:"
export TEST_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export SECRET_KEY="test-secret-key"
export JWT_SECRET="test-secret-key"
# Add service dir + parent dirs to PYTHONPATH so both relative and package imports work
# This handles: microservice layout (from routes import ...) and
#               monolith layout (from app.routers.auth import ...)
export PYTHONPATH="$(pwd):$(dirname $(pwd)):$(dirname $(dirname $(pwd))):${PYTHONPATH:-}"
mkdir -p coverage
python -m pytest tests/ --tb=short -q \
  --cov=. --cov-report=term-missing \
  --cov-report=json:coverage/coverage.json \
  --no-header 2>&1 | tee /tmp/test_out_backend_api-service.txt
echo ">>> [backend/api-service] Done."
```

Luego ejecuta: `chmod +x backend/api-service/run_tests.sh`

### 🟢 PROD — run_tests.sh — backend/shared
> Crea el archivo `backend/shared/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
  - `backend/shared/run_tests.sh`

**Detalle:**
```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> [backend/shared] Installing Python test dependencies..."
pip install pytest pytest-cov pytest-asyncio httpx anyio aiosqlite     fastapi sqlalchemy pyjwt passlib bcrypt python-multipart -q 2>/dev/null || true
# Install project deps declared in requirements.txt if present
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt -q 2>/dev/null || true
fi
echo ">>> [backend/shared] Running tests..."
# Override DB URLs to SQLite in-memory so tests run without a live database
export DATABASE_URL="sqlite+aiosqlite:///:memory:"
export ASYNC_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export DB_URL="sqlite:///:memory:"
export TEST_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export SECRET_KEY="test-secret-key"
export JWT_SECRET="test-secret-key"
# Add service dir + parent dirs to PYTHONPATH so both relative and package imports work
# This handles: microservice layout (from routes import ...) and
#               monolith layout (from app.routers.auth import ...)
export PYTHONPATH="$(pwd):$(dirname $(pwd)):$(dirname $(dirname $(pwd))):${PYTHONPATH:-}"
mkdir -p coverage
python -m pytest tests/ --tb=short -q \
  --cov=. --cov-report=term-missing \
  --cov-report=json:coverage/coverage.json \
  --no-header 2>&1 | tee /tmp/test_out_backend_shared.txt
echo ">>> [backend/shared] Done."
```

Luego ejecuta: `chmod +x backend/shared/run_tests.sh`

### 🟢 PROD — run_tests.sh — frontend
> Crea el archivo `frontend/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
  - `frontend/run_tests.sh`

**Detalle:**
```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> [frontend] Installing JS test dependencies..."
npm install -D jest ts-jest @types/jest jest-environment-jsdom --silent 2>/dev/null || true
echo ">>> [frontend] Running tests..."
npx jest --coverage --passWithNoTests 2>&1 | tee /tmp/test_out_frontend.txt
echo ">>> [frontend] Done."
```

Luego ejecuta: `chmod +x frontend/run_tests.sh`

### 🟢 PROD — run_tests.sh — shared/types
> Crea el archivo `shared/types/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
  - `shared/types/run_tests.sh`

**Detalle:**
```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> [shared/types] Installing Python test dependencies..."
pip install pytest pytest-cov pytest-asyncio httpx anyio aiosqlite     fastapi sqlalchemy pyjwt passlib bcrypt python-multipart -q 2>/dev/null || true
# Install project deps declared in requirements.txt if present
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt -q 2>/dev/null || true
fi
echo ">>> [shared/types] Running tests..."
# Override DB URLs to SQLite in-memory so tests run without a live database
export DATABASE_URL="sqlite+aiosqlite:///:memory:"
export ASYNC_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export DB_URL="sqlite:///:memory:"
export TEST_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export SECRET_KEY="test-secret-key"
export JWT_SECRET="test-secret-key"
# Add service dir + parent dirs to PYTHONPATH so both relative and package imports work
# This handles: microservice layout (from routes import ...) and
#               monolith layout (from app.routers.auth import ...)
export PYTHONPATH="$(pwd):$(dirname $(pwd)):$(dirname $(dirname $(pwd))):${PYTHONPATH:-}"
mkdir -p coverage
python -m pytest tests/ --tb=short -q \
  --cov=. --cov-report=term-missing \
  --cov-report=json:coverage/coverage.json \
  --no-header 2>&1 | tee /tmp/test_out_shared_types.txt
echo ">>> [shared/types] Done."
```

Luego ejecuta: `chmod +x shared/types/run_tests.sh`

### 🔴 TEST — Tests: shared/types/orden.ts
> Ref: §1.1 (modelos de `shared/types/orden.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `shared/types/tests/test_orden.py`

**Casos de prueba (implementar todos):**
- `test_orden_interface_accepts_valid_fields`: The Orden interface must accept all required fields with correct types as per SPEC.md.
  - Input: `{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}`
  - Expected: `{'valid': True}`
- `test_create_orden_dto_missing_required_field`: CreateOrdenDto must raise a validation error if any required field is missing.
  - Input: `{'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100}`
  - Expected: `{'valid': False, 'error_field': 'estado'}`
- `test_orden_interface_invalid_estado_value`: The Orden interface must reject any value for 'estado' not in ['pendiente', 'despachado', 'entregado'].
  - Input: `{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'cancelado'}`
  - Expected: `{'valid': False, 'error_field': 'estado'}`

### 🔴 TEST — Tests: shared/types/dashboard.ts
> Ref: §1.1 (modelos de `shared/types/dashboard.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `shared/types/tests/test_dashboard.py`

**Casos de prueba (implementar todos):**
- `test_dashboard_data_interface_accepts_valid_fields`: DashboardData interface must accept all required fields with correct types and a valid GraficoDespachos array.
  - Input: `{'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}, {'fecha': '2024-06-02', 'cantidad': 15}]}`
  - Expected: `{'valid': True}`
- `test_dashboard_data_missing_grafico_despachos`: DashboardData must raise a validation error if 'graficoDespachos' is missing.
  - Input: `{'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40}`
  - Expected: `{'valid': False, 'error_field': 'graficoDespachos'}`
- `test_grafico_despachos_invalid_fecha_format`: GraficoDespachos must reject 'fecha' values that are not valid ISO 8601 date strings.
  - Input: `{'fecha': '06-01-2024', 'cantidad': 10}`
  - Expected: `{'valid': False, 'error_field': 'fecha'}`

### 🔴 TEST — Tests: backend/shared/types/orden.ts
> Ref: §1.1 (modelos de `backend/shared/types/orden.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_orden.py`

**Casos de prueba (implementar todos):**
- `test_backend_orden_interface_accepts_valid_fields`: Backend Orden interface must accept all required fields with correct types as per SPEC.md.
  - Input: `{'id': 2, 'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'despachado'}`
  - Expected: `{'valid': True}`
- `test_backend_create_orden_dto_invalid_cantidad_type`: CreateOrdenDto must reject 'cantidad' values that are not numbers.
  - Input: `{'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 'two hundred', 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'cantidad'}`
- `test_backend_orden_interface_empty_string_fields`: Backend Orden interface must reject empty strings for required string fields.
  - Input: `{'id': 3, 'fecha': '', 'planta': '', 'centroDistribucion': '', 'producto': '', 'cantidad': 50, 'estado': 'entregado'}`
  - Expected: `{'valid': False, 'error_field': 'planta'}`

### 🔴 TEST — Tests: backend/shared/types/dashboard.ts
> Ref: §1.1 (modelos de `backend/shared/types/dashboard.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_dashboard.py`

**Casos de prueba (implementar todos):**
- `test_backend_dashboard_data_accepts_valid_fields`: Backend DashboardData interface must accept all required fields and valid GraficoDespachos array.
  - Input: `{'totalOrdenes': 10, 'totalDespachadas': 5, 'totalEntregadas': 3, 'ordenesPendientes': 2, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 1}]}`
  - Expected: `{'valid': True}`
- `test_backend_dashboard_data_negative_numbers`: DashboardData must reject negative numbers for total fields.
  - Input: `{'totalOrdenes': -1, 'totalDespachadas': 0, 'totalEntregadas': 0, 'ordenesPendientes': 0, 'graficoDespachos': []}`
  - Expected: `{'valid': False, 'error_field': 'totalOrdenes'}`
- `test_backend_grafico_despachos_missing_cantidad`: GraficoDespachos must raise a validation error if 'cantidad' is missing.
  - Input: `{'fecha': '2024-06-01'}`
  - Expected: `{'valid': False, 'error_field': 'cantidad'}`

### 🔴 TEST — Tests: backend/shared/utils/date.ts
> Ref: §1.1 (modelos de `backend/shared/utils/date.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_date.py`

**Casos de prueba (implementar todos):**
- `test_iso_formatting_valid_date`: Date utility must correctly format a valid date object to ISO 8601 string.
  - Input: `{'date': '2024-06-01T12:00:00'}`
  - Expected: `{'iso_string': '2024-06-01T12:00:00'}`
- `test_date_diff_returns_correct_days`: Date utility must return correct number of days between two ISO 8601 date strings.
  - Input: `{'start': '2024-06-01', 'end': '2024-06-10'}`
  - Expected: `{'days': 9}`
- `test_iso_formatting_invalid_input_raises_error`: Date utility must raise an error when formatting an invalid date input.
  - Input: `{'date': 'not-a-date'}`
  - Expected: `{'raises': True}`

### 🔴 TEST — Tests: backend/api-service/src/ordenes/dto/orden.dto.ts
> Ref: §1.1 (modelos de `backend/api-service/src/ordenes/dto/orden.dto.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/src/ordenes/dto/tests/test_orden_dto.py`

**Casos de prueba (implementar todos):**
- `test_orden_dto_accepts_valid_data`: Orden DTO must accept all required fields with correct types.
  - Input: `{'id': 10, 'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 300, 'estado': 'entregado'}`
  - Expected: `{'valid': True}`
- `test_orden_dto_missing_id_field`: Orden DTO must raise a validation error if 'id' is missing.
  - Input: `{'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 300, 'estado': 'entregado'}`
  - Expected: `{'valid': False, 'error_field': 'id'}`
- `test_orden_dto_invalid_estado_type`: Orden DTO must reject 'estado' values that are not one of the allowed enum values.
  - Input: `{'id': 11, 'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 300, 'estado': 123}`
  - Expected: `{'valid': False, 'error_field': 'estado'}`

### 🔴 TEST — Tests: backend/api-service/src/ordenes/dto/create-orden.dto.ts
> Ref: §1.1 (modelos de `backend/api-service/src/ordenes/dto/create-orden.dto.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/src/ordenes/dto/tests/test_create_orden_dto.py`

**Casos de prueba (implementar todos):**
- `test_create_orden_dto_accepts_valid_data`: CreateOrdenDto must accept all required fields with correct types.
  - Input: `{'fecha': '2024-06-04', 'planta': 'Planta Oeste', 'centroDistribucion': 'CD Oeste', 'producto': 'Producto D', 'cantidad': 400, 'estado': 'pendiente'}`
  - Expected: `{'valid': True}`
- `test_create_orden_dto_missing_producto_field`: CreateOrdenDto must raise a validation error if 'producto' is missing.
  - Input: `{'fecha': '2024-06-04', 'planta': 'Planta Oeste', 'centroDistribucion': 'CD Oeste', 'cantidad': 400, 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'producto'}`
- `test_create_orden_dto_invalid_fecha_format`: CreateOrdenDto must reject 'fecha' values that are not valid ISO 8601 date strings.
  - Input: `{'fecha': '04-06-2024', 'planta': 'Planta Oeste', 'centroDistribucion': 'CD Oeste', 'producto': 'Producto D', 'cantidad': 400, 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'fecha'}`

### 🔴 TEST — Tests: backend/api-service/src/dashboard/dto/dashboard.dto.ts
> Ref: §1.1 (modelos de `backend/api-service/src/dashboard/dto/dashboard.dto.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/src/dashboard/dto/tests/test_dashboard_dto.py`

**Casos de prueba (implementar todos):**
- `test_dashboard_dto_accepts_valid_data`: DashboardData DTO must accept all required fields and valid GraficoDespachos array.
  - Input: `{'totalOrdenes': 50, 'totalDespachadas': 30, 'totalEntregadas': 20, 'ordenesPendientes': 10, 'graficoDespachos': [{'fecha': '2024-06-05', 'cantidad': 5}]}`
  - Expected: `{'valid': True}`
- `test_dashboard_dto_missing_total_entregadas`: DashboardData DTO must raise a validation error if 'totalEntregadas' is missing.
  - Input: `{'totalOrdenes': 50, 'totalDespachadas': 30, 'ordenesPendientes': 10, 'graficoDespachos': [{'fecha': '2024-06-05', 'cantidad': 5}]}`
  - Expected: `{'valid': False, 'error_field': 'totalEntregadas'}`
- `test_dashboard_dto_grafico_despachos_empty_array`: DashboardData DTO must accept an empty array for 'graficoDespachos'.
  - Input: `{'totalOrdenes': 50, 'totalDespachadas': 30, 'totalEntregadas': 20, 'ordenesPendientes': 10, 'graficoDespachos': []}`
  - Expected: `{'valid': True}`

### 🔴 TEST — Tests: backend/api-service/src/shared/cache.service.ts
> Ref: §1.1 (modelos de `backend/api-service/src/shared/cache.service.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/src/shared/tests/test_cache_service.py`

**Casos de prueba (implementar todos):**
- `test_cache_set_and_get_value`: Cache service must store and retrieve a value by key.
  - Input: `{'key': 'test-key', 'value': 'test-value'}`
  - Expected: `{'retrieved_value': 'test-value'}`
- `test_cache_get_nonexistent_key_returns_none`: Cache service must return None when retrieving a nonexistent key.
  - Input: `{'key': 'nonexistent-key'}`
  - Expected: `{'retrieved_value': None}`
- `test_cache_set_invalid_key_type_raises_error`: Cache service must raise an error when setting a value with a non-string key.
  - Input: `{'key': 123, 'value': 'value'}`
  - Expected: `{'raises': True}`

### 🔴 TEST — Tests: backend/api-service/src/shared/db.service.ts
> Ref: §1.1 (modelos de `backend/api-service/src/shared/db.service.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/src/shared/tests/test_db_service.py`

**Casos de prueba (implementar todos):**
- `test_db_service_connect_and_query`: DB service must connect to the database and execute a simple SELECT query.
  - Input: `{'query': 'SELECT 1'}`
  - Expected: `{'result': 1}`
- `test_db_service_insert_and_retrieve_row`: DB service must insert a row and retrieve it correctly.
  - Input: `{'create_table': 'CREATE TABLE test (id INTEGER PRIMARY KEY, value TEXT)', 'insert': "INSERT INTO test (value) VALUES ('abc')", 'select': 'SELECT value FROM test WHERE id=1'}`
  - Expected: `{'result': 'abc'}`
- `test_db_service_query_invalid_sql_raises_error`: DB service must raise an error when executing invalid SQL.
  - Input: `{'query': 'SELECT * FROM non_existing_table'}`
  - Expected: `{'raises': True}`

### 🔴 TEST — Tests: backend/shared/types/orden.dto.ts
> Ref: §1.1 (modelos de `backend/shared/types/orden.dto.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_orden_dto.py`

**Casos de prueba (implementar todos):**
- `test_orden_interface_accepts_valid_data`: The Orden interface must accept valid data matching all required fields and types as per the data contract.
  - Input: `{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}`
  - Expected: `{'valid': True}`
- `test_orden_interface_missing_required_field_raises_error`: The Orden interface must raise a validation error if any required field (e.g., 'producto') is missing.
  - Input: `{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'cantidad': 100, 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'producto'}`
- `test_orden_interface_invalid_estado_value_raises_error`: The Orden interface must raise a validation error if 'estado' is not one of the allowed values ('pendiente', 'despachado', 'entregado').
  - Input: `{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'cancelado'}`
  - Expected: `{'valid': False, 'error_field': 'estado'}`
- `test_orden_interface_negative_cantidad_raises_error`: The Orden interface must raise a validation error if 'cantidad' is negative.
  - Input: `{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': -5, 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'cantidad'}`
- `test_orden_interface_invalid_fecha_format_raises_error`: The Orden interface must raise a validation error if 'fecha' is not a valid ISO 8601 date string.
  - Input: `{'id': 1, 'fecha': '06-01-2024', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'fecha'}`

### 🔴 TEST — Tests: backend/shared/types/create-orden.dto.ts
> Ref: §1.1 (modelos de `backend/shared/types/create-orden.dto.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_create_orden_dto.py`

**Casos de prueba (implementar todos):**
- `test_create_orden_dto_accepts_valid_data`: The CreateOrdenDto interface must accept valid data matching all required fields and types as per the data contract.
  - Input: `{'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'despachado'}`
  - Expected: `{'valid': True}`
- `test_create_orden_dto_missing_required_field_raises_error`: The CreateOrdenDto interface must raise a validation error if any required field (e.g., 'planta') is missing.
  - Input: `{'fecha': '2024-06-02', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'despachado'}`
  - Expected: `{'valid': False, 'error_field': 'planta'}`
- `test_create_orden_dto_invalid_estado_value_raises_error`: The CreateOrdenDto interface must raise a validation error if 'estado' is not one of the allowed values ('pendiente', 'despachado', 'entregado').
  - Input: `{'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'cancelado'}`
  - Expected: `{'valid': False, 'error_field': 'estado'}`
- `test_create_orden_dto_zero_cantidad_is_valid`: The CreateOrdenDto interface must accept 'cantidad' equal to zero as a valid edge case.
  - Input: `{'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 0, 'estado': 'pendiente'}`
  - Expected: `{'valid': True}`
- `test_create_orden_dto_invalid_fecha_format_raises_error`: The CreateOrdenDto interface must raise a validation error if 'fecha' is not a valid ISO 8601 date string.
  - Input: `{'fecha': '02-06-2024', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}`
  - Expected: `{'valid': False, 'error_field': 'fecha'}`

### 🔴 TEST — Tests: backend/shared/types/dashboard.dto.ts
> Ref: §1.1 (modelos de `backend/shared/types/dashboard.dto.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_dashboard_dto.py`

**Casos de prueba (implementar todos):**
- `test_dashboard_data_interface_accepts_valid_data`: The DashboardData interface must accept valid data matching all required fields and types as per the data contract, including a valid graficoDespachos array.
  - Input: `{'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}, {'fecha': '2024-06-02', 'cantidad': 15}]}`
  - Expected: `{'valid': True}`
- `test_dashboard_data_missing_required_field_raises_error`: The DashboardData interface must raise a validation error if any required field (e.g., 'totalEntregadas') is missing.
  - Input: `{'totalOrdenes': 120, 'totalDespachadas': 80, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}]}`
  - Expected: `{'valid': False, 'error_field': 'totalEntregadas'}`
- `test_dashboard_data_grafico_despachos_invalid_fecha_format_raises_error`: The DashboardData interface must raise a validation error if any 'fecha' in graficoDespachos is not a valid ISO 8601 date string.
  - Input: `{'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '01-06-2024', 'cantidad': 10}]}`
  - Expected: `{'valid': False, 'error_field': 'graficoDespachos[0].fecha'}`
- `test_dashboard_data_grafico_despachos_empty_array_is_valid`: The DashboardData interface must accept an empty graficoDespachos array as a valid edge case.
  - Input: `{'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': []}`
  - Expected: `{'valid': True}`
- `test_dashboard_data_negative_total_ordenes_raises_error`: The DashboardData interface must raise a validation error if 'totalOrdenes' is negative.
  - Input: `{'totalOrdenes': -1, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}]}`
  - Expected: `{'valid': False, 'error_field': 'totalOrdenes'}`

### 🔴 TEST — Tests: backend/shared/config/index.ts
> Ref: §1.1 (modelos de `backend/shared/config/index.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_config.py`

**Casos de prueba (implementar todos):**
- `test_config_loads_required_environment_variables`: The config module must load all required environment variables (e.g., DB connection, Redis URL, ports) and expose them as expected.
  - Input: `{'env': {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}}`
  - Expected: `{'config_fields': ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'REDIS_HOST', 'REDIS_PORT', 'API_PORT'], 'valid': True}`
- `test_config_missing_required_env_var_raises_error`: The config module must raise an error if a required environment variable (e.g., POSTGRES_DB) is missing.
  - Input: `{'env': {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}}`
  - Expected: `{'valid': False, 'error_field': 'POSTGRES_DB'}`
- `test_config_invalid_port_value_raises_error`: The config module must raise a validation error if a port environment variable (e.g., API_PORT) is not a valid integer.
  - Input: `{'env': {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': 'notanumber', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}}`
  - Expected: `{'valid': False, 'error_field': 'POSTGRES_PORT'}`
- `test_config_defaults_are_applied_when_optional_env_vars_missing`: The config module must apply default values for optional environment variables if they are not set.
  - Input: `{'env': {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379'}}`
  - Expected: `{'valid': True, 'defaults_applied': True}`
- `test_config_handles_empty_env_values_as_invalid`: The config module must treat empty string values for required environment variables as invalid.
  - Input: `{'env': {'POSTGRES_HOST': '', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}}`
  - Expected: `{'valid': False, 'error_field': 'POSTGRES_HOST'}`

### 🔴 TEST — Tests: backend/shared/db/schemas.py
> Ref: §1.1 (modelos de `backend/shared/db/schemas.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/shared/tests/test_schemas.py`

**Casos de prueba (implementar todos):**
- `test_orden_table_schema_matches_data_contract`: The Orden table schema must match the Orden interface: all columns present, correct types, and constraints.
  - Expected: `{'columns': [{'name': 'id', 'type': 'integer', 'primary_key': True}, {'name': 'fecha', 'type': 'string'}, {'name': 'planta', 'type': 'string'}, {'name': 'centroDistribucion', 'type': 'string'}, {'name': 'producto', 'type': 'string'}, {'name': 'cantidad', 'type': 'integer'}, {'name': 'estado', 'type': 'string'}], 'valid': True}`
- `test_orden_table_rejects_missing_required_fields`: The Orden table must reject inserts missing required fields (e.g., 'producto').
  - Input: `{'insert': {'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'cantidad': 100, 'estado': 'pendiente'}}`
  - Expected: `{'insert_success': False, 'error_field': 'producto'}`
- `test_orden_table_estado_constraint_enforced`: The Orden table must enforce the allowed values for 'estado' ('pendiente', 'despachado', 'entregado').
  - Input: `{'insert': {'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'cancelado'}}`
  - Expected: `{'insert_success': False, 'error_field': 'estado'}`
- `test_orden_table_accepts_valid_insert_and_retrieves_data`: The Orden table must accept valid inserts and allow retrieval of the same data.
  - Input: `{'insert': {'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}}`
  - Expected: `{'insert_success': True, 'retrieved': {'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}}`
- `test_orden_table_negative_cantidad_rejected`: The Orden table must reject inserts where 'cantidad' is negative.
  - Input: `{'insert': {'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': -10, 'estado': 'pendiente'}}`
  - Expected: `{'insert_success': False, 'error_field': 'cantidad'}`

### 🟢 PROD — Foundation — shared types, interfaces, DB schemas, config (1/2)
> Create all shared code and configuration that other items will import.
**Archivos:**
  - `shared/types/orden.ts`  
  - `shared/types/dashboard.ts`  
  - `backend/shared/types/orden.ts`  
  - `backend/shared/types/dashboard.ts`  
  - `backend/shared/utils/date.ts`  
  - `backend/api-service/src/ordenes/dto/orden.dto.ts`  
  - `backend/api-service/src/ordenes/dto/create-orden.dto.ts`  
  - `backend/api-service/src/dashboard/dto/dashboard.dto.ts`  
  - `backend/api-service/src/shared/cache.service.ts`  
  - `backend/api-service/src/shared/db.service.ts`


### 🟢 PROD — Foundation — shared types, interfaces, DB schemas, config (2/2)
> Create all shared code and configuration that other items will import.
**Archivos:**


**Detalle:**
[DEPENDENCY NOTE: The following files are created by item 1. Import/use them — do NOT recreate: backend/shared/utils/date.ts]

### 🟢 PROD — Infrastructure & Deployment
> Complete Docker orchestration and documentation for zero-manual-steps local setup.
**Archivos:**
  - `docker-compose.yml`  
  - `run.sh`  
  - `README.md`


## Wave 2

### 🔴 TEST — Tests: backend/api-service/src/main.ts
> Ref: §1.1 (modelos de `backend/api-service/src/main.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/tests/test_main.py`

**Casos de prueba (implementar todos):**
- `test_health_endpoint_returns_200_and_status_ok`: GET /health should return 200 OK and a JSON body with status: 'ok'.
  - Input: `{'method': 'GET', 'path': '/health'}`
  - Expected: `{'status_code': 200, 'body': {'status': 'ok'}}`
- `test_health_endpoint_returns_503_when_service_unhealthy`: GET /health should return 503 Service Unavailable if a critical dependency (e.g., database) is down.
  - Input: `{'method': 'GET', 'path': '/health', 'simulate': 'database_down'}`
  - Expected: `{'status_code': 503, 'body': {'status': 'unhealthy'}}`
- `test_health_endpoint_method_not_allowed`: POST /health should return 405 Method Not Allowed.
  - Input: `{'method': 'POST', 'path': '/health'}`
  - Expected: `{'status_code': 405}`

### 🔴 TEST — Tests: backend/api-service/src/app.module.ts
> Ref: §1.1 (modelos de `backend/api-service/src/app.module.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/tests/test_app_module.py`

**Casos de prueba (implementar todos):**
- `test_app_module_imports_ordenes_and_dashboard_modules`: AppModule should import OrdenesModule and DashboardModule and expose their endpoints.
  - Expected: `{'modules_imported': ['OrdenesModule', 'DashboardModule']}`
- `test_app_module_initialization_fails_with_missing_dependency`: AppModule initialization should fail if a required dependency (e.g., database connection) is missing.
  - Input: `{'simulate': 'missing_database_dependency'}`
  - Expected: `{'raises': 'DependencyError'}`
- `test_app_module_routes_are_registered`: AppModule should register /api/ordenes and /api/dashboard routes.
  - Expected: `{'routes': ['/api/ordenes', '/api/dashboard']}`

### 🔴 TEST — Tests: backend/api-service/src/ordenes/ordenes.controller.ts
> Ref: §1.1 (modelos de `backend/api-service/src/ordenes/ordenes.controller.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/tests/test_ordenes_controller.py`

**Casos de prueba (implementar todos):**
- `test_get_ordenes_returns_200_and_list_of_ordenes`: GET /api/ordenes should return 200 OK and a list of Orden objects.
  - Input: `{'method': 'GET', 'path': '/api/ordenes'}`
  - Expected: `{'status_code': 200, 'body_type': 'list', 'body_item_fields': ['id', 'fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']}`
- `test_post_ordenes_valid_data_returns_201_and_orden`: POST /api/ordenes with valid CreateOrdenDto should return 201 Created and the created Orden.
  - Input: `{'method': 'POST', 'path': '/api/ordenes', 'json': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}}`
  - Expected: `{'status_code': 201, 'body_fields': ['id', 'fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']}`
- `test_post_ordenes_missing_required_field_returns_400`: POST /api/ordenes with missing required field (e.g., 'producto') should return 400 Bad Request.
  - Input: `{'method': 'POST', 'path': '/api/ordenes', 'json': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'cantidad': 200, 'estado': 'pendiente'}}`
  - Expected: `{'status_code': 400}`
- `test_post_ordenes_invalid_estado_returns_400`: POST /api/ordenes with invalid 'estado' value should return 400 Bad Request.
  - Input: `{'method': 'POST', 'path': '/api/ordenes', 'json': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'invalid_estado'}}`
  - Expected: `{'status_code': 400}`
- `test_delete_ordenes_existing_id_returns_204`: DELETE /api/ordenes/:id with existing id should return 204 No Content.
  - Input: `{'method': 'DELETE', 'path': '/api/ordenes/1'}`
  - Expected: `{'status_code': 204}`
- `test_delete_ordenes_nonexistent_id_returns_404`: DELETE /api/ordenes/:id with non-existent id should return 404 Not Found.
  - Input: `{'method': 'DELETE', 'path': '/api/ordenes/9999'}`
  - Expected: `{'status_code': 404}`
- `test_post_ordenes_invalid_cantidad_type_returns_400`: POST /api/ordenes with non-numeric 'cantidad' should return 400 Bad Request.
  - Input: `{'method': 'POST', 'path': '/api/ordenes', 'json': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 'not_a_number', 'estado': 'pendiente'}}`
  - Expected: `{'status_code': 400}`

### 🔴 TEST — Tests: backend/api-service/src/ordenes/ordenes.service.ts
> Ref: §1.1 (modelos de `backend/api-service/src/ordenes/ordenes.service.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/tests/test_ordenes_service.py`

**Casos de prueba (implementar todos):**
- `test_create_orden_persists_and_returns_orden`: create_orden should persist a new Orden and return the created object with all fields.
  - Input: `{'orden_data': {'fecha': '2024-06-03', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto C', 'cantidad': 50, 'estado': 'despachado'}}`
  - Expected: `{'fields': ['id', 'fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado'], 'field_values': {'fecha': '2024-06-03', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto C', 'cantidad': 50, 'estado': 'despachado'}}`
- `test_get_all_ordenes_returns_all_persisted_ordenes`: get_all_ordenes should return all Ordenes persisted in the database.
  - Expected: `{'result_type': 'list', 'min_length': 2}`
- `test_delete_orden_existing_id_removes_orden`: delete_orden with existing id should remove the Orden from the database.
  - Input: `{'orden_id': 1}`
  - Expected: `{'deleted': True, 'not_found_after': True}`
- `test_delete_orden_nonexistent_id_raises_not_found`: delete_orden with non-existent id should raise NotFoundException.
  - Input: `{'orden_id': 9999}`
  - Expected: `{'raises': 'NotFoundException'}`
- `test_create_orden_invalid_estado_raises_validation_error`: create_orden with invalid 'estado' value should raise a validation error.
  - Input: `{'orden_data': {'fecha': '2024-06-03', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto C', 'cantidad': 50, 'estado': 'invalid'}}`
  - Expected: `{'raises': 'ValidationError'}`

### 🔴 TEST — Tests: backend/api-service/src/dashboard/dashboard.controller.ts
> Ref: §1.1 (modelos de `backend/api-service/src/dashboard/dashboard.controller.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/tests/test_dashboard_controller.py`

**Casos de prueba (implementar todos):**
- `test_get_dashboard_returns_200_and_dashboard_data`: GET /api/dashboard should return 200 OK and a DashboardData object with all required fields.
  - Input: `{'method': 'GET', 'path': '/api/dashboard'}`
  - Expected: `{'status_code': 200, 'body_fields': ['totalOrdenes', 'totalDespachadas', 'totalEntregadas', 'ordenesPendientes', 'graficoDespachos']}`
- `test_get_dashboard_grafico_despachos_structure`: GET /api/dashboard should return 'graficoDespachos' as a list of objects with 'fecha' and 'cantidad'.
  - Input: `{'method': 'GET', 'path': '/api/dashboard'}`
  - Expected: `{'graficoDespachos_item_fields': ['fecha', 'cantidad']}`
- `test_get_dashboard_empty_db_returns_zeros_and_empty_grafico`: GET /api/dashboard with no Ordenes in DB should return all totals as 0 and graficoDespachos as an empty list.
  - Input: `{'method': 'GET', 'path': '/api/dashboard'}`
  - Expected: `{'status_code': 200, 'body': {'totalOrdenes': 0, 'totalDespachadas': 0, 'totalEntregadas': 0, 'ordenesPendientes': 0, 'graficoDespachos': []}}`

### 🔴 TEST — Tests: backend/api-service/src/dashboard/dashboard.service.ts
> Ref: §1.1 (modelos de `backend/api-service/src/dashboard/dashboard.service.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/api-service/tests/test_dashboard_service.py`

**Casos de prueba (implementar todos):**
- `test_get_dashboard_data_returns_correct_totals`: get_dashboard_data should return correct totals for totalOrdenes, totalDespachadas, totalEntregadas, ordenesPendientes based on Ordenes in DB.
  - Expected: `{'fields': ['totalOrdenes', 'totalDespachadas', 'totalEntregadas', 'ordenesPendientes'], 'totals_match_db': True}`
- `test_get_dashboard_data_grafico_despachos_matches_ordenes`: get_dashboard_data should return graficoDespachos with correct aggregation per fecha for 'despachado' Ordenes.
  - Expected: `{'graficoDespachos_aggregation_correct': True}`
- `test_get_dashboard_data_empty_db_returns_zeros_and_empty_grafico`: get_dashboard_data with no Ordenes in DB should return all totals as 0 and graficoDespachos as empty list.
  - Expected: `{'totalOrdenes': 0, 'totalDespachadas': 0, 'totalEntregadas': 0, 'ordenesPendientes': 0, 'graficoDespachos': []}`

### 🔴 TEST — Tests: frontend/src/types/orden.ts
> Ref: §1.1 (modelos de `frontend/src/types/orden.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/types/orden.test.ts`

**Casos de prueba (implementar todos):**
- `Orden interface matches API contract fields and types`: The Orden interface must have all required fields (id, fecha, planta, centroDistribucion, producto, cantidad, estado) with correct types as per API contract.
  - Expected: `{'fields': {'id': 'number', 'fecha': 'string', 'planta': 'string', 'centroDistribucion': 'string', 'producto': 'string', 'cantidad': 'number', 'estado': "'pendiente' | 'despachado' | 'entregado'"}}`
- `CreateOrdenDto interface matches API contract fields and types`: The CreateOrdenDto interface must have all required fields (fecha, planta, centroDistribucion, producto, cantidad, estado) with correct types as per API contract.
  - Expected: `{'fields': {'fecha': 'string', 'planta': 'string', 'centroDistribucion': 'string', 'producto': 'string', 'cantidad': 'number', 'estado': "'pendiente' | 'despachado' | 'entregado'"}}`
- `Orden interface rejects missing required fields`: Creating an Orden object missing any required field must result in a TypeScript error.
  - Input: `{'orden': {'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}}`
  - Expected: `{'typescript_error': "Property 'centroDistribucion' is missing"}`

### 🔴 TEST — Tests: frontend/src/types/dashboard.ts
> Ref: §1.1 (modelos de `frontend/src/types/dashboard.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/types/dashboard.test.ts`

**Casos de prueba (implementar todos):**
- `DashboardData interface matches API contract fields and types`: The DashboardData interface must have all required fields (totalOrdenes, totalDespachadas, totalEntregadas, ordenesPendientes, graficoDespachos) with correct types as per API contract.
  - Expected: `{'fields': {'totalOrdenes': 'number', 'totalDespachadas': 'number', 'totalEntregadas': 'number', 'ordenesPendientes': 'number', 'graficoDespachos': 'GraficoDespachos[]'}}`
- `GraficoDespachos interface matches API contract fields and types`: The GraficoDespachos interface must have all required fields (fecha, cantidad) with correct types as per API contract.
  - Expected: `{'fields': {'fecha': 'string', 'cantidad': 'number'}}`
- `DashboardData interface rejects missing required fields`: Creating a DashboardData object missing any required field must result in a TypeScript error.
  - Input: `{'dashboardData': {'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'graficoDespachos': []}}`
  - Expected: `{'typescript_error': "Property 'ordenesPendientes' is missing"}`

### 🔴 TEST — Tests: frontend/src/api/ordenes.ts
> Ref: §1.1 (modelos de `frontend/src/api/ordenes.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/api/ordenes.test.ts`

**Casos de prueba (implementar todos):**
- `fetchOrdenes returns array of Orden on 200 OK`: Calling fetchOrdenes must make a GET request to /api/ordenes and return an array of Orden objects matching the API contract on 200 OK.
  - Expected: `{'http_method': 'GET', 'url': '/api/ordenes', 'status_code': 200, 'response_type': 'Orden[]'}`
- `createOrden sends correct payload and returns Orden on 201 Created`: Calling createOrden with valid CreateOrdenDto must POST to /api/ordenes and return the created Orden object on 201 Created.
  - Input: `{'createOrdenDto': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}}`
  - Expected: `{'http_method': 'POST', 'url': '/api/ordenes', 'status_code': 201, 'response_type': 'Orden'}`
- `createOrden with missing required field returns error`: Calling createOrden with missing required field (e.g., 'producto') must result in a 400 or 422 error response.
  - Input: `{'createOrdenDto': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'cantidad': 200, 'estado': 'pendiente'}}`
  - Expected: `{'status_code': [400, 422]}`
- `deleteOrden sends DELETE and returns 204 No Content`: Calling deleteOrden with a valid id must send a DELETE request to /api/ordenes/:id and return 204 No Content.
  - Input: `{'id': 2}`
  - Expected: `{'http_method': 'DELETE', 'url': '/api/ordenes/2', 'status_code': 204}`
- `deleteOrden with non-existent id returns error`: Calling deleteOrden with a non-existent id must return a 404 Not Found or appropriate error response.
  - Input: `{'id': 9999}`
  - Expected: `{'status_code': [404, 400]}`

### 🔴 TEST — Tests: frontend/src/api/dashboard.ts
> Ref: §1.1 (modelos de `frontend/src/api/dashboard.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/api/dashboard.test.ts`

**Casos de prueba (implementar todos):**
- `fetchDashboardData returns DashboardData on 200 OK`: Calling fetchDashboardData must make a GET request to /api/dashboard and return a DashboardData object matching the API contract on 200 OK.
  - Expected: `{'http_method': 'GET', 'url': '/api/dashboard', 'status_code': 200, 'response_type': 'DashboardData'}`
- `fetchDashboardData handles server error response`: If the server returns a 500 Internal Server Error, fetchDashboardData must throw or return an error.
  - Expected: `{'status_code': 500, 'error_handling': 'throws or returns error'}`
- `fetchDashboardData handles malformed response`: If the response from /api/dashboard is missing required fields, fetchDashboardData must throw or return an error.
  - Input: `{'malformed_response': {'totalOrdenes': 120, 'totalDespachadas': 80}}`
  - Expected: `{'error_handling': 'throws or returns error'}`

### 🔴 TEST — Tests: frontend/src/hooks/useOrdenes.ts
> Ref: §1.1 (modelos de `frontend/src/hooks/useOrdenes.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/hooks/useOrdenes.test.ts`

**Casos de prueba (implementar todos):**
- `useOrdenes fetches and returns ordenes on mount`: When the useOrdenes hook is mounted, it must fetch ordenes from the API and return them in its state.
  - Expected: `{'state': {'ordenes': 'Orden[]', 'loading': False, 'error': None}}`
- `useOrdenes handles API error on fetch`: If the API returns an error when fetching ordenes, useOrdenes must set error state and loading to false.
  - Input: `{'api_error': True}`
  - Expected: `{'state': {'ordenes': [], 'loading': False, 'error': 'defined'}}`
- `useOrdenes can create a new orden and updates state`: Calling createOrden from the hook must add the new orden to the state if the API call succeeds.
  - Input: `{'newOrden': {'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 50, 'estado': 'pendiente'}}`
  - Expected: `{'state_update': 'ordenes includes new orden'}`
- `useOrdenes handles createOrden API error`: If the API returns an error when creating an orden, useOrdenes must not update ordenes state and must set error.
  - Input: `{'createOrden_error': True}`
  - Expected: `{'state': {'error': 'defined'}}`
- `useOrdenes can delete an orden and updates state`: Calling deleteOrden from the hook must remove the orden from the state if the API call succeeds.
  - Input: `{'delete_id': 1}`
  - Expected: `{'state_update': 'ordenes does not include deleted orden'}`

### 🔴 TEST — Tests: frontend/src/hooks/useDashboard.ts
> Ref: §1.1 (modelos de `frontend/src/hooks/useDashboard.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/hooks/useDashboard.test.ts`

**Casos de prueba (implementar todos):**
- `useDashboard fetches and returns dashboard data on mount`: When the useDashboard hook is mounted, it must fetch dashboard data from the API and return it in its state.
  - Expected: `{'state': {'dashboardData': 'DashboardData', 'loading': False, 'error': None}}`
- `useDashboard handles API error on fetch`: If the API returns an error when fetching dashboard data, useDashboard must set error state and loading to false.
  - Input: `{'api_error': True}`
  - Expected: `{'state': {'dashboardData': None, 'loading': False, 'error': 'defined'}}`
- `useDashboard handles malformed dashboard data`: If the API returns malformed dashboard data (missing required fields), useDashboard must set error state.
  - Input: `{'malformed_dashboardData': {'totalOrdenes': 120}}`
  - Expected: `{'state': {'dashboardData': None, 'error': 'defined'}}`

### 🔴 TEST — Tests: frontend/src/styles/main.css
> Ref: §1.1 (modelos de `frontend/src/styles/main.css`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/styles/main.test.ts`

**Casos de prueba (implementar todos):**
- `Global styles are applied to body and root elements`: main.css must define global styles for body and root elements (e.g., font, background, margin reset).
  - Expected: `{'css_rules': ['body', '#root']}`
- `Global styles include CSS reset or normalization`: main.css must include a CSS reset or normalization for consistent cross-browser rendering.
  - Expected: `{'css_reset': True}`
- `Global styles define base font and color variables`: main.css must define base font-family and color variables for consistent theming.
  - Expected: `{'css_variables': ['--font-family', '--color-primary']}`

### 🔴 TEST — Tests: frontend/tsconfig.json
> Ref: §1.1 (modelos de `frontend/tsconfig.json`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/tsconfig.test.ts`

**Casos de prueba (implementar todos):**
- `TypeScript strict mode is enabled`: tsconfig.json must have 'strict' set to true.
  - Expected: `{'strict': True}`
- `TypeScript paths are configured for src directory`: tsconfig.json must define 'paths' mapping '@/*' to 'src/*'.
  - Expected: `{'paths': {'@/*': ['src/*']}}`
- `TypeScript target is ESNext or ES2020+`: tsconfig.json must set 'target' to 'ESNext' or at least 'ES2020'.
  - Expected: `{'target': ['ESNext', 'ES2020', 'ES2021', 'ES2022', 'ES2023']}`

### 🔴 TEST — Tests: frontend/vite.config.ts
> Ref: §1.1 (modelos de `frontend/vite.config.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/vite.config.test.ts`

**Casos de prueba (implementar todos):**
- `Vite config loads environment variables`: vite.config.ts must load environment variables from .env files.
  - Expected: `{'env_loading': True}`
- `Vite config sets up proxy for /api endpoints`: vite.config.ts must configure a proxy for /api endpoints to the backend server.
  - Expected: `{'proxy': {'/api': 'http://localhost:23001'}}`
- `Vite config supports TypeScript and React plugins`: vite.config.ts must include plugins for TypeScript and React.
  - Expected: `{'plugins': ['react']}`

### 🔴 TEST — Tests: frontend/src/main.tsx
> Ref: §1.1 (modelos de `frontend/src/main.tsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/main.test.tsx`

**Casos de prueba (implementar todos):**
- `renders root App component without crashing`: The React entry point should render the App component into the DOM without errors.
  - Expected: `{'renders': True, 'no_errors': True}`
- `renders with strict mode enabled`: The entry point should wrap the App component in React.StrictMode.
  - Expected: `{'strict_mode': True}`
- `displays fallback UI on error boundary`: If an error is thrown during rendering, the error boundary should display a fallback UI.
  - Input: `{'throw_error': True}`
  - Expected: `{'fallback_ui_displayed': True}`

### 🔴 TEST — Tests: frontend/src/App.tsx
> Ref: §1.1 (modelos de `frontend/src/App.tsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/App.test.tsx`

**Casos de prueba (implementar todos):**
- `renders layout with navigation and main content`: App should render the main layout including navigation and main content area.
  - Expected: `{'navigation_present': True, 'main_content_present': True}`
- `routes to dashboard page on /`: When the route is '/', the dashboard page should be rendered.
  - Input: `{'route': '/'}`
  - Expected: `{'dashboard_page_rendered': True}`
- `routes to orders page on /ordenes`: When the route is '/ordenes', the orders list page should be rendered.
  - Input: `{'route': '/ordenes'}`
  - Expected: `{'orden_list_rendered': True}`
- `shows 404 page for unknown route`: Navigating to an unknown route should render a 404 or NotFound page.
  - Input: `{'route': '/unknown'}`
  - Expected: `{'not_found_page_rendered': True}`

### 🔴 TEST — Tests: frontend/src/components/OrdenList.tsx
> Ref: §1.1 (modelos de `frontend/src/components/OrdenList.tsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/OrdenList.test.tsx`

**Casos de prueba (implementar todos):**
- `renders list of orders from API`: OrdenList should fetch and display a table of orders from GET /api/ordenes.
  - Input: `{'api_response': [{'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}]}`
  - Expected: `{'table_rows': 1, 'fields_displayed': ['id', 'fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']}`
- `shows loading indicator while fetching orders`: OrdenList should display a loading indicator while waiting for the API response.
  - Input: `{'loading': True}`
  - Expected: `{'loading_indicator_displayed': True}`
- `shows error message on API failure`: OrdenList should display an error message if the GET /api/ordenes request fails.
  - Input: `{'api_error': True}`
  - Expected: `{'error_message_displayed': True}`
- `renders empty state when no orders are returned`: OrdenList should display an empty state message when the API returns an empty array.
  - Input: `{'api_response': []}`
  - Expected: `{'empty_state_displayed': True}`
- `deletes order and updates list on successful DELETE`: Clicking delete on an order should call DELETE /api/ordenes/:id and remove the order from the list on 204 response.
  - Input: `{'order_id': 1, 'delete_response_status': 204}`
  - Expected: `{'order_removed': True}`
- `shows error message if DELETE fails`: If DELETE /api/ordenes/:id fails, an error message should be displayed and the order should remain in the list.
  - Input: `{'order_id': 1, 'delete_response_status': 500}`
  - Expected: `{'error_message_displayed': True, 'order_still_present': True}`

### 🔴 TEST — Tests: frontend/src/components/OrdenForm.tsx
> Ref: §1.1 (modelos de `frontend/src/components/OrdenForm.tsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/OrdenForm.test.tsx`

**Casos de prueba (implementar todos):**
- `submits valid form and creates order`: Submitting the form with valid data should POST to /api/ordenes and show success on 201 response.
  - Input: `{'form_data': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}, 'api_response_status': 201}`
  - Expected: `{'success_message_displayed': True, 'form_reset': True}`
- `shows validation errors for missing required fields`: If required fields are missing, the form should display validation errors and not submit.
  - Input: `{'form_data': {'fecha': '', 'planta': '', 'centroDistribucion': '', 'producto': '', 'cantidad': '', 'estado': ''}}`
  - Expected: `{'validation_errors_displayed': ['fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado'], 'api_not_called': True}`
- `shows error message on API failure`: If POST /api/ordenes fails, an error message should be displayed.
  - Input: `{'form_data': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}, 'api_response_status': 500}`
  - Expected: `{'error_message_displayed': True}`
- `prevents submission with invalid cantidad (negative number)`: If 'cantidad' is negative, the form should show a validation error and not submit.
  - Input: `{'form_data': {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': -10, 'estado': 'pendiente'}}`
  - Expected: `{'validation_errors_displayed': ['cantidad'], 'api_not_called': True}`
- `prevents submission with invalid fecha (not ISO 8601)`: If 'fecha' is not a valid ISO 8601 date string, the form should show a validation error and not submit.
  - Input: `{'form_data': {'fecha': 'not-a-date', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 10, 'estado': 'pendiente'}}`
  - Expected: `{'validation_errors_displayed': ['fecha'], 'api_not_called': True}`

### 🔴 TEST — Tests: frontend/src/components/DashboardKPIs.tsx
> Ref: §1.1 (modelos de `frontend/src/components/DashboardKPIs.tsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/DashboardKPIs.test.tsx`

**Casos de prueba (implementar todos):**
- `renders KPI cards with dashboard data`: DashboardKPIs should fetch and display totalOrdenes, totalDespachadas, totalEntregadas, and ordenesPendientes from GET /api/dashboard.
  - Input: `{'api_response': {'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': []}}`
  - Expected: `{'kpi_fields_displayed': ['totalOrdenes', 'totalDespachadas', 'totalEntregadas', 'ordenesPendientes']}`
- `shows loading indicator while fetching dashboard data`: DashboardKPIs should display a loading indicator while waiting for the API response.
  - Input: `{'loading': True}`
  - Expected: `{'loading_indicator_displayed': True}`
- `shows error message on API failure`: DashboardKPIs should display an error message if the GET /api/dashboard request fails.
  - Input: `{'api_error': True}`
  - Expected: `{'error_message_displayed': True}`
- `renders zero values for KPIs if API returns zeros`: If the API returns zero for all KPI fields, DashboardKPIs should display 0 for each KPI.
  - Input: `{'api_response': {'totalOrdenes': 0, 'totalDespachadas': 0, 'totalEntregadas': 0, 'ordenesPendientes': 0, 'graficoDespachos': []}}`
  - Expected: `{'kpi_fields_displayed': ['totalOrdenes', 'totalDespachadas', 'totalEntregadas', 'ordenesPendientes'], 'kpi_values': [0, 0, 0, 0]}`

### 🔴 TEST — Tests: frontend/src/components/DespachosChart.tsx
> Ref: §1.1 (modelos de `frontend/src/components/DespachosChart.tsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/DespachosChart.test.tsx`

**Casos de prueba (implementar todos):**
- `renders chart with graficoDespachos data`: DespachosChart should render a line or bar chart using graficoDespachos array from GET /api/dashboard.
  - Input: `{'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}, {'fecha': '2024-06-02', 'cantidad': 15}]}`
  - Expected: `{'chart_rendered': True, 'data_points': 2}`
- `renders empty chart when graficoDespachos is empty`: If graficoDespachos is an empty array, DespachosChart should render an empty chart or a message indicating no data.
  - Input: `{'graficoDespachos': []}`
  - Expected: `{'empty_chart_displayed': True}`
- `shows error message if chart data is invalid`: If graficoDespachos contains invalid data (e.g., missing fecha or cantidad), DespachosChart should display an error message.
  - Input: `{'graficoDespachos': [{'fecha': '2024-06-01'}]}`
  - Expected: `{'error_message_displayed': True}`
- `renders chart with a single data point`: If graficoDespachos contains only one entry, DespachosChart should render a chart with a single data point.
  - Input: `{'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 5}]}`
  - Expected: `{'chart_rendered': True, 'data_points': 1}`

### 🟢 PROD — Backend — API Service: dashboard & ordenes endpoints, business logic, health
> Implement the NestJS API service with all endpoints and business logic as per SPEC.md:
**Archivos:**
  - `backend/api-service/src/main.ts`  
  - `backend/api-service/src/app.module.ts`  
  - `backend/api-service/src/ordenes/ordenes.controller.ts`  
  - `backend/api-service/src/ordenes/ordenes.service.ts`  
  - `backend/api-service/src/dashboard/dashboard.controller.ts`  
  - `backend/api-service/src/dashboard/dashboard.service.ts`  
  - `backend/api-service/test/ordenes.e2e-spec.ts`  
  - `backend/api-service/tsconfig.json`


### 🟢 PROD — Frontend — Core: types, API clients, hooks, global styles
> Implement all frontend core logic:
**Archivos:**
  - `frontend/src/types/orden.ts`  
  - `frontend/src/types/dashboard.ts`  
  - `frontend/src/api/ordenes.ts`  
  - `frontend/src/api/dashboard.ts`  
  - `frontend/src/hooks/useOrdenes.ts`  
  - `frontend/src/hooks/useDashboard.ts`  
  - `frontend/src/styles/main.css`  
  - `frontend/tsconfig.json`  
  - `frontend/vite.config.ts`


### 🟢 PROD — Frontend — UI: App shell, layout, components, pages
> Implement all frontend UI components and pages:
**Archivos:**
  - `frontend/src/main.tsx`  
  - `frontend/src/App.tsx`  
  - `frontend/src/components/OrdenList.tsx`  
  - `frontend/src/components/OrdenForm.tsx`  
  - `frontend/src/components/DashboardKPIs.tsx`  
  - `frontend/src/components/DespachosChart.tsx`  
  - `frontend/public/index.html`  
  - `frontend/README.md`


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

## §3.7 Configuración de Test Tooling (requerida por ítems 🔴 TEST del §2)

### jest
- Test files → `{project_root}/tests/*.test.{js,jsx,ts,tsx}` (never `.spec.*` co-located with source)
- `package.json` MUST include in `devDependencies`: `jest`, `@types/jest`
- `package.json` MUST include script: `"test": "jest --coverage"`
- Run: `npx jest --coverage`

### pytest
- Test files → `{service_root}/tests/test_*.py` (never co-located with source)
- `requirements.txt` MUST include: `pytest`, `pytest-cov`, `pytest-asyncio`, `httpx`
- Run: `python -m pytest tests/ --tb=short -q --cov=. --cov-report=term-missing`

### vitest
- Test files → `{frontend_root}/tests/*.test.{js,jsx,ts,tsx}` (never `.spec.*` co-located with source)
- `package.json` MUST include in `devDependencies`: `vitest`, `@vitest/coverage-v8`, `jsdom`
- For React projects also add: `@testing-library/react`, `@testing-library/jest-dom`
- `package.json` MUST include script: `"test": "vitest run --coverage"`
- `vite.config.*` MUST include `test` section:
  ```js
  test: { globals: true, environment: 'jsdom', include: ['tests/**/*.test.{js,jsx,ts,tsx}'] }
  ```
- Create `{frontend_root}/tests/setup.js` with: `import '@testing-library/jest-dom'`
- Run: `npx vitest run --coverage`