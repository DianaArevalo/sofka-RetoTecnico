import { IsEnum, IsNumber, IsString, IsOptional, IsObject, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ShipmentTypeEnum {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  INTERNATIONAL = 'INTERNATIONAL',
  THIRD_PARTY_CARRIER = 'THIRD_PARTY_CARRIER',
}

export class ShipmentMetadataDto {
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

  @ApiProperty({ enum: ShipmentTypeEnum })
  @IsEnum(ShipmentTypeEnum)
  type: ShipmentTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: ShipmentMetadataDto;
}