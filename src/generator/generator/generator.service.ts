import { Injectable, Logger } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';

@Injectable()
export class GeneratorService 
{
  private logger = new Logger(GeneratorService.name);

  public pdfBuffer: Buffer;

  constructor(
    private puppeteerService: PuppeteerService,
  )
  { }

  async generatePdf(articlesHtml: string[]): Promise<Buffer>
  {
    this.logger.log(`Generating PDF...`);
    // const html = this.generateHtmlFromArticles(articlesHtml);
    
    const page = await this.puppeteerService.getNewPage();
    // await page.setContent(html);
    await page.goto('http://localhost:3000/Home');

    this.pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    this.logger.log(`Successfully generated PDF.`);

    return this.pdfBuffer;
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
