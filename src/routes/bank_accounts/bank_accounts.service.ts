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
  ) {}

  async create(req: any) {
    const { body: bankaccount, user } = req;
    if (!bankaccount)
      throw new HttpException(
        {
          status: 401,
          error: 'Missing bank account',
        },
        HttpStatus.FORBIDDEN,
      );
    const { account_name, entity_id } = bankaccount;
    if (!account_name || !entity_id) {
      let error;
      if (!account_name) error = 'Missing account name';
      if (!entity_id) error = 'Missing entity id';
      throw new HttpException(
        {
          status: 401,
          error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      const { data, error } = await this.supabase
        .from('bank_accounts')
        .insert({
          ...bankaccount,
          user_id: user.sub,
          entity_id: bankaccount.entity_id,
        })
        .select()
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create bank account',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', paramId)
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get bank account by id',
          message: error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { body: bankaccount, user } = req;
      if (!bankaccount)
        throw new HttpException('Missing body', HttpStatus.FORBIDDEN);
      const { id, organization_id, entity_id, ...rest } = bankaccount;

      if (!organization_id)
        throw new HttpException(
          'Missing organization_id',
          HttpStatus.FORBIDDEN,
        );

      if (!entity_id)
        throw new HttpException('Missing entity_id', HttpStatus.FORBIDDEN);

      const [members, entityDetails] = await Promise.all([
        this.organizationService.getMembers(req, organization_id),
        this.entitiesService.getById(req,entity_id)
    ]);

      const isOrgMember = members.find((x) => x.user_id === req.user.sub);
      const isEntityUser = entityDetails.find((x) => x.user_id === req.user.sub);

      if (!isOrgMember || isEntityUser)
        throw new HttpException(
          'User is not allowed to update entity',
          HttpStatus.FORBIDDEN,
        );

      const { data, error } = await this.supabase
        .from('bank_accounts')
        .update({
          ...rest,
          updated_at: generateTimestamp(),
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
          error: 'Failed to update bank account',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
