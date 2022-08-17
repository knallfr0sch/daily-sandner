export interface Realm {
  /**
   * The base url of web domain, ie
   * spiegel.de, economist.com
   */
  getBaseUrl(): string;

  /**
   * Visits the landing site.
   */
  visitHomepage(): Promise<void>;
}
