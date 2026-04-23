import { Module } from '@nestjs/common';
import { NotificationsConsumer } from './application/handlers/notifications.consumer';
import { AuditConsumer } from '../audit/application/handlers/audit.consumer';

@Module({
  providers: [NotificationsConsumer, AuditConsumer],
  exports: [NotificationsConsumer, AuditConsumer],
})
export class NotificationsModule {}