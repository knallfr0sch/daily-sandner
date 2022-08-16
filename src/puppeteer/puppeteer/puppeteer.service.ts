import { Injectable, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer-core';

const CHROMIUM_EXECUTABLE_PATH: string = '/usr/bin/google-chrome-stable';
const CHROMIUM_USER_DATA_DIR: string = "user-data/";


@Injectable()
export class PuppeteerService implements OnModuleInit {
  private browser: Browser;
  private isInitializing = false;

  async onModuleInit(): Promise<void> {
    await this.initializeBrowser();
  }

  async initializeBrowser(): Promise<void> {
    this.isInitializing = true;
    this.browser = await puppeteer.launch({
      headless: false,
      executablePath: CHROMIUM_EXECUTABLE_PATH,
      userDataDir: CHROMIUM_USER_DATA_DIR,
      args: ["--disable-gpu"]
    });  
    this.isInitializing = false;
  }

  async getNewPage(): Promise<Page>
  {
    if (this.isInitializing) {
      await this.initializeBrowser();
    }

    return this.browser.newPage();
  }
}
