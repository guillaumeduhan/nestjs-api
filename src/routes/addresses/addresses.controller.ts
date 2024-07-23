import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.addressesService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get()
  @ApiOperation({ summary: 'Get all addresses from user' })
  @ApiResponse({ status: 201, description: 'Addresses retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getAll(@Request() req) {
    return await this.addressesService.getAll(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiResponse({ status: 200, description: 'Address found' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async getById(@Request() req, @Param('id') id: string) {
    return await this.addressesService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Request() req, @Param('id') id: string) {
    return await this.addressesService.update(req, id);
  }

  @UseGuards(SupabaseGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async delete(@Request() req, @Param('id') id: string) {
    return await this.addressesService.delete(req, id);
  }
}
