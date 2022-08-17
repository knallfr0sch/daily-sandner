import { Test, TestingModule } from '@nestjs/testing';
import { NytimesService } from './nytimes.service';

describe('NytimesService', () => {
  let service: NytimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NytimesService],
    }).compile();

    service = module.get<NytimesService>(NytimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
