import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // Test hot-reload - check logs for recompilation
    return 'Hello World!';
  }
}
