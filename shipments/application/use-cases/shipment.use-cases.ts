import { Injectable } from '@nestjs/common';
import { ShipmentPort } from '../../domain/ports/shipment.port';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { Shipment, CreateShipmentDto, ShipmentType, ShipmentStatus } from '../../domain/entities/shipment.entity';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment.exceptions';
import { StandardShippingStrategy, ExpressShippingStrategy, InternationalShippingStrategy, ThirdPartyCarrierShippingStrategy } from '../strategies/shipping-strategies';
import { Inject } from '@nestjs/common';

const SHIPPING_STRATEGIES: Record<string, ShippingStrategyPort> = {
  STANDARD: new StandardShippingStrategy(),
  EXPRESS: new ExpressShippingStrategy(),
  INTERNATIONAL: new InternationalShippingStrategy(),
  THIRD_PARTY_CARRIER: new ThirdPartyCarrierShippingStrategy(),
};

@Injectable()
export class CreateShipmentUseCase {
  constructor(
    private readonly shipmentPort: ShipmentPort,
    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreateShipmentDto): Promise<Shipment> {
    const strategy = SHIPPING_STRATEGIES[dto.type];
    if (!strategy) {
      throw new Error(`Tipo de envío no soportado: ${dto.type}`);
    }

    strategy.validate(dto.metadata || {}, dto.declaredValue, dto.senderId, dto.recipientId);

    const shippingCost = strategy.calculateCost(dto.declaredValue, dto.metadata || {});
    const finalStatus = strategy.getFinalStatus();

    const shipment = await this.shipmentPort.create(dto, shippingCost, finalStatus);

    const topicMap: Record<string, string> = {
      DELIVERED: 'shipment.dispatched',
      IN_CUSTOMS: 'shipment.in_customs',
      FAILED: 'shipment.failed',
    };

    const topic = topicMap[finalStatus];
    if (topic) {
      await this.eventPublisher.publish(topic, {
        shipmentId: shipment.id,
        senderId: shipment.senderId,
        recipientId: shipment.recipientId,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        type: shipment.type,
        status: shipment.status,
        timestamp: new Date(),
      });
    }

    return shipment;
  }
}

@Injectable()
export class GetShipmentByIdUseCase {
  constructor(private readonly shipmentPort: ShipmentPort) {}

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
  constructor(private readonly shipmentPort: ShipmentPort) {}

  async execute(customerId: string): Promise<Shipment[]> {
    return this.shipmentPort.findByCustomerId(customerId);
  }
}