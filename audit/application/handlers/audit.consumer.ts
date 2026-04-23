import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class AuditConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuditConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'audit-consumer',
      brokers: [this.configService.get('KAFKA_BROKER', 'localhost:9092')],
    });
    this.consumer = this.kafka.consumer({ groupId: 'audit-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'shipment.dispatched', fromBeginning: false });
    await this.consumer.subscribe({ topic: 'shipment.in_customs', fromBeginning: false });
    await this.consumer.subscribe({ topic: 'shipment.failed', fromBeginning: false });

    let offset = 0;
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const event = JSON.parse(message.value?.toString() || '{}');
        console.log(`[AUDIT] Topic: ${topic} | Partition: ${partition} | Offset: ${offset++} | ShipmentId: ${event.shipmentId} | Timestamp: ${new Date().toISOString()}`);
        this.logger.log(`[AUDIT] Traza registrada: ${topic} - ${event.shipmentId}`);
      },
    });

    this.logger.log('AuditConsumer iniciado');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}