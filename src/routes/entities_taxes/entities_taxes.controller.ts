import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityTaxesService } from './entities_taxes.service';

@ApiTags('entities_taxes')
@Controller('entities_taxes')
export class EntityTaxesController {
  constructor(private readonly entitiesTaxesService: EntityTaxesService) { }

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new entity tax' })
  @ApiResponse({ status: 201, description: 'Entity tax created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.entitiesTaxesService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get entity tax by ID' })
  @ApiResponse({ status: 200, description: 'Entity tax found' })
  @ApiResponse({ status: 204, description: 'No changes made' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Entity tax not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getById(@Param('id') id: string, @Request() req) {
    return await this.entitiesTaxesService.getById(id, req);
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
    return await this.entitiesTaxesService.update(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Post('generate/:entityId')
  @ApiOperation({ summary: 'Generate a new entity taxes & saves it to database' })
  @ApiResponse({ status: 201, description: 'Entity tax generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async generate(@Param('entityId') entityId: string, @Request() req) {
    return await this.entitiesTaxesService.generate(entityId, req);
  }
}
