import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveryModule } from './discovery/discovery.module';
import { EconomistModule } from './economist/economist.module';
import { ForeignAffairsModule } from './foreign-affairs/foreign-affairs.module';
import { GeneratorModule } from './generator/generator.module';
import { NewsApiModule } from './news-api/news-api.module';
import { NytimesModule } from './nytimes/nytimes.module';
import { PrismaService } from './prisma.service';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { SponModule } from './spon/spon.module';
import { StartUpModule } from './start-up/start-up.module';

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
    StartUpModule,
    GeneratorModule,
    PrismaService
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
