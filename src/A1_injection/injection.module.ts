// src/A1_injection/injection.module.ts
import { Module } from '@nestjs/common';
import { InjectionController } from './injection.controller';
import { InjectionService } from './injection.service';
import { InsecureDb } from '../common/insecure-db.service';

@Module({
  controllers: [InjectionController],
  providers: [InjectionService, InsecureDb],
})
export class InjectionModule {}
