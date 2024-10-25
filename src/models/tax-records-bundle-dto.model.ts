import { EntitiesTaxes } from './entities-taxes.model';
import { EntitiesWithRelations } from './entities.model';
import { InvestmentsTaxes } from './investments-taxes.model';

export interface ConfidenceReport {
  confidence: number;
  dropReasons: DropReason[];
}

export interface DropReason {
  key: string;
  context: string;
}

export interface ResultWithConfidence<T> {
  result: T;
  confidenceReport: ConfidenceReport;
}

export interface TaxRecord1065_Snapshot {
  SCHL: {
    otherInvestmentsBeginningOfTaxYear: number;
    otherInvestmentsEndingOfTaxYear: number;
    partnerCapitalAccountsBeginningOfTaxYear: number;
    partnerCapitalAccountsEndingOfTaxYear: number;
    totalAssetsBeginningOfTaxYear: number;
    totalAssetsEndingOfTaxYear: number;
    totalLiabilitiesAndCapitalBeginningOfTaxYear: number;
    totalLiabilitiesAndCapitalEndingOfTaxYear: number;
  };
  SCHM1: {
    netIncomeLossPerBooks: number;
  };
  SCHM2: {
    addLines1Through4: number;
    balanceAtBeginningOfYear: number;
    balanceAtEndOfYear: number;
    capitalContributedCash: number;
    distributionsCash: number;
    netIncomeLoss: number;
  };
}

export interface TaxRecordStatisticSlice {
  assets: number;
  capitalContributions: number;
  cash: number;
  expenses: number;
  investorCount: number;
}

export interface TaxRecordStatistics {
  activityDelta: TaxRecordStatisticSlice;
  yearEnd: TaxRecordStatisticSlice;
  yearStart: TaxRecordStatisticSlice;
}

export class TaxRecordsBundleDto {
  entityTaxRecord: EntitiesTaxes;

  investmentTaxRecords: InvestmentsTaxes[];

  sourceData?: EntitiesWithRelations;

  snapshot1065Data?: TaxRecord1065_Snapshot;

  confidenceReport: ConfidenceReport;

  constructor(data?: Partial<TaxRecordsBundleDto>) {
    Object.assign(this, data);
  }
}

export interface TaxRecordsBundleDtoRelations {
  // describe navigational properties here
}

export type TaxRecordsBundleDtoWithRelations = TaxRecordsBundleDto &
  TaxRecordsBundleDtoRelations;
