// src/A10_logging/logging.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  doWork(itemId: string): any {
    if (itemId !== '123') {
      // 🔴 Throws an error with no logging
      throw new Error(`Unknown itemId: ${itemId}`);
    }
    return { success: true, data: `Processed ${itemId}` };
  }
}
