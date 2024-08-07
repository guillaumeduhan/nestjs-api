import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { EntitiesService } from '../entities/entities.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class BankaccountsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private entitiesService: EntitiesService,
    private organizationService: OrganizationsService,
  ) { }

  async create(req: any) {
    const { body: bankaccount, user } = req;
    if (!bankaccount) throw new HttpException(
      'Missing body',
      HttpStatus.FORBIDDEN,
    );
    const { account_name } = bankaccount;
    if (!account_name) {
      let error;
      if (!account_name) error = 'Missing account name';
      throw new HttpException(
        error,
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      const { data, error } = await this.supabase
        .from('bank_accounts')
        .insert({
          ...bankaccount,
          user_id: user.sub
        })
        .select()
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create bank account',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  };

  async getAll(req: any) {
    try {
      const organizations = await this.organizationService.getAll(req);

      if (!organizations.length) {
        return [];
      }

      const organizationIds = organizations.map(org => org.id);

      const { data: bankAccounts, error } = await this.supabase
        .from('bank_accounts')
        .select('*, organizations(*)')
        .in('organization_id', organizationIds);

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return bankAccounts
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get bank accounts.',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  };

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('bank_accounts')
        .select('*, entities(*, organizations(*))')
        .eq('id', paramId)
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get bank account by id',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  };

  async update(req: any, paramId: string) {
    // bank_account: only user can update for now — security precaution
    try {
      const { body: bankaccount, user } = req;
      if (!bankaccount) throw new HttpException('Missing body', HttpStatus.FORBIDDEN);

      if (bankaccount.user_id != user.sub) throw new HttpException('User is not allowed to update bank_account because he is not the owner', HttpStatus.FORBIDDEN);

      const { id, organization_id, ...rest } = bankaccount;

      if (!organization_id)
        throw new HttpException(
          'Missing organization_id',
          HttpStatus.FORBIDDEN,
        );

      const members = await this.organizationService.getMembers(
        req,
        organization_id,
      );

      const found = members.find((x) => x.user_id === req.user.sub);

      if (!found)
        throw new HttpException(
          'User is not allowed to update bank account',
          HttpStatus.FORBIDDEN,
        );

      const { data, error } = await this.supabase
        .from('bank_accounts')
        .update({
          ...rest,
          updated_at: generateTimestamp(),
          updated_by: user.sub
        })
        .eq('id', paramId)
        .select()
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to update bank account',
        message: error.message,
      }, HttpStatus.FORBIDDEN);
    }
  };
}
