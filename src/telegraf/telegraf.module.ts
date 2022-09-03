import { Module } from '@nestjs/common';
import { GeneratorModule } from 'src/generator/generator.module';

@Module({
  imports: [
    GeneratorModule
  ],
  exports: [

  ]
})
export class TelegrafModule {}
