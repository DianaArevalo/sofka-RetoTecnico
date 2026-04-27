import { ShipmentType } from '../../../../shipments/domain/entities/shipment-type.value-object';
import { ShipmentStatus } from '../../../../shipments/domain/entities/shipment-status.value-object';
import { Money } from '../../../../shipments/domain/entities/money.value-object';

export interface ShipmentEvent {
  shipmentId: string;
  senderId: string;
  recipientId: string;
  declaredValue: Money;
  shippingCost: Money;
  type: ShipmentType;
  status: ShipmentStatus;
  timestamp: Date;
}

export interface EventPublisherPort {
  publish(topic: string, event: ShipmentEvent): Promise<void>;
}
