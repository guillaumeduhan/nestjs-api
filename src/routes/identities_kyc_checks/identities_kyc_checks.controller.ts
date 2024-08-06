import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentitiesKycChecksService } from './identities_kyc_checks.service';

@ApiTags('identity_kyc_checks')
@Controller('identity_kyc_checks')
export class IdentitiesKycChecksController {
  constructor(private readonly identitiesKycChecksService: IdentitiesKycChecksService) { }

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new identity kyc check' })
  @ApiResponse({ status: 201, description: 'Identity Kyc Check created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Request() req) {
    return await this.identitiesKycChecksService.create(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get identity kyc checks by ID' })
  @ApiResponse({ status: 200, description: 'Identity Kyc Check found' })
  @ApiResponse({ status: 404, description: 'Identity not found' })
  async getById(@Request() req, @Param('id') id: string) {
    return await this.identitiesKycChecksService.getById(id);
  }
}
