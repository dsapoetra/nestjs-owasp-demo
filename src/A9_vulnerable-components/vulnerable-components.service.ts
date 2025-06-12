/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/A9_vulnerable-components/vulnerable-components.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class VulnerableComponentsService {
  /**
   * Vulnerable merge: if payload contains __proto__, we
   * copy each key/value into Object.prototype itself,
   * causing all new objects to inherit them.
   */
  merge(payload: any): any {
    if (payload && typeof payload.__proto__ === 'object') {
      const protoProps = payload.__proto__;
      for (const key of Object.keys(protoProps)) {
        // Directly pollute the global prototype
        (Object.prototype as any)[key] = protoProps[key];
      }
    }

    // Return a default object whose own props don’t shadow the polluted ones
    return { name: 'guest' };
  }
}
