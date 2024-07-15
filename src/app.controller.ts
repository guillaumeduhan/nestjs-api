import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) { }

  @Get('ping')
  ping(@Req() req: Request) {
    return this.appService.ping(req);
  }
}