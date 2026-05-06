import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../shared/db.service';
import { CacheService } from '../shared/cache.service';
import { Orden } from './dto/orden.dto';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Injectable()
export class OrdenesService {
  constructor(
    private dbService: DbService,
    private cacheService: CacheService,
  ) {}

  async findAll(): Promise<Orden[]> {
    return this.dbService.query<Orden>('SELECT * FROM ordenes ORDER BY id');
  }

  async create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
    const result = await this.dbService.query<Orden>(
      `INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        createOrdenDto.fecha,
        createOrdenDto.planta,
        createOrdenDto.centroDistribucion,
        createOrdenDto.producto,
        createOrdenDto.cantidad,
        createOrdenDto.estado,
      ],
    );
    await this.cacheService.del('dashboard_data');
    return result[0];
  }

  async delete(id: number): Promise<void> {
    const result = await this.dbService.query('DELETE FROM ordenes WHERE id = $1 RETURNING id', [id]);
    if (result.length === 0) {
      throw new NotFoundException(`Orden with id ${id} not found`);
    }
    await this.cacheService.del('dashboard_data');
  }
}