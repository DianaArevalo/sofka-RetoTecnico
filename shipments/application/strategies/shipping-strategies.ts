import { Injectable } from '@nestjs/common';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { ShipmentMetadata } from '../../domain/entities/shipment.entity';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class StandardShippingStrategy implements ShippingStrategyPort {
  validate(metadata: ShipmentMetadata, declaredValue: number, senderId: string, recipientId: string): void {
    if (senderId === recipientId) {
      throw new InvalidShipmentException('El remitente y el destinatario no pueden ser el mismo');
    }
    if (!metadata.weightKg || metadata.weightKg > 20) {
      throw new InvalidShipmentException('STANDARD: el peso no puede exceder 20 kg');
    }
  }

  calculateCost(declaredValue: number, metadata: ShipmentMetadata): number {
    const cost = declaredValue * 0.001;
    return cost < 5000 ? 5000 : cost;
  }

  getFinalStatus(): string {
    return 'DELIVERED';
  }
}

@Injectable()
export class ExpressShippingStrategy implements ShippingStrategyPort {
  validate(metadata: ShipmentMetadata, declaredValue: number, senderId: string, recipientId: string): void {
    if (senderId === recipientId) {
      throw new InvalidShipmentException('El remitente y el destinatario no pueden ser el mismo');
    }
    if (!metadata.weightKg || metadata.weightKg > 5) {
      throw new InvalidShipmentException('EXPRESS: el peso no puede exceder 5 kg');
    }
    if (declaredValue > 3000000) {
      throw new InvalidShipmentException('EXPRESS: el valor declarado no puede exceder $3,000,000');
    }
  }

  calculateCost(declaredValue: number, metadata: ShipmentMetadata): number {
    return 15000;
  }

  getFinalStatus(): string {
    return 'DELIVERED';
  }
}

@Injectable()
export class InternationalShippingStrategy implements ShippingStrategyPort {
  validate(metadata: ShipmentMetadata, declaredValue: number, senderId: string, recipientId: string): void {
    if (senderId === recipientId) {
      throw new InvalidShipmentException('El remitente y el destinatario no pueden ser el mismo');
    }
    if (!metadata.destinationCountry) {
      throw new InvalidShipmentException('INTERNATIONAL: país de destino es obligatorio');
    }
    if (!metadata.customsDeclaration) {
      throw new InvalidShipmentException('INTERNATIONAL: declaración de aduana es obligatoria');
    }
    if (declaredValue > 50000000) {
      throw new InvalidShipmentException('INTERNATIONAL: el valor declarado no puede exceder $50,000,000');
    }
  }

  calculateCost(declaredValue: number, metadata: ShipmentMetadata): number {
    return 50000 + declaredValue * 0.02;
  }

  getFinalStatus(): string {
    return 'IN_CUSTOMS';
  }
}

@Injectable()
export class ThirdPartyCarrierShippingStrategy implements ShippingStrategyPort {
  validate(metadata: ShipmentMetadata, declaredValue: number, senderId: string, recipientId: string): void {
    if (senderId === recipientId) {
      throw new InvalidShipmentException('El remitente y el destinatario no pueden ser el mismo');
    }
    if (!metadata.carrierName) {
      throw new InvalidShipmentException('THIRD_PARTY_CARRIER: nombre del transportista es obligatorio');
    }
    if (!metadata.externalTrackingId) {
      throw new InvalidShipmentException('THIRD_PARTY_CARRIER: ID de seguimiento externo es obligatorio');
    }
  }

  calculateCost(declaredValue: number, metadata: ShipmentMetadata): number {
    return declaredValue * 0.05;
  }

  getFinalStatus(): string {
    return 'DELIVERED';
  }
}