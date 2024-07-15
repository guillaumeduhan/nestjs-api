import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './auth/supabase/supabase.module';
import { OrganizationsModule } from './routes/organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    AuthModule,
    SupabaseModule,
    OrganizationsModule
  ],
  controllers: [
    AppController,
    AuthController
  ],
  providers: [
    AppService
  ],
})
export class AppModule { }
