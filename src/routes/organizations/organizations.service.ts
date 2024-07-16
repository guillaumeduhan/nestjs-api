import { ROLES } from '@/common/variables/roles';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) { }

  // TODO: to remove ,temporary roles solution check
  async isCurrentMember(user, paramId) {
    const { data: currentMember }: any = await this.supabase
      .from('organizations_members')
      .select('*')
      .eq('organization_id', paramId)
      .eq('user_id', user.sub)
      .single()

    if (!currentMember) throw new HttpException(
      {
        status: 403,
        error: 'User is not member of organization'
      },
      HttpStatus.FORBIDDEN
    );

    return currentMember
  }

  async create(req: any) {
    try {
      const { body, user } = req;
      const { name } = body;
      if (!name) throw new HttpException(
        {
          status: 401,
          error: 'Missing name'
        },
        HttpStatus.FORBIDDEN
      );
      const { data, error }: any = await this.supabase
        .from("organizations")
        .insert({
          name,
          user_id: user.sub,
        })
        .select()
        .single()

      if (data) {
        const { data: inserted, error }: any = await this.supabase
          .from("organizations_members")
          .insert({
            organization_id: data.id,
            email: user.email,
            user_id: user.sub,
            role: 'Administrator'
          })
          .select()
          .single()

        return {
          ...data,
          organizations_members: [
            inserted
          ]
        };
      }
    } catch (error) {
      throw new HttpException(
        error.response,
        HttpStatus.FORBIDDEN
      );
    }
  }

  async get(req: any) {
    try {
      const { user } = req; // we assume user exist otherwise you never enter here
      const { data, error }: any = await this.supabase
        .from("organizations_members")
        .select("*, organizations(*, organizations_members(*))")
        .eq("user_id", user.sub)

      if (data) return data.map(item => item.organizations);
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: 'Failed to get organizations'
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { user, body } = req;
      const currentMember: any = await this.isCurrentMember(user, paramId);

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        {
          status: 403,
          error: 'User is not administrator'
        },
        HttpStatus.FORBIDDEN
      );

      const { user_id, ...rest } = body; // prevent to change user_id here

      const { data: updated, error }: any = await this.supabase
        .from("organizations")
        .update(rest)
        .eq('id', paramId)
        .select()
        .single()

      if (updated) return updated
    } catch (error) {
      throw new HttpException(
        error.response,
        HttpStatus.FORBIDDEN
      );
    }
  }

  // members
  async addMember(req: any, paramId: string) {
    try {
      const { user, body } = req;
      const currentMember: any = await this.isCurrentMember(user, paramId);

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        {
          status: 403,
          error: 'User is not administrator'
        },
        HttpStatus.FORBIDDEN
      );

      if (!body) throw new HttpException(
        {
          status: 401,
          error: 'No body provided'
        },
        HttpStatus.FORBIDDEN
      );

      const { user_id, role: bodyRole, full_name, email } = body;

      const { data: inserted, error }: any = await this.supabase
        .from("organizations_members")
        .insert({
          role: bodyRole,
          user_id,
          full_name,
          email,
          organization_id: paramId
        })
        .select()
        .single()

      if (inserted) return inserted
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: 'Failed to add new member'
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async updateMember(req: any, paramId: string, memberId: string) {
    try {
      const { user, body } = req;
      const currentMember: any = await this.isCurrentMember(user, paramId);

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        {
          status: 403,
          error: 'User is not administrator'
        },
        HttpStatus.FORBIDDEN
      );

      if (!body) throw new HttpException(
        {
          status: 401,
          error: 'No body provided'
        },
        HttpStatus.FORBIDDEN
      );

      const { id, ...rest } = body;

      const { data: updated, error }: any = await this.supabase
        .from("organizations_members")
        .update(rest)
        .eq("id", memberId)
        .select()
        .single()

      if (updated) return updated
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: 'Failed to update new member'
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}