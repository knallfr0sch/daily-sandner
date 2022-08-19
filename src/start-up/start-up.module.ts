import { Module } from '@nestjs/common';
import { DiscoveryModule } from 'src/discovery/discovery.module';
import { EconomistModule } from 'src/economist/economist.module';
import { GeneratorModule } from 'src/generator/generator.module';
import { StartUpService } from './start-up/start-up.service';

@Module({
  imports: [
    DiscoveryModule,
    GeneratorModule,
    EconomistModule,
  ],
  providers: [
    StartUpService
  ]
})
export class StartUpModule {}
