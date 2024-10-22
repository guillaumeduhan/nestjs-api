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
import { InvestmentsTaxesService } from './investments_taxes.service';

@ApiTags('investments_taxes')
@Controller('investments_taxes')
export class InvestmentTaxesController {
  constructor(private readonly investmentTaxesService: InvestmentsTaxesService) { } name

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new investment tax' }) 
  @ApiResponse({ status: 201, description: 'Investment tax created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.investmentTaxesService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get investment tax by ID' }) 
  @ApiResponse({ status: 200, description: 'Investment tax found' })
  @ApiResponse({ status: 204, description: 'No changes made' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Investment tax not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getById(@Param('id') id: string, @Request() req) {
    return await this.investmentTaxesService.getById(id, req);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing investment tax' }) 
  @ApiResponse({ status: 200, description: 'Investment tax updated successfully' })
  @ApiResponse({ status: 204, description: 'No changes made' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Investment tax not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(@Param('id') id: string, @Request() req) {
    return await this.investmentTaxesService.update(id, req);
  }
}
