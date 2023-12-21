import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgZone, afterNextRender, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterContentInit {
  openMenu: boolean = true;
  ngZone = inject(NgZone)
  
  ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', () => {
        this.openMenu = window.matchMedia('(max-width: 767px)').matches ? false : true;
      })
    })
  }
}
