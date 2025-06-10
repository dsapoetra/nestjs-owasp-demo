// src/A6_misconfig/misconfig.module.ts
import { Module } from '@nestjs/common';
import { MisconfigController } from './misconfig.controller';

@Module({
  controllers: [MisconfigController],
})
export class MisconfigModule {}
