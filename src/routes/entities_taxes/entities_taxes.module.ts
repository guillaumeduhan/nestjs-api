import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EntityTaxesController } from './entities_taxes.controller';
import { EntityTaxesService } from './entities_taxes.service';

@Module({
  controllers: [EntityTaxesController],
  providers: [EntityTaxesService],
  imports: [SupabaseModule, ConfigModule]
})
export class EntityTaxesModule { }