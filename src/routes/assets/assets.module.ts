import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [SupabaseModule, ConfigModule],
  providers: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule { }
