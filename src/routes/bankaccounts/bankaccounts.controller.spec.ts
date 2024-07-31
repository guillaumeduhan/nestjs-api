import { Test, TestingModule } from '@nestjs/testing';
import { BankaccountsController } from './bankaccounts.controller';

describe('BankaccountsController', () => {
  let controller: BankaccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankaccountsController],
    }).compile();

    controller = module.get<BankaccountsController>(BankaccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
