import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'USER'], default: 'USER' })
  role: 'ADMIN' | 'USER';

  @CreateDateColumn()
  createdAt: Date;
}