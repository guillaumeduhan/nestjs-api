import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsService } from '../organizations/organizations.service';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';

@Module({
  imports: [SupabaseModule, ConfigModule],
  controllers: [EntitiesController],
  providers: [EntitiesService, OrganizationsService]
})
export class EntitiesModule { }