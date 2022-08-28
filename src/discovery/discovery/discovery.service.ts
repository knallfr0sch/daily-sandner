import { Injectable, Logger } from '@nestjs/common';
import { FetchableArticle } from 'src/domain/fetchable-article';
import { EconomistHttpService } from 'src/economist/economist/economist-http.service';
import { NewsApiService } from 'src/news-api/news-api/news-api.service';
import { NytimesApiService } from 'src/nytimes/nytimes-api/nytimes-api.service';

@Injectable()
export class DiscoveryService
{
  private logger = new Logger(NewsApiService.name);

  constructor(
    private newsApiService: NewsApiService,
    private nytimesApiService: NytimesApiService,
    private economistHttpService: EconomistHttpService,
  ) {}

  /**
   * Discover articles to fetch.
   */
  async discoverArticles(): Promise<FetchableArticle[]> 
  {
    const articles: FetchableArticle[] = [];

    const newsApiArticles: FetchableArticle[] = await this.newsApiService.discover();
    articles.push(...newsApiArticles);
    this.logger.log(newsApiArticles.map(article => article.title));

    const nytimesArticles: FetchableArticle[] = await this.nytimesApiService.discover();
    articles.push(...nytimesArticles);
    this.logger.log(nytimesArticles.map(article => article.title));

    const economistArticles: FetchableArticle[] = await this.economistHttpService.discover();
    articles.push(...economistArticles);
    this.logger.log(economistArticles.map(article => article.title));

    return articles;
  }
}
