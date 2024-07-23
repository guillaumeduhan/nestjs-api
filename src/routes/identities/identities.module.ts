import { Module } from '@nestjs/common';
import { IdentitiesController } from './identities.controller';
import { IdentitiesService } from './identities.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [SupabaseModule, ConfigModule],
  controllers: [IdentitiesController],
  providers: [IdentitiesService]
})
export class IdentitiesModule {}
