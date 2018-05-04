import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'detail/:id', component: HeroDetailComponent }    // o ":" indica que "id" é um parâmetro
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],    // configura o router no nível da APLICAÇÃO, baseado na URL corrente do browser
  exports: [RouterModule]
})

export class AppRoutingModule { }
