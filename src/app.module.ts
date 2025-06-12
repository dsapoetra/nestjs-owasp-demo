// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

import { InsecureDb } from './common/insecure-db.service';

// → Import all your OWASP feature modules here:
import { InjectionModule } from './A1_injection/injection.module';
import { BrokenAuthModule } from './A2_broken-auth/broken-auth.module';
import { SensitiveDataModule } from './A3_sensitive-data/sensitive-data.module';
import { XxeModule } from './A4_xxe/xxe.module';
import { AccessControlModule } from './A5_access-control/access-control.module';
import { MisconfigModule } from './A6_misconfig/misconfig.module';
import { XssModule } from './A7_xss/xss.module';
import { DeserializationModule } from './A8_deserialization/deserialization.module';
import { VulnerableComponentsModule } from './A9_vulnerable-components/vulnerable-components.module';
import { LoggingModule } from './A10_logging/logging.module';

@Module({
  imports: [
    // 1) Make ConfigModule global, load + validate .env
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    // 2) All your feature modules
    InjectionModule,
    BrokenAuthModule,
    SensitiveDataModule,
    XxeModule,
    AccessControlModule,
    MisconfigModule,
    XssModule,
    DeserializationModule,
    VulnerableComponentsModule,
    LoggingModule,
  ],
  // 3) Register your InsecureDb so ConfigService is injected properly
  providers: [InsecureDb],
  exports: [InsecureDb],
})
export class AppModule {}
