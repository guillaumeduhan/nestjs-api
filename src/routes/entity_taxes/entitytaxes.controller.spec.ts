import { Test, TestingModule } from '@nestjs/testing';
import { EntitytaxesController } from './entitytaxes.controller';

describe('EntitytaxesController', () => {
  let controller: EntitytaxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntitytaxesController],
    }).compile();

    controller = module.get<EntitytaxesController>(EntitytaxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
