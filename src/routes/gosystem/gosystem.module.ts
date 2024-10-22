import { Module } from '@nestjs/common';
import { GosystemController } from './gosystem.controller';
import { GosystemService } from './gosystem.service';

@Module({
  controllers: [GosystemController],
  providers: [GosystemService]
})
export class GosystemModule {}
