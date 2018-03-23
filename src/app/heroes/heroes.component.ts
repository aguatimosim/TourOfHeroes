import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  // selectedhero: Hero;

  constructor(private heroService: HeroService) { }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name)  { return; }
    this.heroService.addHero({ name } as Hero).subscribe(hero => {
      this.heroes.push(hero);  
    });   
  }
  
  delete(hero: Hero): void  {
    this.heroes = this.heroes.filter(h => h !== hero);  // retira o herói da lista na página
    this.heroService.deleteHero(hero).subscribe();
  }
  
  ngOnInit() {
    this.getHeroes();
  }

  /* Versão anterior - chamada no ONCLICK da linha
  onSelect(hero: Hero): void   {
    this.selectedhero = hero;
  }
   */

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.heroes); }
}
