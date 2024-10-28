import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './auth/supabase/supabase.module';
import { LoggerMiddleware } from './logger.middleware';
import { supabaseProvider } from './providers/supabase.providers';
import { EntityTaxesModule } from './routes/entities_taxes/entities_taxes.module';
import { InvestmentsTaxesModule } from './routes/investments_taxes/investments_taxes.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SlackModule.forRoot({
      type: 'webhook',
      channels: [
        {
          name: "taxes-v4",
          url: "https://hooks.slack.com/services/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"
        },
        {
          name: "taxes-logs-v4",
          url: "https://hooks.slack.com/services/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"
        }
      ]
    }),
    AuthModule,
    SupabaseModule,
    EntityTaxesModule,
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
