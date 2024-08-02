import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { identity } from 'rxjs';


@Injectable()
export class IdentitiesKycChecksService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    ) { }

    async create(req: any) {
        const { body: identities_kyc_checks, user } = req;
        if (!identities_kyc_checks) throw new HttpException(
            "Missing body",
            HttpStatus.FORBIDDEN
        );

        const { identity_id } = identities_kyc_checks;
        if (!identity_id) throw new HttpException(
            "Missing identity_id",
            HttpStatus.FORBIDDEN
        );
        try {
            const { data, error} = await this.supabase
            .from('identity_kyc_checks')
            .insert({
                ...identities_kyc_checks,
                identity_id
        })
        .select()
        .single();

        if (error) throw new HttpException(
            error.message,
            HttpStatus.FORBIDDEN
          );
    
          return data;
        } catch (error) {
            throw new HttpException(
                {
                    status: error.status,
                    error: 'Failed to create identity kyc checks',
                    message: error.message
                },
                HttpStatus.FORBIDDEN
            );
        }
    }

    async getById(paramId: string) {
        try {
            const { data, error } = await this.supabase
            .from('identity_kyc_checks')
            .select('*')
            .eq('id', paramId)
            .select()
            .single();

            if (error) throw new HttpException(
                error.message,
                HttpStatus.FORBIDDEN
              );
        
              return data;
        } catch (error) {
            throw new HttpException(
                {
                    status: error.status,
                    error: 'Failed to get identity kyc data by id',
                    message: error.message
                },
                HttpStatus.FORBIDDEN
            );
        }
    }




}
