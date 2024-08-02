import { Test, TestingModule } from '@nestjs/testing';
import { IdentitiesKycChecksService } from './identities_kyc_checks.service';

describe('IdentitiesKycChecksService', () => {
  let service: IdentitiesKycChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentitiesKycChecksService],
    }).compile();

    service = module.get<IdentitiesKycChecksService>(IdentitiesKycChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
