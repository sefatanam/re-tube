import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adjustHeight',
  standalone: true
})
export class AdjustHeightPipe implements PipeTransform {
  transform(upperElementRef: HTMLElement, ...args: unknown[]): string {
    const upperDivHeight = upperElementRef.offsetHeight;
    return `calc( 100% - (${upperDivHeight}px + 50px))`;
  }

}
