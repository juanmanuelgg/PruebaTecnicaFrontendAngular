import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-gallery',
  templateUrl: './pokemon-gallery.component.html',
  styleUrls: ['./pokemon-gallery.component.scss']
})
export class PokemonGalleryComponent implements OnInit {
  pokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  isLoading = true;
  showModal = false;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPokemon();
    
    // Listen to route params to show modal when needed
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadPokemonDetail(params['id']);
      } else {
        this.closeModal();
      }
    });
  }

  loadPokemon(): void {
    this.isLoading = true;
    this.pokemonService.getRandomPokemon(30).subscribe({
      next: (pokemons) => {
        this.pokemons = pokemons.filter(p => p !== null);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.isLoading = false;
      }
    });
  }

  loadPokemonDetail(id: string): void {
    const pokemonId = parseInt(id, 10);
    this.pokemonService.getPokemonById(pokemonId).subscribe({
      next: (pokemon) => {
        if (pokemon) {
          this.selectedPokemon = pokemon;
          this.showModal = true;
        }
      },
      error: (error) => {
        console.error('Error loading pokemon detail:', error);
      }
    });
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPokemon = null;
    this.router.navigate(['/']);
  }

  refreshGallery(): void {
    this.loadPokemon();
  }
}

