import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesTaxesController } from './entities_taxes.controller';

describe('EntitiesTaxesController', () => {
  let controller: EntitiesTaxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntitiesTaxesController],
    }).compile();

    controller = module.get<EntitiesTaxesController>(EntitiesTaxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
