import { Deals } from '@/models/deals.model';
import { EntitiesTaxes } from '@/models/entities-taxes.model';
import { Entities, EntitiesWithRelations } from '@/models/entities.model';
import { InvestmentsTaxes } from '@/models/investments-taxes.model';
import { Investments, InvestmentsWithRelations } from '@/models/investments.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxCalculatorService } from './taxes-calculator.service';

describe('TaxCalculatorService', () => {
  let service: TaxCalculatorService;
  let entitiesTaxesRepository: Repository<EntitiesTaxes>;
  let investmentsRepository: Repository<Investments>;
  let investmentsTaxesRepository: Repository<InvestmentsTaxes>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxCalculatorService,
        { provide: getRepositoryToken(EntitiesTaxes), useClass: Repository },
        { provide: getRepositoryToken(Investments), useClass: Repository },
        { provide: getRepositoryToken(InvestmentsTaxes), useClass: Repository }
      ],
    }).compile();

    service = module.get<TaxCalculatorService>(TaxCalculatorService);
    entitiesTaxesRepository = module.get(getRepositoryToken(EntitiesTaxes));
    investmentsRepository = module.get(getRepositoryToken(Investments));
    investmentsTaxesRepository = module.get(getRepositoryToken(InvestmentsTaxes));
  });

  describe('applicableDealContributions', () => {
    it('should calculate total contributions from deals', async () => {
      const deals: Deals[] = [{ closes: [{ investments: [{ capital_wired_amount: 100, management_fee_percentage: null, management_fees_dollars: null }] }] }] as Deals[];
      const tax_year = '2023';

      const result = await service.applicableDealContributions(deals, tax_year);
      expect(result.result).toEqual(100);
      expect(result.confidence_report.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateDealManagementFeesWithReductions', () => {
    it('should calculate management fees with overrides and reductions', async () => {
      const full_fees = 1000;
      const closes: any = [{ investments: [{ management_fees_dollars: 100, management_fee_percentage: null }] }];
      const result = await service.calculateDealManagementFeesWithReductions(full_fees, closes);

      expect(result.result).toBe(900);
      expect(result.confidence_report.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateEntityEndingCash', () => {
    it('should calculate entity ending cash with ledger', async () => {
      const entity = { ledgers: [{ subscription_amount: 200, entry_date: new Date('2023') }] } as EntitiesWithRelations;
      const tax_year = '2023';
      const result = await service.calculateEntityEndingCash(entity, tax_year);

      expect(result.result).toEqual(200);
      expect(result.confidence_report.confidence).toEqual(1);
    });
  });

  describe('calculateEndingLongTermAssets', () => {
    it('should calculate ending long-term assets based on deals', async () => {
      const entity = { deals: [{ closes: [{ portfolio_wire_amount: 500, closed_date: '2023-01-01' }] }] } as any;
      const tax_year = '2023';
      const result = await service.calculateEndingLongTermAssets(entity, tax_year);

      expect(result.result).toEqual(500);
      expect(result.confidence_report.confidence).toEqual(1);
    });
  });

  describe('calculateInvestorContribution', () => {
    it('should calculate investor contributions with ownership percentage and expenses', async () => {
      const investment = { id: 'investment1' } as Investments;
      const entity = new Entities({
        deals: [{
          closes: [{
            closed_date: new Date('2023-01-01'),
            investments: [{ id: 'investment1', capital_wired_amount: 500 }]
          }]
        }]
      }) as EntitiesWithRelations;
      const result = await service.calculateInvestorContribution(investment, entity, '2023', 1000, 1000, 500, 100, 100, 50);

      expect(result.result.total_contributions).toEqual(500);
      expect(result.result.current_ownership_percentage).toBeCloseTo(0.5);
      expect(result.confidence_report.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateInvestorForeignTaxCreditLimitationApplicable', () => {
    it('should return false for foreign tax credit limitation by default', async () => {
      const result = await service.calculateInvestorForeignTaxCreditLimitationApplicable({} as InvestmentsWithRelations, {} as EntitiesWithRelations, '2023');
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
      const entity = {
        id: 'entity1', name: 'Test Entity', ledgers: [], addresses: {
          street_address_line1: 'Test address line 1', street_address_line2: 'Test address line 2'
        }
      } as EntitiesWithRelations;
      const result = await service.createEntityTaxRecord(entity, '2023');

      expect(result.result.entity_id).toEqual('entity1');
      expect(result.result.entity_name).toEqual('Test Entity');
      expect(result.confidence_report.confidence).toBeGreaterThan(0);
    });
  });

  describe('dealContributions', () => {
    it('should calculate deal contributions for given tax year', async () => {
      const deals = [{ closes: [{ investments: [{ capital_wired_amount: 100 }] }] }] as Deals[];
      const result = await service.dealContributions(deals, '2023', true);

      expect(result.result).toEqual(100);
      expect(result.confidence_report.confidence).toBeGreaterThan(0);
    });
  });

  describe('useValue', () => {
    it('should return the first non-empty value from arguments', () => {
      const result = service.useValue(null, '', 'first_non_empty');
      expect(result).toBe('first_non_empty');
    });
  });

  describe('useNumericValue', () => {
    it('should return the first numeric value from arguments', () => {
      const result = service.useNumericValue(0, undefined, null, 5);
      expect(result).toBe(5);
    });
  });
});
