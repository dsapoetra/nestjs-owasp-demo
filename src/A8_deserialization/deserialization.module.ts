// src/A8_deserialization/deserialization.module.ts
import { Module } from '@nestjs/common';
import { DeserializationController } from './deserialization.controller';
import { DeserializationService } from './deserialization.service';

@Module({
  controllers: [DeserializationController],
  providers: [DeserializationService],
})
export class DeserializationModule {}
