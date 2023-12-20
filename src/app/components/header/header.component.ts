import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnInit, afterNextRender, afterRender, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  openMenu: boolean = true;
  ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', () => {
        this.openMenu = window.matchMedia('(max-width: 767px)').matches ? false : true;
      })
    })
  }

}
