import { Deals } from '@/models/deals.model';
import { EntitiesTaxes } from '@/models/entities-taxes.model';
import { EntitiesWithRelations } from '@/models/entities.model';
import { Investments } from '@/models/investments.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxCalculatorService } from './taxes-calculator.service';

describe('TaxCalculatorService', () => {
  let service: TaxCalculatorService;
  let entitiesTaxesRepository: Repository<EntitiesTaxes>;
  let investmentsRepository: Repository<Investments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxCalculatorService,
        { provide: getRepositoryToken(EntitiesTaxes), useClass: Repository },
        { provide: getRepositoryToken(Investments), useClass: Repository },
      ],
    }).compile();

    service = module.get<TaxCalculatorService>(TaxCalculatorService);
    entitiesTaxesRepository = module.get(getRepositoryToken(EntitiesTaxes));
    investmentsRepository = module.get(getRepositoryToken(Investments));
  });

  describe('applicableDealContributions', () => {
    it('should calculate total contributions from deals', async () => {
      const deals: Deals[] = [{ closes: [{ investments: [{ capitalWiredAmount: 100 }] }] }] as Deals[];
      const taxYear = '2023';

      const result = await service.applicableDealContributions(deals, taxYear);
      expect(result.result).toEqual(100);
      expect(result.confidenceReport.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateDealManagementFeesWithReductions', () => {
    it('should calculate management fees with overrides and reductions', async () => {
      const fullFees = 1000;
      const closes = [{ investments: [{ managementFeesDollars: 100 }] }];
      const result = await service.calculateDealManagementFeesWithReductions(fullFees, closes);

      expect(result.result).toBe(900);
      expect(result.confidenceReport.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateEntityEndingCash', () => {
    it('should calculate entity ending cash with ledger', async () => {
      const entity = { ledgers: [{ amount: 200, entryDate: new Date('2023') }] } as EntitiesWithRelations;
      const taxYear = '2023';
      const result = await service.calculateEntityEndingCash(entity, taxYear);

      expect(result.result).toEqual(200);
      expect(result.confidenceReport.confidence).toEqual(1);
    });
  });

  describe('calculateEndingLongTermAssets', () => {
    it('should calculate ending long-term assets based on deals', async () => {
      const entity = { deals: [{ closes: [{ portfolioWireAmount: 500 }] }] } as EntitiesWithRelations;
      const taxYear = '2023';
      const result = await service.calculateEndingLongTermAssets(entity, taxYear);

      expect(result.result).toEqual(500);
      expect(result.confidenceReport.confidence).toEqual(1);
    });
  });

  describe('calculateInvestorContribution', () => {
    it('should calculate investor contributions with ownership percentage and expenses', async () => {
      const investment = { id: 'investment1' } as Investments;
      const entity = { deals: [{ closes: [{ investments: [{ id: 'investment1', capitalWiredAmount: 500 }] }] }] } as EntitiesWithRelations;
      const result = await service.calculateInvestorContribution(investment, entity, '2023', 1000, 1000, 500, 100, 100, 50);

      expect(result.result.totalContributions).toEqual(500);
      expect(result.result.currentOwnershipPercentage).toBeCloseTo(0.5);
      expect(result.confidenceReport.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateInvestorForeignTaxCreditLimitationApplicable', () => {
    it('should return false for foreign tax credit limitation by default', async () => {
      const result = await service.calculateInvestorForeignTaxCreditLimitationApplicable({} as Investments, {} as EntitiesWithRelations, '2023');
      expect(result).toBe(false);
    });
  });

  describe('calculateOwnershipPercentage', () => {
    it('should calculate ownership percentage correctly', () => {
      const result = service.calculateOwnershipPercentage(50, 200);
      expect(result).toBe(0.25);
    });
  });

  describe('createEntityTaxRecord', () => {
    it('should create a tax record with computed values for entity', async () => {
      const entity = { id: 'entity1', name: 'Test Entity', ledgers: [] } as EntitiesWithRelations;
      const result = await service.createEntityTaxRecord(entity, '2023');

      expect(result.result.entityId).toEqual('entity1');
      expect(result.result.entityName).toEqual('Test Entity');
      expect(result.confidenceReport.confidence).toBeGreaterThan(0);
    });
  });

  describe('dealContributions', () => {
    it('should calculate deal contributions for given tax year', async () => {
      const deals = [{ closes: [{ investments: [{ capitalWiredAmount: 100 }] }] }] as Deals[];
      const result = await service.dealContributions(deals, '2023', true);

      expect(result.result).toEqual(100);
      expect(result.confidenceReport.confidence).toBeGreaterThan(0);
    });
  });

  describe('useValue', () => {
    it('should return the first non-empty value from arguments', () => {
      const result = service.useValue(null, '', 'firstNonEmpty');
      expect(result).toBe('firstNonEmpty');
    });
  });

  describe('useNumericValue', () => {
    it('should return the first numeric value from arguments', () => {
      const result = service.useNumericValue(0, undefined, null, 5);
      expect(result).toBe(5);
    });
  });
});
