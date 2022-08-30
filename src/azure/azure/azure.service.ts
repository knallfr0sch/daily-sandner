import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

const CONTAINER_NAME = 'files';

@Injectable()
export class AzureService implements OnModuleInit 
{
  private containerClient: ContainerClient;
  private logger = new Logger(AzureService.name);

  async onModuleInit() 
  {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    this.createContainerIfNotExists(blobServiceClient);
    
    this.containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    this.logger.log(`Azure service initialized`);
  }

  /**
   * Uploads a file to Azure Storage.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFile(file: Buffer, fileName: string): Promise<void> 
  {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    
    const response = await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: { blobContentType: "application/pdf" },
    });

    if (blockBlobClient.exists()) 
    {
      this.logger.log(`File uploaded to Azure Storage: ${fileName}`);
    }

    if (response.errorCode) 
    {
      this.logger.log(`Error uploading file to Azure Storage: ${response.errorCode}`);
    }

    if (response._response.status !== 201) 
    {
      throw new Error(
        `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
      );
    }
  }

  /**
   * Lists all files within our Azure Storage container.
   */
  async listFiles(): Promise<void> 
  {
    for await (const blob of this.containerClient.listBlobsFlat()) 
    {
      console.log(`Blob ${blob.name}`);
    }
  }

  /**
   * Creates the container if it doesn't exist.
   */
  private async createContainerIfNotExists(blobServiceClient: BlobServiceClient): Promise<void>
  {
    let containerExists = false;

    for await (const container of blobServiceClient.listContainers())
    {
      if (container.name === CONTAINER_NAME) 
      {
        containerExists = true;
      }
    }
    if (!containerExists) 
    {
      blobServiceClient.createContainer(CONTAINER_NAME);
    }
  }
}
