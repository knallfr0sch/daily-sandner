import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

const CHROMIUM_USER_DATA_DIR = 'user-data/';

@Injectable()
export class PuppeteerService implements OnModuleInit 
{
  private browser: Browser;
  private isInitializing = false;
  private logger = new Logger(PuppeteerService.name);

  async onModuleInit(): Promise<void> 
  {
    await this.initializeBrowser();
  }

  async initializeBrowser(): Promise<void> 
  {
    this.isInitializing = true;    

    if (process.env.CHROME_BIN)
    {
      this.logger.log(`Init browser with chrome-bin: ${process.env.CHROME_BIN}`);
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null,
        userDataDir: CHROMIUM_USER_DATA_DIR,
        args: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ],
      });      
    }
    else
    {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ],
      });      
    }    
    
    this.isInitializing = false;
  }

  async getNewPage(): Promise<Page> 
  {
    if (this.isInitializing) 
    {
      await this.initializeBrowser();
    }

    return await this.browser.newPage();
  }
}
