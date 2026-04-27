import { Shipment, ShipmentType } from '../entities/shipment.entity';

export interface CreateShipmentInput {
  senderId: string;
  recipientId: string;
  declaredValue: number;
  type: ShipmentType;
  metadata?: Record<string, unknown>;
}

export interface ShipmentPort {
  findById(id: string): Promise<Shipment | null>;
  findByCustomerId(customerId: string): Promise<Shipment[]>;
  create(shipment: Shipment): Promise<Shipment>;
}