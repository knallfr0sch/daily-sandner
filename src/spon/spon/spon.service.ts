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
import {
  isSponLoginInfo,
  SARA_DATA,
  SpiegelWindow,
  SponLoginInfo,
} from '../types';

// SPON
const SPON_URL = 'https://www.spiegel.de/';

// LOGIN FORM
const SPON_LOGIN_URL =
  'https://gruppenkonto.spiegel.de/authenticate?requestAccessToken=true&targetUrl=https%3A%2F%2Fwww.spiegel.de%2Ffuermich%2F';
const SPON_LOGIN_INPUT_NAME = '#loginname';
const SPON_LOGIN_INPUT_PASSWORD = '#password';
const SPON_REMEMBER_CHECKBOX = 'loginAutologin_input';
const SPON_SUBMIT_BUTTON = '#submit';

// CREDENTIALS
const SPON_USER_NAME_KEY = 'SPON_USER_NAME';
const SPON_USER_PASSWORD_KEY = 'SPON_USER_PASSWORD';

@Injectable()
export class SponService
implements LoginFlow, Realm, ArticleScraper, OnModuleInit
{
  private page: Page;
  private loginInfo: UsernamePasswordLogin = { username: '', password: '' };

  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    this.loginInfo.username =
      this.configService.get<string>(SPON_USER_NAME_KEY);
    this.loginInfo.password = this.configService.get<string>(
      SPON_USER_PASSWORD_KEY
    );

    // this.page = await this.puppeteerService.getNewPage();

    // await this.visitHomepage();
    // const exampleArticle =
    //   'https://www.spiegel.de/politik/deutschland/energiekrise-drehen-wir-den-spiess-um-und-oeffnen-nord-stream-2-kolumne-a-f59e705d-5a9b-4457-aee0-ceceee6796cc';
    // await this.processArticle(exampleArticle);
  }

  getBaseUrl(): string {
    return 'spiegel.de';
  }

  /**
   * Visits Spiegel Online
   */
  async visitHomepage(): Promise<void> {
    const page = this.page;
    await page.goto(SPON_URL);
    await this.page.exposeFunction('getReader', this.getReader);

    const isLoggedIn: boolean = (await this.checkLogin()).loggedIn;
    if (!isLoggedIn) {
      await this.login();
      await page.goto(SPON_URL);
    }
    await page.screenshot({
      path: SCREENSHOT_DIR + this.getBaseUrl() + EXTENSION_PNG,
    });
  }

  /**
   * Logs into Spiegel Online
   */
  async login(): Promise<Reader> {
    const page = this.page;

    await page.goto(SPON_LOGIN_URL);
    await page.screenshot({
      path: SCREENSHOT_DIR + 'spiegel_login' + EXTENSION_PNG,
    });
    await page.type(SPON_LOGIN_INPUT_NAME, this.loginInfo.username);
    await page.type(SPON_LOGIN_INPUT_PASSWORD, this.loginInfo.password);

    await page.evaluate((spon_remember_checkbox: string) => {
      const rememberMeCheckbox: HTMLInputElement = <HTMLInputElement>(
        document.getElementById(spon_remember_checkbox)
      );
      rememberMeCheckbox.checked = true;
    }, SPON_REMEMBER_CHECKBOX);

    const button = await page.$(SPON_SUBMIT_BUTTON);
    await button.click();

    await page.waitForNavigation();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({
      path: SCREENSHOT_DIR + 'spiegel_waitForNav' + EXTENSION_PNG,
    });
    return this.checkLogin();
  }

  /**
   *
   */
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

  async checkLogin(): Promise<Reader> {
    const previousUrl: string = this.page.url();
    let returnToUrl = false;
    if (!previousUrl.includes(this.getBaseUrl())) {
      await this.visitHomepage();
      returnToUrl = true;
    }

    const reader = await this.page.evaluate(() =>
      this.getReader((window as SpiegelWindow).SARAs_data)
    );

    if (returnToUrl) {
      await this.page.goto(previousUrl);
    }
    return reader;
  }

  private getReader(sara_data: SARA_DATA[]): Reader {
    const saraLoginInfo: SponLoginInfo = sara_data.find(data =>
      isSponLoginInfo(data)
    ) as SponLoginInfo;
    return {
      loggedIn: saraLoginInfo.user.segment.loggedIn,
      activeSubscription: saraLoginInfo.user.segment.has_active_subscription,
    };
  }
}
