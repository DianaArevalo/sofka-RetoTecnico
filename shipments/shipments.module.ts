import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsController } from './shipments.controller';
import { ShipmentOrmEntity } from './infrastructure/persistence/shipment.orm-entity';
import { ShipmentRepository } from './infrastructure/persistence/shipment.repository';
import { CreateShipmentUseCase, GetShipmentByIdUseCase, GetShipmentsByCustomerUseCase } from './application/use-cases/shipment.use-cases';
import { SharedEventsModule } from '../shared/events/shared-events.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentOrmEntity]),
    SharedEventsModule,
    CustomersModule,
  ],
  controllers: [ShipmentsController],
  providers: [
    ShipmentRepository,
    CreateShipmentUseCase,
    GetShipmentByIdUseCase,
    GetShipmentsByCustomerUseCase,
  ],
  exports: [ShipmentRepository],
})
export class ShipmentsModule {}