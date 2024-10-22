import { Test, TestingModule } from '@nestjs/testing';
import { GosystemController } from './gosystem.controller';

describe('GosystemController', () => {
  let controller: GosystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GosystemController],
    }).compile();

    controller = module.get<GosystemController>(GosystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
