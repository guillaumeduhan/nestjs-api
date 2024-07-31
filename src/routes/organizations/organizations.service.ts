import { ROLES } from '@/common/variables/roles';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) { }

  // TODO: temporary roles solution check
  async checkMembership(req: any, paramId: string) {
    const { user } = req;
    try {
      const { data: currentMember, error }: any = await this.supabase
        .from('organizations_members')
        .select('*')
        .eq('organization_id', paramId)
        .eq('user_id', user.sub)
        .single()

      if (!error) throw new HttpException(
        'User could not be found',
        HttpStatus.NOT_FOUND
      );

      if (!currentMember) throw new HttpException(
        'User is not member of organization',
        HttpStatus.NOT_FOUND
      );

      return currentMember
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Membership not found',
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async create(req: any) {
    try {
      const { body: { name }, user } = req;
      if (!name) throw new HttpException(
        "Missing name",
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

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

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

        if (error) throw new HttpException(
          error.message,
          HttpStatus.FORBIDDEN
        );

        return {
          ...data,
          organizations_members: [
            inserted
          ]
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create organizations',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getAll(req: any) {
    try {
      const { user } = req;
      const { data, error }: any = await this.supabase
        .from("organizations_members")
        .select("*, organizations(*, organizations_members(*))")
        .eq("user_id", user.sub)

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return data.map(item => item.organizations);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get organizations',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(req: any, paramId: string) {
    try {
      const { data, error }: any = await this.supabase
        .from("organizations")
        .select("*, organizations_members(*), deals(*), entities(*)")
        .eq("id", paramId)
        .single()

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return data
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: `Failed to get organization ${paramId}`,
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { user, body } = req;
      const currentMember: any = await this.checkMembership(user, paramId);

      if (!currentMember) throw new HttpException(
        'User is not part of organization',
        HttpStatus.FORBIDDEN
      );

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        'User is not administrator',
        HttpStatus.FORBIDDEN
      );

      const { user_id, ...rest } = body; // prevent to change user_id here

      const { data: updated, error }: any = await this.supabase
        .from("organizations")
        .update(rest)
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
          error: 'Failed to update organizations',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  // members
  async addMember(req: any, paramId: string) {
    try {
      const { user, body } = req;
      if (!body) throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN
      );

      const currentMember: any = await this.checkMembership(user, paramId);

      if (!currentMember) throw new HttpException(
        "User is not member of organization",
        HttpStatus.FORBIDDEN
      )

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        "User is not a administrator",
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

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return inserted
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to add member',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async updateMember(req: any, paramId: string, memberId: string) {
    try {
      const { user, body } = req;
      const currentMember: any = await this.checkMembership(user, paramId);

      if (!currentMember) throw new HttpException(
        'User is not part of organization',
        HttpStatus.FORBIDDEN
      );

      const { role } = currentMember;

      if (role !== ROLES.ADMINISTRATOR) throw new HttpException(
        "User is not a administrator",
        HttpStatus.FORBIDDEN
      );

      const { id, ...rest } = body;

      const { data: updated, error }: any = await this.supabase
        .from("organizations_members")
        .update(rest)
        .eq("id", memberId)
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
          error: 'Failed to update member',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getMembers(req: any, paramId: string) {
    try {
      const { data: members, error }: any = await this.supabase
        .from("organizations_members")
        .select('*')
        .eq("organization_id", paramId)

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return members
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get members',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}