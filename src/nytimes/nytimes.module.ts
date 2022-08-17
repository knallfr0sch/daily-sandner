import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { NytimesService } from './nytimes/nytimes.service';

@Module({
  imports: [
    PuppeteerModule,
  ],
  providers: [
    NytimesService,
  ]
})
export class NytimesModule {}
