import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      user: process.env.POSTGRES_USER || 'distroviz',
      password: process.env.POSTGRES_PASSWORD || 'distrovizpw',
      database: process.env.POSTGRES_DB || 'distrovizdb',
    });
  }

  async onModuleInit() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ordenes (
          id SERIAL PRIMARY KEY,
          fecha TEXT NOT NULL,
          planta TEXT NOT NULL,
          centroDistribucion TEXT NOT NULL,
          producto TEXT NOT NULL,
          cantidad INTEGER NOT NULL,
          estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'despachado', 'entregado'))
        )
      `);

      const result = await client.query('SELECT COUNT(*) FROM ordenes');
      if (parseInt(result.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
          VALUES
            ('2024-06-01', 'Planta Norte', 'CD Central', 'Producto A', 100, 'pendiente'),
            ('2024-06-02', 'Planta Sur', 'CD Sur', 'Producto B', 200, 'despachado'),
            ('2024-06-03', 'Planta Este', 'CD Este', 'Producto C', 150, 'entregado'),
            ('2024-06-04', 'Planta Oeste', 'CD Oeste', 'Producto D', 300, 'pendiente'),
            ('2024-06-05', 'Planta Norte', 'CD Central', 'Producto A', 250, 'despachado')
        `);
      }
    } finally {
      client.release();
    }
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    await this.pool.query(sql, params);
  }
}