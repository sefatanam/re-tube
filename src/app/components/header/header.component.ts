import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  openMenu: boolean = true;
  constructor(){
    afterNextRender(()=>{
      this.openMenu = window.matchMedia('(max-width: 767px)').matches ? false : true;
    })
  }
}
