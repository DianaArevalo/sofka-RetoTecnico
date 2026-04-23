import { Shipment, ShipmentMetadata } from '../entities/shipment.entity';
import { ShipmentOrmEntity } from '../../infrastructure/persistence/shipment.orm-entity';

export class ShipmentMapper {
  static toDomain(orm: ShipmentOrmEntity): Shipment {
    const metadata = orm.metadata ? JSON.parse(JSON.stringify(orm.metadata)) : undefined;
    return new Shipment({
      id: orm.id,
      senderId: orm.senderId,
      recipientId: orm.recipientId,
      declaredValue: orm.declaredValue,
      shippingCost: orm.shippingCost,
      type: orm.type,
      status: orm.status,
      metadata: metadata as ShipmentMetadata,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: Shipment): ShipmentOrmEntity {
    const orm = new ShipmentOrmEntity();
    orm.id = domain.id;
    orm.senderId = domain.senderId;
    orm.recipientId = domain.recipientId;
    orm.declaredValue = domain.declaredValue;
    orm.shippingCost = domain.shippingCost;
    orm.type = domain.type;
    orm.status = domain.status;
    orm.metadata = domain.metadata as unknown as Record<string, unknown>;
    return orm;
  }
}