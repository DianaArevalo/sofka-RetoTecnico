import { Customer, CustomerRole } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from './customer.orm-entity';
import { CustomerResponseDto } from '../http/dtos/customer-response.dto';

export class CustomerMapper {
  static toDomain(orm: CustomerOrmEntity): Customer {
    return new Customer({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      passwordHash: orm.password,
      role: orm.role as CustomerRole,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: Customer): CustomerOrmEntity {
    const orm = new CustomerOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.email = domain.email;
    orm.password = domain.passwordHash;
    orm.role = domain.role as unknown as number;
    orm.isActive = domain.isActive;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }

  static toResponse(domain: Customer): CustomerResponseDto {
    return new CustomerResponseDto(
      domain.id,
      domain.name,
      domain.email,
      domain.role,
      domain.isActive,
      domain.createdAt,
      domain.updatedAt,
    );
  }
}