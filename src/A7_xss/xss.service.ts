// src/A7_xss/xss.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class XssService {
  wrapHtml(input: string): string {
    // 🔴 Direct interpolation → XSS
    return `<html>
      <body>
        <h1>User Message:</h1>
        <div>${input}</div>
      </body>
    </html>`;
  }
}
