import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { RootMenu } from '@typings/menu.type';
@Component({
  selector: 'app-mobile-menus',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './mobile-menus.component.html',
  styleUrl: './mobile-menus.component.scss'
})
export class MobileMenusComponent {
  @Input() menus: RootMenu = {routeButtons:[], routeMenus:[]}
  @Output() onMenuItemClick = new EventEmitter<void>()
}
