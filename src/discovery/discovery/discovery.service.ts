import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EconomistHttpService } from 'src/economist/economist/economist-http.service';
import { NewsApiService } from 'src/news-api/news-api/news-api.service';
import { NytimesApiService } from 'src/nytimes/nytimes-api/nytimes-api.service';

@Injectable()
export class DiscoveryService implements OnModuleInit {
  private logger = new Logger(NewsApiService.name)
  
  constructor(
    private newsApiService: NewsApiService,
    private nytimesApiService: NytimesApiService,
    private economistHttpService: EconomistHttpService,
  ) {

  }

  // Ugly hack, module initiation.
  onModuleInit() {
    setTimeout(() => this.discoverArticles(), 5000);
  }

  async discoverArticles(): Promise<void> {
    const newsApiTitles: string[] = await this.newsApiService.discover();
    this.logger.log("newsapi");
    this.logger.log(newsApiTitles);
    
    const nytimesTitles: string[] = await this.nytimesApiService.discover();
    this.logger.log("nytimes");
    this.logger.log(nytimesTitles);

    const economistLinks: string[] = await this.economistHttpService.discover();
    this.logger.log("economist");
    this.logger.log(economistLinks);
  }

}
