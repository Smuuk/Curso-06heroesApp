import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroe.interface';

@Pipe({
  name: 'heroImg'
})
export class HeroImgPipe implements PipeTransform {

  transform(heroPipe: Heroe): string {
    if(!heroPipe.id && !heroPipe.alt_img){
      return 'assets/no-image.png'
    }

    if(heroPipe.alt_img) return heroPipe.alt_img;
    return `assets/heroes/${heroPipe.id}.jpg`;
  }

  
}
