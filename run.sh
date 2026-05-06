#!/bin/bash
set -e

echo ">>> Starting infrastructure services..."
docker-compose up -d postgres redis

echo ">>> Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U distroviz -d distrovizdb > /dev/null 2>&1; do
  echo "    Waiting for PostgreSQL..."
  sleep 2
done
echo ">>> PostgreSQL is ready."

echo ">>> Waiting for Redis to be ready..."
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
  echo "    Waiting for Redis..."
  sleep 2
done
echo ">>> Redis is ready."

echo ">>> Starting API service..."
docker-compose up -d api-service

echo ">>> Waiting for API service to be healthy..."
until curl -f http://localhost:23001/health > /dev/null 2>&1; do
  echo "    Waiting for API service..."
  sleep 2
done
echo ">>> API service is healthy."

echo ">>> Starting frontend..."
docker-compose up -d frontend

echo ""
echo ">>> All services are running!"
echo "    - API Service:  http://localhost:23001"
echo "    - Frontend:    http://localhost:24000"
echo "    - PostgreSQL:  localhost:25432"
echo "    - Redis:       localhost:26379"