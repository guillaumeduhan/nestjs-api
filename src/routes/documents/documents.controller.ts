import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(SupabaseGuard)
  @Get('/deals_files')
  @ApiOperation({ summary: 'Get all my documents' })
  @ApiResponse({ status: 201, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getAllDealsFiles(@Request() req) {
    return await this.documentsService.getAllDealsFiles(req);
  }

  @UseGuards(SupabaseGuard)
  @Post('/deals_files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async uploadDealsFiles(@Request() req, @UploadedFile() file: Express.Multer.File) {
    req.body.file = file;
    return await this.documentsService.uploadFileDeals(req);
  }

  @UseGuards(SupabaseGuard)
  @Get('/deals_files:id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDealsFilesById(@Request() req, @Param('id') id: string) {
    return await this.documentsService.getDealsFilesById(id, req);
  }

  // for identites
  @UseGuards(SupabaseGuard)
  @Post('/identities_files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a new identity file' })
  @ApiResponse({ status: 201, description: 'Identity file uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async uploadIdentitiesFiles(@Request() req, @UploadedFile() file: Express.Multer.File) {
    req.body.file = file;
    return await this.documentsService.identitiesUploadFile(req);
  }

  @UseGuards(SupabaseGuard)
  @Get('/identities_files')
  @ApiOperation({ summary: 'Get all files for a specific identity' })
  @ApiResponse({ status: 200, description: 'Identity files retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Identity files not found' })
  async getAllIdentitiesFiles(@Request() req) {
    return await this.documentsService.getAllIdentitiesFiles(req);
  }

  @UseGuards(SupabaseGuard)
  @Get('/identities_files/:id')
  @ApiOperation({ summary: 'Get an identity file by ID' })
  @ApiResponse({ status: 200, description: 'Identity file found' })
  @ApiResponse({ status: 404, description: 'Identity file not found' })
  async getIdentitiesFilesById(@Request() req, @Param('id') id: string) {
    return await this.documentsService.getIdentitiesFileById(id, req);
  }
}
