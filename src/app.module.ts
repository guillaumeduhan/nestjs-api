import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './auth/supabase/supabase.module';
import { LoggerMiddleware } from './logger.middleware';
import { supabaseProvider } from './providers/supabase.providers';
import { AssetsModule } from './routes/assets/assets.module';
import { OrganizationsController } from './routes/organizations/organizations.controller';
import { OrganizationsModule } from './routes/organizations/organizations.module';
import { OrganizationsService } from './routes/organizations/organizations.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    AuthModule,
    SupabaseModule,
    OrganizationsModule,
    AssetsModule
  ],
  controllers: [
    AppController,
    AuthController,
    OrganizationsController
  ],
  providers: [
    AppService,
    OrganizationsService,
    supabaseProvider
  ],
  exports: [
    supabaseProvider
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
