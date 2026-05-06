export class Orden {
  id!: number;
  fecha!: string;
  planta!: string;
  centroDistribucion!: string;
  producto!: string;
  cantidad!: number;
  estado!: 'pendiente' | 'despachado' | 'entregado';
}