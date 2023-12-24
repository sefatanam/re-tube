import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Menu } from '@typings/menu.type';
import { ButtonComponent } from "../button/button.component";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [CommonModule, RouterLink, MatButtonModule, ButtonComponent]
})
export class HeaderComponent {
  @Input() routeButtons : Menu[]=[]
  @Input() routeMenus : Menu[]=[]
  @Output() onMenuClick = new EventEmitter<void>();

  emptyMessage ='Nothing Found. 😬';
}
