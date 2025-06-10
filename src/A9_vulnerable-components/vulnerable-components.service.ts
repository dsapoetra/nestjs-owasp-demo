/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/A9_vulnerable-components/vulnerable-components.service.ts
import { Injectable } from '@nestjs/common';
// 🔴 Vulnerable lodash version
import * as _ from 'lodash';

@Injectable()
export class VulnerableComponentsService {
  private default = { isAdmin: false, name: 'guest' };

  mergeObjects(userInput: any): any {
    // 🔴 lodash@4.17.4’s merge is vulnerable to prototype pollution
    const result = _.merge({}, this.default, userInput);
    return result;
  }
}
