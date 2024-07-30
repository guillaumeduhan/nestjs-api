import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';

@Injectable()
export class EntityTaxesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async create(req: any, entityTaxData: any) {
    const { user } = req;
    if (!entityTaxData.entity_id) {
      throw new HttpException(
        {
          status: 400,
          error: "Missing required 'entity_id'",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    entityTaxData.owner_id = user.sub;

    try {
      const { data, error } = await this.supabase
        .from('entity_taxes')
        .insert([entityTaxData])
        .select('*');

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

  async getById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('entity_taxes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new HttpException(
          {
            status: 404,
            error: 'Entity tax record not found',
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

  async update(id: string, updates: any, req: any) {
    const { user } = req;
    const entityTax = await this.getById(id);

    if (!entityTax) {
      throw new HttpException(
        {
          status: 404,
          error: 'Entity tax not found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (entityTax.owner_id !== user.sub) {
      throw new HttpException(
        {
          status: 403,
          error: "Unauthorized: user doesn't have permission to update",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const updatesToApply = Object.keys(updates).reduce((acc, key) => {
      if (updates[key] !== entityTax[key]) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    if (Object.keys(updatesToApply).length === 0) {
      return { message: 'No changes detected', status: 204 };
    }

    try {
      const { data, error } = await this.supabase
        .from('entity_taxes')
        .update(updatesToApply)
        .eq('id', id)
        .select()
        .single();

      if (error) {
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
      throw new HttpException(
        {
          status: 500,
          error: 'Internal Server Error',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}