import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { Discovery } from 'src/domain/discovery-service.interface';

const ECONOMIST_URL = 'https://www.economist.com';
const ECONOMIST_BRIEF_URL = `${ECONOMIST_URL}/the-world-in-brief`;

@Injectable()
export class EconomistHttpService implements Discovery {
  async discover(): Promise<string[]> {
    const jsdom = await JSDOM.fromURL(ECONOMIST_BRIEF_URL);
    const linkElements = jsdom.window.document
      .querySelector('._gobbets')
      .querySelectorAll('a');
    const links: string[] = Array.from(linkElements).map(
      linkElement => linkElement.href
    );
    return links;
  }
}
