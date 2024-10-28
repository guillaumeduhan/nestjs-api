import { EntitiesTaxes } from './entities-taxes.model';
import { EntitiesWithRelations } from './entities.model';
import { InvestmentsTaxes } from './investments-taxes.model';

export interface ConfidenceReport {
  confidence: number;
  drop_reasons: DropReason[];
}

export interface DropReason {
  key: string;
  context: string;
}

export interface ResultWithConfidence<T> {
  result: T;
  confidence_report: ConfidenceReport;
}

export interface TaxRecord1065_Snapshot {
  SCHL: {
    other_investments_beginning_of_tax_year: number;
    other_investments_ending_of_tax_year: number;
    partner_capital_accounts_beginning_of_tax_year: number;
    partner_capital_accounts_ending_of_tax_year: number;
    total_assets_beginning_of_tax_year: number;
    total_assets_ending_of_tax_year: number;
    total_liabilities_and_capital_beginning_of_tax_year: number;
    total_liabilities_and_capital_ending_of_tax_year: number;
  };
  SCHM1: {
    net_income_loss_per_books: number;
  };
  SCHM2: {
    add_lines_1_through_4: number;
    balance_at_beginning_of_year: number;
    balance_at_end_of_year: number;
    capital_contributed_cash: number;
    distributions_cash: number;
    net_income_loss: number;
  };
}

export interface TaxRecordStatisticSlice {
  assets: number;
  capital_contributions: number;
  cash: number;
  expenses: number;
  investor_count: number;
}

export interface TaxRecordStatistics {
  activity_delta: TaxRecordStatisticSlice;
  year_end: TaxRecordStatisticSlice;
  year_start: TaxRecordStatisticSlice;
}

export class TaxRecordsBundleDto {
  entity_tax_record: EntitiesTaxes;

  investment_tax_records: InvestmentsTaxes[];

  source_data?: EntitiesWithRelations;

  snapshot_1065_data?: TaxRecord1065_Snapshot;

  confidence_report: ConfidenceReport;

  constructor(data?: Partial<TaxRecordsBundleDto>) {
    Object.assign(this, data);
  }
}

export interface TaxRecordsBundleDtoRelations {
  // describe navigational properties here
}

export type TaxRecordsBundleDtoWithRelations = TaxRecordsBundleDto &
  TaxRecordsBundleDtoRelations;
