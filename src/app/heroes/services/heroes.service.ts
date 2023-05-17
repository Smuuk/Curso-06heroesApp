import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Heroe } from '../interfaces/heroe.interface';
import { enviroment } from '../../../enviroments/enviroments';

@Injectable({ providedIn: 'root' })
export class HeroesService {
    private baseUrl: string = enviroment.baseUrl;
    constructor(private http: HttpClient) { }

    getHeroes(): Observable<Heroe[]> {
        return this.http.get<Heroe[]>(`${this.baseUrl}/heroes`);
    }

    getHeroById(id: string): Observable<Heroe | undefined> {
        return this.http.get<Heroe>(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                catchError(error => of(undefined))
            );
    }

    getSuggestions(query: string): Observable<Heroe[]> {
        return this.http.get<Heroe[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
    }

    //nombre de la función(nombreDeVariables: Tipo de variable): LoRegresaComoObservable<LoQueRegresa>{
    //  return this.http.Operacion<lo que regresa>(endPoint donde va dirigido, la data que se envia)
    //   };
    //}
    addHero(hero: Heroe): Observable<Heroe> {
        return this.http.post<Heroe>(`${this.baseUrl}/heroes`, hero);
    }

    updateHero(hero: Heroe): Observable<Heroe> {
        if(!hero.id) throw Error('Hero id is required')
        return this.http.patch<Heroe>(`${this.baseUrl}/heroes/${hero.id}`, hero);
    }

    deleteHeroById(id: string): Observable<boolean> {
        return this.http.delete(`${this.baseUrl}/heroes/${id}`)
        .pipe(
            catchError(err => of(false) ),
            map( resp => true )
        );
    }
}