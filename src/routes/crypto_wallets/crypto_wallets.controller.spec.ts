import { Test, TestingModule } from '@nestjs/testing';
import { CryptoWalletsController } from './crypto_wallets.controller';

describe('CryptoWalletsController', () => {
  let controller: CryptoWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoWalletsController],
    }).compile();

    controller = module.get<CryptoWalletsController>(CryptoWalletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
