import { Component, Input } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { getTypeColor } from '../../utils/pokemon-types.util';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent {
  @Input() pokemon!: Pokemon;

  getTypeColor(type: string): string {
    return getTypeColor(type);
  }

  getTypeNames(): string {
    return this.pokemon.types.map(t => t.name).join('/');
  }
}

