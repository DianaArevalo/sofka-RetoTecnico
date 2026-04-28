import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerRole } from '../../../domain/entities/customer-role.value-object';

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

  @ApiPropertyOptional({ enum: CustomerRole, enumName: 'CustomerRole' })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value in CustomerRole) {
      return CustomerRole[value as keyof typeof CustomerRole];
    }
    return value;
  })
  @IsEnum(CustomerRole)
  role?: CustomerRole;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ enum: CustomerRole, enumName: 'CustomerRole' })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value in CustomerRole) {
      return CustomerRole[value as keyof typeof CustomerRole];
    }
    return value;
  })
  @IsEnum(CustomerRole)
  role?: CustomerRole;
}
