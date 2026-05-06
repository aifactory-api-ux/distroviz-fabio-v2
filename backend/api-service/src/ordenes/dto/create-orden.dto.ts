export interface CreateOrdenDto {
  fecha: string;
  planta: string;
  centroDistribucion: string;
  producto: string;
  cantidad: number;
  estado: 'pendiente' | 'despachado' | 'entregado';
}