import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsService } from '../organizations/organizations.service';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';

@Module({
  imports: [SupabaseModule, ConfigModule],
  controllers: [DealsController],
  providers: [DealsService, OrganizationsService]
})
export class DealsModule { }
