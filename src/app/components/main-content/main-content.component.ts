import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { MobileMenusComponent } from '../mobile-menus/mobile-menus.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, HeaderComponent, MobileMenusComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  openMenu: boolean = false;
}
