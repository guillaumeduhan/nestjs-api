import { Test, TestingModule } from '@nestjs/testing';
import { EntitytaxesService } from './entitytaxes.service';

describe('EntitytaxesService', () => {
  let service: EntitytaxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntitytaxesService],
    }).compile();

    service = module.get<EntitytaxesService>(EntitytaxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
