import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DealsRolesService } from './deals_roles.service';

@ApiTags('deals_roles')
@Controller('deals_roles')
export class DealsRolesController {
  constructor(
    private dealsRolesService: DealsRolesService
  ) { }

  @UseGuards(SupabaseGuard)
  @Get()
  @ApiOperation({ summary: 'Get all deals roles' })
  @ApiResponse({
    status: 200,
    description: 'Deals roles get successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async get(@Request() req) {
    return this.dealsRolesService.getAll(req);
  };

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new deal role' })
  @ApiResponse({
    status: 200,
    description: 'Deal role created successfully',
  })
  async create(@Request() req) {
    return this.dealsRolesService.create(req);
  };

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get deal roles by id' })
  @ApiResponse({
    status: 200,
    description: 'Deal roles get successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getById(@Request() req, @Param() params) {
    return this.dealsRolesService.getById(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update deal roles by id' })
  @ApiResponse({
    status: 200,
    description: 'Deal roles updated successfully',
  })
  async update(@Request() req, @Param() params) {
    return this.dealsRolesService.update(req, params.id);
  };
}