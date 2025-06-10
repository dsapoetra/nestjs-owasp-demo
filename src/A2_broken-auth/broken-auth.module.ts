// src/A2_broken-auth/broken-auth.module.ts
import { Module } from '@nestjs/common';
import { BrokenAuthController } from './broken-auth.controller';
import { BrokenAuthService } from './broken-auth.service';

@Module({
  controllers: [BrokenAuthController],
  providers: [BrokenAuthService],
})
export class BrokenAuthModule {}
