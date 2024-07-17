import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto, UpdateAssetDto } from './assets.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SupabaseGuard } from '@/auth/supabase/supabase.guard';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) { }

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
        }
    }
    @UseGuards(SupabaseGuard)
    @Post('/assets')
    @ApiOperation({ summary: 'Create a new asset' })
    @ApiResponse({ status: 201, description: 'Asset created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async createAsset(@Body() assetData: CreateAssetDto) {
        try {
            this.validateCreateAsset(assetData);
            return await this.assetsService.createAsset(assetData);
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
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
            this.validateUpdateAsset(assetData);
            return await this.assetsService.updateAsset(id, assetData);
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    private validateCreateAsset(assetData: CreateAssetDto) {
        if (!assetData.deal_id) {
            throw new HttpException('deal_id is required', HttpStatus.BAD_REQUEST);
        }
        if (!assetData.location) {
            throw new HttpException('location is required', HttpStatus.BAD_REQUEST);
        }
        if (!assetData.security_type) {
            throw new HttpException(
                'security_type is required',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private validateUpdateAsset(assetData: Partial<CreateAssetDto>) {
        if (!assetData.deal_id && !assetData.location && !assetData.security_type) {
            throw new HttpException(
                'At least one of deal_id, location, or security_type is required',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
