
import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit 
{
  private logger = new Logger(PrismaService.name);

  async onModuleInit() 
  {
    this.logger.log(`Starting prisma client and connecting..`);
    await this.$connect();
    this.logger.log(`Successfully connected.`);
  }

  async enableShutdownHooks(
    app: INestApplication
  ) 
  {
    this.$on('beforeExit', async () => 
    {
      await app.close();
    });
  }
}