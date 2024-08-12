import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CryptoWalletsService } from './crypto_wallets.service';

@ApiTags('crypto_wallets')
@Controller('crypto_wallets')
export class CryptoWalletsController {
  constructor(private readonly cryptoWalletsService: CryptoWalletsService) {}

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new crypto wallet' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.cryptoWalletsService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get()
  @ApiOperation({ summary: 'Get all crypto wallets for a specific deal' })
  @ApiResponse({ status: 200, description: 'Wallets retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getAll(@Request() req, @Query('deal_id') dealId: string) {
    return await this.cryptoWalletsService.getAll(req, dealId);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get crypto wallet by ID' })
  @ApiResponse({ status: 200, description: 'Wallet found' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getById(@Request() req, @Param('id') id: string) {
    return await this.cryptoWalletsService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing crypto wallet' })
  @ApiResponse({ status: 200, description: 'Wallet updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Request() req, @Param('id') id: string) {
    return await this.cryptoWalletsService.update(req, id);
  }
}
