import { Test, TestingModule } from '@nestjs/testing';
import { NytimesApiService } from './nytimes-api.service';

describe('NytimesApiService', () => {
  let service: NytimesApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NytimesApiService],
    }).compile();

    service = module.get<NytimesApiService>(NytimesApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
