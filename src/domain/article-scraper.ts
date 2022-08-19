export interface ArticleScraper {
  processArticle(articleUrl: string): Promise<string>;
}
