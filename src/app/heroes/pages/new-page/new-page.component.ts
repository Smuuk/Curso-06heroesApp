import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Heroe, Publisher } from 'app/heroes/interfaces/heroe.interface';
import { HeroesService } from 'app/heroes/services/heroes.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    {
      id: 'DC Comics', desc: 'DC - comics'
    },
    {
      id: 'Marvel Comics', desc: 'Marvel - comics'
    }
  ];
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { };

  get currentHero(): Heroe {
    const hero = this.heroForm.value as Heroe;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
    .pipe(
      switchMap(({id})=> this.heroesService.getHeroById(id)),
    ).subscribe(heroe=>{
      if(!heroe){
        return this.router.navigateByUrl('/');
      }
      this.heroForm.reset(heroe);
      return
    })
  }

  onSumit(): void {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe(hero => {
        //mostrar snackbar
      });
      return;
    }
    this.heroesService.addHero(this.currentHero)
    .subscribe(hero=>{
      //mostrar snackbar, y navegar a /heroes/edit/hero.id
    }); 
  }
}
