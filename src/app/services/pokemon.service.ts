import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon, PokemonApiResponse } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private totalPokemon = 1010; // Total number of Pokémon in the API

  constructor(private http: HttpClient) { }

  /**
   * Get 30 random Pokémon
   */
  getRandomPokemon(count: number = 30): Observable<Pokemon[]> {
    const randomIds = this.getRandomIds(count);
    const requests = randomIds.map(id => this.getPokemonById(id));
    
    return forkJoin(requests);
  }

  /**
   * Get a single Pokémon by ID
   */
  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<PokemonApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.transformPokemon(response)),
      catchError(error => {
        console.error('Error fetching pokemon:', error);
        return of(null as any);
      })
    );
  }

  /**
   * Get a single Pokémon by name
   */
  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<PokemonApiResponse>(`${this.apiUrl}/${name}`).pipe(
      map(response => this.transformPokemon(response)),
      catchError(error => {
        console.error('Error fetching pokemon:', error);
        return of(null as any);
      })
    );
  }

  /**
   * Transform API response to our Pokemon model
   */
  private transformPokemon(response: PokemonApiResponse): Pokemon {
    return {
      id: response.id,
      name: response.name,
      normalizedName: this.normalizeName(response.name),
      imageUrl: response.sprites.other['official-artwork'].front_default || response.sprites.front_default,
      abilities: response.abilities.map(a => ({
        name: this.normalizeName(a.ability.name),
        url: a.ability.url
      })),
      types: response.types.map(t => ({
        name: this.capitalizeFirst(t.type.name),
        url: t.type.url
      }))
    };
  }

  /**
   * Normalize Pokémon name (capitalize first letter of each word, handle special characters)
   */
  private normalizeName(name: string): string {
    return name
      .split('-')
      .map(word => this.capitalizeFirst(word))
      .join(' ');
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate array of random unique Pokémon IDs
   */
  private getRandomIds(count: number): number[] {
    const ids = new Set<number>();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * this.totalPokemon) + 1);
    }
    return Array.from(ids);
  }
}

