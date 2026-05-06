#!/bin/bash
set -e

echo "Starting DistroViz services..."

docker-compose up --build -d

echo ""
echo "Services started:"
echo "  - auth-service:     http://localhost:23001"
echo "  - order-service:    http://localhost:23002"
echo "  - inventory-service: http://localhost:23003"
echo "  - product-service:  http://localhost:23004"
echo "  - api-gateway:      http://localhost:23005"
echo "  - frontend:          http://localhost:23006"
echo ""
echo "API Gateway:          http://localhost:23005/api"
echo "RabbitMQ Management:  http://localhost:15672 (guest/guest)"
echo ""
echo "To view logs: docker-compose logs -f [service-name]"
echo "To stop:      docker-compose down"