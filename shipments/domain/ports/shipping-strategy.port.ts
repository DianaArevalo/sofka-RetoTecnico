import { Shipment, ShipmentMetadata } from '../entities/shipment.entity';

export interface ShippingStrategyPort {
  validate(metadata: ShipmentMetadata, declaredValue: number, senderId: string, recipientId: string): void;
  calculateCost(declaredValue: number, metadata: ShipmentMetadata): number;
  getFinalStatus(): string;
}

export const SHIPPING_STRATEGY_KEY = 'SHIPPING_STRATEGY_KEY';