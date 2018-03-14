import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {Hero} from './hero';
import {HEROES} from './mock-hero';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable()
export class HeroService {

  constructor(private http: HttpClient,
    private messageService: MessageService) {}

  private heroesUrl = 'api/heroes';  // URL to web api (servidor HTTP em memória). Parece que é "api/<objeto retornado pelo serviço in-memory>"

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  getHeroes(): Observable<Hero[]> {
    // this.messageService.add('HeroService: herois lidos');   // mensagem na página - desativada
    // return of (HEROES);  // antigo retorno do MOCK-HEROES  
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(    // analisa a resposta dada
        tap(heroes => this.log('herois lidos do banco de dados')),  // TAP executa o CALLBACK sobre a resposta sem afetá-la
        catchError(this.handleError('getHeroes', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    // this.messageService.add(`HeroService: heroi lido com id = ${id}`);  // Note the backticks ( ` ) that define a JavaScript template literal for embedding the id.
    // return of(HEROES.find(hero => hero.id === id));  // antigo retorno do MOCK-HEROES
    const url = `${this.heroesUrl}/${id}`;  // Note the backticks ( ` ) that define a JavaScript template literal for embedding the id.
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`heroi lido com id = ${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  // Método GET que o usa o método MAP do Observable para extrair o objeto do JSON retornado
  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }
  
  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any>  {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`heroi atualizado com id = ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero>  {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`heroi incluido com id = ${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }
  
  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
        
    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`heroi excluido com id = ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
    
  }
  
  /* GET heroes whose name contains search term */
  searchHeroes (term: string): Observable<Hero[]> {
    const url = `${this.heroesUrl}/?name=${term}`;

    if (! term.trim())  {
      return of ([]);
    }
    return this.http.get<Hero[]>(url)
      .pipe(
        tap(_ => this.log(`encontrados herois correspondentes a "${term}" `)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))  
      );
    
  }
  
  /** Log a HeroService message with the MessageService - método privado de envio de mensagens */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  /** Método padrão para tratamento de erros HTTP, a ser adaptado para o LOG do sistema e a resposta ao usuário.
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} falhou: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
