import { Module } from '@nestjs/common';
import { AzureService } from './azure/azure.service';

@Module({
  providers: [
    AzureService
  ],
  exports: [
    AzureService
  ]
})
export class AzureModule {}
