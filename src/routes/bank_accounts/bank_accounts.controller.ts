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
import { BankaccountsService } from './bank_accounts.service';

@ApiTags('bank_accounts')
@Controller('bank_accounts')
export class BankaccountsController {
  constructor(private readonly bankaccountService: BankaccountsService) {}

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({
    status: 201,
    description: 'Bank account created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.bankaccountService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get bank account by ID' })
  @ApiResponse({ status: 200, description: 'Bank account found' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async getById(@Request() req, @Param('id') id: string) {
    return await this.bankaccountService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing entity' })
  @ApiResponse({ status: 200, description: 'Entity updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Request() req, @Param('id') id: string) {
    return await this.bankaccountService.update(req, id);
  }
}
