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
import { AssetsService } from './assets.service';

@ApiTags('assets')
@Controller()
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @UseGuards(SupabaseGuard)
  @Post('assets')
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Request() req
  ) {
    return await this.assetsService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get('assets')
  @ApiOperation({ summary: 'Get all assets from user' })
  @ApiResponse({ status: 201, description: 'Assets get successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getAll(
    @Request() req
  ) {
    return await this.assetsService.getAll(req);
  }

  @UseGuards(SupabaseGuard)
  @Get('assets/:id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({ status: 200, description: 'Asset found' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async getAssetById(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.assetsService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch('assets/:id')
  @ApiOperation({ summary: 'Update an existing asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(
    @Request() req,
    @Param('id') id: string
  ) {
    return await this.assetsService.update(req, id);
  }
}
