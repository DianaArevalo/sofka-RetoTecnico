import { IsEmail, IsEnum, IsString, IsBoolean, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export enum CustomerRole {
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
}

export class Customer {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ enum: CustomerRole })
  @IsEnum(CustomerRole)
  role: CustomerRole;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }
}

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: CustomerRole })
  @IsOptional()
  @IsEnum(CustomerRole)
  role?: CustomerRole;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: CustomerRole })
  @IsOptional()
  @IsEnum(CustomerRole)
  role?: CustomerRole;
}