import { Customer } from '../entities/customer.entity';
import { CustomerOrmEntity } from '../../infrastructure/persistence/customer.orm-entity';

export class CustomerMapper {
  static toDomain(orm: CustomerOrmEntity): Customer {
    return new Customer({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      password: orm.password,
      role: orm.role,
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
    orm.password = domain.password;
    orm.role = domain.role;
    orm.isActive = domain.isActive;
    return orm;
  }
}