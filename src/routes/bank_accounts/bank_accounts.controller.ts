import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankAccountService, Deposit } from './bank_accounts.service';

@ApiTags('Bank Accounts Layer 2')
@Controller('bank_accounts')
export class Layer2Controller {
  constructor(private readonly applicationService: BankAccountService) { }

  @UseGuards(SupabaseGuard)
  @Get()
  @ApiOperation({ summary: 'Get all bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Bank accounts get successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async get(@Request() req) {
    return this.applicationService.getAll(req);
  };

  @UseGuards(SupabaseGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Bank Account' })
  @ApiResponse({
    status: 200,
    description: 'Bank Account created successfully',
  })
  async create(@Request() req) {
    return this.applicationService.create(req);
  };

  @UseGuards(SupabaseGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Bank account by id' })
  @ApiResponse({
    status: 200,
    description: 'Bank account get successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getById(@Request() req, @Param() params) {
    return this.applicationService.getById(req, params.id);
  };

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Bank Account by id' })
  @ApiResponse({
    status: 200,
    description: 'Bank Account updated successfully',
  })
  async update(@Request() req, @Param() params) {
    return this.applicationService.update(req, params.id);
  };

  // applications


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
  @Get('/applications/check-status/:id')
  @ApiOperation({ summary: 'Check the status of an application' })
  @ApiResponse({
    status: 200,
    description: 'Application Status retrieved successfully',
  })
  async getStatus(@Param('id') id: string): Promise<any> {
    return await this.applicationService.getApplicationStatus(id);
  }

  @UseGuards(SupabaseGuard)
  @Get('/applications/:id/details')
  @ApiOperation({ summary: 'Get the details of an application' })
  @ApiResponse({
    status: 200,
    description: 'Application details retrieved successfully',
  })
  async getApplication(@Param('id') appId: string): Promise<any> {
    return await this.applicationService.getApplicationById(appId);
  }

  @UseGuards(SupabaseGuard)
  @Post('/applications/upload_documents/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document to an application' })
  @ApiResponse({ status: 200, description: 'Document uploaded successfully' })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.applicationService.uploadDocument(
      id,
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @UseGuards(SupabaseGuard)
  @Post('/applications/add_individual/:id')
  @ApiOperation({ summary: 'Add an individual to an application' })
  @ApiResponse({
    status: 200,
    description: 'Individual added to the application successfully',
  })
  async addIndividual(
    @Param('id') id: string,
    @Body() individualData: any,
  ): Promise<any> {
    return await this.applicationService.addIndividual(id, individualData);
  }


  @UseGuards(SupabaseGuard)
  @Post('/applications/submit/:id')
  @ApiOperation({ summary: 'Submit an application' })
  @ApiResponse({
    status: 200,
    description: 'Application submitted successfully',
  })
  async submitApplication(@Param('id') id: string): Promise<any> {
    return await this.applicationService.submitApplication(id);
  }

  @UseGuards(SupabaseGuard)
  @Patch('/update-applications/:id')
  @ApiOperation({ summary: 'Update an application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  async updateApplication(
    @Param('id') id: string,
    @Body() updates: { updates: Array<{ field: string; value: string }> },
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
    @Body() updates: { updates: Array<{ field: string; value: string }> },
  ): Promise<any> {
    return await this.applicationService.updateIndividual(
      id,
      individualId,
      updates,
    );
  }

  @UseGuards(SupabaseGuard)
  @Post('/create-deposits')
  @ApiOperation({ summary: 'Create a deposit' })
  @ApiResponse({ status: 200, description: 'Deposit created successfully' })
  async createDeposit(@Body() deposit: Deposit): Promise<void> {
    await this.applicationService.createDeposit(deposit);
  }

  @UseGuards(SupabaseGuard)
  @Post('/create_application')
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 200, description: 'Application created successfully' })
  async createApplication(
    @Body() applicationData: any,
    @Req() req,
  ): Promise<any> {
    return await this.applicationService.createApplication(
      applicationData,
      req,
    );
  }
}
