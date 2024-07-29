import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class IdentitiesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(req: any) {
    const { body: identity, user } = req;
    if (!identity) throw new HttpException(
      {
        status: 401,
        error: 'Missing identity'
      },
      HttpStatus.FORBIDDEN
    );
    const { legal_name } = identity;
    if (!legal_name) throw new HttpException(
      {
        status: 401,
        error: 'Missing identity legal name'
      },
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error } = await this.supabase
        .from('identities')
        .insert({
          ...identity,
          user_id: user.sub
        })
        .select()
        .single();

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create identity',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getAll(req: any) {
    const { user } = req;
    try {
      const { data, error } = await this.supabase
        .from('identities')
        .select()
        .eq("user_id", user.sub);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all identities of user',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('identities')
        .select('*')
        .eq('id', paramId)
        .select()
        .single();

      if (!data) {
        return {
          status: 200,
          message: "No identity found"
        };
      }

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get identity by id',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { body: identity, user } = req;
      if (!identity) throw new HttpException(
        {
          status: 401,
          error: 'Missing identity'
        },
        HttpStatus.FORBIDDEN
      );
      const { id, user_id, to_delete, ...rest } = identity;
      let obj = {
        ...rest,
        updated_by: user.sub
      }
      obj = identity.to_delete ? { // delete only if to_delete order
        ...obj,
        deleted_at: identity.to_delete ? generateTimestamp() : null,
        deleted_by: identity.to_delete ? user.sub : null
      } : { // we update only if no delete order so we keep last update date
        ...obj,
        updated_at: generateTimestamp(),
      }
      const { data, error } = await this.supabase
        .from('identities')
        .update(obj)
        .eq('id', paramId)
        .select()
        .single();

      if (error) console.log(error);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update identity',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
