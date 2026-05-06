# DistroViz

A distributed microservices application with Node.js/NestJS backend and React frontend.

## Services

- **auth-service** (port 23001): Authentication service
- **order-service** (port 23002): Order management
- **inventory-service** (port 23003): Inventory tracking
- **product-service** (port 23004): Product catalog
- **api-gateway** (port 23005): API Gateway
- **frontend** (port 23006): React frontend

## Quick Start

```bash
./run.sh
```

This will start all services using Docker Compose.

## Development

1. Copy `.env.example` to `.env` in each service directory
2. Run `docker-compose up` to start all services

## Tech Stack

- Backend: Node.js v20.x, NestJS v10.x, TypeScript v5.x
- Frontend: React v18.x, TypeScript v5.x
- Database: PostgreSQL v15.x
- Cache: Redis v7.x
- Message Queue: RabbitMQ v3.x