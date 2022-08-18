import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EconomistModule } from './economist/economist.module';
import { NytimesModule } from './nytimes/nytimes.module';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { SponModule } from './spon/spon.module';
import { ForeignAffairsModule } from './foreign-affairs/foreign-affairs.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { NewsApiModule } from './news-api/news-api.module';

// General Variables
export const SCREENSHOT_DIR = 'screenshots/';
export const EXTENSION_PNG = '.png';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PuppeteerModule,
    SponModule,
    EconomistModule,
    NytimesModule,
    ForeignAffairsModule,
    DiscoveryModule,
    NewsApiModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
