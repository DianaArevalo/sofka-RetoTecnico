import { ShipmentType } from '../entities/shipment-type.value-object';
import { ShipmentStatus } from '../entities/shipment-status.value-object';
import { Money } from '../entities/money.value-object';

export interface CreateShipmentInput {
  senderId: string;
  recipientId: string;
  declaredValue: number;
  type: ShipmentType;
  metadata?: Record<string, unknown>;
}

export interface ShipmentPort {
  findById(id: string): Promise<import('../../domain/entities/shipment.entity').Shipment | null>;
  findByCustomerId(customerId: string): Promise<import('../../domain/entities/shipment.entity').Shipment[]>;
  create(input: CreateShipmentInput, shippingCost: Money, status: ShipmentStatus): Promise<import('../../domain/entities/shipment.entity').Shipment>;
}