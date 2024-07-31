import { Module } from '@nestjs/common';
import { EntityTaxesController } from './entitytaxes.controller';
import { EntityTaxesService } from './entitytaxes.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [EntityTaxesController],
  providers: [EntityTaxesService],
  imports: [SupabaseModule, ConfigModule]

})
export class EntitytaxesModule {}