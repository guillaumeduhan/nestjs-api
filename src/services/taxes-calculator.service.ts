import { Closes, ClosesWithRelations } from '@/models/closes.model';
import { Deals, DealsWithRelations } from '@/models/deals.model';
import { EntitiesTaxes } from '@/models/entities-taxes.model';
import { Entities, EntitiesWithRelations } from '@/models/entities.model';
import { InvestmentsTaxes } from '@/models/investments-taxes.model';
import { InvestmentsWithRelations } from '@/models/investments.model';
import { LedgerWithRelations } from '@/models/ledger.model';
import {
  ConfidenceReport,
  ResultWithConfidence,
  TaxRecord1065_Snapshot,
  TaxRecordsBundleDto
} from '@/models/tax-records-bundle-dto.model';
import { UUIDv4, mergeStrings } from '@/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';

export type EntitiesRelations = Entities & EntitiesWithRelations;

const hoistConfidenceReports = (
  ...reports: ConfidenceReport[]
): ConfidenceReport => {
  const total_confidence =
    reports.reduce((acc, report) => acc + report.confidence, 0) /
    reports.length;
  const merged_drop_reasons = reports.map(r => r.drop_reasons).flat();
  return {
    confidence: reports.length > 0 ? total_confidence : 1,
    drop_reasons: merged_drop_reasons,
  };
};

@Injectable()
export class TaxCalculatorService {
  private readonly _VERSION = 'api_0.63';
  private readonly _MANAGEMENT_FEES_CATEGORY_ID = '966230c6-8066-4114-8641-393960e8c7a5';

  constructor(
    @InjectRepository(EntitiesTaxes)
    private readonly entitiesTaxesRepository: Repository<EntitiesTaxes>,
    @InjectRepository(InvestmentsTaxes)
    private readonly investmentsTaxesRepository: Repository<InvestmentsTaxes>,
  ) { }

  async applicableDealContributions(deals: Deals[], tax_year: string): Promise<ResultWithConfidence<number>> {
    const confidence_reports: ConfidenceReport[] = [];
    const data = deals.reduce((overall_contributions, deal: DealsWithRelations) => {
      return (
        overall_contributions +
        (deal.closes ?? []).reduce((close_contributions, close: Closes) => {
          return (
            close_contributions +
            (close.investments ?? []).reduce(
              (investments_contributions, inv: InvestmentsWithRelations) => {
                if (
                  inv.management_fee_percentage === null &&
                  inv.management_fees_dollars === null
                ) {
                  if (inv.capital_wired_amount && inv.capital_wired_amount > 0) {
                    return (
                      investments_contributions + (inv.capital_wired_amount ?? 0)
                    );
                  }
                  if (inv.subscription_amount && inv.subscription_amount > 0) {
                    confidence_reports.push({
                      confidence: 0.6,
                      drop_reasons: [
                        {
                          key: 'INVESTOR_MISSING_CAPITAL_WIRED_AMOUNT',
                          context: `${inv.id} - ${inv.identity.email} - Using Subscription Amount ${inv.subscription_amount}`,
                        },
                      ],
                    });
                    return (
                      investments_contributions + (inv.subscription_amount ?? 0)
                    );
                  }
                }
                return investments_contributions;
              },
              0,
            )
          );
        }, 0)
      );
    }, 0);
    return {
      result: data,
      confidence_report: hoistConfidenceReports(...confidence_reports),
    };
  }

  async calculateDealManagementFeesWithReductions(
    full_fees: number,
    closes: ClosesWithRelations[],
  ): Promise<ResultWithConfidence<number>> {
    const confidence_reports: ConfidenceReport[] = [];
    let negative_check = false;

    const reductions = closes.reduce((close_contributions, close: Closes) => {
      return (
        close_contributions +
        (close.investments ?? []).reduce((subscription_amount, inv: InvestmentsWithRelations) => {
          let override_percent_fee = null;
          if (inv.management_fee_percentage !== null) {
            let inv_percent = inv.management_fee_percentage;
            if (inv_percent < 0) {
              negative_check = true;
              confidence_reports.push({
                confidence: 0.8,
                drop_reasons: [{ key: 'NEGATIVE_MANAGEMENT_FEE_PERCENT_OVERRIDE_FOUND', context: inv.id }],
              });
            }
            if (inv.management_fee_percentage >= 1) {
              inv_percent = parseFloat((inv.management_fee_percentage / 100).toPrecision(8));
            }
            override_percent_fee = inv_percent * full_fees;
          }
          return subscription_amount + (override_percent_fee ?? inv.management_fees_dollars ?? 0);
        }, 0)
      );
    }, 0);

    if (negative_check) {
      return {
        result: -1,
        confidence_report: this.hoistConfidenceReports(...confidence_reports),
      };
    }

    let final_result = full_fees - reductions;
    if (reductions > full_fees) {
      confidence_reports.push({
        confidence: 0.8,
        drop_reasons: [
          { key: 'MANAGEMENT_FEE_OVERRIDES_TOO_LARGE', context: `Without Overrides: ${full_fees} - With Overrides: ${final_result}` },
        ],
      });
      final_result = -1;
    }

    return {
      result: final_result,
      confidence_report: this.hoistConfidenceReports(...confidence_reports),
    };
  }

  async calculateEntityEndingCash(
    entity: EntitiesRelations,
    tax_year: string,
    prior_year_taxes?: EntitiesTaxes,
  ): Promise<ResultWithConfidence<number>> {
    const has_ledger = !!(entity?.ledgers && entity.ledgers.length > 0);
    const has_prior_year = !!prior_year_taxes;
    const initial_cash = has_prior_year ? prior_year_taxes?.entity_ending_cash ?? 0 : 0;

    if (!has_ledger) {
      return {
        result: initial_cash,
        confidence_report: { confidence: 1, drop_reasons: [] },
      };
    }

    const current_cash = (entity.ledgers as LedgerWithRelations[]).reduce(
      (acc, l) => {
        if (l.entry_date.getFullYear() === parseInt(tax_year) || !has_prior_year) {
          if (l.category && l.category.type === 'expense') return acc + -Math.abs(l.subscription_amount);
          else return acc + Math.abs(l.subscription_amount);
        }
        return acc;
      },
      initial_cash,
    );

    return {
      result: current_cash >= 0 ? current_cash : 0,
      confidence_report: {
        confidence: current_cash >= 0 ? 1 : 0.1,
        drop_reasons: [
          ...(current_cash < 0
            ? [{ key: 'ENTITY_CASH_BELOW_ZERO', context: `Entity year-end cash is ${current_cash}` }]
            : []),
        ],
      },
    };
  }

  async calculateEndingLongTermAssets(
    entity: EntitiesRelations,
    tax_year: string,
    prior_year_taxes?: EntitiesTaxes,
  ): Promise<ResultWithConfidence<number>> {
    const has_prior_year = !!prior_year_taxes;
    const initial_assets = has_prior_year ? prior_year_taxes?.entity_ending_long_term_assets ?? 0 : 0;

    if (
      entity.deals &&
      ((entity.deals as Deals[]) ?? []).reduce(
        (_count, current) => current?.closes?.filter(c => dayjs(c.closed_date).isSame(tax_year, 'year'))?.length ?? 0,
        0,
      ) <= 0
    ) {
      return {
        result: initial_assets,
        confidence_report: { confidence: 1, drop_reasons: [] },
      };
    }

    const current_assets = ((entity.deals as Deals[]) ?? []).reduce(
      (acc, d) =>
        acc +
        (d.closes ?? []).reduce(
          (close_acc, c) => close_acc + (dayjs(c.closed_date).isSame(tax_year, 'year') ? c.portfolio_wire_amount : 0),
          0,
        ),
      initial_assets,
    );

    return {
      result: current_assets,
      confidence_report: { confidence: 1, drop_reasons: [] },
    };
  }

  async calculateInvestorContribution(
    investment: any,
    entity: EntitiesWithRelations,
    tax_year: string,
    full_deal_contributions: number,
    year_deal_contributions: number,
    applicable_contributions: number,
    full_deal_fees: number,
    deal_fees: number,
    expenses: number,
    prior_year_tax_record?: any,
  ): Promise<
    ResultWithConfidence<{
      total_contributions: number;
      year_contributions: number;
      current_ownership_percentage: number;
      current_capital_account_amount: number;
      expenses_net_value: number;
    }>
  > {
    const get_contributions = (
      investments_id: string,
      deals: Deals[],
      full_or_year: boolean,
    ): ResultWithConfidence<number> => {
      const confidence_reports: ConfidenceReport[] = [];
      const data = deals.reduce((overall_contributions, deal) => {
        return (
          overall_contributions +
          (deal.closes ?? [])
            .filter((c: Closes) => c.closed_date !== null)
            .filter((c: Closes) =>
              full_or_year
                ? c.closed_date.getFullYear().toString() <= tax_year
                : c.closed_date.getFullYear().toString() === tax_year
            )
            .reduce((close_contributions, close) => {
              return (
                close_contributions +
                (close.investments ?? [])
                  .filter(i => i.id === investments_id)
                  .reduce((investments_contributions, inv) => {
                    if (inv.capital_wired_amount && inv.capital_wired_amount > 0) {
                      return investments_contributions + (inv.capital_wired_amount ?? 0);
                    }
                    if (inv.subscription_amount && inv.subscription_amount > 0) {
                      confidence_reports.push({
                        confidence: 0.6,
                        drop_reasons: [{ key: 'INVESTOR_MISSING_CAPITAL_WIRED_AMOUNT', context: inv.id }],
                      });
                      return investments_contributions + (inv.subscription_amount ?? 0);
                    }
                    return investments_contributions + (inv.capital_wired_amount ?? 0);
                  }, 0)
              );
            }, 0)
        );
      }, 0);

      return {
        result: data,
        confidence_report: this.hoistConfidenceReports(...confidence_reports),
      };
    };

    const total_investor_contributions = get_contributions(investment.id, entity.deals, true);
    const current_year_investor_contributions = get_contributions(investment.id, entity.deals, false);

    const current_ownership_percentage = this.calculateOwnershipPercentage(
      total_investor_contributions.result,
      full_deal_contributions,
    );

    const current_year_ownership_percentage = this.calculateOwnershipPercentage(
      current_year_investor_contributions.result,
      year_deal_contributions,
    );

    const current_expenses_share = parseFloat(
      ((expenses - deal_fees) * current_year_ownership_percentage).toPrecision(5),
    );

    let current_capital_account_amount =
      total_investor_contributions.result -
      (prior_year_tax_record ? 0 : investment.management_fees_dollars ?? 0) -
      (prior_year_tax_record ? 0 : current_expenses_share);

    if (
      prior_year_tax_record &&
      current_year_investor_contributions.result === 0 &&
      current_expenses_share + (prior_year_tax_record ? 0 : investment.management_fees_dollars ?? 0) === 0
    ) {
      current_capital_account_amount = prior_year_tax_record.investor_ending_capital_account_amount;
    }

    return {
      result: {
        total_contributions: total_investor_contributions.result,
        year_contributions: current_year_investor_contributions.result,
        current_ownership_percentage,
        current_capital_account_amount,
        expenses_net_value: (prior_year_tax_record ? 0 : current_expenses_share) ?? 0,
      },
      confidence_report: this.hoistConfidenceReports(
        total_investor_contributions.confidence_report,
        current_year_investor_contributions.confidence_report,
      ),
    };
  }

  async calculateInvestorForeignTaxCreditLimitationApplicable(
    _investment: InvestmentsWithRelations,
    _entity: EntitiesRelations,
    _tax_year: string,
  ): Promise<boolean> {
    return false;
  }

  calculateOwnershipPercentage(investor_contributions: number, deal_contributions: number): number {
    if (deal_contributions === 0) deal_contributions = 1;
    return parseFloat((investor_contributions / deal_contributions).toPrecision(10));
  }

  async createEntityTaxRecord(
    entity: EntitiesRelations,
    tax_year: string,
  ): Promise<ResultWithConfidence<EntitiesTaxes>> {
    const prior_year_entity_tax_record = await this.getPriorYearEntityTaxRecord(entity, tax_year);

    const deals = (entity.deals ?? []).filter(d => {
      return (d.closes ?? []).find(c => c.closed_date?.getFullYear().toString() === tax_year);
    });

    const new_contributions = deals.reduce((overall_contributions, deal) => {
      return (
        overall_contributions +
        (deal.closes ?? []).reduce((close_contributions, close) => {
          if (close.closed_date?.getFullYear() === parseInt(tax_year)) {
            return (
              close_contributions +
              (close.investments ?? []).reduce(
                (investments_contributions, inv) => {
                  if (inv.capital_wired_amount && inv.capital_wired_amount > 0) {
                    return investments_contributions + (inv.capital_wired_amount ?? 0);
                  }
                  if (inv.subscription_amount && inv.subscription_amount > 0) {
                    return investments_contributions + (inv.subscription_amount ?? 0);
                  }
                  return investments_contributions;
                },
                0,
              )
            );
          } else return close_contributions;
        }, 0)
      );
    }, 0);

    const ending_cash = await this.calculateEntityEndingCash(entity, tax_year, prior_year_entity_tax_record.result);
    const expenses = await this.getEntityExpenses(
      entity,
      prior_year_entity_tax_record.result?.entity_ending_current_liabilities,
      tax_year,
    );
    const ending_long_term_assets = await this.calculateEndingLongTermAssets(entity, tax_year, prior_year_entity_tax_record.result);

    return {
      result: new EntitiesTaxes({
        ...prior_year_entity_tax_record?.result,
        created_at: new Date(),
        updated_at: new Date(),
        provider: 'CCH',
        provider_id: undefined,
        id: UUIDv4(),
        '1065_files_id': undefined,
        entity_id: entity.id,
        entity_name: entity.name,
        tax_year: tax_year,
        filing_status: 'needs-customer-approval',
        is_initial_return: !prior_year_entity_tax_record.result,
        entity_ein: entity.ein,
        entity_formation_date: entity.date_of_formation,
        entity_street_address: this.useValue(
          entity.addresses.street_address_line1,
          mergeStrings([entity.addresses?.street_address_line1, entity.addresses?.street_address_line2]),
        ),
        entity_city: this.useValue(entity.addresses.city, entity.addresses?.city),
        entity_state: this.useValue(entity.addresses.state, entity.addresses?.region),
        entity_postal_code: this.useValue(entity.addresses.postal_code, entity.addresses?.postal_code),
        entity_phone_number: this.useValue(entity.addresses.phone_number, entity.partnership_representative?.phone),
        entity_type: entity?.type?.includes('LP') ? 'LP' : 'LLC',
        entity_satisfies_receipts_and_assets: true,
        entity_beginning_cash: prior_year_entity_tax_record?.result?.entity_ending_cash ?? 0,
        entity_beginning_long_term_assets: prior_year_entity_tax_record?.result?.entity_ending_long_term_assets ?? 0,
        entity_ending_long_term_assets: ending_long_term_assets.result,
        entity_beginning_capital: Math.max(
          (prior_year_entity_tax_record?.result?.entity_ending_long_term_assets ?? 0) +
          (prior_year_entity_tax_record.result?.entity_ending_cash ?? 0),
          0,
        ),
        entity_beginning_current_liabilities: expenses.result.beginning_expenses ?? 0,
        entity_ending_current_liabilities: expenses.result.ending_expenses > 0
          ? this.useNumericValue(0, expenses.result.ending_expenses)
          : prior_year_entity_tax_record?.result?.entity_ending_current_liabilities ?? 0,
        entity_capital_contributions: new_contributions + (prior_year_entity_tax_record?.result?.entity_capital_contributions ?? 0),
        entity_ending_cash: ending_cash.result,
        calculator_version: this._VERSION,
      }),
      confidence_report: this.hoistConfidenceReports(
        prior_year_entity_tax_record.confidence_report,
        ending_cash.confidence_report,
        expenses.confidence_report,
        ending_long_term_assets.confidence_report,
      ),
    };
  }

  async createInvestmentTaxRecordForYear(
    investment: any,
    entity: EntitiesRelations,
    tax_year: string,
    full_deal_contributions: number,
    year_deal_contributions: number,
    applicable_contributions: number,
    full_deal_fees: number,
    deal_fees: number,
  ): Promise<ResultWithConfidence<InvestmentsTaxes>> {
    const prior_year_tax_record = await this.getPriorYearInvestmentTaxRecord(entity, investment, tax_year);
    const prior_year_entity_tax_record = await this.getPriorYearEntityTaxRecord(entity, tax_year);
    const expenses = await this.getEntityExpenses(
      entity,
      prior_year_entity_tax_record.result?.entity_ending_current_liabilities,
      tax_year,
    );

    const investor_contribution = await this.calculateInvestorContribution(
      investment,
      entity,
      tax_year,
      full_deal_contributions,
      year_deal_contributions,
      applicable_contributions,
      full_deal_fees,
      deal_fees,
      expenses.result.ending_expenses - expenses.result.beginning_expenses,
      prior_year_tax_record?.result,
    );

    return {
      result: new InvestmentsTaxes({
        id: UUIDv4(),
        partner_index: prior_year_tax_record?.result?.partner_index,
        status: 'needs-customer-approval',
        investment_id: investment.id,
        investor_identities_id: investment.identity_id,
        investor_legal_name: investment.identity?.legal_name,
        investor_tax_id: this.useValue(investment?.identity?.tax_id, prior_year_tax_record?.result?.investor_tax_id),
        investor_street_address: mergeStrings([
          investment?.identity?.addresses?.street_address_line1,
          investment?.identity?.addresses?.street_address_line2,
        ]),
        investor_city: investment.identity?.addresses?.city,
        investor_state: investment.identity?.addresses?.region,
        investor_postal_code: investment.identity?.addresses?.postal_code,
        investor_country: investment.identity?.addresses?.country,
        investor_email: investment?.identity?.email,
        investor_is_us_domestic: investment.identity?.us_domestic,
        investor_entity_type: this.useValue(
          ['individual', ''].includes((investment?.identity?.type ?? '').toLowerCase())
            ? 'Individual'
            : investment?.identity?.entity_type,
          prior_year_tax_record?.result?.investor_entity_type,
        ),
        investor_entity_is_disregarded: investment.identity?.is_disregarded,
        investor_contributions: investor_contribution.result.year_contributions,
        deal_id: investment.deal?.id,
        entity_id: entity.id ?? investment.deal?.entity?.id,
        investor_foreign_tax_credit_limitation_applicable:
          await this.calculateInvestorForeignTaxCreditLimitationApplicable(investment, entity, tax_year),
        investor_beginning_capital_account_amount: this.useNumericValue(
          0,
          prior_year_tax_record?.result?.investor_ending_capital_account_amount,
        ),
        investor_beginning_profit_percentage: prior_year_tax_record?.result?.investor_ending_profit_percentage ?? 0,
        investor_beginning_loss_percentage: prior_year_tax_record?.result?.investor_ending_loss_percentage ?? 0,
        investor_beginning_capital_percentage: prior_year_tax_record?.result?.investor_ending_capital_percentage ?? 0,
        investor_ownership_percent: investor_contribution.result.current_ownership_percentage ?? 0,
        investor_ending_capital_account_amount: investor_contribution.result.current_capital_account_amount ?? 0,
        investor_ending_profit_percentage: investor_contribution.result.current_ownership_percentage ?? 0,
        investor_ending_loss_percentage: investor_contribution.result.current_ownership_percentage ?? 0,
        investor_ending_capital_percentage: investor_contribution.result.current_ownership_percentage ?? 0,
        investor_current_year_net_income_loss: investor_contribution.result.expenses_net_value,
        tax_year: tax_year,
        calculator_version: this._VERSION,
        investment: investment,
        deal: investment.deal,
        entity: entity ?? investment.deal?.entity,
        record_version: 1,
      } as InvestmentsTaxes),
      confidence_report: this.hoistConfidenceReports(
        prior_year_tax_record.confidence_report,
        investor_contribution.confidence_report,
      ),
    };
  }

  async createTaxRecordsForYear(
    entity: EntitiesRelations,
    tax_year: string,
    ignore_deals_requirement: boolean = false,
  ): Promise<TaxRecordsBundleDto> {
    if ((!entity?.deals || entity?.deals.length < 1) && !ignore_deals_requirement) {
      throw new HttpException('No Deal Records Present', HttpStatus.BAD_REQUEST);
    }

    const data = new TaxRecordsBundleDto({
      entity_tax_record: new EntitiesTaxes(),
      investment_tax_records: [],
      confidence_report: { confidence: 0, drop_reasons: [] },
      source_data: entity,
    });

    const confidence_reports: ConfidenceReport[] = [];

    const applicable_deal_contributions_data = await this.applicableDealContributions(entity.deals ?? [], tax_year);
    const full_deal_contributions_data = await this.dealContributions(entity.deals ?? [], tax_year, true);
    const year_deal_contributions_data = await this.dealContributions(entity.deals ?? [], tax_year, false);

    const current_year_management_fee_ledgers = (entity.ledgers ?? []).filter(
      (l: any) => l.categories_id === this._MANAGEMENT_FEES_CATEGORY_ID && dayjs(l.entry_date).isSame(tax_year, 'year')
    );

    for (const deal of entity.deals ?? []) {
      const closes = (deal.closes ?? []).filter(
        c => dayjs(c.closed_date).isSame(tax_year, 'year') || dayjs(c.closed_date).isBefore(tax_year, 'year')
      );

      let full_deal_fees = current_year_management_fee_ledgers.reduce((ledger_fees, ledger) => ledger_fees + ledger.subscription_amount, 0);

      const deal_fees = await this.calculateDealManagementFeesWithReductions(
        full_deal_fees,
        closes.filter(c => dayjs(c.closed_date).isSame(tax_year, 'year')),
      );
      confidence_reports.push(deal_fees.confidence_report);

      for (const close of closes) {
        for (const investment of close.investments ?? []) {
          const record = await this.createInvestmentTaxRecordForYear(
            investment,
            entity,
            tax_year,
            full_deal_contributions_data.result,
            year_deal_contributions_data.result,
            applicable_deal_contributions_data.result,
            full_deal_fees,
            deal_fees.result,
          );
          confidence_reports.push(record.confidence_report);
          data.investment_tax_records.push(record.result);
        }
      }
    }

    const entity_tax_record = await this.createEntityTaxRecord(entity, tax_year);
    const prior_year_tax_record = await this.getPriorYearEntityTaxRecord(entity, tax_year);
    const prior_expenses = prior_year_tax_record.result?.entity_portfolio_expense;

    data.entity_tax_record = entity_tax_record.result;
    confidence_reports.push(entity_tax_record.confidence_report);
    data.confidence_report = this.hoistConfidenceReports(...confidence_reports);
    data.snapshot_1065_data = await this.generate1065SnapshotData(data.entity_tax_record, prior_expenses ?? 0);

    return new TaxRecordsBundleDto(data);
  }

  async dealContributions(
    deals: Deals[],
    tax_year: string,
    full_or_year: boolean,
  ): Promise<ResultWithConfidence<number>> {
    const confidence_reports: ConfidenceReport[] = [];
    const data = deals.reduce((overall_contributions, deal) => {
      return (
        overall_contributions +
        (full_or_year
          ? deal.closes ?? []
          : deal.closes?.filter(c => dayjs(c.closed_date).isSame(tax_year, 'year')) ?? []
        ).reduce((close_contributions, close) => {
          return (
            close_contributions +
            (close.investments ?? []).reduce(
              (investments_contributions, inv) => {
                if (inv.capital_wired_amount && inv.capital_wired_amount > 0) {
                  return investments_contributions + (inv.capital_wired_amount ?? 0);
                }
                if (inv.subscription_amount && inv.subscription_amount > 0) {
                  confidence_reports.push({
                    confidence: 0.6,
                    drop_reasons: [{ key: 'INVESTOR_MISSING_CAPITAL_WIRED_AMOUNT', context: inv.id }],
                  });
                  return investments_contributions + (inv.subscription_amount ?? 0);
                }
                return investments_contributions;
              },
              0,
            )
          );
        }, 0)
      );
    }, 0);

    return {
      result: data,
      confidence_report: this.hoistConfidenceReports(...confidence_reports),
    };
  }

  async getEntityExpenses(
    entity: EntitiesRelations,
    prior_year_expenses_from_record: number | undefined,
    tax_year: string,
  ) {
    const has_ledger = !!(entity?.ledgers && entity.ledgers.length > 0);
    if (!has_ledger) {
      return {
        result: { beginning_expenses: prior_year_expenses_from_record ?? 0, ending_expenses: prior_year_expenses_from_record ?? 0 },
        confidence_report: { confidence: 1, drop_reasons: [] },
      };
    }

    const prior_year_expenses_calculated = (entity.ledgers as LedgerWithRelations[]).reduce(
      (acc, l) =>
        acc +
        (l.category.type === 'expense' &&
          l.category.name !== 'Asset Purchase' &&
          l.entry_date.getFullYear() === parseInt(tax_year) - 1
          ? l.subscription_amount
          : 0),
      0,
    );

    const expenses = (entity.ledgers as LedgerWithRelations[]).reduce(
      (acc, l) =>
        acc +
        (l.category.type === 'expense' &&
          l.category.name !== 'Asset Purchase' &&
          l.entry_date.getFullYear() === parseInt(tax_year)
          ? l.subscription_amount
          : 0),
      prior_year_expenses_calculated > 0 ? prior_year_expenses_calculated : prior_year_expenses_from_record,
    );

    const prior_year_entity_tax_record = await this.getPriorYearEntityTaxRecord(entity, tax_year);
    return {
      result: {
        beginning_expenses: prior_year_entity_tax_record.result
          ? prior_year_expenses_calculated > 0
            ? prior_year_expenses_calculated
            : prior_year_expenses_from_record
          : 0,
        ending_expenses: expenses,
      },
      confidence_report: { confidence: 1, drop_reasons: [] },
    };
  }

  async getPriorYearEntityTaxRecord(
    entity: EntitiesRelations,
    tax_year: string,
  ): Promise<ResultWithConfidence<EntitiesTaxes | undefined>> {
    const prior_year = parseInt(tax_year) - 1;
    return {
      result: (entity.entities_taxes ?? []).find((r: EntitiesTaxes) => parseInt(r.tax_year ?? '0') === prior_year),
      confidence_report: { confidence: 1, drop_reasons: [] },
    };
  }

  async getPriorYearInvestmentTaxRecord(
    entity: EntitiesRelations,
    investment: InvestmentsWithRelations,
    tax_year: string,
  ): Promise<ResultWithConfidence<InvestmentsTaxes | undefined>> {
    const prior_year = parseInt(tax_year) - 1;
    const record = (investment?.investments_taxes ?? []).find(
      (r: InvestmentsTaxes) => parseInt(r.tax_year ?? '0') === prior_year,
    );
    return {
      result: record,
      confidence_report: { confidence: 1, drop_reasons: [] },
    };
  }

  async generate1065SnapshotData(
    entity_tax_record: EntitiesTaxes,
    prior_expenses: number,
  ): Promise<TaxRecord1065_Snapshot> {
    const normalize = (input: number | undefined | null) => {
      return Math.max(0, input ?? 0);
    };
    const calculate_total_assets_beginning = () => {
      return (
        normalize(entity_tax_record.entity_beginning_long_term_assets) +
        normalize(entity_tax_record.entity_beginning_cash)
      );
    };

    const calculate_total_assets_ending = () => {
      return (
        normalize(entity_tax_record.entity_ending_long_term_assets) +
        normalize(entity_tax_record.entity_ending_cash)
      );
    };

    const calculate_net_income_loss = () => {
      return -(
        normalize(entity_tax_record.entity_ending_current_liabilities) -
        normalize(entity_tax_record.entity_beginning_current_liabilities)
      );
    };

    const calculate_capital_contributed = () => {
      let source_data = normalize(entity_tax_record.entity_beginning_capital);

      if (
        entity_tax_record?.entity_capital_contributions &&
        entity_tax_record.entity_capital_contributions > 0
      ) {
        source_data =
          normalize(entity_tax_record.entity_capital_contributions) -
          normalize(prior_expenses);
      }

      return source_data - normalize(entity_tax_record.entity_beginning_capital);
    };

    return {
      SCHL: {
        other_investments_beginning_of_tax_year: normalize(
          entity_tax_record.entity_beginning_long_term_assets,
        ),
        other_investments_ending_of_tax_year: normalize(
          entity_tax_record.entity_ending_long_term_assets,
        ),
        total_assets_beginning_of_tax_year: calculate_total_assets_beginning(),
        total_assets_ending_of_tax_year: calculate_total_assets_ending(),
        partner_capital_accounts_beginning_of_tax_year:
          calculate_total_assets_beginning(),
        partner_capital_accounts_ending_of_tax_year: calculate_total_assets_ending(),
        total_liabilities_and_capital_beginning_of_tax_year:
          calculate_total_assets_beginning(),
        total_liabilities_and_capital_ending_of_tax_year: calculate_total_assets_ending(),
      },
      SCHM1: {
        net_income_loss_per_books: calculate_net_income_loss(),
      },
      SCHM2: {
        balance_at_beginning_of_year: normalize(
          entity_tax_record.entity_beginning_capital,
        ),
        capital_contributed_cash: calculate_capital_contributed(),
        net_income_loss: calculate_net_income_loss(),
        add_lines_1_through_4:
          normalize(entity_tax_record.entity_beginning_capital) +
          calculate_capital_contributed() +
          calculate_net_income_loss(),
        distributions_cash: 0,
        balance_at_end_of_year:
          normalize(entity_tax_record.entity_beginning_capital) +
          calculate_capital_contributed() +
          calculate_net_income_loss(),
      },
    };
  }

  hoistConfidenceReports(...reports: ConfidenceReport[]): ConfidenceReport {
    const total_confidence = reports.reduce((acc, report) => acc + report.confidence, 0) / reports.length;
    const merged_drop_reasons = reports.map(r => r.drop_reasons).flat();
    return {
      confidence: reports.length > 0 ? total_confidence : 1,
      drop_reasons: merged_drop_reasons,
    };
  }

  useNumericValue(default_value = 0, ...args: Array<number | undefined | null>): number {
    return args.find(i => i) ?? default_value;
  }

  useValue(...args: Array<string | undefined | null>): string | undefined | null {
    return args.find(i => i && i.trim() !== '');
  }
}
