import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CustomerRoleEnum {
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
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

  @ApiPropertyOptional({ enum: CustomerRoleEnum })
  @IsOptional()
  @IsEnum(CustomerRoleEnum)
  role?: CustomerRoleEnum;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ enum: CustomerRoleEnum })
  @IsOptional()
  @IsEnum(CustomerRoleEnum)
  role?: CustomerRoleEnum;
}