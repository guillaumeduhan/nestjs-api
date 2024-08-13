import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { IdentitiesService } from '../identities/identities.service';

@Injectable()
export class SignersService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly identitiesServices: IdentitiesService
  ) { }

  async update(req: any, identityId: string) {
    try {
      const { body, user } = req;
      const { signer_id } = body;
      if (!signer_id) throw new HttpException(
        "Missing signer id",
        HttpStatus.NO_CONTENT
      );
      const updated = this.identitiesServices.update(req, identityId);

      return updated;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update signer on identity ' + identityId,
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}
