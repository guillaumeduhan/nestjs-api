import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(req: any): any {
    return {
      status: 'API running',
      date: new Date(),
      url: req.url,
      headers: Object.assign({}, req.headers),
    }
  }
}
