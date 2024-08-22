import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(req: any): any {
    return {
      status: 'Tax API v4 running well',
      date: new Date(),
      url: req.url,
      headers: Object.assign({}, req.headers),
    }
  }
}
