// src/A5_access-control/access-control.module.ts
import { Module } from '@nestjs/common';
import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './access-control.service';

@Module({
  controllers: [AccessControlController],
  providers: [AccessControlService],
})
export class AccessControlModule {}
