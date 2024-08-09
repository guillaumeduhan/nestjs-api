import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntitiesService } from '../entities/entities.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { Layer2Controller } from './bank_accounts.controller';
import { BankAccountService } from './bank_accounts.service';


@Module({
  controllers: [Layer2Controller],
  providers: [BankAccountService, EntitiesService, OrganizationsService],
  imports: [SupabaseModule, ConfigModule]
})
export class BankAccountsModule { }
