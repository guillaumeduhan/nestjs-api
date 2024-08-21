import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class EntitiesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private organizationsService: OrganizationsService
  ) { }

  async create(req: any) {
    const { body: entity, user } = req;
    if (!entity) throw new HttpException(
      "Missing body",
      HttpStatus.FORBIDDEN
    );
    const { name, organization_id } = entity;
    if (!name || !organization_id) {
      let error;
      if (!name) error = "Missing name";
      if (!organization_id) error = "Missing organization";
      throw new HttpException(
        error,
        HttpStatus.FORBIDDEN
      );
    }
    try {
      const { data, error } = await this.supabase
        .from('entities')
        .insert({
          ...entity,
          user_id: user.sub,
          organization_id: entity.organization_id
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
          error: 'Failed to create entity',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getAll(req: any) {
    try {
      const organizations = await this.organizationsService.getAll(req);

      if (!organizations.length) {
        return [];
      }

      const organizationIds = organizations.map(org => org.id);

      const { data: entities, error } = await this.supabase
        .from('entities')
        .select('*, organizations(*, organizations_members(*))')
        .in('organization_id', organizationIds);

      if (error) throw new HttpException(
        error.message,
        HttpStatus.FORBIDDEN
      );

      return entities
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get all entities',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('entities')
        .select('*, organizations(*, organizations_members(*))')
        .eq('id', paramId)
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
          error: 'Failed to get entity by id',
          message: error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async update(req: any, paramId: string) {
    try {
      const { body: entity, user } = req;
      if (!entity) throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN
      );
      const { id, ...rest } = entity;

      if (!entity.organization_id) throw new HttpException(
        "Missing organization_id",
        HttpStatus.FORBIDDEN
      );

      const members = await this.organizationsService.getMembers(req, entity.organization_id);

      const found = members.find(x => x.user_id === req.user.sub);

      if (!found) throw new HttpException(
        "User is not allowed to update entity",
        HttpStatus.FORBIDDEN
      );

      const { data, error } = await this.supabase
        .from('entities')
        .update({
          ...rest,
          updated_at: generateTimestamp(),
          updated_by: user.sub
        })
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
          error: 'Failed to update entity',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}