import { Test, TestingModule } from '@nestjs/testing';
import { DealsRolesController } from './deals_roles.controller';

describe('DealsRolesController', () => {
  let controller: DealsRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DealsRolesController],
    }).compile();

    controller = module.get<DealsRolesController>(DealsRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
