// src/A4_xxe/xxe.module.ts
import { Module } from '@nestjs/common';
import { XxeController } from './xxe.controller';
import { XxeService } from './xxe.service';

@Module({
  controllers: [XxeController],
  providers: [XxeService],
})
export class XxeModule {}
