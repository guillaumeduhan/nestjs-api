import { Test, TestingModule } from '@nestjs/testing';
import { GosystemService } from './gosystem.service';

describe('GosystemService', () => {
  let service: GosystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GosystemService],
    }).compile();

    service = module.get<GosystemService>(GosystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
