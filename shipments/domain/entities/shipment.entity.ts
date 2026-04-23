import { IsEnum, IsNumber, IsString, IsOptional, IsObject, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ShipmentType {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  INTERNATIONAL = 'INTERNATIONAL',
  THIRD_PARTY_CARRIER = 'THIRD_PARTY_CARRIER',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  IN_CUSTOMS = 'IN_CUSTOMS',
  FAILED = 'FAILED',
}

export class ShipmentMetadata {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destinationCountry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customsDeclaration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carrierName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalTrackingId?: string;
}

export class Shipment {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ format: 'uuid' })
  senderId: string;

  @ApiProperty({ format: 'uuid' })
  recipientId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  declaredValue: number;

  @ApiProperty()
  @IsNumber()
  shippingCost: number;

  @ApiProperty({ enum: ShipmentType })
  @IsEnum(ShipmentType)
  type: ShipmentType;

  @ApiProperty({ enum: ShipmentStatus })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: ShipmentMetadata;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Shipment>) {
    Object.assign(this, partial);
  }
}

export class CreateShipmentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  senderId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  recipientId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  declaredValue: number;

  @ApiProperty({ enum: ShipmentType })
  @IsEnum(ShipmentType)
  type: ShipmentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: ShipmentMetadata;
}