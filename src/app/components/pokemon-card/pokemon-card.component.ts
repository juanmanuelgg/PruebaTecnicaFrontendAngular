import { Component, Input } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { getTypeColor } from '../../utils/pokemon-types.util';

@Component({
    selector: 'app-pokemon-card',
    templateUrl: './pokemon-card.component.html',
    styleUrls: ['./pokemon-card.component.scss'],
    standalone: false
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  getTypeColor(type: string): string {
    return getTypeColor(type);
  }
}

