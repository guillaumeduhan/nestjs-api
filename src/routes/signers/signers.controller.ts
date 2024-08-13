import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { SignersService } from '@/routes/signers/signers.service';
import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('signers')
@Controller('signers')
export class SignersController {
  constructor(
    private signersService: SignersService
  ) { }

  @UseGuards(SupabaseGuard)
  @Post(':id')
  async update(@Request() req, @Param() params: any) {
    return this.signersService.update(req, params.id);
  };
}