import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { Discovery } from 'src/domain/discovery';
import { FetchableArticle } from 'src/domain/fetchable-article';
import { NytimesResult } from './domain/nytimes-result';
import { NytimesViewedArticle } from './domain/nytimes-viewed-article';

const NYTIMES_VIEWED_API_URL =
  'https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json';

@Injectable()
export class NytimesApiService implements Discovery 
{
  constructor(private http: HttpService) {}

  /**
   * Discover articles on nytimes.com by calling their API.
   */
  async discover(): Promise<FetchableArticle[]> 
  {
    const httpResult = await firstValueFrom(
      this.http.get<NytimesResult>(NYTIMES_VIEWED_API_URL).pipe(map(response => response.data))
    );

    const fetchableArticles = httpResult.results.map(nytimesArticle => 
      NytimesViewedArticle.toFetchableArticle(nytimesArticle)
    );
    return fetchableArticles;
  }
}
