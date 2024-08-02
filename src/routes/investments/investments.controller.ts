import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';

@ApiTags('investments')
@Controller('investments')
export class InvestmentsController {
    constructor(private readonly investmentsService: InvestmentsService) {}

    @UseGuards(SupabaseGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new investment' })
    @ApiResponse({ status: 201, description: 'Investment created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input'})
    async create(@Request() req) {
        return await this.investmentsService.create(req);
    }

    @UseGuards(SupabaseGuard)
    @Get()
    @ApiOperation({ summary: 'Get all investements from organizations' })
    @ApiResponse({ status: 200, description: 'Investments retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async getAll(@Request() req) {
      return await this.investmentsService.getAll(req);
    }

    @UseGuards(SupabaseGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get investment by ID' })
    @ApiResponse({ status: 200, description: 'Investment found' })
    @ApiResponse({ status: 404, description: 'Investment not found' })
    async getById(@Request() req, @Param('id') id: string) {
      return await this.investmentsService.getById(id, req);
    }
}