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
    // deals from user's organizations
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

  // async getById(req: any, paramId: string) {
  //   try {
  //     const { data, error }: any = await this.supabase
  //       .from("deals")
  //       .select("*, deals_members(*)")
  //       .eq("id", paramId)
  //       .single()

  //     if (data) return data
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: error.status,
  //         error: `Failed to get deal ${paramId}`,
  //         message: error.message
  //       },
  //       HttpStatus.FORBIDDEN
  //     );
  //   }
  // }

  // async update(req: any, paramId: string) {
  //   try {
  //     const { user, body } = req;
  //     const currentMember: any = await this.isCurrentMember(user, paramId);

  //     const { role } = currentMember;

  //     if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
  //       'User is not administrator',
  //       HttpStatus.FORBIDDEN
  //     );

  //     const { user_id, ...rest } = body; // prevent to change user_id here

  //     const { data: updated, error }: any = await this.supabase
  //       .from("deals")
  //       .update(rest)
  //       .eq('id', paramId)
  //       .select()
  //       .single()

  //     if (updated) return updated
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: error.status,
  //         error: 'Failed to update deals',
  //         message: error.message
  //       },
  //       HttpStatus.FORBIDDEN
  //     );
  //   }
  // }
}