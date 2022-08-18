import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { Discovery } from 'src/domain/discovery-service.interface';
import { NYTimesArticle } from '../types';

const NYTIMES_API_URL = 'https://api.nytimes.com/svc/mostpopular/v2/shared/1.json';


@Injectable()
export class NytimesApiService implements Discovery
{
  constructor(
    private http: HttpService,
  ) {}

  async discover() {
    return firstValueFrom(
      this.http
        .get(NYTIMES_API_URL)
        .pipe(
          map(response => response.data.results),
          map((nytimesArticles: NYTimesArticle[]) => 
            nytimesArticles.map((nytimesArticle: NYTimesArticle) => 
              nytimesArticle.title
          ))
        )
    );
  }
}
