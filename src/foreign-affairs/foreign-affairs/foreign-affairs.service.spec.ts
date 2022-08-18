import { Test, TestingModule } from '@nestjs/testing';
import { ForeignAffairsService } from './foreign-affairs.service';

describe('ForeignAffairsService', () => {
  let service: ForeignAffairsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForeignAffairsService],
    }).compile();

    service = module.get<ForeignAffairsService>(ForeignAffairsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
