import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import {
    Body,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AssetsService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    ) { }

    async getAssetById(id: string) {
        const { data, error } = await this.supabase
            .from('assets')
            .select('*')
            .eq('id', id);
        console.log(data);
        if (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!data || data.length === 0) {
            throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
        }
        return data;
    }

    async createAsset(assetData: any) {
        const { data, error } = await this.supabase
            .from('assets')
            .insert([assetData]);

        if (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        return data;
    }

    async updateAsset(id: string, assetData: any) {
        const { data, error } = await this.supabase
            .from('assets')
            .update(assetData)
            .eq('id', id);

        if (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        return data;
    }
}
