import { FetchableArticle } from "src/domain/fetchable-article";
import { NytimesImage } from "./nytimes-image";

export class NytimesViewedArticle 
{

  /**
   * Article's URL.
   */
  url: string;

  /**
   * Semicolon separated list of keywords.
   */
  adx_keywords: string;

  /**
   * Deprecated. Set to null.
   */
  column: null;

  /**
   * Article's section (e.g. Sports).
   */
  section: string;

  /**
   * Article's byline (e.g. By Thomas L. Friedman).
   */
  byline: string;

  /**
   * Asset type (e.g. Article, Interactive, ...).
   */
  type: string;

  /**
   * Article's headline (e.g. When the Cellos Play, the Cows Come Home).
   */
  title: string;

  /**
   * Brief summary of the article.
   */
  abstract: string;

  /**
   * When the article was published on the web (e.g. 2021-04-19).
   */
  published_date: string;

  /**
   * Publisher (e.g. New York Times).
   */
  source: string;

  /**
   * Asset ID number (e.g. 100000007772696).
   */
  id: number;

  /**
   * Asset ID number (e.g100000007772696. ).
   */
  asset_id: number;

  /**
   * Array of description facets (e.g. Quarantine (Life and Culture)).
   */
  des_facet: string[];

  /**
   * Array of organization facets (e.g. Sullivan Street Bakery).
   */
  org_facet: string[];

  /**
   * Array of person facets (e.g. Bittman, Mark).
   */
  per_facet: string[];

  /**
   * Array of geographic facets (e.g. Canada).
   */
  geo_facet: string;

  /**
   * Array of images.
   */
  media: NytimesImage[];

  /**
   * An article's globally unique identifier.
   */
  uri: string;

  public static toFetchableArticle(
    nytimesViewedArticle: NytimesViewedArticle
  ): FetchableArticle
  {
    return {
      url: nytimesViewedArticle.url,
      title: nytimesViewedArticle.title,
      source: "nytimes",
      publishedAt: nytimesViewedArticle.published_date
    };
  }

}