/* eslint-disable @typescript-eslint/require-await */
// src/A3_sensitive-data/sensitive-data.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SensitiveDataService {
  // 🔴 In‐memory “database” of credit card details
  private readonly cards = [
    { userId: '1', ccNumber: '4111111111111111', expiry: '12/25', cvv: '123' },
    { userId: '2', ccNumber: '5555555555554444', expiry: '10/24', cvv: '999' },
  ];

  async getCreditCard(userId: string): Promise<any> {
    // 🔴 Returns full data, including CVV
    const card = this.cards.find((c) => c.userId === userId);
    if (!card) return { message: 'Not found' };
    return card;
  }
}
