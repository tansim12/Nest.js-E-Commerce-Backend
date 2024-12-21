import { Test, TestingModule } from '@nestjs/testing';
import { CAndSubCService } from './c-and-sub-c.service';

describe('CAndSubCService', () => {
  let service: CAndSubCService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CAndSubCService],
    }).compile();

    service = module.get<CAndSubCService>(CAndSubCService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
