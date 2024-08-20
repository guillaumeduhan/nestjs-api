import { Test, TestingModule } from '@nestjs/testing';
import { DealsRolesService } from './deals_roles.service';

describe('DealsRolesService', () => {
  let service: DealsRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DealsRolesService],
    }).compile();

    service = module.get<DealsRolesService>(DealsRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
