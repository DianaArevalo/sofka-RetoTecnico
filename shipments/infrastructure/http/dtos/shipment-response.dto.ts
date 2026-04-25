import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentType, ShipmentStatus, ShipmentMetadata } from '../../../domain/entities/shipment.entity';

export enum ShipmentTypeEnum {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  INTERNATIONAL = 'INTERNATIONAL',
  THIRD_PARTY_CARRIER = 'THIRD_PARTY_CARRIER',
}

export enum ShipmentStatusEnum {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  IN_CUSTOMS = 'IN_CUSTOMS',
  FAILED = 'FAILED',
}

export class ShipmentMetadataResponseDto {
  @ApiPropertyOptional()
  weightKg?: number;

  @ApiPropertyOptional()
  destinationCountry?: string;

  @ApiPropertyOptional()
  customsDeclaration?: string;

  @ApiPropertyOptional()
  carrierName?: string;

  @ApiPropertyOptional()
  externalTrackingId?: string;

  constructor(metadata?: ShipmentMetadata) {
    if (metadata) {
      this.weightKg = metadata.weightKg;
      this.destinationCountry = metadata.destinationCountry;
      this.customsDeclaration = metadata.customsDeclaration;
      this.carrierName = metadata.carrierName;
      this.externalTrackingId = metadata.externalTrackingId;
    }
  }
}

export class ShipmentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  senderId: string;

  @ApiProperty({ format: 'uuid' })
  recipientId: string;

  @ApiProperty()
  declaredValue: number;

  @ApiProperty()
  shippingCost: number;

  @ApiProperty({ enum: ShipmentTypeEnum })
  type: ShipmentTypeEnum;

  @ApiProperty({ enum: ShipmentStatusEnum })
  status: ShipmentStatusEnum;

  @ApiPropertyOptional()
  metadata?: ShipmentMetadataResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    id: string,
    senderId: string,
    recipientId: string,
    declaredValue: number,
    shippingCost: number,
    type: ShipmentType,
    status: ShipmentStatus,
    metadata: ShipmentMetadata | undefined,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.declaredValue = declaredValue;
    this.shippingCost = shippingCost;
    this.type = ShipmentTypeEnum[ShipmentType[type]];
    this.status = ShipmentStatusEnum[ShipmentStatus[status]];
    this.metadata = metadata ? new ShipmentMetadataResponseDto(metadata) : undefined;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}