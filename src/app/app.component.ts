import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.dev';
import { MainContentComponent } from '@components/main-content/main-content.component';
import { MenuService } from '@services/menu.service';
import { RootMenu } from '@typings/menu.type';
import { AuthService } from '@services/auth.service';
import { RxdbProviderService } from '@services/rxdb.service';

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
  rxdbProvider = inject(RxdbProviderService);

  rootMenu: RootMenu = this.menuService.rootMenu;

  ngOnInit(): void {
    if (!this.rxdbProvider.rxDatabase) {
      this.rxdbProvider.intiRxDatabase('retubev1');
    }
  }
}
