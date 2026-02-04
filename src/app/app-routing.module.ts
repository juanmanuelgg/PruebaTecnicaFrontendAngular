import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonGalleryComponent } from './components/pokemon-gallery/pokemon-gallery.component';

const routes: Routes = [
  { path: '', component: PokemonGalleryComponent },
  { path: 'pokemon/:id', component: PokemonGalleryComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
