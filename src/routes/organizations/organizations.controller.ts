import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private organizationsService: OrganizationsService
  ) { }

  @UseGuards(SupabaseGuard)
  @Get()
  async get(@Request() req) {
    return this.organizationsService.getAll(req);
  };

  @UseGuards(SupabaseGuard)
  @Get(':id')
  async getById(@Request() req, @Param() params: any) {
    return this.organizationsService.getById(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Post()
  async create(@Request() req) {
    return this.organizationsService.create(req);
  };

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  async update(@Request() req, @Param() params: any) {
    return this.organizationsService.update(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Get(':id/members')
  async getMembers(@Request() req, @Param() params: any) {
    return this.organizationsService.getMembers(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Post(':id/members')
  async addMember(@Request() req, @Param() params: any) {
    return this.organizationsService.addMember(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Patch(':id/members/:memberId')
  async updateMember(@Request() req, @Param() params: any) {
    const { id, memberId } = params;
    return this.organizationsService.updateMember(req, id, memberId);
  };

  // @UseGuards(SupabaseGuard)
  // @Get(':id/identities')
  // async getIdentities(@Request() req, @Param() params: any) {
  //   return this.organizationsService.getIdentities(req, params.id);
  // };
}

