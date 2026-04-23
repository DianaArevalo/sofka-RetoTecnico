import { Module, Global } from '@nestjs/common';
import { KafkaEventPublisher } from './infrastructure/kafka-event.publisher';

@Global()
@Module({
  providers: [
    {
      provide: 'EventPublisher',
      useClass: KafkaEventPublisher,
    },
  ],
  exports: ['EventPublisher'],
})
export class SharedEventsModule {}