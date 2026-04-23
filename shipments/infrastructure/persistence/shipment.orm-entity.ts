import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ShipmentType, ShipmentStatus } from '../../domain/entities/shipment.entity';

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

  @Column({ type: 'enum', enum: ShipmentType })
  type: ShipmentType;

  @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  status: ShipmentStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}