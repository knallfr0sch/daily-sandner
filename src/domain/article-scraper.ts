import { ReadabilityArticle } from './readability-article';

export interface ArticleScraper {
  processArticle(articleUrl: string): Promise<ReadabilityArticle>;
}
