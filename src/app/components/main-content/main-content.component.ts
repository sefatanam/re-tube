import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { MobileMenusComponent } from '../mobile-menus/mobile-menus.component';
import { RootMenu } from '@typings/menu.type';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, HeaderComponent, MobileMenusComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  openMenu: boolean = false;
  @Input() menus: RootMenu = { routeButtons: [], routeMenus: [] };
  @Input() user = signal<User | null>(null);
}
