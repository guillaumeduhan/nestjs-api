import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SlackService } from 'nestjs-slack';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class EntityTaxesService {
  constructor(
    private slackService: SlackService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  private createLogger(entityId: string): winston.Logger {
    return winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: `[ENTITIES] %DATE% ${entityId}.log`,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          zippedArchive: true,
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
          ),
          level: 'info',
        }),
      ],
    });
  }

  async create(req: any) {
    const { body: entityTax, user } = req;
    if (!entityTax) {
      throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const { data, error } = await this.supabase
        .from('entities_taxes')
        .insert({
          ...entityTax,
          created_at: generateTimestamp(),
        })
        .select('*')
        .single();

      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.FORBIDDEN,
        );
      }
      const { entity_name, id } = data;

      this.slackService.sendText(`✅ [ENTITY] Successfully created 👉 ${entity_name} 👉 id: ${process.env.PRODUCTION_URL}/entities_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });
      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [ENTITY] Failed to create 👉 ${error.message}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create entity taxes',
          message: error.message
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('entities_taxes')
        .select('*')
        .eq('id', paramId)
        .single();

      // if (error) throw new HttpException(
      //   error.message,
      //   HttpStatus.NOT_FOUND,
      // );
      if (error) return null;
      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to get entity taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }

  async update(paramId: string, req: any) {
    try {
      const { body: entityTax, user } = req;
      if (!entityTax) {
        throw new HttpException(
          'Missing body',
          HttpStatus.FORBIDDEN,
        );
      }

      const { data, error } = await this.supabase
        .from('entities_taxes')
        .update({ ...entityTax, updated_at: generateTimestamp() })
        .eq('id', paramId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.FORBIDDEN,
        );
      }

      const { entity_name, id } = data;

      this.slackService.sendText(`🟢 [ENTITY] Updated 👉 ${entity_name} 👉 ${process.env.PRODUCTION_URL}/entities_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });

      const { data: dataHistory, error: dataError } = await this.supabase
        .from('entities_taxes_history')
        .insert(data)
        .select('*')
        .single();

      if (dataError) {
        console.error('Supabase error:', dataError.message);
        throw new HttpException(
          `History: ${error.message}`,
          HttpStatus.FORBIDDEN,
        );
      }

      const { history_id }: any = dataHistory;

      this.slackService.sendText(`⏱️ [ENTITY] History saved 👉 ${entity_name} 👉 ${process.env.PRODUCTION_URL}/entities_taxes/${id}/history/${history_id}`, {
        channel: "taxes-logs-v4"
      });

      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [ENTITY] Update failed 👉 ${error.message} 👉 ${process.env.PRODUCTION_URL}/entities_taxes/${paramId}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException({
        status: error.status,
        error: 'Failed to update entity taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }

  async generate(entityId: string, req: any, taxYear: string = '2024', fundManagerApproval: boolean = false) {
    try {
      if (!entityId) {
        throw new HttpException(
          "Missing entity id",
          HttpStatus.FORBIDDEN,
        );
      };

      const { data, error } = await this.supabase
        .from('entities')
        .select('*')
        .eq('id', entityId)
        .single();

      if (error) {
        throw new HttpException(
          `Entity not found: ${entityId}`,
          HttpStatus.FORBIDDEN,
        );
      };

      // timer starts
      const time_0 = performance.now();

      const logger = this.createLogger(entityId);

      // Log the start of the process
      logger.info(`⏱️ Starting to generate tax id for ${entityId}`);

      // timer ends
      const time_1 = performance.now();

      logger.info('⏱️ Call to controller took ' + (time_1 - time_0) + ' milliseconds.');

      // Log the start of the process
      logger.info(`✅ Successfully generated entities-taxes for entity: ${entityId}`);

      return data
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to generate entity tax',
          message: error.message
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
