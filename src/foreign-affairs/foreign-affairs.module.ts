import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { ForeignAffairsService } from './foreign-affairs/foreign-affairs.service';

@Module({
  imports: [
    PuppeteerModule
  ],
  providers: [
    ForeignAffairsService
  ]
})
export class ForeignAffairsModule {}
