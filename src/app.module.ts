import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { SponModule } from './spon/spon.module';
import { EconomistModule } from './economist/economist.module';

// General Variables
export const SCREENSHOT_DIR: string = "screenshots/";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    PuppeteerModule,
    SponModule,
    EconomistModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
