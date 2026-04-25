import { Customer, CustomerRole } from '../entities/customer.entity';

export interface CreateCustomerInput {
  name: string;
  email: string;
  password: string;
  role?: CustomerRole;
}

export interface UpdateCustomerInput {
  name?: string;
  role?: CustomerRole;
}

export interface CustomerPort {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(input: CreateCustomerInput): Promise<Customer>;
  update(id: string, input: UpdateCustomerInput): Promise<Customer>;
  deactivate(id: string): Promise<void>;
}