import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Get, Patch, Post, Request, UseGuards, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller()
export class OrganizationsController {
  constructor(
    private organizationsService: OrganizationsService
  ) { }

  @UseGuards(SupabaseGuard)
  @Get('organizations')
  async get(@Request() req) {
    return this.organizationsService.get(req);
  };

  @UseGuards(SupabaseGuard)
  @Post('organizations')
  async create(@Request() req) {
    return this.organizationsService.create(req);
  };

  @UseGuards(SupabaseGuard)
  @Patch('organizations/:id')
  async update(@Request() req, @Param() params:any) {
    return this.organizationsService.update(req, params.id);
  };
}

