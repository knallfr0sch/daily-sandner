import { Controller, Get, Header, Render, StreamableFile } from '@nestjs/common';
import { DiscoveryService } from './discovery/discovery/discovery.service';
import { FetchableArticle } from './domain/fetchable-article';
import { GeneratorService } from './generator/generator/generator.service';
import { PrismaService } from './prisma/prisma.service';

const TEST_ARTICLE = `<head>Header</head><body><div><h2>Article</h2></div><div><div id="readability-page-1" class="page"><section><p><span><a href="https://www.economist.com/europe/" data-analytics="sidebar:section">Europe</a></span><span> | <!-- -->The other nuclear risk</span></p><h2>A fifth of Ukraine’s electricity supply is now in Vladimir Putin’s hands</h2></section><div><p data-caps="initial"><span data-caps="initial">E</span><small>ARLY IN THE</small> morning of March 4th, after a night of heavy fighting, Russian forces took control of Europe’s largest nuclear power plant: Zaporizhzhia in southern Ukraine. The fighting had started a blaze which teams of firefighters scrambled to put out. There is no evidence of damage to the plant’s six reactors, which in normal times supply a fifth of Ukraine’s electricity. When the Russians attacked only three of the six reactors were operating. The two close to the fighting were shut down in response. Now just one is running at 60% capacity. </p><div><figure><div itemscope="" itemprop="image" itemtype="https://schema.org/ImageObject" data-slim="1"><meta itemprop="url" content="https://www.economist.com/img/b/1280/1088/90/media-assets/image/20220312_WOM984.png"><p><img loading="lazy" src="https://www.economist.com/img/b/1280/1088/90/media-assets/image/20220312_WOM984.png" srcset="https://www.economist.com/img/b/200/170/90/media-assets/image/20220312_WOM984.png 200w,https://www.economist.com/img/b/300/255/90/media-assets/image/20220312_WOM984.png 300w,https://www.economist.com/img/b/400/340/90/media-assets/image/20220312_WOM984.png 400w,https://www.economist.com/img/b/600/510/90/media-assets/image/20220312_WOM984.png 600w,https://www.economist.com/img/b/640/544/90/media-assets/image/20220312_WOM984.png 640w,https://www.economist.com/img/b/800/680/90/media-assets/image/20220312_WOM984.png 800w,https://www.economist.com/img/b/1000/850/90/media-assets/image/20220312_WOM984.png 1000w,https://www.economist.com/img/b/1280/1088/90/media-assets/image/20220312_WOM984.png 1280w" sizes="336px" alt=""></p></div></figure><p>There are 15 nuclear reactors in Ukraine. Together they supply more than half of the country’s electricity, making it one of the most nuclear-dependent countries in the world. As well as the six reactors at Zaporizhzhia, now under Russian control, there are three at the Yuzhnoukrainsk plant one oblast over and four more in two separate plants in the north-west of the country. </p><p>On March 1st Ukraine’s nuclear plant operator, Energoatom, asked the International Atomic Energy Agency (<small>IAEA</small>), an arm of the United Nations, to intervene to keep Russian forces at least 30km away from nuclear power stations. On March 3rd the <small>IAEA</small> called on Russian forces to “immediately cease actions’‘ at Ukrainian nuclear sites. Zaporizhzhia, which is on the Dnieper about 100km north-west of the Russian-occupied city of Melitopol, was the agency’s primary concern; it had been surrounded by Russian forces for days. </p><p>This morning Volodymyr Zelensky, Ukraine’s president, said that in ignoring the <small>IAEA</small>’s call Russian troops had committed a “terror attack”. “They know what they are shooting at. They’ve been preparing for this,” Mr Zelensky wrote online. Stray shells could have damaged the infrastructure that allows a reactor to function safely, either by cutting off the water supply used to take heat from the core and drive the plant’s mighty turbines or by damaging the diesel reactors that power the back-up cooling pumps. If a nuclear reactor loses the ability to cool itself, it risks going into meltdown.</p><p>Operational nuclear reactors have never been in the firing line like this. Reactors under construction have been attacked and destroyed before; Israel has levelled two, one in Iraq in 1981 and another in Syria in 2007. There have been wars on the territory of countries with operational reactors, such as skirmishes on the India-Pakistan border and the conflicts between Armenia and Azerbaijan. But in those cases the fighting took place hundreds of miles away from the reactors themselves. To have an operational nuclear plant seized by force is unprecedented. </p></div><p>On the first day of the invasion Russian forces took Chernobyl, the nuclear plant which suffered a meltdown in 1986. But the Chernobyl site poses a far lower risk than Zaporizhzhia. The nuclear fuel was long ago removed from the three undamaged reactors. The fourth reactor, the one which exploded in 1986, has been cleaned up and encased in a vast concrete sarcophagus, which was itself covered by a gigantic metal dome in 2014. The increased levels of radiation that have been observed around the plant are thought to be due to heavy armoured vehicles churning up contaminated soil. </p><p>Thus it is Ukraine’s operational reactors that pose the more serious risk. Because of the danger of reactor meltdowns and the large leaks of radioactive material which can follow, nuclear plants are some of the world’s most over-engineered objects, and are designed to remain safe if hit by an aeroplane, or a terrorist attack. Before the invasion, Petro Kotin, Energoatom’s boss, said that in the event of shelling they would be shut down and their fuel unloaded. If the power supply is disrupted, the backup generators kick in. Mr Kotin noted that Ukrainian reactors had more diesel fuel on hand than is normal as a hedge against such disruption.</p><p>But war is unpredictable, and no nuclear plant design can account for all eventualities. “Were a reactor core to melt, explosive gases or belching radioactive debris would exit the containment structure,” Bennett Ramburg, the author of “Nuclear Power Plants as Weapons for the Enemy”, noted recently. “Once in the atmosphere, the effluents would settle over thousands of miles, dumping light to very toxic radioactive elements on urban and rural landscapes.” Suriya Jayanti, an energy lawyer at the American embassy in Kyiv between 2018 and 2020, says she believes Russia is using control of Ukraine’s nuclear power plants to “leverage terror over Europe”. </p><p>Radiation levels around Zaporizhzhia have not risen. The fire broke out in a non-essential building on the periphery. That Ukraine’s nuclear plants would be forced to shut down, rather than melt down, was always the more likely outcome. They are designed to do this in the event of a malfunction in the infrastructure that keeps the core at safe temperatures, regardless of whether that malfunction is due to shelling or human error. This is what is happening now at Zaporizhzhia. But the plant alone produces 23% of Ukraine’s power; with Ukrainians huddled in freezing bunkers, shortages have the potential to cause great suffering. </p><p>The country’s electricity grid is not connected to any of its neighbours. Links to the Russian and Belarusian grid were taken offline as part of an experiment on grid stability carried out, as it happened, on the day of the invasion. They are still down, meaning it is not currently possible to replace Zaporizhzhia’s electricity with imported supply. Talks with Europe about integrating with Ukraine’s grid are ongoing, and transmission lines to Hungary, Romania, Slovakia and Poland have already been installed, says Volodymyr Kudrytskyi, the boss of Ukraine’s grid operator Ukrenergo. He hopes that the European Network of Transmission System Operators will approve the interconnection with the Ukrainian grid soon.</p><p>The reactors at Zaporizhzhia may yet start up again once it is safe to do so. But if present circumstances endure, that will be done under Russian, rather than Ukrainian control. Later on the morning of March 4th the Russian Defence Ministry confirmed that it had control of Zaporizhzhia. On top of everything else, Russia’s president, Vladimir Putin, now has his hands gripped round the country’s power supply.<span data-ornament="ufinish">■</span></p><p><i>Our recent coverage of the Ukraine crisis can be found <a href="https://www.economist.com/ukraine-crisis">here</a>.</i></p></div></div></div></body>`;

@Controller()
export class AppController 
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generatorService: GeneratorService,
    private readonly discoveryService: DiscoveryService,
  ) {}

  @Get('Home')
  @Render('Home')
  getHello() 
  {
    return { message: 'NestJS ❤ Svelte' };
  }


  @Get('db')
  async getTestValuesFromDb(): Promise<FetchableArticle[]>
  {
    return this.prismaService.fetchableArticle.findMany();
  }

  @Get('pdf')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment; filename="daily-sandner.pdf"')
  async getStaticFile(): Promise<StreamableFile>
  {
    if (this.generatorService.pdfBuffer === undefined) 
    {
      await this.generate();
    }
    return new StreamableFile(this.generatorService.pdfBuffer);
    
  }  

  @Get('discover')
  async discover(): Promise<FetchableArticle[]>
  {
    await this.discoveryService.discoverArticles();
    return this.prismaService.fetchableArticle.findMany();
  }

  @Get('generate')
  async generate(): Promise<StreamableFile> 
  {
    return new StreamableFile(
      await this.generatorService.generatePdf([TEST_ARTICLE])
    );
  }
}

