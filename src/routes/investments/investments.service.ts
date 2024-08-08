import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class InvestmentsService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly organizationsService: OrganizationsService,
  ) { }

  async create(req: any) {
    const { body: investments, user } = req;
    if (!investments)
      throw new HttpException('Missing body', HttpStatus.FORBIDDEN);
    const { amount } = investments;
    if (!amount) {
      let error;
      if (!amount) error = 'Missing amount';
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .insert({
          ...investments,
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
          error: 'Failed to create Investments',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAll(req: any) {
    try {
      const organizations = await this.organizationsService.getAll(req);

      if (!organizations.length) {
        return [];
      }

      const organizationIds = organizations.map((org) => org.id);
      const { data: investments, error } = await this.supabase
        .from('investments')
        .select('*, deals(*, organizations(*))')
        .in('organization_id', organizationIds);

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return investments;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all investments',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('id', paramId)
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get investments by id',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
