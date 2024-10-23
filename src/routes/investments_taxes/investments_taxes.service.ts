import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SlackService } from 'nestjs-slack';

@Injectable()
export class InvestmentsTaxesService {
  constructor(
    private slackService: SlackService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(req: any) {
    const { body: investmentTax, user } = req;
    if (!investmentTax) {
      throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const { data, error } = await this.supabase
        .from('investments_taxes')
        .insert({
          ...investmentTax,
          created_at: generateTimestamp(),
        })
        .select('*')
        .single();

      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.FORBIDDEN,
        );
      }
      const { id } = data;
      this.slackService.sendText(`✅ [INVESTMENT] Successfully created 👉 https://v4.allocations.com/investments_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });
      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [INVESTMENT] Failed to create 👉 ${error.message}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create investment taxes',
          message: error.message
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('investments_taxes')
        .select('*')
        .eq('id', paramId)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to get investment taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }

  async update(paramId: string, req: any) {
    try {
      const { body: investmentTax, user } = req;
      if (!investmentTax) {
        throw new HttpException(
          'Missing body',
          HttpStatus.FORBIDDEN,
        );
      }

      const { data, error } = await this.supabase
        .from('investments_taxes')
        .update({ ...investmentTax, updated_at: generateTimestamp() })
        .eq('id', paramId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.FORBIDDEN,
        );
      }

      const { id } = data;
      this.slackService.sendText(`🟢 [INVESTMENT] Updated 👉 https://v4.allocations.com/investments_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });
      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [INVESTMENT] Failed to update 👉 ${error.message} 👉 https://v4.allocations.com/investments_taxes/${paramId}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException({
        status: error.status,
        error: 'Failed to update investment taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }
}
