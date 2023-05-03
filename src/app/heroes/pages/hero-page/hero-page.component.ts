import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Heroe } from 'app/heroes/interfaces/heroe.interface';
import { HeroesService } from 'app/heroes/services/heroes.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

public hero?: Heroe;

  constructor(
    private heroeService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ){}

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroeService.getHeroById(id)),
    ).subscribe(params => {
      if(!params) return this.router.navigate(['/heroes/list']);
      this.hero = params;
      console.log({params});
      return;
    })
  }

  goBack():void{
    this.router.navigateByUrl('heroes/list');
  }
}
