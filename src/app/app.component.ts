import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.dev';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MenuService } from 'services/menu.service';
import { RootMenu } from '@typings/menu.type';
import { AuthService } from 'services/auth.service';
import { initializeApp } from 'firebase/app';

initializeApp(environment.firebaseConfig);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, MainContentComponent],
})
export class AppComponent {
  environment = environment;
  authService = inject(AuthService);
  menuService = inject(MenuService);
  rootMenu: RootMenu = this.menuService.rootMenu;
}
