export interface Discovery
{
  discover(): Promise<string[]>;
}