import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './auth/supabase/supabase.module';
import { LoggerMiddleware } from './logger.middleware';
import { supabaseProvider } from './providers/supabase.providers';
import { AddressesModule } from './routes/addresses/addresses.module';
import { AssetsModule } from './routes/assets/assets.module';
import { BankAccountsModule } from './routes/bank_accounts/bank_accounts.module';
import { DealsModule } from './routes/deals/deals.module';
import { EntitiesModule } from './routes/entities/entities.module';
import { EntitytaxesModule } from './routes/entity_taxes/entitytaxes.module';
import { IdentitiesModule } from './routes/identities/identities.module';
import { OrganizationsController } from './routes/organizations/organizations.controller';
import { OrganizationsModule } from './routes/organizations/organizations.module';
import { OrganizationsService } from './routes/organizations/organizations.service';
import { InvestmentsModule } from './routes/investments/investments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    AuthModule,
    SupabaseModule,
    OrganizationsModule,
    AssetsModule,
    AddressesModule,
    IdentitiesModule,
    EntitiesModule,
    EntitytaxesModule,
    BankAccountsModule,
    DealsModule,
    InvestmentsModule
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
