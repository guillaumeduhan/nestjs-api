import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class EntityTaxesService {
  constructor(
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
        .from('entity_taxes')
        .insert({
          ...entitytax,
          owner_id: user.sub,
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
      return data;
    } catch (error) {
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
        .from('entity_taxes')
        .select('*')
        .eq('id', paramId)
        .single();
      if (error) throw new HttpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to create entity taxes',
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

      const currentData = await this.getById(paramId, req);
      if (currentData.owner_id !== user.sub) {
        throw new HttpException(
          "Unauthorized: user doesn't have permission to update",
          HttpStatus.FORBIDDEN,
        );
      }

      const { data, error } = await this.supabase
        .from('entity_taxes')
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

      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to update entity taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }
}
