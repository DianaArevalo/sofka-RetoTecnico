import { Injectable } from '@nestjs/common';
import { CustomerPort, CreateCustomerInput, UpdateCustomerInput } from '../../domain/ports/customer.port';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(input: CreateCustomerInput): Promise<Customer> {
    return this.customerPort.create(input);
  }
}

@Injectable()
export class GetAllCustomersUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(): Promise<Customer[]> {
    return this.customerPort.findAll();
  }
}

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.customerPort.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }
}

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.customerPort.update(id, input);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }
}

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(id: string): Promise<void> {
    const customer = await this.customerPort.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    await this.customerPort.deactivate(id);
  }
}