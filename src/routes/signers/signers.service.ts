import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SignersService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) { }

  async create(req: any) {
    try {
      const { body, user } = req;
      if (!body) throw new HttpException(
        "Missing body",
        HttpStatus.NO_CONTENT
      );
      const { parent_identity_id, child_identity_id } = body;
      if (!parent_identity_id || !child_identity_id) {
        let error;
        if (!child_identity_id) error = "Missing child identity id."
        if (!parent_identity_id) error = "Missing parent identity id."
        throw new HttpException(
          error,
          HttpStatus.NO_CONTENT
        )
      }
      const { data, error }: any = await this.supabase
        .from("signers")
        .insert({
          name,
          ...body,
          user_id: user.sub,
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
          error: 'Failed to create signer',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
