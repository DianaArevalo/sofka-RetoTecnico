import { Injectable, Inject } from '@nestjs/common';
import { ShipmentPort, CreateShipmentInput } from '../../domain/ports/shipment.port';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { Shipment, ShipmentType, ShipmentStatus, ShipmentMetadata, Money } from '../../domain/entities/shipment.entity';
import { EventPublisherPort } from '../../../shared/events/domain/ports/event-publisher.port';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment.exceptions';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateShipmentUseCase {
  constructor(
    @Inject('ShipmentPort') private readonly shipmentPort: ShipmentPort,
    @Inject('SHIPPING_STRATEGIES') private readonly strategies: Map<ShipmentType, ShippingStrategyPort>,
    @Inject('EventPublisher') private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(input: CreateShipmentInput): Promise<Shipment> {
    if (input.senderId === input.recipientId) {
      throw new InvalidShipmentException('El remitente y el destinatario no pueden ser el mismo');
    }

    const shipment = new Shipment({
      id: uuidv4(),
      senderId: input.senderId,
      recipientId: input.recipientId,
      declaredValue: new Money(input.declaredValue),
      shippingCost: new Money(0),
      type: input.type,
      status: ShipmentStatus.PENDING,
      metadata: input.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const strategy = this.strategies.get(shipment.type);
    if (!strategy) {
      throw new InvalidShipmentException(`Tipo de envío no soportado: ${shipment.type}`);
    }

    const processedShipment = strategy.execute(shipment);

    const savedShipment = await this.shipmentPort.create(processedShipment);

    const topicMap: Record<string, string> = {
      [ShipmentStatus.DELIVERED]: 'shipment.dispatched',
      [ShipmentStatus.IN_CUSTOMS]: 'shipment.in_customs',
      [ShipmentStatus.FAILED]: 'shipment.failed',
    };

    const topic = topicMap[savedShipment.status];
    if (topic) {
      await this.eventPublisher.publish(topic, {
        shipmentId: savedShipment.id,
        senderId: savedShipment.senderId,
        recipientId: savedShipment.recipientId,
        declaredValue: savedShipment.declaredValue,
        shippingCost: savedShipment.shippingCost,
        type: savedShipment.type,
        status: savedShipment.status,
        timestamp: new Date(),
      });
    }

    return savedShipment;
  }
}

@Injectable()
export class GetShipmentByIdUseCase {
  constructor(@Inject('ShipmentPort') private readonly shipmentPort: ShipmentPort) {}

  async execute(id: string): Promise<Shipment> {
    const shipment = await this.shipmentPort.findById(id);
    if (!shipment) {
      throw new ShipmentNotFoundException(id);
    }
    return shipment;
  }
}

@Injectable()
export class GetShipmentsByCustomerUseCase {
  constructor(@Inject('ShipmentPort') private readonly shipmentPort: ShipmentPort) {}

  async execute(customerId: string): Promise<Shipment[]> {
    return this.shipmentPort.findByCustomerId(customerId);
  }
}