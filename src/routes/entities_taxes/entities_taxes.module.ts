import { SupabaseModule } from '@/auth/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack';
import { EntityTaxesController } from './entities_taxes.controller';
import { EntityTaxesService } from './entities_taxes.service';

@Module({
  controllers: [EntityTaxesController],
  providers: [EntityTaxesService],
  imports: [SupabaseModule, ConfigModule,
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
    })
  ],
})
export class EntityTaxesModule { }