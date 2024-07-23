import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class IdentitiesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async create(req: any) {
    const { body: identity, user } = req;
    if (!identity) throw new HttpException(
      {
        status: 401,
        error: 'Missing identity'
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
          message: error
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
          message: error
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
          message: error
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
      if (!identity.user_id) throw new HttpException(
        {
          status: 401,
          error: 'Missing user_id'
        },
        HttpStatus.FORBIDDEN
      );
      if (identity.user_id !== user.sub) throw new HttpException(
        {
          status: 403,
          error: "Unauthorized: user doesn't have permission to update"
        },
        HttpStatus.FORBIDDEN
      );
      const { id, ...rest } = identity;
      const { data, error } = await this.supabase
        .from('identities')
        .update({
          ...rest,
          updated_at: generateTimestamp()
        })
        .eq('id', paramId)
        .select()
        .single();

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update identity',
          message: error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
