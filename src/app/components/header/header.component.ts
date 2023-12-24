import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Menu } from '@typings/menu.type';
import { ButtonComponent } from "../button/button.component";
import { User } from 'firebase/auth';
import { AuthService } from 'services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [CommonModule, RouterLink, MatButtonModule, ButtonComponent]
})
export class HeaderComponent {
  authService = inject(AuthService)
  @Input() user = signal<User | null>(null);
  @Input() routeButtons: Menu[] = []
  @Input() routeMenus: Menu[] = []
  @Output() onMenuClick = new EventEmitter<void>();

  emptyMessage = 'Nothing Found. 😬';


  kickOut = () => this.authService.signOut()
}
