import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FetchableArticle } from 'src/domain/fetchable-article';
import { EconomistHttpService } from 'src/economist/economist/economist-http.service';
import { NewsApiService } from 'src/news-api/news-api/news-api.service';
import { NytimesApiService } from 'src/nytimes/nytimes-api/nytimes-api.service';

@Injectable()
export class DiscoveryService implements OnModuleInit 
{
  private logger = new Logger(NewsApiService.name);

  constructor(
    private newsApiService: NewsApiService,
    private nytimesApiService: NytimesApiService,
    private economistHttpService: EconomistHttpService
  ) {}

  // Ugly hack, module initiation.
  onModuleInit() 
  {
    setTimeout(() => this.discoverArticles(), 3000);
  }

  async discoverArticles(): Promise<void> 
  {
    const newsApiArticles: FetchableArticle[] = await this.newsApiService.discover();
    this.logger.log('newsapi');
    this.logger.log(newsApiArticles.map(article => article.title));

    const nytimesArticles: FetchableArticle[] = await this.nytimesApiService.discover();
    this.logger.log('nytimes');
    this.logger.log(nytimesArticles.map(article => article.title));

    const economistArticles: FetchableArticle[] = await this.economistHttpService.discover();
    this.logger.log('economist');
    this.logger.log(economistArticles.map(article => article.title));
  }
}
