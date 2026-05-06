export interface GraficoDespachos {
  fecha: string;
  cantidad: number;
}

export interface DashboardData {
  totalOrdenes: number;
  totalDespachadas: number;
  totalEntregadas: number;
  ordenesPendientes: number;
  graficoDespachos: GraficoDespachos[];
}