/**
 * Returned from `readability.js / parse()`
 */
export interface ReadabilityArticle {
  title: string;
  byline: string;
  dir: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  siteName: string;
}
