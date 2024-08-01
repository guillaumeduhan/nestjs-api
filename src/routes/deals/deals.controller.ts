import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DealsService } from './deals.service';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(
    private dealsService: DealsService
  ) { }

  @UseGuards(SupabaseGuard)
  @Get()
  @ApiOperation({ summary: 'Get all deals from organizations' })
  @ApiResponse({
    status: 200,
    description: 'Deals get successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async get(@Request() req) {
    return this.dealsService.getAll(req);
  };

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  @ApiResponse({
    status: 200,
    description: 'Deals created successfully',
  })
  async create(@Request() req) {
    return this.dealsService.create(req);
  };

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get deal by id' })
  @ApiResponse({
    status: 200,
    description: 'Deal get successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getById(@Request() req, @Param() params) {
    return this.dealsService.getById(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update deal by id' })
  @ApiResponse({
    status: 200,
    description: 'Deal updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Request() req, @Param() params) {
    return this.dealsService.update(req, params.id);
  };
}