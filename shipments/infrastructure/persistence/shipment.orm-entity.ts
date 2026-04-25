import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('shipments')
export class ShipmentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'uuid' })
  recipientId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  declaredValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  shippingCost: number;

  @Column({ type: 'int', default: 1 })
  type: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}