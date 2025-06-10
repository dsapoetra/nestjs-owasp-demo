// src/A7_xss/xss.module.ts
import { Module } from '@nestjs/common';
import { XssController } from './xss.controller';
import { XssService } from './xss.service';

@Module({
  controllers: [XssController],
  providers: [XssService],
})
export class XssModule {}
