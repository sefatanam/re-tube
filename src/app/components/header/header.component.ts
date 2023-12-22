import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Menu } from '@typings/menu.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() routeButtons : Menu[]=[]
  @Input() routeMenus : Menu[]=[]
  @Output() onMenuClick = new EventEmitter<void>();

  emptyMessage ='Nothing Found. 😬';
}
