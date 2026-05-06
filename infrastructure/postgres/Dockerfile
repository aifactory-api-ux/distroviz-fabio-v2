FROM postgres:15-alpine

WORKDIR /app

COPY init.sql /docker-entrypoint-initdb.d/init.sql

RUN chmod +x /docker-entrypoint-initdb.d/init.sql