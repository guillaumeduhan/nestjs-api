import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class DealsRolesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly organizationsService: OrganizationsService
  ) { }

  async create(req: any) {
    try {
      const { body, user } = req;
      if (!body) throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN
      );
      const { deal_id, email, role, full_name } = body;
      if (!deal_id) throw new HttpException(
        'Missing deal',
        HttpStatus.FORBIDDEN
      );
      if (!email) throw new HttpException(
        'Missing email',
        HttpStatus.FORBIDDEN
      );
      if (!role) throw new HttpException(
        'Missing role',
        HttpStatus.FORBIDDEN
      );
      if (!full_name) throw new HttpException(
        'Missing full name',
        HttpStatus.FORBIDDEN
      );
      const { data, error }: any = await this.supabase
        .from("deals_roles")
        .insert(body)
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
          error: 'Failed to create deal roles',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  };

  async getAll(req: any) {
    const { user } = req;
    try {
      const { data: deals_roles, error } = await this.supabase
        .from('deals_roles')
        .select('*, deals(*)')
        .eq("email", user.email)

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return deals_roles
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all deals_roles',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(req: any, paramId: string) {
    try {
      const { user } = req;
      const { data: deal_roles, error }: any = await this.supabase
        .from("deals_roles")
        .select("*, deals(*)")
        .eq("id", paramId)
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return deal_roles;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: `Failed to get deals roles, id: ${paramId}`,
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { user, body } = req;

      if (!body) throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN
      );

      const { id, created_at, updated_at, updated_by, ...rest } = body;

      const { data: updated, error }: any = await this.supabase
        .from("deals_roles")
        .update({
          ...rest,
          updated_at: generateTimestamp(),
          updated_by: user.sub
        })
        .eq('id', paramId)
        .select()
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return updated
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: `Failed to update deal roles, id: ${paramId}`,
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}