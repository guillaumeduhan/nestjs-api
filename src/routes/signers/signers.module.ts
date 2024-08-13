import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentitiesService } from '../identities/identities.service';
import { SignersController } from './signers.controller';
import { SignersService } from './signers.service';

@Module({
  imports: [SupabaseModule, ConfigModule],
  controllers: [SignersController],
  providers: [SignersService, IdentitiesService]
})
export class SignersModule { }
