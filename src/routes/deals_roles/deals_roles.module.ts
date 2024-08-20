import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsService } from '../organizations/organizations.service';
import { DealsRolesController } from './deals_roles.controller';
import { DealsRolesService } from './deals_roles.service';

@Module({
  imports: [SupabaseModule, ConfigModule],
  controllers: [DealsRolesController],
  providers: [DealsRolesService, OrganizationsService]
})
export class DealsRolesModule { }
