import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { GeneratorService } from './generator/generator.service';

@Module({
  imports: [
    PuppeteerModule,
  ],
  providers: [
    GeneratorService,
  ],
  exports: [
    GeneratorService,
  ]
})
export class GeneratorModule {}
