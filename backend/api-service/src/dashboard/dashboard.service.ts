import { Injectable } from '@nestjs/common';
import { DbService } from '../shared/db.service';
import { CacheService } from '../shared/cache.service';
import { DashboardData } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private dbService: DbService,
    private cacheService: CacheService,
  ) {}

  async getDashboardData(): Promise<DashboardData> {
    const cached = await this.cacheService.get<DashboardData>('dashboard_data');
    if (cached) {
      return cached;
    }

    const ordenes = await this.dbService.query<any>('SELECT * FROM ordenes');

    const totalOrdenes = ordenes.length;
    const totalDespachadas = ordenes.filter((o: any) => o.estado === 'despachado').length;
    const totalEntregadas = ordenes.filter((o: any) => o.estado === 'entregado').length;
    const ordenesPendientes = ordenes.filter((o: any) => o.estado === 'pendiente').length;

    const despachosPorFecha: { [key: string]: number } = {};
    ordenes
      .filter((o: any) => o.estado === 'despachado')
      .forEach((o: any) => {
        despachosPorFecha[o.fecha] = (despachosPorFecha[o.fecha] || 0) + o.cantidad;
      });

    const graficoDespachos = Object.entries(despachosPorFecha).map(([fecha, cantidad]) => ({
      fecha,
      cantidad,
    }));

    const dashboardData: DashboardData = {
      totalOrdenes,
      totalDespachadas,
      totalEntregadas,
      ordenesPendientes,
      graficoDespachos,
    };

    await this.cacheService.set('dashboard_data', dashboardData, 300);
    return dashboardData;
  }
}