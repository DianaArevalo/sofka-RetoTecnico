import { Module } from '@nestjs/common';
import { AuditConsumer } from './application/handlers/audit.consumer';

@Module({
  providers: [AuditConsumer],
  exports: [AuditConsumer],
})
export class AuditModule {}