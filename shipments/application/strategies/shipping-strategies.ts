import { Injectable } from '@nestjs/common';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { Shipment, ShipmentMetadata, Money } from '../../domain/entities/shipment.entity';
import { ShipmentStatus } from '../../domain/entities/shipment-status.value-object';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class StandardShippingStrategy extends ShippingStrategyPort {
  validate(shipment: Shipment): void {
    const metadata = shipment.metadata || {};
    if (!metadata.weightKg || metadata.weightKg > 20) {
      throw new InvalidShipmentException('STANDARD: el peso no puede exceder 20 kg');
    }
  }

  calculateCost(shipment: Shipment): Money {
    const cost = shipment.declaredValue.value * 0.001;
    return new Money(cost < 5000 ? 5000 : cost);
  }

  execute(shipment: Shipment): Shipment {
    this.validate(shipment);
    const cost = this.calculateCost(shipment);
    return shipment.withShippingCost(cost).withStatus(ShipmentStatus.DELIVERED);
  }
}

@Injectable()
export class ExpressShippingStrategy extends ShippingStrategyPort {
  validate(shipment: Shipment): void {
    const metadata = shipment.metadata || {};
    if (!metadata.weightKg || metadata.weightKg > 5) {
      throw new InvalidShipmentException('EXPRESS: el peso no puede exceder 5 kg');
    }
    if (shipment.declaredValue.value > 3000000) {
      throw new InvalidShipmentException('EXPRESS: el valor declarado no puede exceder $3,000,000');
    }
  }

  calculateCost(shipment: Shipment): Money {
    return new Money(15000);
  }

  execute(shipment: Shipment): Shipment {
    this.validate(shipment);
    const cost = this.calculateCost(shipment);
    return shipment.withShippingCost(cost).withStatus(ShipmentStatus.DELIVERED);
  }
}

@Injectable()
export class InternationalShippingStrategy extends ShippingStrategyPort {
  validate(shipment: Shipment): void {
    const metadata = shipment.metadata || {};
    if (!metadata.destinationCountry) {
      throw new InvalidShipmentException('INTERNATIONAL: país de destino es obligatorio');
    }
    if (!metadata.customsDeclaration) {
      throw new InvalidShipmentException('INTERNATIONAL: declaración de aduana es obligatoria');
    }
    if (shipment.declaredValue.value > 50000000) {
      throw new InvalidShipmentException('INTERNATIONAL: el valor declarado no puede exceder $50,000,000');
    }
  }

  calculateCost(shipment: Shipment): Money {
    return new Money(50000 + shipment.declaredValue.value * 0.02);
  }

  execute(shipment: Shipment): Shipment {
    this.validate(shipment);
    const cost = this.calculateCost(shipment);
    return shipment.withShippingCost(cost).withStatus(ShipmentStatus.IN_CUSTOMS);
  }
}

@Injectable()
export class ThirdPartyCarrierShippingStrategy extends ShippingStrategyPort {
  validate(shipment: Shipment): void {
    const metadata = shipment.metadata || {};
    if (!metadata.carrierName) {
      throw new InvalidShipmentException('THIRD_PARTY_CARRIER: nombre del transportista es obligatorio');
    }
    if (!metadata.externalTrackingId) {
      throw new InvalidShipmentException('THIRD_PARTY_CARRIER: ID de seguimiento externo es obligatorio');
    }
  }

  calculateCost(shipment: Shipment): Money {
    return new Money(shipment.declaredValue.value * 0.05);
  }

  execute(shipment: Shipment): Shipment {
    this.validate(shipment);
    const cost = this.calculateCost(shipment);
    return shipment.withShippingCost(cost).withStatus(ShipmentStatus.DELIVERED);
  }
}