import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './auth/supabase/supabase.module';
import { LoggerMiddleware } from './logger.middleware';
import { supabaseProvider } from './providers/supabase.providers';
import { EntitiesTaxesModule } from './routes/entities_taxes/entities_taxes.module';
import { InvestmentsTaxesModule } from './routes/investments_taxes/investments_taxes.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    AuthModule,
    SupabaseModule,
    EntitiesTaxesModule,
    InvestmentsTaxesModule
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [
    AppService,
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
