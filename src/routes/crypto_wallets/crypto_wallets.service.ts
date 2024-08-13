import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class CryptoWalletsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(req: any) {
    const { body: wallet, user } = req;
    if (!wallet) throw new HttpException('Missing body', HttpStatus.FORBIDDEN);

    const { name, organization_id, deal_id } = wallet;
    if (!name || !organization_id || !deal_id) {
      let error;
      if (!name) error = 'Missing wallet name';
      if (!organization_id) error = 'Missing organization ID';
      if (!deal_id) error = 'Missing deal ID';
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }

    try {
      const { data, error } = await this.supabase
        .from('wallets')
        .insert({
          ...wallet,
          user_id: user.sub,
        })
        .select()
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create wallet',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAll(req: any, dealId: string) {
    try {
      const { user } = req;

      const { data: wallets, error } = await this.supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.sub)

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return wallets;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get wallets',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('wallets')
        .select('*')
        .eq('id', paramId)
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get wallet by id',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { body: wallet, user } = req;
      if (!wallet)
        throw new HttpException('Missing body', HttpStatus.FORBIDDEN);

      const { id, ...rest } = wallet;

      const { data, error } = await this.supabase
        .from('wallets')
        .update({
          ...rest,
          updated_at: generateTimestamp(),
          updated_by: user.sub,
        })
        .eq('id', paramId)
        .select()
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update wallet',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
