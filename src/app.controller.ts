import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FetchableArticle } from './domain/fetchable-article';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController 
{
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  @Get('db')
  async getTestValuesFromDb(): Promise<FetchableArticle[]>
  {
    return this.prismaService.fetchableArticle.findMany();
  }

  @Get('pdf')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment; filename="daily-sandner.pdf"')
  getStaticFile(): StreamableFile 
  {
    const file = createReadStream(
      join(process.cwd(),
        './scraper-results/daily-sandner.pdf'
      ));
    return new StreamableFile(file);
  }  
}

