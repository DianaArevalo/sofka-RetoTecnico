import { Shipment, CreateShipmentDto } from '../entities/shipment.entity';

export interface ShipmentPort {
  findById(id: string): Promise<Shipment | null>;
  findByCustomerId(customerId: string): Promise<Shipment[]>;
  create(dto: CreateShipmentDto, shippingCost: number, status: string): Promise<Shipment>;
}