import { generateTimestamp } from '@/common/helpers/utils';
import { ROLES } from '@/common/variables/roles';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class DealsService {
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
      const { name, organization_id } = body;
      if (!name) throw new HttpException(
        'Missing name',
        HttpStatus.FORBIDDEN
      );
      if (!organization_id) throw new HttpException(
        'Missing organization',
        HttpStatus.FORBIDDEN
      );
      const { data, error }: any = await this.supabase
        .from("deals")
        .insert({
          name,
          organization_id,
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
          error: 'Failed to create deals',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  };

  async getAll(req: any) {
    try {
      const organizations = await this.organizationsService.getAll(req);

      if (!organizations.length) {
        return [];
      }

      const dealsIds = organizations.map(org => org.id);

      const { data: deals, error } = await this.supabase
        .from('deals')
        .select('*')
        .in('organization_id', dealsIds);

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return deals
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all deals',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(req: any, paramId: string) {
    try {
      const { user } = req;
      const { data: deal, error }: any = await this.supabase
        .from("deals")
        .select("*, organizations(*, entities(*), organizations_members(*)), entities(*, organizations(*), bank_accounts(*)), identities(*)")
        .eq("id", paramId)
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      // if admin = complete deal
      // if user = partial deal
      const {
        organizations,
        entities,
        identities,
        multi_asset,
        identity_id,
        signing_date,
        source,
        ...partial
      } = deal;
      const currentUser = organizations?.organizations_members.find(m => m.user_id === user.sub);

      if (!currentUser) return partial;

      return deal;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: `Failed to get deal ${paramId}`,
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

      const { data: deal, error }: any = await this.supabase
        .from("deals")
        .select("*")
        .eq('id', paramId)
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      const { organization_id } = deal;

      const currentMember: any = await this.organizationsService.checkMembership(req, organization_id);

      if (!currentMember) throw new HttpException(
        "User is not member of organization",
        HttpStatus.FORBIDDEN
      )

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        "User is not an administrator",
        HttpStatus.FORBIDDEN
      );

      const { id, user_id, created_at, updated_at, updated_by, ...rest } = body;

      const { data: updated, error: updateError }: any = await this.supabase
        .from("deals")
        .update({
          ...rest,
          updated_at: generateTimestamp(),
          updated_by: user.sub
        })
        .eq('id', paramId)
        .select()
        .single()

      if (updateError) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return updated
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: `Failed to update deal ${paramId}`,
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}