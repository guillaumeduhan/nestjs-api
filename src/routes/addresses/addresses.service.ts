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
export class AddressesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(req: any) {
    const { body: address, user } = req;
    if (!address) throw new HttpException(
      {
        status: 401,
        error: 'Missing address'
      },
      HttpStatus.FORBIDDEN
    );
    if (!address.nickname) throw new HttpException(
      {
        status: 401,
        error: 'Missing address nickname'
      },
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error } = await this.supabase
        .from('addresses')
        .insert({
          ...address,
          user_id: user.sub
        })
        .select()
        .single();

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create address',
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
        .from('addresses')
        .select()
        .eq("user_id", user.sub);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all addresses of user',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('addresses')
        .select('*')
        .eq('id', paramId)
        .select()
        .single();

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get address by id',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { body: address, user } = req;
      if (!address) throw new HttpException(
        {
          status: 401,
          error: 'Missing address'
        },
        HttpStatus.FORBIDDEN
      );
      const { id, user_id, to_delete, ...rest } = address;
      let obj = {
        ...rest
      }
      obj = address.to_delete ? {
        ...obj,
        deleted_at: address.to_delete ? generateTimestamp() : null,
        deleted_by: address.to_delete ? user.sub : null
      } : {
        ...obj,
        updated_by: user.sub,
        updated_at: generateTimestamp(),
      }
      const { data, error } = await this.supabase
        .from('addresses')
        .update(obj)
        .eq('id', paramId)
        .eq('user_id', user.sub)
        .select()
        .single();

      if (error) throw new HttpException(
        {
          status: error.code,
          error: 'Failed to update address',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update address',
          message: error.response.error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
