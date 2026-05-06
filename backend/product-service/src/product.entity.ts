import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  sku: string;

  @CreateDateColumn()
  createdAt: Date;
}