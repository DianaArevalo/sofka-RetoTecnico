import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { EventPublisherPort } from '../ports/event-publisher.port';
import { ShipmentEvent } from '../../../shipments/domain/entities/shipment-event.entity';

@Injectable()
export class KafkaEventPublisher implements EventPublisherPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaEventPublisher.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get('KAFKA_CLIENT_ID', 'courier-api'),
      brokers: [this.configService.get('KAFKA_BROKER', 'localhost:9092')],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    this.logger.log('Kafka producer disconnected');
  }

  async publish(topic: string, event: ShipmentEvent): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: event.shipmentId,
          value: JSON.stringify(event),
        },
      ],
    });
    this.logger.log(`Evento publicado en topic ${topic}: ${event.shipmentId}`);
  }
}