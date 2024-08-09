import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankAccountService, Deposit } from './bank_accounts.service';

@ApiTags('Layer 2 USD Banking')
@Controller('layer2')
export class Layer2Controller {
  constructor(private readonly applicationService: BankAccountService) { }

  @UseGuards(SupabaseGuard)
  @Delete('/applications/:id/individual/:individualId')
  @ApiOperation({ summary: 'Delete an individual from an application' })
  @ApiResponse({ status: 204, description: 'Individual deleted successfully' })
  async deleteIndividual(
    @Param('id') applicationId: string,
    @Param('individualId') individualId: string,
  ): Promise<void> {
    await this.applicationService.deleteIndividual(applicationId, individualId);
  }

  @UseGuards(SupabaseGuard)
  @Get('/applications/:id/check-status')
  @ApiOperation({ summary: 'Check the status of an application' })
  @ApiResponse({ status: 200, description: 'Application Status retrieved successfully' })
  async getStatus(@Param('id') id: string): Promise<any> {
    return await this.applicationService.getApplicationStatus(id);
  }

  @UseGuards(SupabaseGuard)
  @Get('/applications/:id/details')
  @ApiOperation({ summary: 'Get the details of an application' })
  @ApiResponse({ status: 200, description: 'Application details retrieved successfully' })
  async getApplication(@Param('id') appId: string): Promise<any> {
    return await this.applicationService.getApplicationById(appId);
  }

  @UseGuards(SupabaseGuard)
  @Post('/upload-documents/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document to an application' })
  @ApiResponse({ status: 200, description: 'Document uploaded successfully' })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.applicationService.uploadDocument(id, file.buffer, file.originalname, file.mimetype);
  }

  @UseGuards(SupabaseGuard)
  @Post('/applications/:id/add-individual')
  @ApiOperation({ summary: 'Add an individual to an application' })
  @ApiResponse({ status: 200, description: 'Individual added to the application successfully' })
  async addIndividual(
    @Param('id') id: string,
    @Body() individualData: any,
  ): Promise<any> {
    return await this.applicationService.addIndividual(id, individualData);
  }

  @UseGuards(SupabaseGuard)
  @Post('/applications/:id/submit')
  @ApiOperation({ summary: 'Submit an application' })
  @ApiResponse({ status: 200, description: 'Application submitted successfully' })
  async submitApplication(@Param('id') id: string): Promise<any> {
    return await this.applicationService.submitApplication(id);
  }

  @UseGuards(SupabaseGuard)
  @Patch('/update-applications/:id')
  @ApiOperation({ summary: 'Update an application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  async updateApplication(
    @Param('id') id: string,
    @Body() updates: { updates: Array<{ field: string, value: string }> },
  ): Promise<any> {
    return await this.applicationService.updateApplication(id, updates);
  }

  @UseGuards(SupabaseGuard)
  @Patch('/applications/:id/update-individual/:individualId')
  @ApiOperation({ summary: 'Update an individual in an application' })
  @ApiResponse({ status: 200, description: 'Individual updated successfully' })
  async updateIndividual(
    @Param('id') id: string,
    @Param('individualId') individualId: string,
    @Body() updates: { updates: Array<{ field: string, value: string }> },
  ): Promise<any> {
    return await this.applicationService.updateIndividual(id, individualId, updates);
  }

  @UseGuards(SupabaseGuard)
  @Post('/create-deposits')
  @ApiOperation({ summary: 'Create a deposit' })
  @ApiResponse({ status: 200, description: 'Deposit created successfully' })
  async createDeposit(@Body() deposit: Deposit): Promise<void> {
    await this.applicationService.createDeposit(deposit);
  }

  @UseGuards(SupabaseGuard)
  @Post('/create-application')
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 200, description: 'Application created successfully' })
  async createApplication(@Body() applicationData: any): Promise<any> {
    return await this.applicationService.createApplication(applicationData);
  }
}
