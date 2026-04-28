import { Module, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsController } from './shipments.controller';
import { ShipmentOrmEntity } from './infrastructure/persistence/shipment.orm-entity';
import { ShipmentRepository } from './infrastructure/persistence/shipment.repository';
import { CreateShipmentUseCase, GetShipmentByIdUseCase, GetShipmentsByCustomerUseCase } from './application/use-cases/shipment.use-cases';
import { StandardShippingStrategy, ExpressShippingStrategy, InternationalShippingStrategy, ThirdPartyCarrierShippingStrategy } from './application/strategies/shipping-strategies';
import { SharedEventsModule } from '../shared/events/shared-events.module';
import { CustomersModule } from '../customers/customers.module';
import { ShipmentType } from './domain/entities/shipment-type.value-object';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentOrmEntity]),
    SharedEventsModule,
    CustomersModule,
  ],
  controllers: [ShipmentsController],
  providers: [
    ShipmentRepository,
    {
      provide: 'ShipmentPort',
      useExisting: ShipmentRepository,
    },
    StandardShippingStrategy,
    ExpressShippingStrategy,
    InternationalShippingStrategy,
    ThirdPartyCarrierShippingStrategy,
    CreateShipmentUseCase,
    GetShipmentByIdUseCase,
    GetShipmentsByCustomerUseCase,
    {
      provide: 'SHIPPING_STRATEGIES',
      useFactory: (
        std: StandardShippingStrategy,
        exp: ExpressShippingStrategy,
        intl: InternationalShippingStrategy,
        tpc: ThirdPartyCarrierShippingStrategy,
      ) => new Map<ShipmentType, any>([
        [ShipmentType.STANDARD, std],
        [ShipmentType.EXPRESS, exp],
        [ShipmentType.INTERNATIONAL, intl],
        [ShipmentType.THIRD_PARTY_CARRIER, tpc],
      ]),
      inject: [StandardShippingStrategy, ExpressShippingStrategy, InternationalShippingStrategy, ThirdPartyCarrierShippingStrategy],
    },
  ],
  exports: [ShipmentRepository],
})
export class ShipmentsModule {}