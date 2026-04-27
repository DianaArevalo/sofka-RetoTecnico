import { Shipment, ShipmentType, ShipmentStatus, ShipmentMetadata, Money } from '../entities/shipment.entity';

export abstract class ShippingStrategyPort {
  abstract validate(shipment: Shipment): void;
  abstract calculateCost(shipment: Shipment): Money;
  abstract execute(shipment: Shipment): Shipment;
}