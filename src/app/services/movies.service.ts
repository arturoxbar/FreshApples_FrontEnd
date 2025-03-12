import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';


const ENDPOINTS = {
  POPULAR: "/general/popular",
  TRENDING: "/general/trending",
  MEDIA: "/general/",
  MOVIES: "/movie/",
  SERIES: "/serie/"
}


@Injectable()
export class MoviesService {
  private baseUrl = 'https://freshapplesbackend-production.up.railway.app/';
  //private baseUrl = 'http://localhost:7338/';
  private prefix = 'api/v1/medias'
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => error);
  }

  popularMedias() {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.POPULAR}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  trendingMedias() {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.TRENDING}`
    return this.http.get(url).pipe(
      catchError(this.handleError)
    )
  }

  movieDetails(id: number) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.MOVIES}${id}`
    return this.http.get(url).pipe(
      catchError(this.handleError)
    )
  }

  serieDetails(id: number) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.SERIES}${id}`
    return this.http.get(url).pipe(
      catchError(this.handleError)
    )
  }

  searchMedia(mediaName: string) {
    const url = `${this.baseUrl}${this.prefix}${ENDPOINTS.MEDIA}${mediaName}`
    return this.http.post(url, {}).pipe(
      catchError(this.handleError)
    )
  }

  getOwnMedias() {
    const url = `${this.baseUrl}${this.prefix}/general`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    )
  }


}
