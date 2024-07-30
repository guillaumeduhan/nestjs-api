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
      {
        status: 401,
        error: 'Missing entity'
      },
      HttpStatus.FORBIDDEN
    );
    const { name, organization_id, user_id } = entity;
    if (!name || !organization_id || !user_id) {
      let error;
      if (!name) error = "Missing name";
      if (!organization_id) error = "Missing organization";
      if (!user_id) error = "Missing user";
      throw new HttpException(
        {
          status: 401,
          error
        },
        HttpStatus.FORBIDDEN
      );
    }
    try {
      const { data, error } = await this.supabase
        .from('entities')
        .insert({
          ...entity,
          organization_id: entity.organization_id
        })
        .select()
        .single();

      if (error) console.log(error)
      return data;
    } catch (error) {
      console.log(error)
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create entity',
          message: error
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
        .select('*')
        .in('organization_id', organizationIds);

      if (error) {
        throw new HttpException(
          {
            error: 'Failed to get entities',
            message: error.message
          },
          HttpStatus.FORBIDDEN
        );
      }

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
        .select('*')
        .eq('id', paramId)
        .single();

      if (!data) {
        return {
          status: 200,
          message: "No entity found"
        };
      }

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
        {
          status: 401,
          error: 'Missing entity'
        },
        HttpStatus.FORBIDDEN
      );
      if (!entity.organization_id) throw new HttpException(
        {
          status: 401,
          error: 'Missing organization_id'
        },
        HttpStatus.FORBIDDEN
      );
      const { id, ...rest } = entity;
      const { data, error } = await this.supabase
        .from('entities')
        .update({
          ...rest,
          updated_at: generateTimestamp()
        })
        .eq('id', paramId)
        .select()
        .single();

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to update entity',
          message: error
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}