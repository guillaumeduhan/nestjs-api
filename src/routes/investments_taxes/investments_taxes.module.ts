import { Module } from '@nestjs/common';
import { InvestmentsTaxesController } from './investments_taxes.controller';
import { InvestmentsTaxesService } from './investments_taxes.service';

@Module({
  controllers: [InvestmentsTaxesController],
  providers: [InvestmentsTaxesService]
})
export class InvestmentsTaxesModule {}
