import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { EconomistService } from './economist/economist.service';

@Module({
  imports: [
    PuppeteerModule
  ],
  providers: [
    EconomistService,
  ]
})
export class EconomistModule {}
