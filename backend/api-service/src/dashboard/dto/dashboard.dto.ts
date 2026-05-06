import { GraficoDespachos } from './grafico-despachos.dto';

export interface DashboardData {
  totalOrdenes: number;
  totalDespachadas: number;
  totalEntregadas: number;
  ordenesPendientes: number;
  graficoDespachos: GraficoDespachos[];
}