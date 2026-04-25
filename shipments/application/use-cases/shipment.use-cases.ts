import { Injectable } from '@nestjs/common';
import { ShipmentPort, CreateShipmentInput } from '../../domain/ports/shipment.port';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { Shipment, ShipmentType, ShipmentStatus, ShipmentMetadata, Money } from '../../domain/entities/shipment.entity';
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

  async execute(input: CreateShipmentInput): Promise<Shipment> {
    const strategy = SHIPPING_STRATEGIES[input.type];
    if (!strategy) {
      throw new Error(`Tipo de envío no soportado: ${input.type}`);
    }

    strategy.validate(input.metadata || {}, input.declaredValue, input.senderId, input.recipientId);

    const shippingCost = strategy.calculateCost(input.declaredValue, input.metadata || {});
    const finalStatus = strategy.getFinalStatus();

    const shipment = await this.shipmentPort.create(input, shippingCost, finalStatus);

    const topicMap: Record<string, string> = {
      [ShipmentStatus.DELIVERED]: 'shipment.dispatched',
      [ShipmentStatus.IN_CUSTOMS]: 'shipment.in_customs',
      [ShipmentStatus.FAILED]: 'shipment.failed',
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