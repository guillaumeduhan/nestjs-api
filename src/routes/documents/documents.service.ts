import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async uploadFile(req: any) {
    const { body: document, user } = req;
    if (!document)
      throw new HttpException('Missing body', HttpStatus.FORBIDDEN);
    const { deal_id, file, type } = document;
    if (!deal_id || !file) {
      let error = 'Missing required fields: ';
      if (!deal_id) error += 'deal_id ';
      if (!file) error += 'file ';
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }

    try {

      const fileName = `deals_files/${deal_id}/${file.originalname}`;
      const { error: uploadError } = await this.supabase.storage
        .from('deals')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError)
        throw new HttpException(uploadError.message, HttpStatus.FORBIDDEN);

      const fileId = uuidv4();

      const { data, error } = await this.supabase
        .from('deals_files')
        .insert({
          user_id: user.sub,
          deal_id: deal_id,
          file_id: fileId,
          name: file.originalname,
          type: type || null,
        })
        .select()
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      return data;
    } catch (error) {
      console.error('Upload Error:', error.message);
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to upload document',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAll(req: any) {
    const { user } = req;
    try {
      const { data, error } = await this.supabase
        .from('deals_files')
        .select('*')
        .eq('user_id', user.sub);

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get documents',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('deals_files')
        .select('*')
        .eq('id', paramId)
        .single();

      if (error) throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to get document by id',
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
