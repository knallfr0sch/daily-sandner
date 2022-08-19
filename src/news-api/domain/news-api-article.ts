import { FetchableArticle } from "src/domain/fetchable-article";
import { NewsApiShortSource } from "./news-api-short-source";

export class NewsApiArticle 
{
  source: NewsApiShortSource;
  author?: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content: string;

  public static toFetchableArticle(newsApiArticle: NewsApiArticle): FetchableArticle 
  {
    return {
      url: newsApiArticle.url,
      title: newsApiArticle.title,
      source: newsApiArticle.source.id,
      publishedAt: newsApiArticle.publishedAt
    };
  }
}