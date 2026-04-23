import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerPort } from '../../domain/ports/customer.port';
import { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerRole } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from './customer.orm-entity';
import { CustomerMapper } from '../../domain/mappers/customer.mapper';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

@Injectable()
export class CustomerRepository implements CustomerPort {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async findAll(): Promise<Customer[]> {
    const ormEntities = await this.repository.find({ where: { isActive: true } });
    return ormEntities.map(CustomerMapper.toDomain);
  }

  async findById(id: string): Promise<Customer | null> {
    const ormEntity = await this.repository.findOne({ where: { id, isActive: true } });
    if (!ormEntity) return null;
    return CustomerMapper.toDomain(ormEntity);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    if (!ormEntity) return null;
    return CustomerMapper.toDomain(ormEntity);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.repository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const ormEntity = new CustomerOrmEntity();
    ormEntity.name = dto.name;
    ormEntity.email = dto.email;
    ormEntity.password = hashedPassword;
    ormEntity.role = dto.role || CustomerRole.SENDER;
    ormEntity.isActive = true;

    const saved = await this.repository.save(ormEntity);
    return CustomerMapper.toDomain(saved);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (!ormEntity) {
      throw new CustomerNotFoundException(id);
    }

    if (dto.name) ormEntity.name = dto.name;
    if (dto.role) ormEntity.role = dto.role;

    const saved = await this.repository.save(ormEntity);
    return CustomerMapper.toDomain(saved);
  }

  async deactivate(id: string): Promise<void> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (ormEntity) {
      ormEntity.isActive = false;
      await this.repository.save(ormEntity);
    }
  }
}