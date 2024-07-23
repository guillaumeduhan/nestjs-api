import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SupabaseModule, ConfigModule],
  controllers: [AddressesController],
  providers: [AddressesService]
})
export class AddressesModule {}
