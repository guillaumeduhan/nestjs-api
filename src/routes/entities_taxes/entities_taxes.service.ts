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

      const { data: existing, error: existingError } = await this.supabase
        .from('entities')
        .select('*')
        .eq('id', entityId)
        .single();

      if (existingError) {
        throw new HttpException(
          `Entity not found: ${entityId}`,
          HttpStatus.FORBIDDEN,
        );
      };

      // Timer starts + logs savings
      const time_0 = performance.now();
      const logger = this.createLogger(entityId);
      logger.info(`⏱️ Starting to generate tax id for ${entityId}`);

      // 1. Retrieve entity data
      // 1.1 Call supabase to fetch entity tax records for the specified entity and year
      const QUERY = `
        *,
        organizations(*),
        assets(*),
        ledger(
          *,
          ledger_categories(*)
        ),
        entities_taxes(*),
        investments_taxes(*),
        deals(
          *,
          investments(
            *,
            investments_taxes(*),
            identities(*)
          ),
          closes(
            *,
            deals (
              investments(
                *,
                investments_taxes(*),
                identities(*)
              )
            ),
            entities(
              assets(*)
            )
          )
        )
      `;

      const { data, error } = await this.supabase
        .from('entities')
        .select(QUERY)
        .eq('id', entityId)
        .single();

      if (error) {
        logger.error(`❌ ${error.message}`);
        throw new HttpException(
          error.message,
          HttpStatus.FORBIDDEN,
        );
      };


      // 1.2 If no data is found, throw an error indicating the entity does not exist

      // 2. Create tax records
      // 2.1 Use `taxCalculatorService` to generate tax records for the specified year for the entity

      // 3. Save data if validated
      // 3.1 If `commit` is true, call `saveOrReplaceTaxRecords` to save or replace tax records
      // 3.2 Pass entity tax records and investment tax records as arguments
      // 3.3 Use `fmApproval` to indicate if fund manager approval is needed

      // 4. Return and log duration
      // 4.1 If `commit` is false, return the records as an object
      // 4.2 Log the elapsed time for the controller call

      // 5. Error handling
      // 5.1 If an error occurs, throw an error indicating an expectation failure

      // 6. Calculate and fetch organizations
      // 6.1 Calculate the prior year
      // 6.2 Retrieve all associated organizations

      // 7. Query entities
      // 7.1 Query for the entity using `entityId` and `organizationId` criteria

      // 8. Load entity relations
      // 8.1 Include organization, representative, identities, and address information
      // 8.2 Retrieve entity taxes for the current and prior fiscal year
      // 8.3 Include information on investments and related taxes

      // 9. Log and return
      // 9.1 Log processing time
      // 9.2 If no data is found, throw an error indicating the entity is not found
      // 9.3 Return extrapolated data by calling `extrapolateData`

      // 10. Data enrichment
      // 10.1 Call `populateCloses` to complete closing information
      // 10.2 Use `populateLedgerEntries` to add ledger entries
      // 10.3 Correct missing capital account amounts with `correctMissingCapitalAccountAmounts`

      // 11. Return enriched data
      // 11.1 Return completed and enriched data for the fiscal year

      // 12. Define and prepare approval
      // 12.1 Set approval status if `fmApproval` is enabled and check that user is not a system call

      // 13. Reset identifiers
      // 13.1 Reset identifiers in `entityTaxRecord` and `investmentTaxRecords` for new creation

      // 14. Check existing records
      // 14.1 Fetch existing records for the fiscal year to avoid duplicates
      // 14.2 Delete existing records if they are found

      // 15. Update fund manager approval
      // 15.1 If `fmApproval` is enabled, update filing status and log the approval date, email, and manager approval

      // 16. Create new records
      // 16.1 Save entity tax record and create all investment tax records with updated information


      // timer ends
      const time_1 = performance.now();

      logger.info('⏱️ Call to controller took ' + (time_1 - time_0) + ' milliseconds.');

      // Log the start of the process
      logger.info(`✅ Successfully generated entities-taxes!`);

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
