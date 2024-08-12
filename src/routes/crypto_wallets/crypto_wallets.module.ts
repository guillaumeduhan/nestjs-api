import { Module } from '@nestjs/common';
import { CryptoWalletsController } from './crypto_wallets.controller';
import { CryptoWalletsService } from './crypto_wallets.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  controllers: [CryptoWalletsController],
  providers: [CryptoWalletsService],
  imports: [SupabaseModule, ConfigModule]
})
export class CryptoWalletsModule {}
