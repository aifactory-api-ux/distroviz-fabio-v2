import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory')
export class InventoryItem {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @UpdateDateColumn()
  updatedAt: Date;
}