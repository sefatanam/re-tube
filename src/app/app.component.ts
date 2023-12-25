import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MenuService } from 'services/menu.service';
import { RootMenu } from '@typings/menu.type';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthService } from 'services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';


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
  toastService = inject(HotToastService);
  router = inject(Router);

  rootMenu: RootMenu = this.menuService.rootMenu;

  firestore: Firestore = inject(Firestore);
  items$!: Observable<any[]>;

  ngOnInit(): void {
    const aCollection = collection(this.firestore, 'items')
    this.items$ = collectionData(aCollection);
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
