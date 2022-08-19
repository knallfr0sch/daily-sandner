import { FetchableArticle } from "./fetchable-article";

export interface Discovery {
  discover(): Promise<FetchableArticle[]>;
}
