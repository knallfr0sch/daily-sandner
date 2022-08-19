import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { Discovery } from 'src/domain/discovery';
import { FetchableArticle } from 'src/domain/fetchable-article';

const ECONOMIST_URL = 'https://www.economist.com';
const ECONOMIST_BRIEF_URL = `${ECONOMIST_URL}/the-world-in-brief`;

@Injectable()
export class EconomistHttpService implements Discovery 
{
  constructor(
    private http: HttpService,
  ) {}

  async discover(): Promise<FetchableArticle[]> 
  {
    const jsdom = await JSDOM.fromURL(ECONOMIST_BRIEF_URL);
    const linkElements: NodeListOf<HTMLAnchorElement> = jsdom.window.document
      .querySelector('._gobbets')
      .querySelectorAll('a');

    const linkArray = Array.from(linkElements);
    const hrefs = linkArray.map(linkElement => linkElement.href);
    const validHrefs = hrefs.filter(href => href.includes(ECONOMIST_URL));
    const articlePromises = validHrefs.map(async url => await this.getArticle(url));
    const links: Promise<FetchableArticle[]> = Promise.all(articlePromises);

    return links;
  }

  async getArticle(url: string): Promise<FetchableArticle>
  {
    const jsdom: JSDOM = await JSDOM.fromURL(url);

    const metaNodes: NodeListOf<HTMLMetaElement> =
      jsdom.window.document.head.querySelectorAll('meta');

    const metas: HTMLMetaElement[] = Array.from(metaNodes);
    const title = metas.find(meta => meta.getAttribute('property') === 'og:title').content;
    return {
      url,
      title,
      source: "economist",
      publishedAt: Date.now().toString()
    };
  }

}
