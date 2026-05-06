# DistroViz

Sistema de gestión de órdenes de distribución con dashboard en tiempo real.

## Tech Stack

- **Backend**: Node.js v20.x, NestJS v10.x, TypeScript v5.x
- **Frontend**: React v18.x, TypeScript v5.x, Vite v4.x
- **Database**: PostgreSQL v15.x
- **Cache**: Redis v7.x
- **Orchestration**: Docker Compose v2.x

## Quick Start

```bash
./run.sh
```

Esto iniciará todos los servicios:
- API Service: http://localhost:23001
- Frontend: http://localhost:24000
- PostgreSQL: localhost:25432
- Redis: localhost:26379

## API Endpoints

- `GET /api/dashboard` - Datos del dashboard
- `GET /api/ordenes` - Lista de órdenes
- `POST /api/ordenes` - Crear orden
- `DELETE /api/ordenes/:id` - Eliminar orden

## Development

```bash
# Backend
cd backend/api-service
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## Testing

```bash
# Run all test suites
./backend/api-service/run_tests.sh
./backend/shared/run_tests.sh
./frontend/run_tests.sh
./shared/types/run_tests.sh
```