import { Shipment, ShipmentType, ShipmentStatus, ShipmentMetadata, Money } from '../../domain/entities/shipment.entity';
import { ShipmentOrmEntity } from './shipment.orm-entity';
import { ShipmentResponseDto } from '../http/dtos/shipment-response.dto';

export class ShipmentMapper {
  static toDomain(orm: ShipmentOrmEntity): Shipment {
    const metadata = orm.metadata ? (orm.metadata as Record<string, unknown>) : undefined;
    return new Shipment({
      id: orm.id,
      senderId: orm.senderId,
      recipientId: orm.recipientId,
      declaredValue: new Money(Number(orm.declaredValue)),
      shippingCost: new Money(Number(orm.shippingCost)),
      type: orm.type as ShipmentType,
      status: orm.status as ShipmentStatus,
      metadata: metadata as ShipmentMetadata | undefined,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: Shipment): ShipmentOrmEntity {
    const orm = new ShipmentOrmEntity();
    orm.id = domain.id;
    orm.senderId = domain.senderId;
    orm.recipientId = domain.recipientId;
    orm.declaredValue = domain.declaredValue.value;
    orm.shippingCost = domain.shippingCost.value;
    orm.type = domain.type as unknown as number;
    orm.status = domain.status as unknown as number;
    orm.metadata = domain.metadata as Record<string, unknown>;
    return orm;
  }

  static toResponse(domain: Shipment): ShipmentResponseDto {
    return new ShipmentResponseDto(
      domain.id,
      domain.senderId,
      domain.recipientId,
      domain.declaredValue.value,
      domain.shippingCost.value,
      domain.type,
      domain.status,
      domain.metadata,
      domain.createdAt,
      domain.updatedAt,
    );
  }
}