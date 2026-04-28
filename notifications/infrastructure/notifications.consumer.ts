import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class NotificationsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'notifications-consumer',
      brokers: [this.configService.get('KAFKA_BROKER', 'localhost:9092')],
    });
    this.consumer = this.kafka.consumer({ groupId: 'notifications-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'shipment.dispatched', fromBeginning: false });
    await this.consumer.subscribe({ topic: 'shipment.in_customs', fromBeginning: false });
    await this.consumer.subscribe({ topic: 'shipment.failed', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const event = JSON.parse(message.value?.toString() || '{}');
        this.logger.log(`[NOTIFICATION] Envío dispatched: ${JSON.stringify(event)}`);
        console.log(`[NOTIFICATIONS] Notificación enviada: Envío ${event.shipmentId} - Estado: ${event.status} - Valor: $${event.declaredValue} - Timestamp: ${event.timestamp}`);
      },
    });

    this.logger.log('NotificationsConsumer iniciado');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}