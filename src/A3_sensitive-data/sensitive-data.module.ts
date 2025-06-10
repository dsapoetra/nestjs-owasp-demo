// src/A3_sensitive-data/sensitive-data.module.ts
import { Module } from '@nestjs/common';
import { SensitiveDataController } from './sensitive-data.controller';
import { SensitiveDataService } from './sensitive-data.service';

@Module({
  controllers: [SensitiveDataController],
  providers: [SensitiveDataService],
})
export class SensitiveDataModule {}
