// src/A9_vulnerable-components/vulnerable-components.module.ts
import { Module } from '@nestjs/common';
import { VulnerableComponentsController } from './vulnerable-components.controller';
import { VulnerableComponentsService } from './vulnerable-components.service';

@Module({
  controllers: [VulnerableComponentsController],
  providers: [VulnerableComponentsService],
})
export class VulnerableComponentsModule {}
