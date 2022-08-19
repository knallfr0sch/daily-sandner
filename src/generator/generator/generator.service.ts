import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const html_to_pdf = require('html-pdf-node');

@Injectable()
export class GeneratorService 
{

  async generatePdf(articlesHtml: string[])
  {
    const html = this.generateHtmlFromArticles(articlesHtml);
    // console.log(html);

    const file = { content: html, name: './daily-sandner.pdf' };
    const pdfBuffer = await html_to_pdf.generatePdf(file, { format: 'A4' });
    writeFileSync('./scraper-results/daily-sandner.pdf', pdfBuffer);
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
