import { generateTimestamp } from '@/common/helpers/utils';
import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SlackService } from 'nestjs-slack';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class InvestmentsTaxesService {
  constructor(
    private slackService: SlackService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  private createLogger(investmentId: string): winston.Logger {
    return winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: `[INVESTMENTS] %DATE% ${investmentId}.log`,
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
    const { body: investmentTax, user } = req;
    if (!investmentTax) {
      throw new HttpException(
        "Missing body",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const { data, error } = await this.supabase
        .from('investments_taxes')
        .insert({
          ...investmentTax,
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
      const { id } = data;
      this.slackService.sendText(`✅ [INVESTMENT] Successfully created 👉 https://v4.allocations.com/investments_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });
      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [INVESTMENT] Failed to create 👉 ${error.message}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to create investment taxes',
          message: error.message
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getById(paramId: string, req: any) {
    try {
      const { data, error } = await this.supabase
        .from('investments_taxes')
        .select('*')
        .eq('id', paramId)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      throw new HttpException({
        status: error.status,
        error: 'Failed to get investment taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }

  async update(paramId: string, req: any) {
    try {
      const { body: investmentTax, user } = req;
      if (!investmentTax) {
        throw new HttpException(
          'Missing body',
          HttpStatus.FORBIDDEN,
        );
      }

      const { data, error } = await this.supabase
        .from('investments_taxes')
        .update({ ...investmentTax, updated_at: generateTimestamp() })
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

      const { id } = data;

      this.slackService.sendText(`🟢 [INVESTMENT] Updated 👉 https://v4.allocations.com/investments_taxes/${id}`, {
        channel: "taxes-logs-v4"
      });

      const { data: dataHistory, error: dataError } = await this.supabase
        .from('investments_taxes_history')
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

      this.slackService.sendText(`⏱️ [INVESTMENT] History saved 👉 https://v4.allocations.com/investments_taxes/${id}/history/${history_id}`, {
        channel: "taxes-logs-v4"
      });

      return data;
    } catch (error) {
      this.slackService.sendText(`🔴 [INVESTMENT] Failed to update 👉 ${error.message} 👉 https://v4.allocations.com/investments_taxes/${paramId}`, {
        channel: "taxes-logs-v4"
      });
      throw new HttpException({
        status: error.status,
        error: 'Failed to update investment taxes',
        message: error.message
      },
        HttpStatus.FORBIDDEN);
    }
  }

  async generate(investmentId: string, req: any, taxYear: string = '2024', fundManagerApproval: boolean = false) {
    try {
      if (!investmentId) {
        throw new HttpException(
          "Missing investment id",
          HttpStatus.FORBIDDEN,
        );
      };

      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('id', investmentId)
        .single();

      if (error) {
        throw new HttpException(
          `Investment not found: ${investmentId}`,
          HttpStatus.FORBIDDEN,
        );
      };

      // timer starts
      const time_0 = performance.now();

      const logger = this.createLogger(investmentId);

      // Log the start of the process
      logger.info(`⏱️ Starting to generate tax id for ${investmentId}`);

      // timer ends
      const time_1 = performance.now();

      logger.info('⏱️ Call to controller took ' + (time_1 - time_0) + ' milliseconds.');

      // Log the start of the process
      logger.info(`✅ Successfully generated investments-taxes for entity: ${investmentId}`);

      return data
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Failed to generate Investment tax',
          message: error.message
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
