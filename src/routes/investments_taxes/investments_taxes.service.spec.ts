import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentsTaxesService } from './investments_taxes.service';

describe('InvestmentsTaxesService', () => {
  let service: InvestmentsTaxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentsTaxesService],
    }).compile();

    service = module.get<InvestmentsTaxesService>(InvestmentsTaxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
