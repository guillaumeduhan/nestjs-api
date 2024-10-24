import { Deals } from '@/models/deals.model';
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

  async applicableDealContributions(deals: Deals[], taxYear: string): Promise<ResultWithConfidence<number>> {
    const confidenceReports: ConfidenceReport[] = [];
    const data = deals.reduce((overallContributions, deal) => {
      return (
        overallContributions +
        (deal.closes ?? []).reduce((closeContributions, close) => {
          return (
            closeContributions +
            (close.investments ?? []).reduce(
              (investmentsContributions, inv) => {
                if (
                  inv.managementFeePercent === null &&
                  inv.managementFeesDollars === null &&
                  inv.capitalWiredAmount &&
                  inv.capitalWiredAmount > 0
                ) {
                  return investmentsContributions + (inv.capitalWiredAmount ?? 0);
                }
                if (inv.subscriptionAmount && inv.subscriptionAmount > 0) {
                  confidenceReports.push({
                    confidence: 0.6,
                    dropReasons: [{ key: 'INVESTOR_MISSING_CAPITAL_WIRED_AMOUNT', context: inv.id }],
                  });
                  return investmentsContributions + (inv.subscriptionAmount ?? 0);
                }
                return investmentsContributions;
              },
              0,
            )
          );
        }, 0)
      );
    }, 0);

    return {
      result: data,
      confidenceReport: this.hoistConfidenceReports(...confidenceReports),
    };
  }

  async calculateDealManagementFeesWithReductions(
    fullFees: number,
    closes: any[],
  ): Promise<ResultWithConfidence<number>> {
    const confidenceReports: ConfidenceReport[] = [];
    let negativeCheck = false;

    const reductions = closes.reduce((closeContributions, close) => {
      return (
        closeContributions +
        (close.investments ?? []).reduce((amount, inv) => {
          let overridePercentFee = null;
          if (inv.managementFeePercent !== null) {
            let invPercent = inv.managementFeePercent;
            if (invPercent < 0) {
              negativeCheck = true;
              confidenceReports.push({
                confidence: 0.8,
                dropReasons: [{ key: 'NEGATIVE_MANAGEMENT_FEE_PERCENT_OVERRIDE_FOUND', context: inv.id }],
              });
            }
            if (inv.managementFeePercent >= 1) {
              invPercent = parseFloat((inv.managementFeePercent / 100).toPrecision(8));
            }
            overridePercentFee = invPercent * fullFees;
          }
          return amount + (overridePercentFee ?? inv.managementFeesDollars ?? 0);
        }, 0)
      );
    }, 0);

    if (negativeCheck) {
      return {
        result: -1,
        confidenceReport: this.hoistConfidenceReports(...confidenceReports),
      };
    }

    let finalResult = fullFees - reductions;
    if (reductions > fullFees) {
      confidenceReports.push({
        confidence: 0.8,
        dropReasons: [
          { key: 'MANAGEMENT_FEE_OVERRIDES_TOO_LARGE', context: `Without Overrides: ${fullFees} - With Overrides: ${finalResult}` },
        ],
      });
      finalResult = -1;
    }

    return {
      result: finalResult,
      confidenceReport: this.hoistConfidenceReports(...confidenceReports),
    };
  }

  async calculateEntityEndingCash(
    entity: EntitiesRelations,
    taxYear: string,
    priorYearTaxes?: EntitiesTaxes,
  ): Promise<ResultWithConfidence<number>> {
    const hasLedger = !!(entity?.ledgers && entity.ledgers.length > 0);
    const hasPriorYear = !!priorYearTaxes;
    const initialCash = hasPriorYear ? priorYearTaxes?.entityEndingCash ?? 0 : 0;

    if (!hasLedger) {
      return {
        result: initialCash,
        confidenceReport: { confidence: 1, dropReasons: [] },
      };
    }

    const currentCash = (entity.ledgers as LedgerWithRelations[]).reduce(
      (acc, l) => {
        if (l.entryDate.getFullYear() === parseInt(taxYear) || !hasPriorYear) {
          if (l.category.type === 'expense') return acc + -Math.abs(l.amount);
          else return acc + Math.abs(l.amount);
        }
        return acc;
      },
      initialCash,
    );

    return {
      result: currentCash >= 0 ? currentCash : 0,
      confidenceReport: {
        confidence: currentCash >= 0 ? 1 : 0.1,
        dropReasons: [
          ...(currentCash < 0
            ? [{ key: 'ENTITY_CASH_BELOW_ZERO', context: `Entity year-end cash is ${currentCash}` }]
            : []),
        ],
      },
    };
  }

  async calculateEndingLongTermAssets(
    entity: EntitiesRelations,
    taxYear: string,
    priorYearTaxes?: EntitiesTaxes,
  ): Promise<ResultWithConfidence<number>> {
    const hasPriorYear = !!priorYearTaxes;
    const initialAssets = hasPriorYear ? priorYearTaxes?.entityEndingLongTermAssets ?? 0 : 0;

    if (
      entity.deals &&
      ((entity.deals as Deals[]) ?? []).reduce(
        (_count, current) => current?.closes?.filter(c => dayjs(c.closedDate).isSame(taxYear, 'year'))?.length ?? 0,
        0,
      ) <= 0
    ) {
      return {
        result: initialAssets,
        confidenceReport: { confidence: 1, dropReasons: [] },
      };
    }

    const currentAssets = ((entity.deals as Deals[]) ?? []).reduce(
      (acc, d) =>
        acc +
        (d.closes ?? []).reduce(
          (closeAcc, c) => closeAcc + (dayjs(c.closedDate).isSame(taxYear, 'year') ? c.portfolioWireAmount : 0),
          0,
        ),
      initialAssets,
    );

    return {
      result: currentAssets,
      confidenceReport: { confidence: 1, dropReasons: [] },
    };
  }

  async calculateInvestorContribution(
    investment: InvestmentsWithRelations,
    entity: EntitiesRelations,
    taxYear: string,
    fullDealContributions: number,
    yearDealContributions: number,
    applicableContributions: number,
    fullDealFees: number,
    dealFees: number,
    expenses: number,
    priorYearTaxRecord?: any,
  ): Promise<
    ResultWithConfidence<{
      totalContributions: number;
      yearContributions: number;
      currentOwnershipPercentage: number;
      currentCapitalAccountAmount: number;
      expensesNetValue: number;
    }>
  > {
    const getContributions = (
      investmentsId: string,
      deals: Deals[],
      fullOrYear: boolean,
    ): ResultWithConfidence<number> => {
      const confidenceReports: ConfidenceReport[] = [];
      const data = deals.reduce((overallContributions, deal) => {
        return (
          overallContributions +
          (deal.closes ?? [])
            .filter(c =>
              fullOrYear
                ? c.closedDate!.getFullYear().toString() <= taxYear
                : c.closedDate!.getFullYear().toString() === taxYear,
            )
            .reduce((closeContributions, close) => {
              return (
                closeContributions +
                (close.investments ?? [])
                  .filter(i => i.id === investmentsId)
                  .reduce((investmentsContributions, inv) => {
                    if (inv.capitalWiredAmount && inv.capitalWiredAmount > 0) {
                      return investmentsContributions + (inv.capitalWiredAmount ?? 0);
                    }
                    if (inv.subscriptionAmount && inv.subscriptionAmount > 0) {
                      confidenceReports.push({
                        confidence: 0.6,
                        dropReasons: [{ key: 'INVESTOR_MISSING_CAPITAL_WIRED_AMOUNT', context: inv.id }],
                      });
                      return investmentsContributions + (inv.subscriptionAmount ?? 0);
                    }
                    return investmentsContributions + (inv.capitalWiredAmount ?? 0);
                  }, 0)
              );
            }, 0)
        );
      }, 0);

      return {
        result: data,
        confidenceReport: this.hoistConfidenceReports(...confidenceReports),
      };
    };

    const totalInvestorContributions = getContributions(investment.id, entity.deals, true);
    const currentYearInvestorContributions = getContributions(investment.id, entity.deals, false);

    const currentOwnershipPercentage = this.calculateOwnershipPercentage(
      totalInvestorContributions.result,
      fullDealContributions,
    );

    const currentYearOwnershipPercentage = this.calculateOwnershipPercentage(
      currentYearInvestorContributions.result,
      yearDealContributions,
    );

    const currentExpensesShare = parseFloat(
      ((expenses - dealFees) * currentYearOwnershipPercentage).toPrecision(5),
    );

    let currentCapitalAccountAmount =
      totalInvestorContributions.result -
      (priorYearTaxRecord ? 0 : investment.managementFeesDollars ?? 0) -
      (priorYearTaxRecord ? 0 : currentExpensesShare);

    if (
      priorYearTaxRecord &&
      currentYearInvestorContributions.result === 0 &&
      currentExpensesShare + (priorYearTaxRecord ? 0 : investment.managementFeesDollars ?? 0) === 0
    ) {
      currentCapitalAccountAmount = priorYearTaxRecord.investorEndingCapitalAccountAmount;
    }

    return {
      result: {
        totalContributions: totalInvestorContributions.result,
        yearContributions: currentYearInvestorContributions.result,
        currentOwnershipPercentage,
        currentCapitalAccountAmount,
        expensesNetValue: (priorYearTaxRecord ? 0 : currentExpensesShare) ?? 0,
      },
      confidenceReport: this.hoistConfidenceReports(
        totalInvestorContributions.confidenceReport,
        currentYearInvestorContributions.confidenceReport,
      ),
    };
  }

  async calculateInvestorForeignTaxCreditLimitationApplicable(
    _investment: InvestmentsWithRelations,
    _entity: EntitiesRelations,
    _taxYear: string,
  ): Promise<boolean> {
    return false;
  }

  calculateOwnershipPercentage(investorContributions: number, dealContributions: number): number {
    if (dealContributions === 0) dealContributions = 1;
    return parseFloat((investorContributions / dealContributions).toPrecision(10));
  }

  async createEntityTaxRecord(
    entity: EntitiesRelations,
    taxYear: string,
  ): Promise<ResultWithConfidence<EntitiesTaxes>> {
    const priorYearEntityTaxRecord = await this.getPriorYearEntityTaxRecord(entity, taxYear);

    const deals = (entity.deals ?? []).filter(d => {
      return (d.closes ?? []).find(c => c.closedDate?.getFullYear().toString() === taxYear);
    });

    const newContributions = deals.reduce((overallContributions, deal) => {
      return (
        overallContributions +
        (deal.closes ?? []).reduce((closeContributions, close) => {
          if (close.closedDate?.getFullYear() === parseInt(taxYear)) {
            return (
              closeContributions +
              (close.investments ?? []).reduce(
                (investmentsContributions, inv) => {
                  if (inv.capitalWiredAmount && inv.capitalWiredAmount > 0) {
                    return investmentsContributions + (inv.capitalWiredAmount ?? 0);
                  }
                  if (inv.subscriptionAmount && inv.subscriptionAmount > 0) {
                    return investmentsContributions + (inv.subscriptionAmount ?? 0);
                  }
                  return investmentsContributions;
                },
                0,
              )
            );
          } else return closeContributions;
        }, 0)
      );
    }, 0);

    const endingCash = await this.calculateEntityEndingCash(entity, taxYear, priorYearEntityTaxRecord.result);
    const expenses = await this.getEntityExpenses(
      entity,
      priorYearEntityTaxRecord.result?.entityEndingCurrentLiabilities,
      taxYear,
    );
    const endingLongTermAssets = await this.calculateEndingLongTermAssets(entity, taxYear, priorYearEntityTaxRecord.result);

    return {
      result: new EntitiesTaxes({
        ...priorYearEntityTaxRecord?.result,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'CCH',
        providerId: undefined,
        id: UUIDv4(),
        '1065FilesId': undefined,
        entityId: entity.id,
        entityName: entity.name,
        taxYear: taxYear,
        filingStatus: 'needs-customer-approval',
        isInitialReturn: !priorYearEntityTaxRecord.result,
        entityEin: entity.ein,
        entityFormationDate: entity.dateOfFormation,
        entityStreetAddress: this.useValue(
          entity.streetAddress,
          mergeStrings([entity.organization?.addressLine1, entity.organization?.addressLine2]),
        ),
        entityCity: this.useValue(entity.city, entity.organization?.city),
        entityState: this.useValue(entity.state, entity.organization?.region),
        entityPostalCode: this.useValue(entity.postalCode, entity.organization?.postalCode),
        entityPhoneNumber: this.useValue(entity.phoneNumber, entity.partnershipRepresentative?.phone),
        entityType: entity?.type?.includes('LP') ? 'LP' : 'LLC',
        entitySatisfiesReceiptsAndAssets: true,
        entityBeginningCash: priorYearEntityTaxRecord?.result?.entityEndingCash ?? 0,
        entityBeginningLongTermAssets: priorYearEntityTaxRecord?.result?.entityEndingLongTermAssets ?? 0,
        entityEndingLongTermAssets: endingLongTermAssets.result,
        entityBeginningCapital: Math.max(
          (priorYearEntityTaxRecord?.result?.entityEndingLongTermAssets ?? 0) +
          (priorYearEntityTaxRecord.result?.entityEndingCash ?? 0),
          0,
        ),
        entityBeginningCurrentLiabilities: expenses.result.beginningExpenses ?? 0,
        entityEndingCurrentLiabilities: expenses.result.endingExpenses > 0
          ? this.useNumericValue(0, expenses.result.endingExpenses)
          : priorYearEntityTaxRecord?.result?.entityEndingCurrentLiabilities ?? 0,
        entityCapitalContributions: newContributions + (priorYearEntityTaxRecord?.result?.entityCapitalContributions ?? 0),
        entityEndingCash: endingCash.result,
        calculatorVersion: this._VERSION,
      }),
      confidenceReport: this.hoistConfidenceReports(
        priorYearEntityTaxRecord.confidenceReport,
        endingCash.confidenceReport,
        expenses.confidenceReport,
        endingLongTermAssets.confidenceReport,
      ),
    };
  }

  async createInvestmentTaxRecordForYear(
    investment: InvestmentsWithRelations,
    entity: EntitiesRelations,
    taxYear: string,
    fullDealContributions: number,
    yearDealContributions: number,
    applicableContributions: number,
    fullDealFees: number,
    dealFees: number,
  ): Promise<ResultWithConfidence<InvestmentsTaxes>> {
    const priorYearTaxRecord = await this.getPriorYearInvestmentTaxRecord(entity, investment, taxYear);
    const priorYearEntityTaxRecord = await this.getPriorYearEntityTaxRecord(entity, taxYear);
    const expenses = await this.getEntityExpenses(
      entity,
      priorYearEntityTaxRecord.result?.entityEndingCurrentLiabilities,
      taxYear,
    );

    const investorContribution = await this.calculateInvestorContribution(
      investment,
      entity,
      taxYear,
      fullDealContributions,
      yearDealContributions,
      applicableContributions,
      fullDealFees,
      dealFees,
      expenses.result.endingExpenses - expenses.result.beginningExpenses,
      priorYearTaxRecord?.result,
    );

    return {
      result: new InvestmentsTaxes({
        id: UUIDv4(),
        partnerIndex: priorYearTaxRecord?.result?.partnerIndex,
        status: 'needs-customer-approval',
        investmentId: investment.id,
        investorIdentitiesId: investment.identitiesId,
        investorLegalName: investment.identity?.legalName,
        investorTaxId: this.useValue(investment?.identity?.taxId, priorYearTaxRecord?.result?.investorTaxId),
        investorStreetAddress: mergeStrings([
          investment?.identity?.addressLine_1,
          investment?.identity?.addressLine_2,
        ]),
        investorCity: investment.identity?.city,
        investorState: investment.identity?.region,
        investorPostalCode: investment.identity?.postalCode,
        investorCountry: investment.identity?.country,
        investorEmail: investment?.identity?.userEmail,
        investorIsUsDomestic: investment.identity?.usDomestic,
        investorEntityType: this.useValue(
          ['individual', ''].includes((investment?.identity?.type ?? '').toLowerCase())
            ? 'Individual'
            : investment?.identity?.entityType,
          priorYearTaxRecord?.result?.investorEntityType,
        ),
        investorEntityIsDisregarded: investment.identity?.entityIsDisregarded,
        investorContributions: investorContribution.result.yearContributions,
        dealId: investment.deal?.id,
        entityId: entity.id ?? investment.deal?.entity?.id,
        investorForeignTaxCreditLimitationApplicable:
          await this.calculateInvestorForeignTaxCreditLimitationApplicable(investment, entity, taxYear),
        investorBeginningCapitalAccountAmount: this.useNumericValue(
          0,
          priorYearTaxRecord?.result?.investorEndingCapitalAccountAmount,
        ),
        investorBeginningProfitPercentage: priorYearTaxRecord?.result?.investorEndingProfitPercentage ?? 0,
        investorBeginningLossPercentage: priorYearTaxRecord?.result?.investorEndingLossPercentage ?? 0,
        investorBeginningCapitalPercentage: priorYearTaxRecord?.result?.investorEndingCapitalPercentage ?? 0,
        investorOwnershipPercent: investorContribution.result.currentOwnershipPercentage ?? 0,
        investorEndingCapitalAccountAmount: investorContribution.result.currentCapitalAccountAmount ?? 0,
        investorEndingProfitPercentage: investorContribution.result.currentOwnershipPercentage ?? 0,
        investorEndingLossPercentage: investorContribution.result.currentOwnershipPercentage ?? 0,
        investorEndingCapitalPercentage: investorContribution.result.currentOwnershipPercentage ?? 0,
        investorCurrentYearNetIncomeLoss: investorContribution.result.expensesNetValue,
        taxYear: taxYear,
        calculatorVersion: this._VERSION,
        investment: investment,
      } as InvestmentsTaxes),
      confidenceReport: this.hoistConfidenceReports(
        priorYearTaxRecord.confidenceReport,
        investorContribution.confidenceReport,
      ),
    };
  }

  async createTaxRecordsForYear(
    entity: EntitiesRelations,
    taxYear: string,
    ignoreDealsRequirement: boolean = false,
  ): Promise<TaxRecordsBundleDto> {
    if ((!entity?.deals || entity?.deals.length < 1) && !ignoreDealsRequirement) {
      throw new HttpException('No Deal Records Present', HttpStatus.BAD_REQUEST);
    }

    const data = new TaxRecordsBundleDto({
      entityTaxRecord: new EntitiesTaxes(),
      investmentTaxRecords: [],
      confidenceReport: { confidence: 0, dropReasons: [] },
      sourceData: entity,
    });

    const confidenceReports: ConfidenceReport[] = [];

    const applicableDealContributionsData = await this.applicableDealContributions(entity.deals ?? [], taxYear);
    const fullDealContributionsData = await this.dealContributions(entity.deals ?? [], taxYear, true);
    const yearDealContributionsData = await this.dealContributions(entity.deals ?? [], taxYear, false);

    const currentYearManagementFeeLedgers = (entity.ledgers ?? []).filter(
      l => l.categoriesId === this._MANAGEMENT_FEES_CATEGORY_ID && dayjs(l.entryDate).isSame(taxYear, 'year')
    );

    for (const deal of entity.deals ?? []) {
      const closes = (deal.closes ?? []).filter(
        c => dayjs(c.closedDate).isSame(taxYear, 'year') || dayjs(c.closedDate).isBefore(taxYear, 'year')
      );

      let fullDealFees = currentYearManagementFeeLedgers.reduce((ledgerFees, ledger) => ledgerFees + ledger.amount, 0);

      const dealFees = await this.calculateDealManagementFeesWithReductions(
        fullDealFees,
        closes.filter(c => dayjs(c.closedDate).isSame(taxYear, 'year')),
      );
      confidenceReports.push(dealFees.confidenceReport);

      for (const close of closes) {
        for (const investment of close.investments ?? []) {
          const record = await this.createInvestmentTaxRecordForYear(
            investment,
            entity,
            taxYear,
            fullDealContributionsData.result,
            yearDealContributionsData.result,
            applicableDealContributionsData.result,
            fullDealFees,
            dealFees.result,
          );
          confidenceReports.push(record.confidenceReport);
          data.investmentTaxRecords.push(record.result);
        }
      }
    }

    const entityTaxRecord = await this.createEntityTaxRecord(entity, taxYear);
    const priorYearTaxRecord = await this.getPriorYearEntityTaxRecord(entity, taxYear);
    const priorExpenses = priorYearTaxRecord.result?.entityPortfolioExpense;

    data.entityTaxRecord = entityTaxRecord.result;
    confidenceReports.push(entityTaxRecord.confidenceReport);
    data.confidenceReport = this.hoistConfidenceReports(...confidenceReports);
    data.snapshot1065Data = await this.generate1065SnapshotData(data.entityTaxRecord, priorExpenses ?? 0);

    return new TaxRecordsBundleDto(data);
  }

  async dealContributions(
    deals: Deals[],
    taxYear: string,
    fullOrYear: boolean,
  ): Promise<ResultWithConfidence<number>> {
    const confidenceReports: ConfidenceReport[] = [];
    const data = deals.reduce((overallContributions, deal) => {
      return (
        overallContributions +
        (fullOrYear
          ? deal.closes ?? []
          : deal.closes?.filter(c => dayjs(c.closedDate).isSame(taxYear, 'year')) ?? []
        ).reduce((closeContributions, close) => {
          return (
            closeContributions +
            (close.investments ?? []).reduce(
              (investmentsContributions, inv) => {
                if (inv.capitalWiredAmount && inv.capitalWiredAmount > 0) {
                  return investmentsContributions + (inv.capitalWiredAmount ?? 0);
                }
                if (inv.subscriptionAmount && inv.subscriptionAmount > 0) {
                  confidenceReports.push({
                    confidence: 0.6,
                    dropReasons: [{ key: 'INVESTOR_MISSING_CAPITAL_WIRED_AMOUNT', context: inv.id }],
                  });
                  return investmentsContributions + (inv.subscriptionAmount ?? 0);
                }
                return investmentsContributions;
              },
              0,
            )
          );
        }, 0)
      );
    }, 0);

    return {
      result: data,
      confidenceReport: this.hoistConfidenceReports(...confidenceReports),
    };
  }

  async getEntityExpenses(
    entity: EntitiesRelations,
    priorYearExpensesFromRecord: number | undefined,
    taxYear: string,
  ) {
    const hasLedger = !!(entity?.ledgers && entity.ledgers.length > 0);
    if (!hasLedger) {
      return {
        result: { beginningExpenses: priorYearExpensesFromRecord ?? 0, endingExpenses: priorYearExpensesFromRecord ?? 0 },
        confidenceReport: { confidence: 1, dropReasons: [] },
      };
    }

    const priorYearExpensesCalculated = (entity.ledgers as LedgerWithRelations[]).reduce(
      (acc, l) =>
        acc +
        (l.category.type === 'expense' &&
          l.category.name !== 'Asset Purchase' &&
          l.entryDate.getFullYear() === parseInt(taxYear) - 1
          ? l.amount
          : 0),
      0,
    );

    const expenses = (entity.ledgers as LedgerWithRelations[]).reduce(
      (acc, l) =>
        acc +
        (l.category.type === 'expense' &&
          l.category.name !== 'Asset Purchase' &&
          l.entryDate.getFullYear() === parseInt(taxYear)
          ? l.amount
          : 0),
      priorYearExpensesCalculated > 0 ? priorYearExpensesCalculated : priorYearExpensesFromRecord,
    );

    const priorYearEntityTaxRecord = await this.getPriorYearEntityTaxRecord(entity, taxYear);
    return {
      result: {
        beginningExpenses: priorYearEntityTaxRecord.result
          ? priorYearExpensesCalculated > 0
            ? priorYearExpensesCalculated
            : priorYearExpensesFromRecord
          : 0,
        endingExpenses: expenses,
      },
      confidenceReport: { confidence: 1, dropReasons: [] },
    };
  }

  async getPriorYearEntityTaxRecord(
    entity: EntitiesRelations,
    taxYear: string,
  ): Promise<ResultWithConfidence<EntitiesTaxes | undefined>> {
    const priorYear = parseInt(taxYear) - 1;
    return {
      result: (entity.entitiesTaxes ?? []).find((r: EntitiesTaxes) => parseInt(r.taxYear ?? '0') === priorYear),
      confidenceReport: { confidence: 1, dropReasons: [] },
    };
  }

  async getPriorYearInvestmentTaxRecord(
    entity: EntitiesRelations,
    investment: InvestmentsWithRelations,
    taxYear: string,
  ): Promise<ResultWithConfidence<InvestmentsTaxes | undefined>> {
    const priorYear = parseInt(taxYear) - 1;
    const record = (investment.investmentsTaxes ?? []).find(
      (r: InvestmentsTaxes) => parseInt(r.taxYear ?? '0') === priorYear,
    );
    return {
      result: record,
      confidenceReport: { confidence: 1, dropReasons: [] },
    };
  }

  async generate1065SnapshotData(
    entityTaxRecord: EntitiesTaxes,
    priorExpenses: number,
  ): Promise<TaxRecord1065_Snapshot> {
    const normalize = (input: number | undefined | null) => {
      return Math.max(0, input ?? 0);
    };
    const calculateTotalAssetsBeginning = () => {
      return (
        normalize(entityTaxRecord.entityBeginningLongTermAssets) +
        normalize(entityTaxRecord.entityBeginningCash)
      );
    };

    const calculateTotalAssetsEnding = () => {
      return (
        normalize(entityTaxRecord.entityEndingLongTermAssets) +
        normalize(entityTaxRecord.entityEndingCash)
      );
    };

    const calculateNetIncomeLoss = () => {
      return -(
        normalize(entityTaxRecord.entityEndingCurrentLiabilities) -
        normalize(entityTaxRecord.entityBeginningCurrentLiabilities)
      );
    };

    const calculateCapitalContributed = () => {
      let sourceData = normalize(entityTaxRecord.entityBeginningCapital);

      if (
        entityTaxRecord?.entityCapitalContributions &&
        entityTaxRecord.entityCapitalContributions > 0
      ) {
        sourceData =
          normalize(entityTaxRecord.entityCapitalContributions) -
          normalize(priorExpenses);
      }

      return sourceData - normalize(entityTaxRecord.entityBeginningCapital);
    };

    return {
      SCHL: {
        otherInvestmentsBeginningOfTaxYear: normalize(
          entityTaxRecord.entityBeginningLongTermAssets,
        ),
        otherInvestmentsEndingOfTaxYear: normalize(
          entityTaxRecord.entityEndingLongTermAssets,
        ),
        totalAssetsBeginningOfTaxYear: calculateTotalAssetsBeginning(),
        totalAssetsEndingOfTaxYear: calculateTotalAssetsEnding(),
        partnerCapitalAccountsBeginningOfTaxYear:
          calculateTotalAssetsBeginning(),
        partnerCapitalAccountsEndingOfTaxYear: calculateTotalAssetsEnding(),
        totalLiabilitiesAndCapitalBeginningOfTaxYear:
          calculateTotalAssetsBeginning(),
        totalLiabilitiesAndCapitalEndingOfTaxYear: calculateTotalAssetsEnding(),
      },
      SCHM1: {
        netIncomeLossPerBooks: calculateNetIncomeLoss(),
      },
      SCHM2: {
        balanceAtBeginningOfYear: normalize(
          entityTaxRecord.entityBeginningCapital,
        ),
        capitalContributedCash: calculateCapitalContributed(),
        netIncomeLoss: calculateNetIncomeLoss(),
        addLines1Through4:
          normalize(entityTaxRecord.entityBeginningCapital) +
          calculateCapitalContributed() +
          calculateNetIncomeLoss(),
        // TODO: Not implemented in the system yet
        distributionsCash: 0,
        balanceAtEndOfYear:
          normalize(entityTaxRecord.entityBeginningCapital) +
          calculateCapitalContributed() +
          calculateNetIncomeLoss(),
      },
    };
  }

  hoistConfidenceReports(...reports: ConfidenceReport[]): ConfidenceReport {
    const totalConfidence = reports.reduce((acc, report) => acc + report.confidence, 0) / reports.length;
    const mergedDropReasons = reports.map(r => r.dropReasons).flat();
    return {
      confidence: reports.length > 0 ? totalConfidence : 1,
      dropReasons: mergedDropReasons,
    };
  }

  useNumericValue(defaultValue = 0, ...args: Array<number | undefined | null>): number {
    return args.find(i => i) ?? defaultValue;
  }

  useValue(...args: Array<string | undefined | null>): string | undefined | null {
    return args.find(i => i && i.trim() !== '');
  }
}
