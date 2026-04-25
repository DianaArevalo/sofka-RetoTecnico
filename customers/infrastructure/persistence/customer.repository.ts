import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerPort, CreateCustomerInput, UpdateCustomerInput } from '../../domain/ports/customer.port';
import { Customer, CustomerRole } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from './customer.orm-entity';
import { CustomerMapper } from './customer.mapper';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';
import { v4 as uuidv4 } from 'uuid';

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

  async create(input: CreateCustomerInput): Promise<Customer> {
    const existing = await this.repository.findOne({ where: { email: input.email } });
    if (existing) {
      throw new EmailAlreadyExistsException(input.email);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const now = new Date();
    const ormEntity = this.repository.create({
      id: uuidv4(),
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: (input.role || CustomerRole.SENDER) as unknown as number,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.repository.save(ormEntity);
    return CustomerMapper.toDomain(saved);
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (!ormEntity) {
      throw new CustomerNotFoundException(id);
    }

    if (input.name) ormEntity.name = input.name;
    if (input.role) ormEntity.role = input.role as unknown as number;

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