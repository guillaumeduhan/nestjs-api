import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAssetDto, UpdateAssetDto } from './assets.dto';
import { AssetsService } from './assets.service';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  private readonly logger = new Logger(AssetsController.name);
  constructor(private readonly assetsService: AssetsService) {}

  @UseGuards(SupabaseGuard)
  @Get('assets/:id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({ status: 200, description: 'Asset found' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async getAssetByDealId(@Param('id') id: string) {
    try {
      return await this.assetsService.getAssetById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.logger.log(`Finished getAssetById operation for Id: ${id}`);
    }
  }
  @UseGuards(SupabaseGuard)
  @Post('/assets')
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createAsset(@Body() assetData: CreateAssetDto) {
    try {
      return await this.assetsService.createAsset(assetData);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    } finally {
      this.logger.log(
        `Finished createAsset operation for asset data: ${JSON.stringify(assetData)}`,
      );
    }
  }
  @UseGuards(SupabaseGuard)
  @Patch('assets/:id')
  @ApiOperation({ summary: 'Update an existing asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateAsset(
    @Param('id') id: string,
    @Body() assetData: UpdateAssetDto,
  ) {
    try {
      return await this.assetsService.updateAsset(id, assetData);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    } finally {
      this.logger.log(
        `Finished updateAsset operation for asset id: ${id} with data: ${JSON.stringify(assetData)}`,
      );
    }
  }
}
