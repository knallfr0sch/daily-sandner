import { Test, TestingModule } from '@nestjs/testing';
import { SponService } from './spon.service';

describe('SponService', () => {
  let service: SponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SponService],
    }).compile();

    service = module.get<SponService>(SponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
