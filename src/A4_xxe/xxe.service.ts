// src/A4_xxe/xxe.service.ts
import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class XxeService {
  async parse(xml: string): Promise<any> {
    // 🔴 Does not disable external entity resolution → XXE vulnerability
    return parseStringPromise(xml, { explicitCharkey: true });
  }
}
