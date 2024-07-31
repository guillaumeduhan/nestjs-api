import { Module } from '@nestjs/common';
import { BankaccountsController } from './bankaccounts.controller';
import { BankaccountsService } from './bankaccounts.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { EntitiesService } from '../entities/entities.service';
import { OrganizationsService } from '../organizations/organizations.service';


@Module({
  controllers: [BankaccountsController],
  providers: [BankaccountsService, EntitiesService, OrganizationsService],
  imports: [SupabaseModule, ConfigModule]
})
export class BankaccountsModule { }
