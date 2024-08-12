import { Test, TestingModule } from '@nestjs/testing';
import { CryptoWalletsService } from './crypto_wallets.service';

describe('CryptoWalletsService', () => {
  let service: CryptoWalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoWalletsService],
    }).compile();

    service = module.get<CryptoWalletsService>(CryptoWalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
