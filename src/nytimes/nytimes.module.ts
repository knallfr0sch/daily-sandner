import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { NytimesApiService } from './nytimes-api/nytimes-api.service';
import { NytimesService } from './nytimes/nytimes.service';

const NYTIMES_API_TOKEN = 'NYTIMES_API_TOKEN';

@Module({
  imports: [
    PuppeteerModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        params: {
          'api-key': configService.get(NYTIMES_API_TOKEN),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NytimesService, NytimesApiService],
  exports: [NytimesApiService],
})
export class NytimesModule {}
