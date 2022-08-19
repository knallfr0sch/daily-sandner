import { NewsApiArticle } from "./news-api-article";

export interface NewsApiResult 
{
  status: "ok" | "error";
  totalResults: number;
  articles: NewsApiArticle[];
}