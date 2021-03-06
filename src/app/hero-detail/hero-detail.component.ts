import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private heroService: HeroService) { }

  getHero(): void {
    const id: number = +this.route.snapshot.paramMap.get('id');   // The JavaScript (+) operator converts the string to a number.
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }
  
  save(): void  {
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack);
  }

  ngOnInit(): void {
    this.getHero();
  }

  goBack(): void  {
    this.location.back();
  }

}
