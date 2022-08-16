import { Readability } from '@mozilla/readability';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Page } from 'puppeteer-core';
import { SCREENSHOT_DIR } from 'src/app.module';
import { ReadabilityArticle } from 'src/domain/article';
import { ArticleScraper } from 'src/domain/article-scraper';
import { LoginFlow } from 'src/domain/login-flow';
import { Reader } from 'src/domain/reader';
import { Realm } from 'src/domain/realm';
import { UsernamePasswordLogin } from 'src/domain/usernamePasswordLogin';
import { PuppeteerService } from 'src/puppeteer/puppeteer/puppeteer.service';
import { EconomistWindow, TEDL } from '../types';
var { JSDOM } = require('jsdom');

// LOGIN FORM
const economist_login_url = 'https://www.economist.com/api/auth/login';
const economist_login_input_name = 'input[name="username"]';
const economist_login_input_password = 'input[name="password"]';

const economist_submit_button = 'button[type="submit"]';

// CREDENTIALS
const ECONOMIST_USER_NAME_KEY = "ECONOMIST_USER_NAME";
const ECONOMIST_USER_PASSWORD_KEY = "ECONOMIST_USER_PASSWORD"

@Injectable()
export class EconomistService implements Realm, ArticleScraper, LoginFlow
{
  private page: Page;
  private loginInfo: UsernamePasswordLogin = {username: "", password: ""};
  
  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService,
  ) { }

  async onModuleInit() {
    this.loginInfo.username = this.configService.get<string>(ECONOMIST_USER_NAME_KEY);
    this.loginInfo.password = this.configService.get<string>(ECONOMIST_USER_PASSWORD_KEY);

    console.log(this.loginInfo.username);

    this.page = await this.puppeteerService.getNewPage();

    await this.visitHomepage();
    const exampleArticle = "https://www.economist.com/business/2022/08/15/republicans-are-falling-out-of-love-with-america-inc";
    await this.processArticle(exampleArticle);
  }

  getBaseUrl(): string {
    return "economist.com"
  }
  
  async visitHomepage(): Promise<void> {
    const page = this.page;
    await page.goto(`https://${this.getBaseUrl()}`);
    await this.page.exposeFunction("getReader", this.getReader);

    const isLoggedIn: boolean = (await this.checkLogin()).loggedIn;
    if (!isLoggedIn) {
      await this.login();
      await page.goto(this.getBaseUrl());
    }
    await page.screenshot({path: SCREENSHOT_DIR + this.getBaseUrl()});
  }

  /**
   * Logs into The Economist
   */
   async login(): Promise<Reader> {
    const page = this.page;

    await page.goto(economist_login_url);
    await page.waitForSelector(economist_login_input_name);
    await page.screenshot({path: SCREENSHOT_DIR + "economist_" + "login" + ".png"});


    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");
    // document.querySelector("c-lwc-login-form").shadowRoot.querySelector("lightning-card").shadowRoot.querySelector('.slds-card__body').children[0].assignedNodes()[4].getElementsByTagName("input");


    await page.type(economist_login_input_name, this.loginInfo.username);
    await page.type(economist_login_input_password, this.loginInfo.password);

    const button = await page.$(economist_submit_button);
    await button.click();
    

    await page.waitForNavigation();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({path: SCREENSHOT_DIR + "economist_waitForNav.png"});
    return this.checkLogin();
  }

  async checkLogin(): Promise<Reader> {
    const previousUrl: string = this.page.url();
    let returnToUrl = false;
    if (!previousUrl.includes(this.getBaseUrl())) {
      await this.visitHomepage();
      returnToUrl = true;
    }
   
    const reader = await this.page.evaluate(() => 
      this.getReader((window as EconomistWindow).tedl)
    );

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

    let asd: Node;
    asd.getRootNode

    return article;
  }

  private getReader(tedl: TEDL): Reader {
    const loggedIn: boolean = tedl.user.status === "logged-in";
    let activeSubscription = false;
    if (loggedIn === true) {
      activeSubscription = tedl.user.IsSubscriber === true
                        && tedl.user.account_type === "paid"                              
                        && tedl.user.isLapsed === false;
    }

    return { loggedIn, activeSubscription};
  }
  
}
