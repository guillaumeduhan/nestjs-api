import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { generateTimestamp } from '@/common/helpers/utils';

@Injectable()
export class EntityTaxesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async create(req: any) {
    const { body: entitytax, user } = req;
    if (!entitytax || !entitytax.entity_id) {
      throw new HttpException(
        {
          status: 400,
          error: "Missing required 'entity_id'",
        },
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
          {
            status: 500,
            error: error.message || 'Failed to create entity tax',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          error: 'Internal Server Error',
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
      if (!data) {
        throw new HttpException(
          {
            status: 404,
            error: 'Entity tax record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          error: 'Internal Server Error',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(paramId: string, req: any) {
    try {
      const { body: entitytax, user } = req;
      if (!entitytax) {
        throw new HttpException(
          {
            status: 401,
            error: 'Missing entity tax data',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const currentData = await this.getById(paramId, req);
      if (currentData.owner_id !== user.sub) {
        throw new HttpException(
          {
            status: 403,
            error: "Unauthorized: user doesn't have permission to update",
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // Remove the reference to updated_by and any other non-existing fields
      const updatesToApply = { ...entitytax, updated_at: generateTimestamp() }; // Only include fields that exist in your database
      const { data, error } = await this.supabase
        .from('entity_taxes')
        .update(updatesToApply)
        .eq('id', paramId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        throw new HttpException(
          {
            status: 500,
            error: error.message || 'Failed to update entity tax',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return data;
    } catch (error) {
      console.error('Update error:', error);
      throw new HttpException(
        {
          status: 500,
          error: 'Internal Server Error',
          message: error.message || error.toString(),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
