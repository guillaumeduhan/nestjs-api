import { Test, TestingModule } from '@nestjs/testing';
import { IdentitiesKycChecksController } from './identities_kyc_checks.controller';

describe('IdentitiesKycChecksController', () => {
  let controller: IdentitiesKycChecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentitiesKycChecksController],
    }).compile();

    controller = module.get<IdentitiesKycChecksController>(IdentitiesKycChecksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
