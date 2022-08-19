import { Module } from '@nestjs/common';
import { EconomistModule } from 'src/economist/economist.module';
import { NewsApiModule } from 'src/news-api/news-api.module';
import { NytimesModule } from 'src/nytimes/nytimes.module';
import { DiscoveryService } from './discovery/discovery.service';

@Module({
  imports: [
    NewsApiModule,
    NytimesModule,
    EconomistModule,
  ],
  providers: [
    DiscoveryService
  ],
  exports: [
    DiscoveryService
  ]
})
export class DiscoveryModule {}
