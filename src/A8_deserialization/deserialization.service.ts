// src/A8_deserialization/deserialization.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeserializationService {
  runScript(script: string): any {
    // 🔴 Deadly insecure: `eval()` on user‐provided string
    return eval(script);
  }
}
