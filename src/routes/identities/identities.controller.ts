import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentitiesService } from './identities.service';

@ApiTags('identities')
@Controller('identities')
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) { }

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new identity' })
  @ApiResponse({ status: 201, description: 'Identity created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.identitiesService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get()
  @ApiOperation({ summary: 'Get all identities from user' })
  @ApiResponse({ status: 201, description: 'Identities retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getAll(@Request() req) {
    return await this.identitiesService.getAll(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get identity by ID' })
  @ApiResponse({ status: 200, description: 'Identity found' })
  @ApiResponse({ status: 404, description: 'Identity not found' })
  async getById(@Request() req, @Param('id') id: string) {
    return await this.identitiesService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing identity' })
  @ApiResponse({ status: 200, description: 'Identity updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Request() req, @Param('id') id: string) {
    return await this.identitiesService.update(req, id);
  }
}
