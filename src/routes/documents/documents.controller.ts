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
  @Get()
  @ApiOperation({ summary: 'Get all my documents' })
  @ApiResponse({ status: 201, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getAll(@Request() req) {
    return await this.documentsService.getAll(req);
  }

  @UseGuards(SupabaseGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    req.body.file = file;
    return await this.documentsService.uploadFile(req);
  }

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getById(@Request() req, @Param('id') id: string) {
    return await this.documentsService.getById(id, req);
  }
}
