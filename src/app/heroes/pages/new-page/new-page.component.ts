import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/heroes/components/card/confirm-dialog/confirm-dialog.component';
import { Heroe, Publisher } from 'app/heroes/interfaces/heroe.interface';
import { HeroesService } from 'app/heroes/services/heroes.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

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
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { };

  get currentHero(): Heroe {
    const hero = this.heroForm.value as Heroe;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id)),
      ).subscribe(heroe => {
        if (!heroe) {
          return this.router.navigateByUrl('/');
        }
        this.heroForm.reset(heroe);
        return
      })
  }

  onSumit(): void {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          //to do: mostrar snackbar
          this.showSnackBar(`${hero.superhero} updated!`);
        });
      return;
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${hero.superhero} created!`)
      });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result)return;
      this.heroesService.deleteHeroById(this.currentHero.id)
      .subscribe(wasDeleted =>{
        if(wasDeleted)
        this.router.navigate(['/heroes'])
      })
    });
  }

  showSnackBar(message: string): void {
    this.snackbar.open(message, 'ok', {

      duration: 2500,
    })
  }
}
