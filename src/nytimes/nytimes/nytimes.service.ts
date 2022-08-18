import { Readability } from '@mozilla/readability';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSDOM } from 'jsdom';
import { Page } from 'puppeteer-core';
import { EXTENSION_PNG, SCREENSHOT_DIR } from 'src/app.module';
import { ArticleScraper } from 'src/domain/article-scraper';
import { LoginFlow } from 'src/domain/login-flow';
import { ReadabilityArticle } from 'src/domain/readability-article';
import { Reader } from 'src/domain/reader';
import { Realm } from 'src/domain/realm';
import { UsernamePasswordLogin } from 'src/domain/usernamePasswordLogin';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';
import { HTTPS_PREFIX } from 'src/util/https-prefix';
import { isPageData, NYTimesData, NytimesWindow, PageData } from '../types';

// LOGIN
const NYTIMES_LOGIN_URL =
  'https://myaccount.nytimes.com/auth/login?response_type=cookie&redirect_uri=https%3A%2F%2Fwww.nytimes.com';
const NYTIMES_LOGIN_INPUT_NAME = '#email';
const NYTIMES_LOGIN_INPUT_PASSWORD = '#password';
const NYTIMES_SUBMIT_BUTTON = 'button[type="submit"]';

// CREDENTIALS
const NYTIMES_USER_NAME_KEY = 'NYTIMES_USER_NAME';
const NYTIMES_USER_PASSWORD_KEY = 'NYTIMES_USER_PASSWORD';

@Injectable()
export class NytimesService
implements OnModuleInit, Realm, ArticleScraper, LoginFlow
{
  private page: Page;
  private loginInfo: UsernamePasswordLogin = { username: '', password: '' };

  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    // this.loginInfo.username = this.configService.get<string>(NYTIMES_USER_NAME_KEY);
    // this.loginInfo.password = this.configService.get<string>(NYTIMES_USER_PASSWORD_KEY);
    // this.page = await this.puppeteerService.getNewPage();
    // this.page.exposeFunction('isPageData', isPageData);
    // await this.visitHomepage();
    // const exampleArticle =
    //   'https://www.nytimes.com/2022/08/17/nyregion/salman-rushdie-stabbing-suspect.html';
    // await this.processArticle(exampleArticle);
  }

  getBaseUrl(): string {
    return 'nytimes.com';
  }

  async visitHomepage(): Promise<void> {
    const page = this.page;
    await page.goto(`${HTTPS_PREFIX}${this.getBaseUrl()}`);
    await this.page.exposeFunction('getReader', this.getReader);

    const isLoggedIn: boolean = (await this.checkLogin()).loggedIn;
    if (!isLoggedIn) {
      await this.login();
      await page.goto(`${HTTPS_PREFIX}${this.getBaseUrl()}`);
    }
    await page.screenshot({
      path: SCREENSHOT_DIR + this.getBaseUrl() + EXTENSION_PNG,
    });
  }

  async processArticle(articleUrl: string): Promise<ReadabilityArticle> {
    if (
      !articleUrl.includes(this.getBaseUrl()) &&
      !articleUrl.includes('nyti.ms')
    ) {
      return undefined;
    }

    await this.page.goto(articleUrl);
    const htmlArticle = await this.page.content();

    const document = new JSDOM(htmlArticle);
    const article = new Readability(document.window.document).parse();
    console.log(article.title);
    return article;
  }

  async checkLogin(): Promise<Reader> {
    const previousUrl: string = this.page.url();
    let returnToUrl = false;
    if (!previousUrl.includes(this.getBaseUrl())) {
      await this.visitHomepage();
      returnToUrl = true;
    }

    await this.page.waitForNetworkIdle();

    const dataLayer: NYTimesData[] = (await this.page.evaluate(
      () => (window as NytimesWindow).dataLayer
    )) as NYTimesData[];

    const reader = this.getReader(dataLayer);

    if (returnToUrl) {
      await this.page.goto(previousUrl);
    }
    return reader;
  }

  private getReader(dataLayer: NYTimesData[]): Reader {
    const pageData = dataLayer.find((data): data is PageData =>
      isPageData(data)
    );

    const loggedIn: boolean = pageData.session?.isLoggedIn === true;
    let activeSubscription = false;
    if (loggedIn === true) {
      activeSubscription =
        pageData.user.type === 'sub' &&
        pageData.user.subInfo.subscriptions.find(
          sub => sub.status === 'ACTIVE'
        ) !== undefined;
    }

    return { loggedIn, activeSubscription };
  }

  /**
   * Logs into NYTimes
   */
  async login(): Promise<Reader> {
    const page = this.page;

    await page.goto(NYTIMES_LOGIN_URL);
    await page.screenshot({
      path: SCREENSHOT_DIR + 'nytimes_login' + EXTENSION_PNG,
    });

    await page.type(NYTIMES_LOGIN_INPUT_NAME, this.loginInfo.username);
    await page.click(NYTIMES_SUBMIT_BUTTON);

    await page.type(NYTIMES_LOGIN_INPUT_PASSWORD, this.loginInfo.password);
    await page.click(NYTIMES_SUBMIT_BUTTON);

    await page.waitForNavigation();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({
      path: SCREENSHOT_DIR + 'nytimes_waitForNav' + EXTENSION_PNG,
    });
    return this.checkLogin();
  }
}
