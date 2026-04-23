import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { SharedEventsModule } from './shared/events/shared-events.module';
import { CustomerOrmEntity } from './customers/infrastructure/persistence/customer.orm-entity';
import { ShipmentOrmEntity } from './shipments/infrastructure/persistence/shipment.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5432')),
        username: configService.get('DB_USERNAME', 'courier'),
        password: configService.get('DB_PASSWORD', 'courier123'),
        database: configService.get('DB_NAME', 'courier_db'),
        entities: [CustomerOrmEntity, ShipmentOrmEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CustomersModule,
    ShipmentsModule,
    SharedEventsModule,
    NotificationsModule,
    AuditModule,
  ],
})
export class AppModule {}