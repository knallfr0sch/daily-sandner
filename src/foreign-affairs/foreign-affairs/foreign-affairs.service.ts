import { Readability } from '@mozilla/readability';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSDOM } from 'jsdom';
import { Page } from 'puppeteer-core';
import { EXTENSION_PNG, SCREENSHOT_DIR } from 'src/app.module';
import { LoginFlow } from 'src/domain/login-flow';
import { ReadabilityArticle } from 'src/domain/readability-article';
import { Reader } from 'src/domain/reader';
import { Realm } from 'src/domain/realm';
import { UsernamePasswordLogin } from 'src/domain/usernamePasswordLogin';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';
import { HTTPS_PREFIX } from 'src/util/https-prefix';
import { ForeignAffairsData, ForeignAffairsUser, ForeignAffairsWindow, isDataForeignAffairsUser } from '../types';

// CREDENTIALS
const FOREIGN_AFFAIRS_USER_NAME_KEY = 'FOREIGN_AFFAIRS_USER_NAME';
const FOREIGN_AFFAIRS_USER_PASSWORD_KEY = 'FOREIGN_AFFAIRS_USER_PASSWORD';

// LOGIN FORM
const FOREIGN_AFFAIRS_LOGIN_URL ='https://www.foreignaffairs.com/user/login';
const FOREIGN_AFFAIRS_LOGIN_INPUT_NAME = '#edit-name';
const FOREIGN_AFFAIRS_LOGIN_INPUT_PASSWORD = '#edit-pass';
const FOREIGN_AFFAIRS_SUBMIT_BUTTON = '#edit-submit';

@Injectable()
export class ForeignAffairsService implements LoginFlow, Realm, OnModuleInit {
  private page: Page;
  private loginInfo: UsernamePasswordLogin = { username: '', password: '' };

  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService
  ) { }

  getBaseUrl(): string {
      return 'foreignaffairs.com';
  }

  getHomePage(): string {
    return `${HTTPS_PREFIX}${this.getBaseUrl()}`
  }

  async onModuleInit() {
    // this.loginInfo.username = this.configService.get<string>(FOREIGN_AFFAIRS_USER_NAME_KEY);
    // this.loginInfo.password = this.configService.get<string>(FOREIGN_AFFAIRS_USER_PASSWORD_KEY);

    // this.page = await this.puppeteerService.getNewPage();

    // await this.visitHomepage();
    // const exampleArticle =
    //   'https://www.foreignaffairs.com/ukraine/playing-fire-ukraine';
    // await this.processArticle(exampleArticle);
  }

  /**
   * Visits Foreign Affairs
   */
   async visitHomepage(): Promise<void> {
    const page = this.page;
    await page.goto(this.getHomePage());
    await this.page.exposeFunction('getReader', this.getReader);

    const isLoggedIn: boolean = (await this.checkLogin()).loggedIn;
    if (!isLoggedIn) {
      await this.login();
      await page.goto(this.getHomePage());
    }
    await page.screenshot({ path: SCREENSHOT_DIR + this.getBaseUrl() + EXTENSION_PNG });
  }

  async login(): Promise<Reader> {
    const page = this.page;

    await page.goto(FOREIGN_AFFAIRS_LOGIN_URL);
    await page.screenshot({ path: SCREENSHOT_DIR + 'foreign_affairs_login' + EXTENSION_PNG });
    await page.type(FOREIGN_AFFAIRS_LOGIN_INPUT_NAME, this.loginInfo.username);
    await page.type(FOREIGN_AFFAIRS_LOGIN_INPUT_PASSWORD, this.loginInfo.password);


    const button = await page.$(FOREIGN_AFFAIRS_SUBMIT_BUTTON);
    await button.click();

    await page.waitForNavigation();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await page.screenshot({ path: SCREENSHOT_DIR + 'foreign_affairs_waitForNav' + EXTENSION_PNG });
    return this.checkLogin();
  }

  async checkLogin(): Promise<Reader> {
    const previousUrl: string = this.page.url();
    let returnToUrl = false;
    if (!previousUrl.includes(this.getBaseUrl())) {
      await this.visitHomepage();
      returnToUrl = true;
    }

    const dataLayer: ForeignAffairsData[] = await this.page.evaluate(() =>
      (window as ForeignAffairsWindow).dataLayer
    );

    const reader = this.getReader(dataLayer);

    if (returnToUrl) {
      await this.page.goto(previousUrl);
    }
    return reader;
  }

  async processArticle(articleUrl: string): Promise<ReadabilityArticle> {
    if (!articleUrl.includes(this.getBaseUrl())) {
      return undefined;
    }
    await this.page.goto(articleUrl);

    const htmlArticle = await this.page.content();

    const document = new JSDOM(htmlArticle);
    const article = new Readability(document.window.document).parse();
    console.log(article.title);
    return article;
  }

  private getReader(foreignAffairsData: ForeignAffairsData[]): Reader {
    const foreignAffairsUser: ForeignAffairsUser = foreignAffairsData.find((data) =>
      isDataForeignAffairsUser(data)
    ) as ForeignAffairsUser;

    const userType = foreignAffairsUser['user type'];

    const loggedIn: boolean = userType !== undefined
                           && userType !== 'anonymous';
    let activeSubscription = false;
    if (loggedIn === true) {
      activeSubscription = userType === 'plus_subscriber_user';
    }
    
    return {loggedIn, activeSubscription};
  }

}
