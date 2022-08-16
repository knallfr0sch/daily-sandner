import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { SponService } from './spon/spon.service';

@Module({
  imports: [
    PuppeteerModule,
  ],
  providers: [
    SponService,
  ]
})
export class SponModule {}
