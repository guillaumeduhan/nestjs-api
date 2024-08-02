import { Module } from '@nestjs/common';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsService } from '../organizations/organizations.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';

@Module({
  controllers: [InvestmentsController],
  providers: [InvestmentsService, OrganizationsService],
  imports: [ SupabaseModule, ConfigModule]
})
export class InvestmentsModule {}