import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FetchableArticle } from 'src/domain/fetchable-article';
import { EconomistHttpService } from 'src/economist/economist/economist-http.service';
import { NewsApiService } from 'src/news-api/news-api/news-api.service';
import { NytimesApiService } from 'src/nytimes/nytimes-api/nytimes-api.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiscoveryService
{
  private logger = new Logger(NewsApiService.name);

  constructor(
    private newsApiService: NewsApiService,
    private nytimesApiService: NytimesApiService,
    private economistHttpService: EconomistHttpService,
    private prismaService: PrismaService,
  ) {}

  /**
   * Discover articles to fetch.
   */
  async discoverArticles(): Promise<FetchableArticle[]> 
  {
    const articles: FetchableArticle[] = [];

    this.logger.log('Discovering articles to fetch...');

    const newsApiArticles: FetchableArticle[] = await this.newsApiService.discover();
    articles.push(...newsApiArticles);

    const nytimesArticles: FetchableArticle[] = await this.nytimesApiService.discover();
    articles.push(...nytimesArticles);

    const economistArticles: FetchableArticle[] = await this.economistHttpService.discover();
    articles.push(...economistArticles);

    this.logger.log(articles[0]);

    try 
    {
      await this.prismaService.fetchableArticle.createMany({
        data: articles,
        skipDuplicates: true,
      });
    }
    catch (error) 
    {
      if (error instanceof Prisma.PrismaClientKnownRequestError) 
      {
        this.logger.error(error.message);
      }
      throw error;
    }

    this.logger.log(`Discovered ${articles.length} articles.`);

    const dbArticles = await this.prismaService.fetchableArticle.findMany();
    this.logger.log(`Found ${dbArticles.length} articles in the database.`);

    return articles;
  }
}
