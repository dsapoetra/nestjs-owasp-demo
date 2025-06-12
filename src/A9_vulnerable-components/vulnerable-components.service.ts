/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/A9_vulnerable-components/vulnerable-components.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class VulnerableComponentsService {
  /**
   * Vulnerable merge: if payload contains __proto__, we
   * set that object as the prototype of Object.prototype,
   * causing global prototype pollution.
   */
  merge(payload: any): any {
    // Directly set payload.__proto__ onto Object.prototype
    if (payload && typeof payload.__proto__ === 'object') {
      // This line pollutes the global prototype
      Object.setPrototypeOf(Object.prototype, payload.__proto__);
    }

    // Return some default object to show merge did not alter its own props
    return { isAdmin: false, name: 'guest' };
  }
}
