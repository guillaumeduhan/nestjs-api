import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SlackService } from 'nestjs-slack';

@Injectable()
export class EntityTaxesService {
  constructor(
    private slackService: SlackService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(req: any) {
    const { body: entitytax, user } = req;
    if (!entitytax) {
      throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const { data, error } = await this.supabase
        .from('entities_taxes')
        .insert({
          ...entitytax,
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
      const { entity_name, id } = data;
      this.slackService.sendText(`✅ [ENTITY] Successfully created 👉 ${entity_name} 👉 id: https://v4.allocations.com/entities_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });
      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [ENTITY] Failed to create 👉 ${error.message}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create entity taxes',
          message: error.message
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('entities_taxes')
        .select('*')
        .eq('id', paramId)
        .single();

      // if (error) throw new HttpException(
      //   error.message,
      //   HttpStatus.NOT_FOUND,
      // );
      if (error) return null;
      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to get entity taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }

  async update(paramId: string, req: any) {
    try {
      const { body: entitytax, user } = req;
      if (!entitytax) {
        throw new HttpException(
          'Missing body',
          HttpStatus.FORBIDDEN,
        );
      }

      const { data, error } = await this.supabase
        .from('entities_taxes')
        .update({ ...entitytax, updated_at: generateTimestamp() })
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
      const { entity_name, id } = data;
      this.slackService.sendText(`🟢 [ENTITY] Updated 👉 ${entity_name} 👉 https://v4.allocations.com/entities_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });
      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [ENTITY] Failed to update 👉 ${error.message} 👉 https://v4.allocations.com/entities_taxes/${paramId}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException({
        status: error.status,
        error: 'Failed to update entity taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }
}
