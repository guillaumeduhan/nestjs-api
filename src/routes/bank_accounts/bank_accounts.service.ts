import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';

export interface Deposit {
  deposit_type: string;
  deposit_destination: {
    destination_account_id: string;
  };
}

@Injectable()
export class BankAccountService {
  private axiosClient: AxiosInstance;
  private token: string | null = null;
  private tokenExpireTime: Date | null = null;

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {
    this.axiosClient = axios.create({
      baseURL: process.env.LAYER2_TEST_BASE_URL,
    });
  }

  private async getOAuthToken(): Promise<string | null> {
    if (
      this.token &&
      this.tokenExpireTime &&
      new Date() < this.tokenExpireTime
    ) {
      return this.token;
    }

    const clientId = process.env.TEST_LAYER2_CLIENT_ID;
    const clientSecret = process.env.TEST_LAYER2_SECRET;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    try {
      const tokenResponse = await axios.post(
        `${process.env.LAYER2_TEST_URL}`,
        'grant_type=client_credentials&scope=applications:read applications:write',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache, no-store, must-revalidate max-age=0',
          },
        },
      );

      this.tokenExpireTime = new Date(
        new Date().getTime() + tokenResponse.data.expires_in * 1000,
      );
      this.token = tokenResponse.data.access_token;
      return this.token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  async createApplication(applicationData: any, req: any): Promise<any> {
    const idempotencyKey = uuidv4();
    const token = await this.getOAuthToken();

    if (!token) {
        throw new HttpException('OAuth token not available', HttpStatus.UNAUTHORIZED);
    }

    const { account_to_open, ...applicationDetails } = applicationData;
    const { account_id, product_id, asset_type_id } = account_to_open;
    const user = req.user;

    try {
        // First, attempt to create the application with Layer2
        const response = await this.axiosClient.post(
            '/applications',
            applicationData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-l2f-request-id': idempotencyKey,
                    'x-l2f-idempotency-id': idempotencyKey,
                    'Cache-Control': 'no-cache, no-store, must-revalidate max-age=0',
                },
            },
        );

        // If successful, store the data in your Supabase database
        const { data: bankAccountData, error: bankAccountError } =
            await this.supabase
                .from('bank_accounts')
                .insert({
                    id: uuidv4(),
                    account_name: applicationDetails.customer_details.registered_name,
                    user_id: user.sub,
                    organization_id: applicationDetails.organization_id,
                    created_at: generateTimestamp(),
                    updated_at: generateTimestamp(),
                })
                .select()
                .single();

        if (bankAccountError) {
            throw new HttpException(bankAccountError.message, HttpStatus.FORBIDDEN);
        }

        const { data: supabaseApplicationData, error: applicationError } =
            await this.supabase
                .from('banking_applications')
                .insert({
                    id: uuidv4(),
                    bank_account_id: bankAccountData.id,
                    deal_id: applicationDetails.deal_id,
                    account_id: account_id,
                    product_id: product_id,
                    asset_type_id: asset_type_id,
                    customer_id: applicationDetails.customer_id,
                    application_type: applicationDetails.application_type,
                    terms_and_conditions_accepted:
                        applicationDetails.terms_and_conditions_accepted,
                    created_at: generateTimestamp(),
                    application_status: 'Pending',
                    application_id: response.data.data.id,
                })
                .select()
                .single();

        if (applicationError) {
            throw new HttpException(applicationError.message, HttpStatus.FORBIDDEN);
        }

        return response.data;
    } catch (error) {
        console.error('Error creating application:', error.response?.data?.errors || error.message);

        // Throw the error response received from Layer2
        if (error.response && error.response.data && error.response.data.errors) {
            throw new HttpException(error.response.data.errors, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        throw new HttpException('Failed to create application', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


  async deleteIndividual(
    applicationId: string,
    individualId: string,
  ): Promise<void> {
    const token = await this.getOAuthToken();
    const idempotencyKey = uuidv4();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.axiosClient.delete(
        `/applications/${applicationId}/individual/${individualId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
          },
        },
      );
    } catch (error) {
      throw new HttpException(
        `Failed to delete individual: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDeposit(deposit: Deposit): Promise<void> {
    const token = await this.getOAuthToken();
    const idempotencyKey = uuidv4();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.axiosClient.post(`/deposits`, deposit, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-l2f-request-id': idempotencyKey,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create deposit: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateIndividual(
    appId: string,
    individualId: string,
    updates: { updates: Array<{ field: string; value: string }> },
  ): Promise<any> {
    const token = await this.getOAuthToken();
    const idempotencyKey = uuidv4();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const patchData = {
        updates: updates.updates.map((update) => ({
          field: update.field,
          value: update.value,
        })),
      };

      const response = await this.axiosClient.patch(
        `/applications/${appId}/individual/${individualId}`,
        patchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to update individual: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateApplication(
    id: string,
    updates: { updates: Array<{ field: string; value: any }> },
  ): Promise<any> {
    const token = await this.getOAuthToken();
    const idempotencyKey = uuidv4();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const patchData = {
        updates: updates.updates.map((update) => ({
          field: update.field,
          value: update.value,
        })),
      };

      const updatedApplication = await this.axiosClient.patch(
        `/applications/${id}`,
        patchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return updatedApplication.data;
    } catch (error) {
      console.error(`Failed to update application: ${error.message}`);
      throw new HttpException(
        `Failed to update application: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getApplicationById(appId: string): Promise<any> {
    const token = await this.getOAuthToken();
    const idempotencyKey = uuidv4();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response = await this.axiosClient.get(`/applications/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-l2f-request-id': idempotencyKey,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve application',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getApplicationStatus(id: string): Promise<any> {
    const idempotencyKey = uuidv4();
    const token = await this.getOAuthToken();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response = await this.axiosClient.get(
        `/applications/${id}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve application status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addIndividual(id: string, individualData: any): Promise<any> {
    const idempotencyKey = uuidv4();
    const token = await this.getOAuthToken();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response = await this.axiosClient.post(
        `/applications/${id}/individual`,
        individualData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to add individual: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async submitApplication(id: string): Promise<any> {
    const idempotencyKey = uuidv4();
    const token = await this.getOAuthToken();

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response = await this.axiosClient.post(
        `/applications/${id}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to submit application: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadDocument(
    id: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<any> {
    const token = await this.getOAuthToken();
    const idempotencyKey = uuidv4();
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    if (!token) {
      throw new HttpException(
        'OAuth token not available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response = await this.axiosClient.post(
        `/documents/${id}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
            'x-l2f-request-id': idempotencyKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to upload document: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
