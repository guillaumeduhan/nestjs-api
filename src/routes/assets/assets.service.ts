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
export class AssetsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(req: any) {
    const { body: asset, user } = req;
    if (!asset) throw new HttpException(
      "Missing body",
      HttpStatus.FORBIDDEN
    );
    if (!asset.legal_name) throw new HttpException(
      "Missing legal name",
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error } = await this.supabase
        .from('assets')
        .insert({
          ...asset,
          user_id: user.sub
        })
        .select()
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create asset',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getAll(req: any) {
    const { user } = req;
    try {
      const { data, error } = await this.supabase
        .from('assets')
        .select()
        .eq("user_id", user.sub)

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all assets of user',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('assets')
        .select('*')
        .eq('id', paramId)
        .select()
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get asset by id',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { body: asset, user } = req;
      if (!asset) throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN
      );
      if (!asset.user_id) throw new HttpException(
        "Missing user_id",
        HttpStatus.FORBIDDEN
      );
      if (asset.user_id !== user.sub) throw new HttpException(
        "Unauthorized: user doesn't have permission to update",
        HttpStatus.FORBIDDEN
      );
      const { id, ...rest } = asset;
      const { data, error } = await this.supabase
        .from('assets')
        .update({
          ...rest,
          updated_at: generateTimestamp()
        })
        .eq('id', paramId)
        .select()
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update asset',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
