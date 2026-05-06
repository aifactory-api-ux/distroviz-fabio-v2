import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: ['PENDING', 'CONFIRMED', 'DISPATCHED', 'CANCELLED'], default: 'PENDING' })
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}