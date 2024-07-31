import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntitiesService } from '../entities/entities.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { BankaccountsController } from './bank_accounts.controller';
import { BankaccountsService } from './bank_accounts.service';


@Module({
  controllers: [BankaccountsController],
  providers: [BankaccountsService, EntitiesService, OrganizationsService],
  imports: [SupabaseModule, ConfigModule]
})
export class BankAccountsModule { }
