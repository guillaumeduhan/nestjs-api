import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [SupabaseModule, ConfigModule]
})
export class DocumentsModule {}
