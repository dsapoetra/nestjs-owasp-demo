// src/A9_vulnerable-components/vulnerable-components.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';

@Injectable()
export class VulnerableComponentsService {
  /**
   * Vulnerable merge: if payload contains __proto__, we
   * set that object as the prototype of Object.prototype,
   * causing global prototype pollution.
   */
  merge(payload: any): any {
    if (payload && typeof payload.__proto__ === 'object') {
      // Pollute the global Object prototype
      Object.setPrototypeOf(Object.prototype, payload.__proto__);
    }

    // Return a fresh object that has its own isAdmin:false
    return { isAdmin: false, name: 'guest' };
  }
}
