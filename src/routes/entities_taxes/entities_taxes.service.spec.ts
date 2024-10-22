import { Test, TestingModule } from '@nestjs/testing';
import { EntityTaxesService } from './entities_taxes.service';

describe('EntitytaxesService', () => {
  let service: EntityTaxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityTaxesService],
    }).compile();

    service = module.get<EntityTaxesService>(EntityTaxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
