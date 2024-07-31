import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DealsService } from './deals.service';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(
    private dealsService: DealsService
  ) { }

  // @UseGuards(SupabaseGuard)
  // @Get()
  // async get(@Request() req) {
  //   return this.dealsService.getAll(req);
  // };

  @UseGuards(SupabaseGuard)
  @Post()
  async create(@Request() req) {
    return this.dealsService.create(req);
  };
}