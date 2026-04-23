import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../entities/customer.entity';

export interface CustomerPort {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(dto: CreateCustomerDto): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
  deactivate(id: string): Promise<void>;
}