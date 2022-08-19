import { NewsApiCategory } from "./news-api-category";
import { NewsApiCountry } from "./news-api-country";
import { NewsApiId } from "./news-api-id";
import { NewsApiLanguage } from "./news-api-language";
import { NewsApiName } from "./news-api-name";
import { NewsApiShortSource } from "./news-api-short-source";

export interface NewsApiSource extends NewsApiShortSource
{
  id: NewsApiId;
  name: NewsApiName;
  description: string;
  url: string;
  category: NewsApiCategory;
  language: NewsApiLanguage;
  country: NewsApiCountry;
}