import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignersService } from './signers.service';

@ApiTags('signers')
@Controller('signers')
export class SignersController {
  constructor(
    private signersService: SignersService
  ) { }

  @UseGuards(SupabaseGuard)
  @Post()
  async create(@Request() req) {
    return this.signersService.create(req);
  };

  // @UseGuards(SupabaseGuard)
  // @Get(':id')
  // async getById(@Request() req, @Param() params: any) {
  //   return this.organizationsService.getById(req, params.id);
  // };
}