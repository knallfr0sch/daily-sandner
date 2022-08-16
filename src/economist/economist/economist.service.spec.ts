import { Test, TestingModule } from '@nestjs/testing';
import { EconomistService } from './economist.service';

describe('EconomistService', () => {
  let service: EconomistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EconomistService],
    }).compile();

    service = module.get<EconomistService>(EconomistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
