import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { SignersController } from './signers.controller';
import { SignersService } from './signers.service';

@Module({
  imports: [SupabaseModule],
  controllers: [SignersController],
  providers: [SignersService]
})
export class SignersModule { }
