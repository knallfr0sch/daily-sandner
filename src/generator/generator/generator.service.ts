import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';

export const FILE_PATH = './scraper-results/daily-sandner.pdf';

@Injectable()
export class GeneratorService 
{

  constructor(
    private puppeteerService: PuppeteerService,
  )
  { }

  async generatePdf(articlesHtml: string[])
  {
    const html = this.generateHtmlFromArticles(articlesHtml);
    
    const page = await this.puppeteerService.getNewPage();
    console.log(html);
    await page.setContent(html);
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
