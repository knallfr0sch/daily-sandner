import { Readability } from '@mozilla/readability';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSDOM } from 'jsdom';
import { Page } from 'puppeteer';
import { EXTENSION_PNG, SCREENSHOT_DIR } from 'src/app.module';
import { ArticleScraper } from 'src/domain/article-scraper';
import { LoginFlow } from 'src/domain/login-flow';
import { Reader } from 'src/domain/reader';
import { Realm } from 'src/domain/realm';
import { UsernamePasswordLogin } from 'src/domain/usernamePasswordLogin';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';
import { HTTPS_PREFIX } from 'src/util/https-prefix';
import { EconomistWindow, TEDL } from '../types';

// LOGIN FORM
const economist_login_url = 'https://www.economist.com/api/auth/login';

// CREDENTIALS
const ECONOMIST_USER_NAME_KEY = 'ECONOMIST_USER_NAME';
const ECONOMIST_USER_PASSWORD_KEY = 'ECONOMIST_USER_PASSWORD';

@Injectable()
export class EconomistService
implements OnModuleInit, Realm, ArticleScraper, LoginFlow
{
  private page: Page;
  private loginInfo: UsernamePasswordLogin = { username: '', password: '' };

  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService,
  ) { }

  async onModuleInit() 
  {
    this.loginInfo.username = this.configService.get<string>(ECONOMIST_USER_NAME_KEY);
    this.loginInfo.password = this.configService.get<string>(ECONOMIST_USER_PASSWORD_KEY);

    // console.log(this.loginInfo.username);

    // this.page = await this.puppeteerService.getNewPage();

    // await this.visitHomepage();
    // const exampleArticle = "https://www.economist.com/business/2022/08/15/republicans-are-falling-out-of-love-with-america-inc";
    // await this.processArticle(exampleArticle);
  }

  getBaseUrl(): string 
  {
    return 'economist.com';
  }

  async visitHomepage(): Promise<void> 
  {
    const page = this.page;
    await page.goto(`${HTTPS_PREFIX}${this.getBaseUrl()}`);
    await this.page.exposeFunction('getReader', this.getReader);

    const isLoggedIn: boolean = (await this.checkLogin()).loggedIn;
    if (!isLoggedIn) 
    {
      await this.login();
      await page.goto(`${HTTPS_PREFIX}${this.getBaseUrl()}`);
    }
    await page.screenshot({
      path: SCREENSHOT_DIR + this.getBaseUrl() + '.png',
    });
  }

  /**
   * Logs into The Economist
   */
  async login(): Promise<Reader> 
  {
    const page = this.page;

    await page.goto(economist_login_url);
    await page.screenshot({
      path: SCREENSHOT_DIR + 'economist_' + 'login' + EXTENSION_PNG,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Holy fuck this is dirty.

    await page.evaluate(
      (username: string, password: string) => 
      {
        const slot: HTMLSlotElement = document
          .querySelector('c-lwc-login-form')
          .shadowRoot.querySelector('lightning-card')
          .shadowRoot.querySelector('.slds-card__body')
          .children[0] as HTMLSlotElement;

        const inputCard: HTMLElement = slot.assignedNodes()[4] as HTMLElement;

        const userNamelightningInput: Element =
          inputCard.children[1].children[1];
        const userNameInput: HTMLInputElement =
          userNamelightningInput.shadowRoot.querySelector('input');
        userNameInput.value = username;

        const passwordLightningInput =
          inputCard.children[2].children[0].children[1];
        const passwordInput: HTMLInputElement =
          passwordLightningInput.shadowRoot.querySelector('input');
        passwordInput.value = password;

        const loginLightningInput = inputCard.children[4]
          .children[0] as HTMLElement;

        loginLightningInput.click();
      },
      this.loginInfo.username,
      this.loginInfo.password
    );

    await page.screenshot({
      path: SCREENSHOT_DIR + 'economist_' + 'login_after_type' + EXTENSION_PNG,
    });

    await page.waitForNavigation();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({
      path: SCREENSHOT_DIR + 'economist_waitForNav.png',
    });
    return this.checkLogin();
  }

  async checkLogin(): Promise<Reader> 
  {
    const previousUrl: string = this.page.url();
    let returnToUrl = false;
    if (!previousUrl.includes(this.getBaseUrl())) 
    {
      await this.visitHomepage();
      returnToUrl = true;
    }

    const reader = await this.page.evaluate(() =>
      this.getReader((window as EconomistWindow).tedl)
    );

    if (returnToUrl) 
    {
      await this.page.goto(previousUrl);
    }
    return reader;
  }

  async processArticle(articleUrl: string): Promise<string>
  {
    console.log(articleUrl);
    if (!articleUrl.includes(this.getBaseUrl())) 
    {
      console.log("invalid url, aborting");
      return undefined;
    }
    const jsdom = await JSDOM.fromURL(articleUrl);
    const readability = new Readability(jsdom.window.document).parse();
    console.log(readability.content);
    return readability.content;
  }

  // async processArticle(articleUrl: string): Promise<ReadabilityArticle> 
  // {
  //   if (!articleUrl.includes(this.getBaseUrl())) 
  //   {
  //     return undefined;
  //   }
  //   console.log(articleUrl);

  //   await this.page.goto(articleUrl);

  //   const htmlArticle = await this.page.content();

  //   const document = new JSDOM(htmlArticle);
  //   const article = new Readability(document.window.document).parse();
  //   console.log(article.title);

  //   return article;
  // }

  private getReader(tedl: TEDL): Reader 
  {
    const loggedIn: boolean =
      tedl.user !== undefined && tedl.user.status === 'logged-in';
    let activeSubscription = false;
    if (loggedIn === true) 
    {
      activeSubscription =
        tedl.user.IsSubscriber === true &&
        tedl.user.account_type === 'paid' &&
        tedl.user.isLapsed === false;
    }

    return { loggedIn, activeSubscription };
  }
}
