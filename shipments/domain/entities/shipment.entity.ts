import { ShipmentType } from './shipment-type.value-object';
import { ShipmentStatus } from './shipment-status.value-object';
import { ShipmentMetadata } from './shipment-metadata.value-object';
import { Money } from './money.value-object';

export { ShipmentType, ShipmentStatus, ShipmentMetadata, Money };

export class Shipment {
  readonly id: string;
  readonly senderId: string;
  readonly recipientId: string;
  readonly declaredValue: Money;
  readonly shippingCost: Money;
  readonly type: ShipmentType;
  readonly status: ShipmentStatus;
  readonly metadata?: ShipmentMetadata;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    senderId: string;
    recipientId: string;
    declaredValue: Money;
    shippingCost: Money;
    type: ShipmentType;
    status: ShipmentStatus;
    metadata?: ShipmentMetadata;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.senderId = props.senderId;
    this.recipientId = props.recipientId;
    this.declaredValue = props.declaredValue;
    this.shippingCost = props.shippingCost;
    this.type = props.type;
    this.status = props.status;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isInternational(): boolean {
    return this.type === ShipmentType.INTERNATIONAL;
  }

  canModifyStatus(): boolean {
    return this.status !== ShipmentStatus.DELIVERED && this.status !== ShipmentStatus.FAILED;
  }

  withStatus(status: ShipmentStatus): Shipment {
    return new Shipment({
      ...this,
      status,
      updatedAt: new Date(),
    });
  }

  withShippingCost(cost: Money): Shipment {
    return new Shipment({
      ...this,
      shippingCost: cost,
      updatedAt: new Date(),
    });
  }
}