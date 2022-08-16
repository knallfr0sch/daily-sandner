import { ReadabilityArticle } from "./article";

export interface ArticleScraper {
  processArticle(articleUrl: string): Promise<ReadabilityArticle>;
}