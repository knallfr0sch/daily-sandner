import { Injectable, Logger } from '@nestjs/common';
import {
  Action, Ctx, Hears, Help, InlineQuery, Start, Update
} from 'nestjs-telegraf';
import { TEST_ARTICLE } from 'src/app.controller';
import { GeneratorService } from 'src/generator/generator/generator.service';
import { Scenes } from 'telegraf';
import { InlineKeyboardMarkup } from 'typegram/markup';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Markup } = require('telegraf');

const buttons: InlineKeyboardMarkup = Markup.inlineKeyboard([
  Markup.button.callback('Coke', '1'),
  Markup.button.callback('Pepsi', '2')
]);

console.log(buttons);

@Update()
@Injectable()
export class Telegrafer 
{
  private logger: Logger = new Logger(Telegrafer.name);  

  constructor(
    private generatorService: GeneratorService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Scenes.SceneContext) 
  {
    await ctx.reply('Welcome');
  }

  @Hears('keyboard')
  async keyboard(@Ctx() ctx: Scenes.SceneContext) 
  {
    ctx.reply(`Test keyboard!`, 
      { reply_markup:
        {
          inline_keyboard: [
            [ { text: "Button 1", callback_data: "btn-1" },
              { text: "Button 2", callback_data: "btn-2" } ],
          ]
        }
      });
  }

  @Action('btn-1')
  async action(@Ctx() ctx: Scenes.SceneContext) 
  {
    ctx.answerCbQuery("Received action!",  { show_alert: true });
    console.log("Received action!");
  }

  @Help()
  async help(@Ctx() ctx: Scenes.SceneContext) 
  {
    await ctx.reply('Send me a sticker');
  }

  @Hears('latest')
  async latest(@Ctx() ctx: Scenes.SceneContext) 
  {
    this.logger.log(`Generating PDF...`);
    if (this.generatorService.pdfBuffer === undefined) 
    {
      await this.generatorService.generatePdf([TEST_ARTICLE]);
    }

    ctx.replyWithDocument({
      source: this.generatorService.pdfBuffer,
      filename: 'daily-sandner.pdf'
    }
    );
  }

  @InlineQuery("switch")
  async switch(@Ctx() ctx: Scenes.SceneContext)
  {
    ctx.answerInlineQuery([],
      {
        switch_pm_text: "Chat with me in private..",
        switch_pm_parameter: "test"
      }
    );
  }

  @InlineQuery("latest")
  async inlineQuery(@Ctx() ctx: Scenes.SceneContext)
  {
    ctx.answerInlineQuery(
      [
        {
          type: "document",
          id: "4",
          mime_type: "application/pdf",
          title: "Daily Sandner",
          document_url: "https://dailysandnerblobber.blob.core.windows.net/files/daily-sandner.pdf",
          description: "The best news ever",
        }
      ],
    );
  }

  @Hears('hi')
  async hears(@Ctx() ctx: Scenes.SceneContext) 
  {
    await ctx.reply(`${ctx.botInfo.username} welcomes ${ctx.from.username}.`);
    
  }
}