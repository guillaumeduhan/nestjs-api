import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Supabase } from '@/auth/supabase';
import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { SupabaseStrategy } from '@/auth/supabase/supabase.strategy';
import { supabaseProvider } from '@/providers/supabase.providers';

@Module({
  imports: [ConfigModule],
  providers: [Supabase, SupabaseStrategy, SupabaseGuard, supabaseProvider],
  exports: [Supabase, SupabaseStrategy, SupabaseGuard, supabaseProvider],
})
export class SupabaseModule { }