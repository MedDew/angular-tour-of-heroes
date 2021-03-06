import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = "/api/heroes";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService : MessageService, private httpClient : HttpClient  ) {

   }

  getHeroes() : Observable<Hero[]>{
    // TODO: send the message _after_ fetching the heroes
    // this.messageService.add('HeroService: fetched heroes');
    // return of(HEROES);
    return this.httpClient.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log("fetched heroes")), 
      catchError(this.handleError<Hero[]>("getHeroes", []))
    );
  }

  getHero(id : number) : Observable<Hero>{
    // TODO: send the message _after_ fetching the hero
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    //return of(HEROES.find(hero => hero.id === id))
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log(`HeroService: fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  public updateHero(hero : Hero) : Observable<any>{
    //const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions ).pipe(
      tap( _ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>("updateHero"))
    );
  }

  /** POST: add a new hero to the server */
  public addHero(hero : Hero) :  Observable<Hero>{
    return this.httpClient.post(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(  (newHero : Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>("addHero"))
    )
  }

  private log(message : string) : void {
    this.messageService.add(`HeroService : ${message}`);
  }


      /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
     
        // TODO: send the error to remote logging infrastructure
        console.error("ERROR THROWN : ", error); // log to console instead
     
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.statusText}`);//${error.message}
     
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

    /** DELETE: delete the hero from the server */
    public deleteHero(hero : Hero | number) : Observable<Hero>{
      console.log("Type of Hero : ");
      console.log(typeof hero === 'number');

      const id = typeof hero === 'number' ? hero : hero.id;

      const url = `${this.heroesUrl}/${id}`;
      return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
        tap( _ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>("deleteHero"))
      )
    }

    /* GET heroes whose name contains search term */
    searchHeroes(term: string): Observable<Hero[]> {
      if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }

      return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    }
}
