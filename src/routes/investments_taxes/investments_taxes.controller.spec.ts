import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentsTaxesController } from './investments_taxes.controller';

describe('InvestmentsTaxesController', () => {
  let controller: InvestmentsTaxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentsTaxesController],
    }).compile();

    controller = module.get<InvestmentsTaxesController>(InvestmentsTaxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
