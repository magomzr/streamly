import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    let string = 'Hello World!';
    return string;
  }
}
