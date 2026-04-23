import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomerOrmEntity } from './infrastructure/persistence/customer.orm-entity';
import { CustomerRepository } from './infrastructure/persistence/customer.repository';
import { CreateCustomerUseCase, GetAllCustomersUseCase, GetCustomerByIdUseCase, UpdateCustomerUseCase, DeleteCustomerUseCase } from './application/use-cases/customer.use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    CustomerRepository,
    CreateCustomerUseCase,
    GetAllCustomersUseCase,
    GetCustomerByIdUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [CustomerRepository],
})
export class CustomersModule {}