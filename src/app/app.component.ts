import { Component, OnInit, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.dev';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MenuService } from 'services/menu.service';
import { RootMenu } from '@typings/menu.type';
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
export class AppComponent implements OnInit {
  environment = environment;

  authService = inject(AuthService);
  menuService = inject(MenuService);

  rootMenu: RootMenu = this.menuService.rootMenu;

  constructor() {
    afterNextRender(() => {
      const theme = window.localStorage.getItem('theme') ?? 'light';
      window.document.querySelector('body')?.classList.add(theme)
    })
  }

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.authService.authUser.set(user);
      } else {
        this.authService.authUser.set(null)
      }
    })
  }

}
