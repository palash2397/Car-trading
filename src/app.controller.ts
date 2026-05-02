import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  root() {
    return 'server is running';
  }
}
