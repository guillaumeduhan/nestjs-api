import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { EntityTaxesService } from './entitytaxes.service';

@ApiTags('entity_taxes')
@Controller('entity_taxes')
export class EntityTaxesController {
  constructor(private readonly entityTaxesService: EntityTaxesService) {}

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new entity tax' })
  @ApiResponse({ status: 201, description: 'Entity tax created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.entityTaxesService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get entity tax by ID' })
  @ApiResponse({ status: 200, description: 'Entity tax found' })
  @ApiResponse({ status: 404, description: 'Entity tax not found' })
  async getById(@Param('id') id: string, @Request() req) {
    return await this.entityTaxesService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing entity tax' })
  @ApiResponse({ status: 200, description: 'Entity tax updated successfully' })
  @ApiResponse({ status: 204, description: 'No changes made' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Entity tax not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(@Param('id') id: string, @Request() req) {
    return await this.entityTaxesService.update(id, req);
  }
}
