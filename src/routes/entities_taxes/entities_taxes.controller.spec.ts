import { Test, TestingModule } from '@nestjs/testing';
import { EntityTaxesController } from './entities_taxes.controller';

describe('EntityTaxesService', () => {
  let controller: EntityTaxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityTaxesController],
    }).compile();

    controller = module.get<EntityTaxesController>(EntityTaxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
