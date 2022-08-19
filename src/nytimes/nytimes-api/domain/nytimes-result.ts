import { NytimesViewedArticle } from "./nytimes-viewed-article";

export interface NytimesResult {
  status: string;
  copyright: string;
  num_results: number;
  results: NytimesViewedArticle[];
}
