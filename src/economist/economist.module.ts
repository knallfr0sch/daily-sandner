import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { EconomistHttpService } from './economist/economist-http.service';
import { EconomistService } from './economist/economist.service';

@Module({
  imports: [
    PuppeteerModule,
  ],
  providers: [
    EconomistService,
    EconomistHttpService,
  ],
  exports: [
    EconomistHttpService
  ]
})
export class EconomistModule {}
