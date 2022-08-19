import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Discovery } from 'src/domain/discovery';
import { FetchableArticle } from 'src/domain/fetchable-article';
import { NewsApiArticle } from '../domain/news-api-article';
import { NewsApiId } from '../domain/news-api-id';
import { NewsApiResult } from '../domain/news-api-result';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NewsAPI = require('newsapi');
const NEWS_API_TOKEN_KEY = 'NEWS_API_TOKEN';

const desiredSources: NewsApiId[] = [
  'spiegel-online',
  'die-zeit'
];

@Injectable()
export class NewsApiService implements Discovery, OnModuleInit 
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private newsapi: any;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() 
  {
    const apiToken: string = this.configService.get<string>(NEWS_API_TOKEN_KEY);
    this.newsapi = new NewsAPI(apiToken);
  }

  async discover(): Promise<FetchableArticle[]>
  {
    const topHeadlineResult: NewsApiResult = await this.newsapi.v2.topHeadlines({
      sources: desiredSources.join(','),
    });

    const fetchableArticles: FetchableArticle[] = topHeadlineResult.articles.map(
      newsApiArticle => NewsApiArticle.toFetchableArticle(newsApiArticle)
    );

    return fetchableArticles;
  }
}
