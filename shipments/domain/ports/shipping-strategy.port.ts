import { ShipmentMetadata } from '../entities/shipment.entity';
import { ShipmentStatus } from '../entities/shipment-status.value-object';
import { Money } from '../entities/money.value-object';

export interface ShippingStrategyPort {
  validate(metadata: ShipmentMetadata, declaredValue: number, senderId: string, recipientId: string): void;
  calculateCost(declaredValue: number, metadata: ShipmentMetadata): Money;
  getFinalStatus(): ShipmentStatus;
}

export const SHIPPING_STRATEGY_KEY = 'SHIPPING_STRATEGY_KEY';