import { Test, TestingModule } from '@nestjs/testing';
import { CAndSubCController } from './c-and-sub-c.controller';
import { CAndSubCService } from './c-and-sub-c.service';

describe('CAndSubCController', () => {
  let controller: CAndSubCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CAndSubCController],
      providers: [CAndSubCService],
    }).compile();

    controller = module.get<CAndSubCController>(CAndSubCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
