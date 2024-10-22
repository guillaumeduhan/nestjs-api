import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InvestmentTaxesController } from './investments_taxes.controller';
import { InvestmentsTaxesService } from './investments_taxes.service';

@Module({
  controllers: [InvestmentTaxesController],
  providers: [InvestmentsTaxesService],
  imports: [SupabaseModule, ConfigModule]
})
export class InvestmentsTaxesModule { }
