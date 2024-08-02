import { Module } from '@nestjs/common';
import { IdentitiesKycChecksController } from './identities_kyc_checks.controller';
import { IdentitiesKycChecksService } from './identities_kyc_checks.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [IdentitiesKycChecksController],
  providers: [IdentitiesKycChecksService],
  imports: [SupabaseModule, ConfigModule]
})
export class IdentitiesKycChecksModule {}
