import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Discovery } from 'src/domain/discovery-service.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NewsAPI = require('newsapi');
const NEWS_API_TOKEN_KEY = 'NEWS_API_TOKEN';


@Injectable()
export class NewsApiService implements Discovery, OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private newsapi: any;

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const apiToken: string = this.configService.get<string>(NEWS_API_TOKEN_KEY);
    this.newsapi = new NewsAPI(apiToken);
  }

  async discover() {
    const headlines = await this.newsapi.v2.topHeadlines({
      sources: 'spiegel-online,die-zeit',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titles: string[] = headlines.articles.map((article: any) => article.title);

    return titles;
  }

}
