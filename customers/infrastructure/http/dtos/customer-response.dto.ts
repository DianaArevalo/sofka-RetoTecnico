import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerRole } from '../../../domain/entities/customer-role.value-object';

export enum CustomerRoleEnum {
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
}

export class CustomerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty({ enum: CustomerRoleEnum })
  role: CustomerRoleEnum;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    role: CustomerRole,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = CustomerRoleEnum[CustomerRole[role]];
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}