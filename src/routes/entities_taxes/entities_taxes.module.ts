import { Module } from '@nestjs/common';
import { EntitiesTaxesController } from './entities_taxes.controller';
import { EntitiesTaxesService } from './entities_taxes.service';

@Module({
  controllers: [EntitiesTaxesController],
  providers: [EntitiesTaxesService]
})
export class EntitiesTaxesModule {}
