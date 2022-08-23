import { Injectable, Logger } from '@nestjs/common';
import { mkdir } from 'fs';
import { JSDOM } from 'jsdom';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';

export const FILE_PATH = './scraper-results/daily-sandner.pdf';

@Injectable()
export class GeneratorService 
{
  private logger = new Logger(GeneratorService.name);

  constructor(
    private puppeteerService: PuppeteerService,
  )
  { }

  async generatePdf(articlesHtml: string[])
  {
    this.logger.log(`Generating PDF at ${FILE_PATH}`);
    const html = this.generateHtmlFromArticles(articlesHtml);
    
    const page = await this.puppeteerService.getNewPage();
    await page.setContent(html);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mkdir('scraper-results', err => this.logger.log('Directory already exists'));

    page.pdf({
      path: FILE_PATH,
      format: 'A4',
      printBackground: true
    });
  }

  private generateHtmlFromArticles(articlesHtml: string[]): string 
  {
    const jsdom = new JSDOM('<!DOCTYPE html>');
    const doc = jsdom.window.document;

    const header = 'The Daily Sandner';
    const div = doc.createElement('h1');
    div.innerHTML = header;
    doc.body.appendChild(div);

    for (const articleHtml of articlesHtml) 
    {
      const article = doc.createElement('div');
      article.innerHTML = articleHtml;
      doc.body.appendChild(article);
    }    

    return jsdom.serialize();
  }
}
