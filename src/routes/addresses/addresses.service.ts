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
        .from('addresses')
        .select()
        .eq("user_id", user.sub);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all addresses of user',
          message: error
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

      if (!data) {
        return {
          status: 200,
          message: "No address found"
        };
      }

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get address by id',
          message: error
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
      if (!address.user_id) throw new HttpException(
        {
          status: 401,
          error: 'Missing user_id'
        },
        HttpStatus.FORBIDDEN
      );
      if (address.user_id !== user.sub) throw new HttpException(
        {
          status: 403,
          error: "Unauthorized: user doesn't have permission to update"
        },
        HttpStatus.FORBIDDEN
      );
      const { id, ...rest } = address;
      const { data, error } = await this.supabase
        .from('addresses')
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
          error: 'Failed to update address',
          message: error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async delete(req: any, paramId: string) {
    const { user } = req;
    try {
      const { data, error } = await this.supabase
        .from('addresses')
        .delete()
        .eq('id', paramId)
        .eq('user_id', user.sub);

      if (!data) {
        return {
          status: 200,
          message: "No address found to delete"
        };
      }

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to delete address',
          message: error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
