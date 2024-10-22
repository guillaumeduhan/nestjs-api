import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesTaxesService } from './entities_taxes.service';

describe('EntitiesTaxesService', () => {
  let service: EntitiesTaxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntitiesTaxesService],
    }).compile();

    service = module.get<EntitiesTaxesService>(EntitiesTaxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
