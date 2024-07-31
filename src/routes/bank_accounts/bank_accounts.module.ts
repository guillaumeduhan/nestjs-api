import { Module } from '@nestjs/common';
import { BankaccountsController } from './bank_accounts.controller';
import { BankaccountsService } from './bank_accounts.service';
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
